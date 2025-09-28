#!/usr/bin/env python3
"""
Migration script to add display_order columns to existing tables.
This script handles both SQLite (development) and PostgreSQL (production).
"""

import os
import sys
import sqlite3
try:
    import psycopg2
except ImportError:
    psycopg2 = None
from sqlalchemy import create_engine, text

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.config import Settings

def get_database_url():
    """Get database URL from environment or config."""
    settings = Settings()
    return settings.DATABASE_URL

def check_column_exists(cursor, table_name, column_name):
    """Check if a column exists in the table."""
    try:
        # Try PostgreSQL first
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = %s AND column_name = %s
        """, (table_name, column_name))
        return cursor.fetchone() is not None
    except:
        # Fallback to SQLite
        try:
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [row[1] for row in cursor.fetchall()]
            return column_name in columns
        except:
            return False

def migrate_database():
    """Add display_order columns to all tables."""
    database_url = get_database_url()
    
    print(f"🔧 Connecting to database: {database_url.split('@')[1] if '@' in database_url else 'local'}")
    
    try:
        engine = create_engine(database_url)
        
        with engine.connect() as connection:
            # Get cursor for raw SQL
            cursor = connection.connection.cursor()
            
            tables_to_migrate = [
                ("ai_tools", "display_order"),
                ("projects", "display_order"), 
                ("blog_posts", "display_order")
            ]
            
            for table_name, column_name in tables_to_migrate:
                print(f"📋 Checking {table_name}...")
                
                # Check if column already exists
                if check_column_exists(cursor, table_name, column_name):
                    print(f"✅ Column {column_name} already exists in {table_name}")
                    continue
                
                # Add the column
                try:
                    if "postgresql" in database_url:
                        # PostgreSQL
                        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} INTEGER DEFAULT 0")
                        print(f"✅ Added {column_name} column to {table_name} (PostgreSQL)")
                    else:
                        # SQLite
                        cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} INTEGER DEFAULT 0")
                        print(f"✅ Added {column_name} column to {table_name} (SQLite)")
                    
                    # Set initial display_order values based on id
                    cursor.execute(f"UPDATE {table_name} SET {column_name} = id WHERE {column_name} IS NULL")
                    print(f"✅ Set initial {column_name} values for {table_name}")
                    
                except Exception as e:
                    print(f"❌ Error adding {column_name} to {table_name}: {e}")
                    continue
            
            # Commit changes
            connection.connection.commit()
            print("🎉 Migration completed successfully!")
            
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Starting display_order migration...")
    success = migrate_database()
    
    if success:
        print("✅ Migration completed successfully!")
        sys.exit(0)
    else:
        print("❌ Migration failed!")
        sys.exit(1)
