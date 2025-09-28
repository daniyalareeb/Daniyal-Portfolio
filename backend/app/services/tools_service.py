import uuid
import html
import logging
from datetime import datetime
from typing import List
import feedparser
import httpx
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.models.tool import Tool
from app.core.tools_sources import TOOLS_SOURCES
from app.core.ai_client import llm_chat  # existing helper that calls OpenRouter
from app.database import SessionLocal

logger = logging.getLogger(__name__)

# Updated professional categories
CATEGORIES = [
    "AI Chat & Assistant", "Image & Visual AI", "Video & Media AI", "Audio & Voice AI", 
    "Development & Code", "Content Creation", "Productivity & Automation", "Design & UX",
    "Business & Marketing", "Research & Analytics", "Other"
]

def _heuristic_category(name: str, description: str) -> str:
    s = f"{name} {description}".lower()
    pairs = [
        ("AI Chat & Assistant", ["chat", "assistant", "gpt", "claude", "perplexity", "conversation", "ai chat", "chatbot"]),
        ("Image & Visual AI", ["image", "diffusion", "photo", "midjourney", "stability", "art", "generate image", "visual", "picture", "graphic"]),
        ("Video & Media AI", ["video", "runway", "sora", "edit video", "video generation", "animation", "media", "film", "movie"]),
        ("Audio & Voice AI", ["voice", "speech", "tts", "stt", "podcast", "audio", "elevenlabs", "murf", "sound", "music"]),
        ("Development & Code", ["code", "developer", "ide", "copilot", "repo", "debug", "programming", "software", "api", "github"]),
        ("Content Creation", ["writer", "copy", "content", "email", "blog", "writing", "article", "text", "copywriting", "presentation"]),
        ("Productivity & Automation", ["notion", "todo", "calendar", "automation", "workflow", "productivity", "task", "schedule", "organize"]),
        ("Design & UX", ["figma", "ux", "design", "ui", "mockup", "art", "creative", "prototype", "wireframe", "user experience"]),
        ("Business & Marketing", ["marketing", "ads", "campaign", "social media", "seo", "business", "sales", "analytics", "growth"]),
        ("Research & Analytics", ["paper", "summarize", "search papers", "arxiv", "research", "data", "analysis", "insights", "intelligence"]),
    ]
    for cat, keys in pairs:
        if any(k in s for k in keys): return cat
    return "Other"

async def _classify_with_llm(name: str, description: str) -> str:
    # Ask the LLM to pick one of our categories — but defend against rate-limits.
    prompt = [
        {"role": "system", "content": "You are a classifier. Pick one category from: " + ", ".join(CATEGORIES)},
        {"role": "user", "content": f"Tool name: {name}\n\nDescription: {description}\n\nReturn only the category name."}
    ]
    try:
        out = await llm_chat(prompt)
        cat = out.strip().split("\n")[0]
        # sanitize
        if cat in CATEGORIES:
            return cat
    except Exception as e:
        logger.warning("LLM classify failed: %s", e)
    # fallback
    return _heuristic_category(name, description)

def _parse_feed_entry(entry):
    title = getattr(entry, "title", "") or ""
    link = getattr(entry, "link", "") or ""
    summary = getattr(entry, "summary", "") or getattr(entry, "description", "") or ""
    return html.unescape(title.strip()), link.strip(), html.unescape(summary.strip())

async def fetch_tools_from_source(url: str, limit_per_source: int = 10):
    """
    Fetch tools from a single RSS/Atom feed source.
    """
    tools = []
    try:
        feed = feedparser.parse(url)
        if not feed.entries:
            logger.warning("No entries found in feed: %s", url)
            return tools

        for entry in feed.entries[:limit_per_source]:
            try:
                title, link, summary = _parse_feed_entry(entry)
                
                if not title or not link:
                    continue
                
                # Clean up description
                description = summary
                if len(description) > 2000:
                    description = description[:2000] + "..."
                
                tools.append({
                    "name": title,
                    "url": link,
                    "description": description,
                    "source": url
                })
                
            except Exception as e:
                logger.warning("Failed to parse entry from %s: %s", url, e)
                continue
                
    except Exception as e:
        logger.error("Failed to parse feed %s: %s", url, e)
    
    return tools

async def fetch_and_update_tools(db: Session):
    """
    Main entry: iterate sources, fetch, classify, upsert into DB.
    """
    added = 0
    for src in TOOLS_SOURCES:
        try:
            items = await fetch_tools_from_source(src, limit_per_source=8)
        except Exception as e:
            logger.exception("Failed to fetch tools from %s: %s", src, e)
            continue

        for item in items:
            name = item.get("name")[:255]
            url = item.get("url")
            description = (item.get("description") or "")[:2000]
            source = item.get("source") or src

            if not url:
                continue

            # Try an LLM classification but fallback if rate-limited
            category = await _classify_with_llm(name, description)

            # Upsert logic: prefer URL match
            existing = db.query(Tool).filter(Tool.url == url).first()
            if existing:
                existing.name = name
                existing.description = description
                existing.category = category
                existing.source = source
                existing.auto_fetched = True
                existing.last_checked = datetime.utcnow()
            else:
                t = Tool(
                    name=name,
                    description=description or f"{name} - no description.",
                    category=category,
                    status="Unknown",
                    url=url,
                    pricing="Unknown",
                    source=source,
                    auto_fetched=True,
                    last_checked=datetime.utcnow()
                )
                db.add(t)
                added += 1
        db.commit()
    return {"added": added, "timestamp": datetime.utcnow().isoformat()}

def list_tools_db(db: Session, q: str = None, category: str = None, limit: int = 50):
    """List tools with optional search and category filtering."""
    query = db.query(Tool)
    
    if q:
        query = query.filter(Tool.name.ilike(f"%{q}%") | Tool.description.ilike(f"%{q}%"))
    
    if category:
        query = query.filter(Tool.category == category)
    
    # Try to order by display_order first, fallback to id if column doesn't exist
    try:
        return query.order_by(Tool.display_order.asc(), Tool.last_checked.desc()).limit(limit).all()
    except Exception as e:
        logger.warning(f"display_order column not found, falling back to id ordering: {e}")
        return query.order_by(Tool.id.desc()).limit(limit).all()