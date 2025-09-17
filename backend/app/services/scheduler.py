"""
APScheduler – runs background jobs:
- fetch blogs daily (dev: every hour)
- sync projects daily (dev: every 2 hours)
- tools auto-update placeholder
"""
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.blog_service import fetch_and_update_blogs
from app.services.projects_service import sync_projects
from app.services.data_persistence import DataPersistenceService

_scheduler = None

def _job(fn):
    """Wrap job with its own DB session to avoid leaks."""
    def runner():
        db: Session = SessionLocal()
        try:
            import asyncio
            asyncio.run(fn(db))
        except TypeError:
            # if fn signature doesn't need db
            import asyncio
            asyncio.run(fn())
        finally:
            db.close()
    return runner

def start_scheduler():
    global _scheduler
    if _scheduler:
        return
    _scheduler = BackgroundScheduler(timezone="UTC")
    # Run blogs every 3 days for automatic updates
    _scheduler.add_job(_job(fetch_and_update_blogs), "interval", days=3, id="blogs")
    _scheduler.add_job(_job(sync_projects), "interval", hours=2, id="projects")
    
    # Add data backup job - runs every 30 minutes
    def backup_data_job():
        try:
            persistence_service = DataPersistenceService()
            persistence_service.backup_to_environment()
            persistence_service.backup_to_file()
            print("Scheduled data backup completed")
        except Exception as e:
            print(f"Scheduled data backup failed: {e}")
    
    _scheduler.add_job(backup_data_job, "interval", minutes=30, id="data_backup")
    _scheduler.start()

# Admin functions for manual refresh
async def run_blog_update():
    """Manual blog update for admin endpoint"""
    db: Session = SessionLocal()
    try:
        await fetch_and_update_blogs(db)
        return {"message": "Blogs updated successfully"}
    finally:
        db.close()

async def run_tools_update():
    """Manual tools update for admin endpoint"""
    # Placeholder - implement when tools service is ready
    return {"message": "Tools update not implemented yet"}

async def run_projects_update():
    """Manual projects update for admin endpoint"""
    db: Session = SessionLocal()
    try:
        await sync_projects(db)
        return {"message": "Projects updated successfully"}
    finally:
        db.close()

def get_scheduler_status():
    """Get the status of the scheduler"""
    global _scheduler
    if not _scheduler:
        return {"status": "not_started", "jobs": []}
    
    jobs = []
    for job in _scheduler.get_jobs():
        next_run = job.next_run_time.isoformat() if job.next_run_time else None
        jobs.append({
            "id": job.id,
            "name": job.name,
            "next_run_time": next_run,
            "trigger": str(job.trigger),
            "interval": "3 days" if job.id == "blogs" else "2 hours" if job.id == "projects" else "unknown"
        })
    
    return {
        "status": "running" if _scheduler.running else "stopped",
        "jobs": jobs,
        "blog_schedule": "Every 3 days",
        "project_schedule": "Every 2 hours"
    }

def reset_blog_scheduler():
    """Reset the blog scheduler to run again in 3 days from now."""
    global _scheduler
    if not _scheduler:
        return False
    
    try:
        # Remove the existing blog job
        _scheduler.remove_job("blogs")
        
        # Add a new blog job that runs in 3 days from now
        _scheduler.add_job(_job(fetch_and_update_blogs), "interval", days=3, id="blogs")
        
        return True
    except Exception as e:
        print(f"Error resetting blog scheduler: {e}")
        return False
