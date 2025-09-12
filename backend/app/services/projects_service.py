"""
Sync GitHub repos tagged 'portfolio' topic.
"""
import httpx
from sqlalchemy.orm import Session
from app.config import settings
from app.models.project import Project

GITHUB_API = "https://api.github.com"

async def sync_projects(db: Session):
    # Search repositories by topic 'portfolio' for your user
    url = f"{GITHUB_API}/search/repositories?q=user:{settings.GITHUB_USERNAME}+topic:portfolio&sort=updated&order=desc"
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()

    items = data.get("items", [])
    for repo in items:
        rid = repo["id"]  # Use integer ID
        existing = db.query(Project).filter(Project.id == rid).first()
        if not existing:
            p = Project(
                id=rid,
                name=repo["name"],
                description=repo.get("description") or "No description available",
                url=repo["html_url"],
            )
            db.add(p)
        else:
            # update basic fields
            existing.description = repo.get("description") or "No description available"
            existing.url = repo["html_url"]
    db.commit()