"""
Data Persistence Service
Provides multiple strategies for data persistence across deployments
"""
import os
import json
import base64
import sqlite3
from typing import Dict, List, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class DataPersistenceService:
    """Service for managing data persistence across deployments"""
    
    def __init__(self, db_path: str = "data/portfolio.db"):
        self.db_path = db_path
        
    def export_data_to_json(self) -> Dict[str, Any]:
        """Export all data from SQLite to JSON format"""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Export tools
            cursor.execute("SELECT * FROM ai_tools")
            tools = [dict(row) for row in cursor.fetchall()]
            
            # Export projects
            cursor.execute("SELECT * FROM projects")
            projects = [dict(row) for row in cursor.fetchall()]
            
            # Export blogs
            cursor.execute("SELECT * FROM blog_posts")
            blogs = [dict(row) for row in cursor.fetchall()]
            
            # Export contacts
            cursor.execute("SELECT * FROM contact_submissions")
            contacts = [dict(row) for row in cursor.fetchall()]
            
            conn.close()
            
            return {
                "exported_at": datetime.now().isoformat(),
                "tools": tools,
                "projects": projects,
                "blogs": blogs,
                "contacts": contacts
            }
            
        except Exception as e:
            logger.error(f"Failed to export data: {e}")
            return {}
    
    def import_data_from_json(self, data: Dict[str, Any]) -> bool:
        """Import data from JSON format to SQLite"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Import tools
            if "tools" in data:
                cursor.execute("DELETE FROM ai_tools")
                for tool in data["tools"]:
                    cursor.execute("""
                        INSERT INTO ai_tools (id, name, description, category, status, url, pricing, source, auto_fetched, last_checked)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        tool.get("id"), tool.get("name"), tool.get("description"),
                        tool.get("category"), tool.get("status"), tool.get("url"),
                        tool.get("pricing"), tool.get("source"), tool.get("auto_fetched"),
                        tool.get("last_checked")
                    ))
            
            # Import projects
            if "projects" in data:
                cursor.execute("DELETE FROM projects")
                for project in data["projects"]:
                    cursor.execute("""
                        INSERT INTO projects (id, name, description, url, github_url, category, technologies, image_url)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        project.get("id"), project.get("name"), project.get("description"),
                        project.get("url"), project.get("github_url"), project.get("category"),
                        project.get("technologies"), project.get("image_url")
                    ))
            
            # Import blogs
            if "blogs" in data:
                cursor.execute("DELETE FROM blog_posts")
                for blog in data["blogs"]:
                    cursor.execute("""
                        INSERT INTO blog_posts (id, title, excerpt, content, url, category, published, featured, source, published_date, last_updated)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        blog.get("id"), blog.get("title"), blog.get("excerpt"), blog.get("content"),
                        blog.get("url"), blog.get("category"), blog.get("published"), blog.get("featured"),
                        blog.get("source"), blog.get("published_date"), blog.get("last_updated")
                    ))
            
            # Import contacts
            if "contacts" in data:
                cursor.execute("DELETE FROM contact_submissions")
                for contact in data["contacts"]:
                    cursor.execute("""
                        INSERT INTO contact_submissions (id, name, email, message)
                        VALUES (?, ?, ?, ?)
                    """, (
                        contact.get("id"), contact.get("name"), contact.get("email"),
                        contact.get("message")
                    ))
            
            conn.commit()
            conn.close()
            return True
            
        except Exception as e:
            logger.error(f"Failed to import data: {e}")
            return False
    
    def backup_to_environment(self) -> bool:
        """Backup data to Railway environment variable (base64 encoded)"""
        try:
            data = self.export_data_to_json()
            if not data:
                return False
                
            # Convert to base64 for storage in environment variable
            json_str = json.dumps(data)
            b64_data = base64.b64encode(json_str.encode()).decode()
            
            # Store in environment variable (this would need Railway CLI to update)
            os.environ["DATABASE_BACKUP"] = b64_data
            logger.info(f"Data backed up to environment variable (size: {len(b64_data)} chars)")
            return True
            
        except Exception as e:
            logger.error(f"Failed to backup to environment: {e}")
            return False
    
    def restore_from_environment(self) -> bool:
        """Restore data from Railway environment variable"""
        try:
            b64_data = os.getenv("DATABASE_BACKUP")
            if not b64_data:
                return False
                
            # Decode from base64
            json_str = base64.b64decode(b64_data).decode()
            data = json.loads(json_str)
            
            # Import data
            return self.import_data_from_json(data)
            
        except Exception as e:
            logger.error(f"Failed to restore from environment: {e}")
            return False
    
    def backup_to_file(self, backup_path: str = "data/backup.json") -> bool:
        """Backup data to JSON file"""
        try:
            data = self.export_data_to_json()
            if not data:
                return False
                
            os.makedirs(os.path.dirname(backup_path), exist_ok=True)
            with open(backup_path, 'w') as f:
                json.dump(data, f, indent=2)
                
            logger.info(f"Data backed up to {backup_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to backup to file: {e}")
            return False
    
    def restore_from_file(self, backup_path: str = "data/backup.json") -> bool:
        """Restore data from JSON file"""
        try:
            if not os.path.exists(backup_path):
                return False
                
            with open(backup_path, 'r') as f:
                data = json.load(f)
                
            return self.import_data_from_json(data)
            
        except Exception as e:
            logger.error(f"Failed to restore from file: {e}")
            return False
