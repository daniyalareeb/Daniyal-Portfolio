"""
ChromaDB Server for Railway deployment
Provides HTTP API for vector operations
"""
import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import json

# Initialize FastAPI app
app = FastAPI(title="ChromaDB Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB client (in-memory for Railway)
client = chromadb.Client(Settings(allow_reset=True))

# Initialize sentence transformer
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Collection name
COLLECTION_NAME = "cv_data"

# Create or get collection
collection = client.get_or_create_collection(name=COLLECTION_NAME)

@app.get("/")
async def root():
    return {"message": "ChromaDB Server is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "collection_count": collection.count()}

@app.post("/add_documents")
async def add_documents(request: Dict[str, Any]):
    """Add documents to the collection"""
    try:
        docs = request.get("documents", [])
        if not docs:
            return {"message": "No documents provided"}
        
        # Extract IDs and texts
        ids = [doc["id"] for doc in docs]
        texts = [doc["text"] for doc in docs]
        
        # Generate embeddings
        embeddings = embedder.encode(texts, convert_to_numpy=True).tolist()
        
        # Add to collection
        collection.upsert(ids=ids, documents=texts, embeddings=embeddings)
        
        return {"message": f"Added {len(docs)} documents", "count": len(docs)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_documents(request: Dict[str, Any]):
    """Query similar documents"""
    try:
        query_text = request.get("query", "")
        k = request.get("k", 4)
        
        if not query_text:
            raise HTTPException(status_code=400, detail="Query text is required")
        
        # Generate embedding for query
        query_embedding = embedder.encode([query_text], convert_to_numpy=True).tolist()
        
        # Query collection
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=k
        )
        
        documents = results.get("documents", [[]])[0]
        distances = results.get("distances", [[]])[0]
        
        return {
            "documents": documents,
            "distances": distances,
            "count": len(documents)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/reset")
async def reset_collection():
    """Reset the collection (for testing)"""
    try:
        client.delete_collection(COLLECTION_NAME)
        global collection
        collection = client.get_or_create_collection(name=COLLECTION_NAME)
        return {"message": "Collection reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
