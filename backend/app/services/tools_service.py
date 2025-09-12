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

CATEGORIES = [
    "Chat Assistant", "Image Generation", "Video Editing", "Voice", 
    "Presentation", "Coding & Development", "Productivity", "Writing",
    "Art & Design", "Marketing", "Research", "Other"
]

def _heuristic_category(name: str, description: str) -> str:
    s = f"{name} {description}".lower()
    pairs = [
        ("Chat Assistant", ["chat", "assistant", "gpt", "claude", "perplexity", "conversation"]),
        ("Image Generation", ["image", "diffusion", "photo", "midjourney", "stability", "art", "generate image"]),
        ("Video Editing", ["video", "runway", "sora", "edit video", "video generation", "animation"]),
        ("Voice", ["voice", "speech", "tts", "stt", "podcast", "audio", "elevenlabs", "murf"]),
        ("Presentation", ["slide", "presentation", "deck", "pitch", "beautiful.ai", "canva"]),
        ("Coding & Development", ["code", "developer", "ide", "copilot", "repo", "debug", "programming"]),
        ("Productivity", ["notion", "todo", "calendar", "automation", "workflow", "productivity"]),
        ("Writing", ["writer", "copy", "content", "email", "blog", "writing"]),
        ("Art & Design", ["figma", "ux", "design", "ui", "mockup", "art", "creative"]),
        ("Marketing", ["marketing", "ads", "campaign", "social media", "seo"]),
        ("Research", ["paper", "summarize", "search papers", "arxiv", "research"]),
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
    Try RSS first. If not, perform a best-effort scrape for external links.
    Returns list of dicts: {name, url, description, source}
    """
    tools = []
    try:
        feed = feedparser.parse(url)
        if feed and getattr(feed, "entries", None):
            for entry in feed.entries[:limit_per_source]:
                name, link, summary = _parse_feed_entry(entry)
                if link:
                    tools.append({"name": name or link, "url": link, "description": summary, "source": url})
            return tools
    except Exception as e:
        logger.debug("Feed parse failed for %s: %s", url, e)

    # Fallback: HTML parse (simple heuristic)
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(url)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "lxml")
            # collect candidate links (external)
            anchors = soup.find_all("a", href=True)
            # heuristic: choose anchors with text length and external links
            candidates = []
            for a in anchors:
                href = a["href"]
                text = a.get_text(separator=" ", strip=True)
                if href.startswith("#") or href.startswith("mailto:"):
                    continue
                if not href.startswith("http"):
                    # make absolute if relative
                    href = httpx.URL(url).join(href)
                if len(text) < 3 or len(text) > 120:
                    # short names or reasonable names only
                    continue
                candidates.append((text, str(href)))
            # dedupe and return up to limit
            seen = set()
            for text, link in candidates:
                if link in seen:
                    continue
                seen.add(link)
                # quick description by trying to fetch meta description (safe, but try/catch)
                desc = ""
                try:
                    async with httpx.AsyncClient(timeout=10) as c2:
                        rr = await c2.get(link)
                        soup2 = BeautifulSoup(rr.text, "lxml")
                        m = soup2.find("meta", {"name": "description"}) or soup2.find("meta", {"property": "og:description"})
                        if m and m.get("content"):
                            desc = m["content"]
                except Exception:
                    desc = ""
                tools.append({"name": text, "url": link, "description": desc, "source": url})
                if len(tools) >= limit_per_source:
                    break
    except Exception as e:
        logger.warning("HTML parse failed for %s: %s", url, e)

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
    query = db.query(Tool)
    if q:
        qlower = f"%{q.lower()}%"
        query = query.filter((Tool.name.ilike(qlower)) | (Tool.description.ilike(qlower)))
    if category and category.lower() != "all":
        query = query.filter(Tool.category == category)
    return query.order_by(Tool.last_checked.desc()).limit(limit).all()