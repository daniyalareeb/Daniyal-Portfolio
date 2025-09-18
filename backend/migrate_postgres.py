#!/usr/bin/env python3
"""
Migration script to add image_url column to PostgreSQL tables
"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.database import engine
from sqlalchemy import text

def migrate_postgres():
    """Add image_url column to PostgreSQL tables if they don't exist"""
    try:
        with engine.connect() as conn:
            # Add to ai_tools table
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'ai_tools' AND column_name = 'image_url'
            """))
            
            if result.fetchone() is None:
                print("Adding image_url column to ai_tools table...")
                conn.execute(text("ALTER TABLE ai_tools ADD COLUMN image_url VARCHAR(500)"))
                conn.commit()
                print("✅ ai_tools.image_url column added successfully!")
            else:
                print("✅ ai_tools.image_url column already exists")
            
            # Add to projects table
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'projects' AND column_name = 'image_url'
            """))
            
            if result.fetchone() is None:
                print("Adding image_url column to projects table...")
                conn.execute(text("ALTER TABLE projects ADD COLUMN image_url VARCHAR(500)"))
                conn.commit()
                print("✅ projects.image_url column added successfully!")
            else:
                print("✅ projects.image_url column already exists")
                
    except Exception as e:
        print(f"❌ Error adding image_url column: {e}")

if __name__ == "__main__":
    migrate_postgres()
