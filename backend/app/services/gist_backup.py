"""
GitHub Gist-based backup system for data persistence
Provides cloud-based backup that survives all deployments
"""
import os
import json
import base64
import httpx
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class GistBackupService:
    """Service for backing up data to GitHub Gists"""
    
    def __init__(self):
        self.github_token = os.getenv("GITHUB_TOKEN")
        self.gist_id = os.getenv("BACKUP_GIST_ID")
        
    def create_gist(self, data: Dict[str, Any]) -> Optional[str]:
        """Create a new Gist with backup data"""
        if not self.github_token:
            logger.warning("No GitHub token found, skipping Gist backup")
            return None
            
        try:
            # Convert data to JSON string
            json_str = json.dumps(data, indent=2)
            
            # Create Gist payload
            payload = {
                "description": f"Portfolio Data Backup - {datetime.now().isoformat()}",
                "public": False,
                "files": {
                    "portfolio_backup.json": {
                        "content": json_str
                    }
                }
            }
            
            # Make API request
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.github.com/gists",
                    headers={
                        "Authorization": f"token {self.github_token}",
                        "Accept": "application/vnd.github.v3+json"
                    },
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 201:
                    gist_data = response.json()
                    gist_id = gist_data["id"]
                    logger.info(f"Created backup Gist: {gist_id}")
                    return gist_id
                else:
                    logger.error(f"Failed to create Gist: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error creating Gist: {e}")
            return None
    
    def update_gist(self, gist_id: str, data: Dict[str, Any]) -> bool:
        """Update existing Gist with new backup data"""
        if not self.github_token:
            logger.warning("No GitHub token found, skipping Gist update")
            return False
            
        try:
            # Convert data to JSON string
            json_str = json.dumps(data, indent=2)
            
            # Update Gist payload
            payload = {
                "description": f"Portfolio Data Backup - {datetime.now().isoformat()}",
                "files": {
                    "portfolio_backup.json": {
                        "content": json_str
                    }
                }
            }
            
            # Make API request
            async with httpx.AsyncClient() as client:
                response = await client.patch(
                    f"https://api.github.com/gists/{gist_id}",
                    headers={
                        "Authorization": f"token {self.github_token}",
                        "Accept": "application/vnd.github.v3+json"
                    },
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    logger.info(f"Updated backup Gist: {gist_id}")
                    return True
                else:
                    logger.error(f"Failed to update Gist: {response.status_code} - {response.text}")
                    return False
                    
        except Exception as e:
            logger.error(f"Error updating Gist: {e}")
            return False
    
    def get_gist(self, gist_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve data from Gist"""
        if not self.github_token:
            logger.warning("No GitHub token found, skipping Gist retrieval")
            return None
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.github.com/gists/{gist_id}",
                    headers={
                        "Authorization": f"token {self.github_token}",
                        "Accept": "application/vnd.github.v3+json"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    gist_data = response.json()
                    if "portfolio_backup.json" in gist_data["files"]:
                        content = gist_data["files"]["portfolio_backup.json"]["content"]
                        data = json.loads(content)
                        logger.info(f"Retrieved backup from Gist: {gist_id}")
                        return data
                    else:
                        logger.error("Backup file not found in Gist")
                        return None
                else:
                    logger.error(f"Failed to retrieve Gist: {response.status_code} - {response.text}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error retrieving Gist: {e}")
            return None
    
    def backup_data(self, data: Dict[str, Any]) -> bool:
        """Backup data to Gist (create or update)"""
        if self.gist_id:
            # Update existing Gist
            return self.update_gist(self.gist_id, data)
        else:
            # Create new Gist
            gist_id = self.create_gist(data)
            if gist_id:
                # Store Gist ID for future updates
                logger.info(f"New backup Gist created: {gist_id}")
                return True
            return False
    
    def restore_data(self) -> Optional[Dict[str, Any]]:
        """Restore data from Gist"""
        if not self.gist_id:
            logger.warning("No Gist ID configured for restore")
            return None
            
        return self.get_gist(self.gist_id)
