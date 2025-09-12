#!/usr/bin/env python3
"""Simple script to create database tables with new model structure."""

import sys
import os
sys.path.append(os.path.dirname(__file__))

from app.database import engine, Base
from app.models import Tool, Project, BlogPost, ChatMessage, CVChunk, ContactSubmission

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    create_tables()
