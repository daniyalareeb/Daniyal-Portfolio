"""
Data Backup API Endpoints
Provides endpoints for backing up and restoring data
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
# Data persistence service removed - using PostgreSQL
from app.schemas.common import APIResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/backup-data")
def backup_data(db: Session = Depends(get_db)):
    """Backup all data to JSON format - DISABLED (using PostgreSQL)"""
    raise HTTPException(
        status_code=410, 
        detail="Data backup disabled - using PostgreSQL for persistence"
    )

@router.post("/restore-data")
def restore_data(db: Session = Depends(get_db)):
    """Restore data from backup - DISABLED (using PostgreSQL)"""
    raise HTTPException(
        status_code=410, 
        detail="Data restore disabled - using PostgreSQL for persistence"
    )

@router.get("/export-data")
def export_data(db: Session = Depends(get_db)):
    """Export data as JSON - DISABLED (using PostgreSQL)"""
    raise HTTPException(
        status_code=410, 
        detail="Data export disabled - using PostgreSQL for persistence"
    )

@router.post("/import-data")
def import_data(data: dict, db: Session = Depends(get_db)):
    """Import data from JSON - DISABLED (using PostgreSQL)"""
    raise HTTPException(
        status_code=410, 
        detail="Data import disabled - using PostgreSQL for persistence"
    )
