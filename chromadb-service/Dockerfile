FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the ChromaDB server script
COPY chromadb_server.py .

# Expose port
EXPOSE 8001

# Run ChromaDB server
CMD ["python", "chromadb_server.py"]
