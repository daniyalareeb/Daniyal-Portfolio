#!/usr/bin/env python3
"""
Database initialization script
Creates all tables in the database
"""

from app.database import engine, Base
from app.models import *  # Import all models to register them

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    init_database()
