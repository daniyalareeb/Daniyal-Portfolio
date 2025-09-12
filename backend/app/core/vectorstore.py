"""
ChromaDB wrapper for storing your CV + portfolio notes and running RAG-like retrieval.
We use local MiniLM sentence-transformers for embeddings (CPU friendly).
"""
import os
from pathlib import Path
from typing import List, Tuple
import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

# Get the absolute path to the backend directory and then to data/chroma
backend_dir = Path(__file__).parent.parent.parent
chroma_path = backend_dir / "data" / "chroma"

client = chromadb.PersistentClient(path=str(chroma_path), settings=ChromaSettings(allow_reset=True))

_embedder = SentenceTransformer("all-MiniLM-L6-v2")

CollectionName = "cv_data"  # Match the collection name from setup script

def get_collection():
    return client.get_or_create_collection(name=CollectionName)


def add_documents(docs:List[Tuple[str,str]]):
    col = get_collection()
    if not docs:
        return
    ids = [d[0] for d in docs]
    texts = [d[1] for d in docs]
    embeddings = _embedder.encode(texts, convert_to_numpy=True).tolist()
    col.upsert(ids=ids, documents=texts, embeddings=embeddings)

def query_similar(text: str, k: int = 4) -> List[str]:
    col = get_collection()
    emb = _embedder.encode([text], convert_to_numpy=True).tolist()
    res = col.query(query_embeddings=emb, n_results=k)
    return res.get("documents", [[]])[0]  # list of strings