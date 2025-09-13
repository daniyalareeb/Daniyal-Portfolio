"""
ChromaDB wrapper for storing your CV + portfolio notes and running RAG-like retrieval.
Uses external ChromaDB server deployed on Railway.
"""
import os
import httpx
from typing import List, Tuple
import logging

# Configure logging
logger = logging.getLogger(__name__)

# ChromaDB server URL (will be set via environment variable)
CHROMADB_URL = os.getenv("CHROMADB_URL", "http://localhost:8001")

CollectionName = "cv_data"  # Match the collection name from setup script

async def add_documents(docs: List[Tuple[str, str]]):
    """Add documents to the external ChromaDB server"""
    if not docs:
        return
    
    try:
        # Prepare documents for API
        documents = [{"id": doc[0], "text": doc[1]} for doc in docs]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CHROMADB_URL}/add_documents",
                json={"documents": documents},
                timeout=30.0
            )
            response.raise_for_status()
            logger.info(f"Added {len(docs)} documents to ChromaDB")
            
    except Exception as e:
        logger.error(f"Failed to add documents to ChromaDB: {e}")
        raise

async def query_similar(text: str, k: int = 4) -> List[str]:
    """Query similar documents from external ChromaDB server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{CHROMADB_URL}/query",
                json={"query": text, "k": k},
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            return result.get("documents", [])
            
    except Exception as e:
        logger.error(f"Failed to query ChromaDB: {e}")
        return []

def add_documents_sync(docs: List[Tuple[str, str]]):
    """Synchronous wrapper for add_documents"""
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(add_documents(docs))
    except RuntimeError:
        # If no event loop is running, create a new one
        return asyncio.run(add_documents(docs))

def query_similar_sync(text: str, k: int = 4) -> List[str]:
    """Synchronous wrapper for query_similar"""
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(query_similar(text, k))
    except RuntimeError:
        # If no event loop is running, create a new one
        return asyncio.run(query_similar(text, k))