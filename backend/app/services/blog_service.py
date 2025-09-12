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
    "AI/ML Theory", "Deep Learning", "NLP", "Computer Vision", 
    "Reinforcement Learning", "Generative AI", "AI Ethics", 
    "MLOps", "Data Engineering", "AI Infrastructure", 
    "AI SaaS Tools", "Open Source AI", "AI APIs", 
    "AI Automation", "AI Frameworks", "Healthcare AI", 
    "Finance AI", "Marketing AI", "Education AI", 
    "Entertainment AI", "AI Startups", "AI Trends", 
    "Enterprise AI", "AI Consulting", "Responsible AI", 
    "AI Regulation", "AI Safety", "AI Learning", 
    "AI Research", "Other"
]

def _heuristic_category(title: str, content: str) -> str:
    """Heuristic categorization for blog posts with specific AI/ML topics."""
    text = f"{title} {content}".lower()
    
    # AI/ML Theory & Fundamentals
    if any(word in text for word in ["machine learning theory", "ml theory", "algorithm", "mathematical", "statistical", "probability"]):
        return "AI/ML Theory"
    elif any(word in text for word in ["deep learning", "neural network", "cnn", "rnn", "lstm", "transformer", "attention"]):
        return "Deep Learning"
    elif any(word in text for word in ["nlp", "natural language", "text processing", "language model", "bert", "gpt", "llm"]):
        return "NLP"
    elif any(word in text for word in ["computer vision", "image recognition", "object detection", "segmentation", "opencv"]):
        return "Computer Vision"
    elif any(word in text for word in ["reinforcement learning", "rl", "q-learning", "policy gradient", "agent"]):
        return "Reinforcement Learning"
    elif any(word in text for word in ["generative ai", "diffusion", "gan", "stable diffusion", "midjourney", "dall-e"]):
        return "Generative AI"
    elif any(word in text for word in ["ai ethics", "bias", "fairness", "responsible ai", "ethical ai"]):
        return "AI Ethics"
    
    # Engineering & Operations
    elif any(word in text for word in ["mlops", "model deployment", "model serving", "pipeline", "monitoring"]):
        return "MLOps"
    elif any(word in text for word in ["data engineering", "etl", "data pipeline", "data warehouse", "big data"]):
        return "Data Engineering"
    elif any(word in text for word in ["ai infrastructure", "cloud ai", "gpu", "distributed", "scaling"]):
        return "AI Infrastructure"
    elif any(word in text for word in ["saas", "productivity", "automation tool", "workflow", "zapier"]):
        return "AI SaaS Tools"
    elif any(word in text for word in ["open source", "github", "hugging face", "tensorflow", "pytorch"]):
        return "Open Source AI"
    elif any(word in text for word in ["api", "rest api", "graphql", "integration", "tutorial"]):
        return "AI APIs"
    elif any(word in text for word in ["automation", "workflow automation", "process automation", "rpa"]):
        return "AI Automation"
    elif any(word in text for word in ["framework", "library", "tensorflow", "pytorch", "scikit-learn"]):
        return "AI Frameworks"
    
    # Industry Applications
    elif any(word in text for word in ["healthcare", "medical", "diagnosis", "drug discovery", "biomedical"]):
        return "Healthcare AI"
    elif any(word in text for word in ["finance", "banking", "trading", "fraud detection", "risk assessment"]):
        return "Finance AI"
    elif any(word in text for word in ["marketing", "advertising", "personalization", "customer", "sales"]):
        return "Marketing AI"
    elif any(word in text for word in ["education", "learning", "adaptive", "tutoring", "edtech"]):
        return "Education AI"
    elif any(word in text for word in ["entertainment", "gaming", "music", "video", "art", "creative"]):
        return "Entertainment AI"
    
    # Business & Industry
    elif any(word in text for word in ["startup", "funding", "venture", "entrepreneur", "founder"]):
        return "AI Startups"
    elif any(word in text for word in ["trend", "market analysis", "industry report", "forecast"]):
        return "AI Trends"
    elif any(word in text for word in ["enterprise", "corporate", "business", "company", "organization"]):
        return "Enterprise AI"
    elif any(word in text for word in ["consulting", "service", "agency", "advisory", "expert"]):
        return "AI Consulting"
    
    # Governance & Safety
    elif any(word in text for word in ["regulation", "governance", "policy", "compliance", "legal"]):
        return "AI Regulation"
    elif any(word in text for word in ["safety", "alignment", "existential risk", "control", "robustness"]):
        return "AI Safety"
    elif any(word in text for word in ["privacy", "data protection", "gdpr", "security"]):
        return "Responsible AI"
    
    # Learning & Research
    elif any(word in text for word in ["course", "certification", "bootcamp", "tutorial", "learning path"]):
        return "AI Learning"
    elif any(word in text for word in ["research", "paper", "academic", "conference", "breakthrough"]):
        return "AI Research"
    
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
