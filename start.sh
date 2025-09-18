#!/bin/bash
cd backend
export PYTHONPATH=/app/backend:$PYTHONPATH
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
