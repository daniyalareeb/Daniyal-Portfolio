#!/usr/bin/env python3
"""
Migration script to add display_order columns to production database
Run this script to add the missing display_order columns to existing tables
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

def get_database_url():
    """Get database URL from environment variables"""
    # Try PostgreSQL first (production)
    if 'DATABASE_URL' in os.environ:
        return os.environ['DATABASE_URL']
    
    # Fallback to local SQLite
    return 'sqlite:///./data/portfolio.db'

def add_display_order_columns():
    """Add display_order columns to all tables"""
    db_url = get_database_url()
    print(f"Connecting to database: {db_url[:50]}...")
    
    engine = create_engine(db_url)
    
    # SQL statements to add display_order columns
    migrations = [
        "ALTER TABLE ai_tools ADD COLUMN display_order INTEGER DEFAULT 0;",
        "ALTER TABLE projects ADD COLUMN display_order INTEGER DEFAULT 0;", 
        "ALTER TABLE blog_posts ADD COLUMN display_order INTEGER DEFAULT 0;"
    ]
    
    with engine.connect() as conn:
        for migration in migrations:
            try:
                print(f"Executing: {migration}")
                conn.execute(text(migration))
                conn.commit()
                print("✅ Success")
            except OperationalError as e:
                if "already exists" in str(e) or "duplicate column" in str(e):
                    print("⚠️  Column already exists, skipping")
                else:
                    print(f"❌ Error: {e}")
            except Exception as e:
                print(f"❌ Unexpected error: {e}")
    
    print("Migration completed!")

if __name__ == "__main__":
    add_display_order_columns()
