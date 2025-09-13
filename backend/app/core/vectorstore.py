"""
PostgreSQL pgvector wrapper for storing CV + portfolio notes and running RAG-like retrieval.
Uses PostgreSQL with pgvector extension for efficient vector operations.
"""
import os
from pathlib import Path
from typing import List, Tuple

# Try to import pgvector components, fallback if not available
try:
    from app.core.pgvector_store import add_documents as pgvector_add_documents
    from app.core.pgvector_store import query_similar as pgvector_query_similar
    from app.core.pgvector_store import initialize_pgvector
    PGVECTOR_AVAILABLE = True
except ImportError as e:
    PGVECTOR_AVAILABLE = False
    print(f"⚠️ pgvector not available: {e}. RAG features will be disabled.")

def add_documents(docs: List[Tuple[str, str]]):
    """Add documents to vector store."""
    if not PGVECTOR_AVAILABLE:
        print("⚠️ pgvector not available. Skipping document addition.")
        return
    
    try:
        pgvector_add_documents(docs)
    except Exception as e:
        print(f"❌ Error adding documents to pgvector: {e}")

def query_similar(text: str, k: int = 4) -> List[str]:
    """Query similar documents from vector store."""
    if not PGVECTOR_AVAILABLE:
        print("⚠️ pgvector not available. Returning empty results.")
        return []
    
    try:
        return pgvector_query_similar(text, k)
    except Exception as e:
        print(f"❌ Error querying pgvector: {e}")
        return []

def initialize_vector_store():
    """Initialize the vector store."""
    if not PGVECTOR_AVAILABLE:
        print("⚠️ pgvector not available. Skipping vector store initialization.")
        return
    
    try:
        initialize_pgvector()
    except Exception as e:
        print(f"❌ Error initializing vector store: {e}")