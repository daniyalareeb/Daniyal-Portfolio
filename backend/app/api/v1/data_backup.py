"""
Data Backup API Endpoints
Provides endpoints for backing up and restoring data
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.data_persistence import DataPersistenceService
from app.schemas.common import APIResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/backup-data")
def backup_data(db: Session = Depends(get_db)):
    """Backup all data to JSON format"""
    try:
        persistence_service = DataPersistenceService()
        
        # Backup to file
        file_success = persistence_service.backup_to_file()
        
        # Backup to environment variable
        env_success = persistence_service.backup_to_environment()
        
        if file_success or env_success:
            return APIResponse(
                success=True,
                data={
                    "message": "Data backed up successfully",
                    "file_backup": file_success,
                    "environment_backup": env_success
                }
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to backup data")
            
    except Exception as e:
        logger.error(f"Backup failed: {e}")
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")

@router.post("/restore-data")
def restore_data(db: Session = Depends(get_db)):
    """Restore data from backup"""
    try:
        persistence_service = DataPersistenceService()
        
        # Try to restore from environment variable first
        env_success = persistence_service.restore_from_environment()
        
        # If environment restore failed, try file restore
        if not env_success:
            file_success = persistence_service.restore_from_file()
            if file_success:
                return APIResponse(
                    success=True,
                    data={"message": "Data restored from file backup"}
                )
        
        if env_success:
            return APIResponse(
                success=True,
                data={"message": "Data restored from environment backup"}
            )
        else:
            raise HTTPException(status_code=404, detail="No backup found to restore")
            
    except Exception as e:
        logger.error(f"Restore failed: {e}")
        raise HTTPException(status_code=500, detail=f"Restore failed: {str(e)}")

@router.get("/export-data")
def export_data(db: Session = Depends(get_db)):
    """Export data as JSON (for manual backup)"""
    try:
        persistence_service = DataPersistenceService()
        data = persistence_service.export_data_to_json()
        
        if data:
            return APIResponse(
                success=True,
                data=data
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to export data")
            
    except Exception as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(status_code=500, detail=f"Export failed: {str(e)}")

@router.post("/import-data")
def import_data(data: dict, db: Session = Depends(get_db)):
    """Import data from JSON (for manual restore)"""
    try:
        persistence_service = DataPersistenceService()
        success = persistence_service.import_data_from_json(data)
        
        if success:
            return APIResponse(
                success=True,
                data={"message": "Data imported successfully"}
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to import data")
            
    except Exception as e:
        logger.error(f"Import failed: {e}")
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
