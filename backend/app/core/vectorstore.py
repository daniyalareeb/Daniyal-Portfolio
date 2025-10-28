"""
ChromaDB wrapper for storing your CV + portfolio notes and running RAG-like retrieval.
Uses local ChromaDB SQLite database integrated into the FastAPI backend.
"""
import os
import chromadb
from typing import List, Tuple
import logging
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)

# Local ChromaDB path - use Heroku-friendly directory
CHROMADB_PATH = os.path.join(
    os.environ.get('VOLUME_MOUNT_PATH', './data'), 
    'chroma'
)

CollectionName = "cv_data"

# Initialize ChromaDB client
def get_chroma_client():
    """Get or create ChromaDB client with persistent storage"""
    try:
        # Ensure directory exists
        os.makedirs(CHROMADB_PATH, exist_ok=True)
        
        # Create persistent client
        client = chromadb.PersistentClient(path=CHROMADB_PATH)
        
        # Get or create collection
        try:
            collection = client.get_collection(CollectionName)
        except ValueError:
            # Collection doesn't exist, create it
            collection = client.create_collection(
                name=CollectionName,
                metadata={"description": "CV and portfolio data for RAG queries"}
            )
            logger.info(f"Created new ChromaDB collection: {CollectionName}")
        
        return client, collection
    except Exception as e:
        logger.error(f"Failed to initialize ChromaDB: {e}")
        return None, None

def add_documents_sync(docs: List[Tuple[str, str]]):
    """Add documents to local ChromaDB"""
    if not docs:
        return
    
    try:
        client, collection = get_chroma_client()
        if not collection:
            logger.warning("ChromaDB not available, skipping document addition")
            return
        
        # Prepare documents for ChromaDB
        ids = [doc[0] for doc in docs]
        documents = [doc[1] for doc in docs]
        
        # Add documents to collection
        collection.add(
            ids=ids,
            documents=documents
        )
        logger.info(f"Added {len(docs)} documents to ChromaDB")
        
    except Exception as e:
        logger.error(f"Failed to add documents to ChromaDB: {e}")
        logger.warning("ChromaDB service is not available, continuing without vector storage")

def query_similar_sync(text: str, k: int = 4) -> List[str]:
    """Query similar documents from local ChromaDB"""
    try:
        client, collection = get_chroma_client()
        if not collection:
            logger.warning("ChromaDB not available, returning fallback documents")
            return get_fallback_documents()
        
        # Query similar documents
        results = collection.query(
            query_texts=[text],
            n_results=k
        )
        
        # Extract documents from results
        documents = results.get('documents', [[]])
        if documents and documents[0]:
            return documents[0]
        else:
            return get_fallback_documents()
            
    except Exception as e:
        logger.error(f"Failed to query ChromaDB: {e}")
        return get_fallback_documents()

def get_fallback_documents() -> List[str]:
    """Return fallback documents when ChromaDB is not available"""
    return [
        "Daniyal Ahmad is a skilled backend developer with expertise in FastAPI, Python, and modern web development.",
        "He has experience with AI/ML technologies and has worked on various portfolio projects.",
        "His technical skills include Python, JavaScript, React, FastAPI, SQL, and cloud deployment.",
        "Daniyal is passionate about creating efficient and scalable web applications."
    ]

# Async wrappers for compatibility
async def add_documents(docs: List[Tuple[str, str]]):
    """Async wrapper for add_documents_sync"""
    import asyncio
    return await asyncio.get_event_loop().run_in_executor(None, add_documents_sync, docs)

async def query_similar(text: str, k: int = 4) -> List[str]:
    """Async wrapper for query_similar_sync"""
    import asyncio
    return await asyncio.get_event_loop().run_in_executor(None, query_similar_sync, text, k)