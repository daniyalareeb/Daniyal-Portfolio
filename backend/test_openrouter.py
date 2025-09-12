#!/usr/bin/env python3
"""
Test script to verify OpenRouter API integration
"""
import asyncio
import os
from dotenv import load_dotenv
from app.core.ai_client import ai_client

# Load environment variables
load_dotenv()

async def test_openrouter():
    """Test OpenRouter API integration"""
    print("Testing OpenRouter API integration...")
    print(f"API Key configured: {'Yes' if os.getenv('OPENROUTER_API_KEY') else 'No'}")
    print(f"Base URL: {os.getenv('OPENROUTER_BASE_URL', 'Not set')}")
    print(f"Model: {os.getenv('OPENROUTER_MODEL', 'Not set')}")
    print("-" * 50)
    
    # Test simple chat
    test_message = "Hello! Tell me about Daniyal's skills in one sentence."
    print(f"Test message: {test_message}")
    
    try:
        response = await ai_client.get_chat_response(
            messages=[{"role": "user", "content": test_message}],
            context="You are Daniyal's AI assistant. Be concise and professional."
        )
        print(f"✅ Response received: {response}")
        return True
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_openrouter())
    if result:
        print("\n🎉 OpenRouter integration test passed!")
    else:
        print("\n💥 OpenRouter integration test failed!")

