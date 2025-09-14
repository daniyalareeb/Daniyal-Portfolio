#!/usr/bin/env python3
"""
Initialize database with sample data if empty.
This script runs on startup to ensure the database has data.
"""

import requests
import time
import os

def init_database():
    """Initialize database with sample data if empty"""
    backend_url = os.getenv("RAILWAY_PUBLIC_DOMAIN", "https://kind-perfection-production-ae48.up.railway.app")
    
    # Wait for backend to be ready
    max_retries = 30
    for i in range(max_retries):
        try:
            response = requests.get(f"{backend_url}/docs", timeout=5)
            if response.status_code == 200:
                print("Backend is ready!")
                break
        except:
            if i == max_retries - 1:
                print("Backend not ready after 30 retries")
                return
            time.sleep(2)
    
    # Check if database is empty
    try:
        response = requests.get(f"{backend_url}/api/v1/tools/list", timeout=5)
        if response.status_code == 200:
            data = response.json()
            tools_count = len(data.get('data', {}).get('items', []))
            
            if tools_count == 0:
                print("Database is empty, populating...")
                populate_response = requests.post(f"{backend_url}/api/v1/populate-database", timeout=10)
                if populate_response.status_code == 200:
                    result = populate_response.json()
                    print(f"Database populated: {result}")
                else:
                    print(f"Failed to populate database: {populate_response.text}")
            else:
                print(f"Database already has {tools_count} tools")
    except Exception as e:
        print(f"Error checking/populating database: {e}")

if __name__ == "__main__":
    init_database()
