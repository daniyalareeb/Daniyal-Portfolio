#!/bin/bash

# Railway startup script for DanPortfolio Backend
# This script handles database initialization and starts the FastAPI server

echo "🚀 Starting DanPortfolio Backend on Railway..."

# Check if we're in production
if [ "$APP_ENV" = "production" ]; then
    echo "📊 Production environment detected"
    
    # Initialize database if needed
    echo "🗄️ Checking database initialization..."
    python3 -c "
import os
from app.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        # Check if tables exist
        result = conn.execute(text(\"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'\"))
        table_count = result.fetchone()[0]
        
        if table_count == 0:
            print('📝 No tables found, initializing database...')
            os.system('python3 scripts/setup_db.py')
        else:
            print(f'✅ Database already initialized with {table_count} tables')
            
except Exception as e:
    print(f'❌ Database check failed: {e}')
    print('📝 Attempting to initialize database...')
    os.system('python3 scripts/setup_db.py')
"
else
    echo "🔧 Development environment detected"
fi

# Start the FastAPI server
echo "🌐 Starting FastAPI server on port $PORT..."
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT

