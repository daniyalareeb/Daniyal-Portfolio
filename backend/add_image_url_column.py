#!/usr/bin/env python3
"""
Migration script to add image_url column to ai_tools table
"""
import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.database import engine
from sqlalchemy import text

def add_image_url_column():
    """Add image_url column to ai_tools and projects tables if they don't exist"""
    try:
        with engine.connect() as conn:
            # Add to ai_tools table
            try:
                conn.execute(text("SELECT image_url FROM ai_tools LIMIT 1"))
                print("✅ ai_tools.image_url column already exists")
            except Exception:
                print("Adding image_url column to ai_tools table...")
                conn.execute(text("ALTER TABLE ai_tools ADD COLUMN image_url VARCHAR(500)"))
                conn.commit()
                print("✅ ai_tools.image_url column added successfully!")
            
            # Add to projects table
            try:
                conn.execute(text("SELECT image_url FROM projects LIMIT 1"))
                print("✅ projects.image_url column already exists")
            except Exception:
                print("Adding image_url column to projects table...")
                conn.execute(text("ALTER TABLE projects ADD COLUMN image_url VARCHAR(500)"))
                conn.commit()
                print("✅ projects.image_url column added successfully!")
                
    except Exception as e:
        print(f"❌ Error adding image_url column: {e}")

if __name__ == "__main__":
    add_image_url_column()
