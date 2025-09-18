import html
import logging
from datetime import datetime
from typing import List
import feedparser
import httpx
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.models.blog import BlogPost
from app.database import SessionLocal

logger = logging.getLogger(__name__)

from app.core.rss_sources import SOURCES

# Blog sources - AI/ML focused blogs across multiple categories
BLOG_SOURCES = SOURCES + [
    # Additional business and industry sources
    "https://feeds.feedburner.com/TechCrunch/",
    "https://feeds.feedburner.com/venturebeat/SZYF",
    "https://feeds.feedburner.com/readwriteweb/",
    "https://feeds.feedburner.com/mashable/",
    # Healthcare AI
    "https://feeds.feedburner.com/healthcareitnews/",
    # Marketing & AI
    "https://feeds.feedburner.com/marketingland/",
    # AI Agents & Automation
    "https://feeds.feedburner.com/automationworld/",
]

BLOG_CATEGORIES = [
    "AI Research & Development", "Machine Learning", "AI Applications", 
    "AI Business & Industry", "AI Ethics & Policy", "AI Tools & Platforms", 
    "AI News & Trends", "Other"
]

def _heuristic_category(title: str, content: str) -> str:
    """Heuristic categorization for blog posts with specific AI/ML topics."""
    text = f"{title} {content}".lower()
    
    # AI Research & Development
    if any(word in text for word in ["research", "paper", "arxiv", "algorithm", "model", "neural network", "deep learning", "transformer", "llm", "gpt", "bert", "academic", "study", "experiment", "methodology", "innovation"]):
        return "AI Research & Development"
    elif any(word in text for word in ["machine learning", "ml", "training", "dataset", "model training", "supervised", "unsupervised", "reinforcement learning", "classification", "regression", "clustering", "feature", "prediction", "mlops"]):
        return "Machine Learning"
    elif any(word in text for word in ["application", "use case", "implementation", "deployment", "production", "chatbot", "recommendation", "computer vision", "nlp", "speech recognition", "image recognition", "autonomous", "robotics", "healthcare", "finance"]):
        return "AI Applications"
    elif any(word in text for word in ["business", "industry", "enterprise", "startup", "investment", "funding", "market", "revenue", "strategy", "leadership", "management", "consulting", "case study", "roi", "adoption", "transformation", "digital"]):
        return "AI Business & Industry"
    elif any(word in text for word in ["ethics", "bias", "fairness", "privacy", "security", "regulation", "policy", "governance", "responsible ai", "transparency", "accountability", "safety", "ai safety", "algorithmic bias", "data protection", "compliance"]):
        return "AI Ethics & Policy"
    elif any(word in text for word in ["tool", "platform", "framework", "library", "api", "sdk", "software", "openai", "hugging face", "tensorflow", "pytorch", "cloud", "aws", "azure", "google cloud", "infrastructure", "development", "coding"]):
        return "AI Tools & Platforms"
    elif any(word in text for word in ["news", "announcement", "release", "update", "trend", "future", "forecast", "prediction", "outlook", "breakthrough", "milestone", "achievement", "competition", "market analysis", "industry report"]):
        return "AI News & Trends"
    
    else:
        return "Other"

def _parse_blog_entry(entry):
    """Parse blog entry from RSS feed."""
    title = getattr(entry, "title", "") or ""
    link = getattr(entry, "link", "") or ""
    summary = getattr(entry, "summary", "") or getattr(entry, "description", "") or ""
    published = getattr(entry, "published_parsed", None)
    
    # Clean up content - remove HTML tags
    title = html.unescape(title.strip())
    summary = html.unescape(summary.strip())
    
    # Remove HTML tags from summary - more aggressive cleaning
    try:
        soup = BeautifulSoup(summary, 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        summary = soup.get_text(separator=' ', strip=True)
    except:
        # Fallback: simple regex to remove common HTML tags
        import re
        summary = re.sub(r'<[^>]+>', '', summary)
        summary = re.sub(r'\s+', ' ', summary).strip()
    
    # Additional cleaning
    import re
    summary = re.sub(r'&[a-zA-Z]+;', ' ', summary)  # Remove HTML entities
    summary = re.sub(r'\s+', ' ', summary).strip()  # Clean whitespace
    summary = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', summary)  # Remove URLs
    
    # Extract date
    published_date = None
    if published:
        try:
            published_date = datetime(*published[:6])
        except:
            pass
    
    # Ensure content is substantial (at least 100 characters)
    if len(summary) < 100:
        summary = f"{summary} This article provides insights into the latest developments and trends in the field."
    
    return {
        "title": title,
        "url": link.strip(),
        "excerpt": summary[:300] + "..." if len(summary) > 300 else summary,
        "content": summary,
        "published_date": published_date,
        "source": "RSS Feed"
    }

async def fetch_blogs_from_source(url: str, limit_per_source: int = 5):
    """Fetch blogs from a single source."""
    blogs = []
    try:
        feed = feedparser.parse(url)
        if feed and getattr(feed, "entries", None):
            for entry in feed.entries[:limit_per_source]:
                blog_data = _parse_blog_entry(entry)
                if blog_data["url"]:
                    blogs.append(blog_data)
            return blogs
    except Exception as e:
        logger.debug("Blog feed parse failed for %s: %s", url, e)
    
    return []

async def fetch_and_update_blogs(db: Session):
    """Fetch blogs from all sources and update database with category limits."""
    added_count = 0
    updated_count = 0
    removed_count = 0
    
    # Track blogs by category to enforce limits
    category_counts = {}
    new_blogs_by_category = {}
    
    # First, collect all new blogs from sources
    for source_url in BLOG_SOURCES:
        try:
            blogs = await fetch_blogs_from_source(source_url)
            
            for blog_data in blogs:
                category = _heuristic_category(blog_data["title"], blog_data["content"])
                
                # Initialize category tracking
                if category not in new_blogs_by_category:
                    new_blogs_by_category[category] = []
                
                # Add to new blogs for this category
                new_blogs_by_category[category].append(blog_data)
                
        except Exception as e:
            logger.error("Failed to fetch blogs from %s: %s", source_url, e)
            continue
    
    # Process each category
    for category, new_blogs in new_blogs_by_category.items():
        try:
            # Get existing blogs for this category
            existing_blogs = db.query(BlogPost).filter(
                BlogPost.category == category,
                BlogPost.published == True
            ).order_by(BlogPost.published_date.desc()).all()
            
            # Sort new blogs by published date (newest first)
            new_blogs.sort(key=lambda x: x.get("published_date", datetime.now()), reverse=True)
            
            # Calculate how many new blogs we can add
            max_blogs_per_category = 10
            available_slots = max_blogs_per_category - len(existing_blogs)
            
            if available_slots <= 0:
                # Category is full, remove oldest blogs to make room for newest
                blogs_to_remove = existing_blogs[available_slots:]
                for old_blog in blogs_to_remove:
                    db.delete(old_blog)
                    removed_count += 1
                available_slots = max_blogs_per_category
            
            # Add new blogs (up to the limit)
            for i, blog_data in enumerate(new_blogs[:available_slots]):
                # Check if blog already exists by URL
                existing = db.query(BlogPost).filter(BlogPost.url == blog_data["url"]).first()
                
                if existing:
                    # Update existing blog
                    existing.title = blog_data["title"]
                    existing.excerpt = blog_data["excerpt"]
                    existing.content = blog_data["content"]
                    existing.category = category
                    existing.last_updated = datetime.now()
                    updated_count += 1
                else:
                    # Add new blog
                    new_blog = BlogPost(
                        title=blog_data["title"],
                        excerpt=blog_data["excerpt"],
                        content=blog_data["content"],
                        url=blog_data["url"],
                        category=category,
                        featured=False,
                        published=True,
                        source=blog_data["source"],
                        published_date=blog_data["published_date"] or datetime.now()
                    )
                    db.add(new_blog)
                    added_count += 1
            
            db.commit()
            
        except Exception as e:
            logger.error("Failed to process category %s: %s", category, e)
            db.rollback()
            continue
    
    return {
        "added": added_count,
        "updated": updated_count,
        "removed": removed_count,
        "timestamp": datetime.now().isoformat()
    }
