"""
OpenRouter AI client for chat completions and embeddings.
Handles multiple free models with fallback mechanisms.
"""
import os
import httpx
from typing import List, Dict, Any, Optional
from app.config import settings

class OpenRouterClient:
    """OpenRouter client with fallback mechanisms for free models."""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL
        self.model = settings.OPENROUTER_MODEL
        
        # Current free models on OpenRouter (as of Dec 2024)
        # Ordered by quality/reasoning for witty responses - try best reasoning models first
        self.free_models = [
            "tngtech/deepseek-r1t-chimera:free",       # Best reasoning, witty responses
            "allenai/olmo-3-32b-think:free",           # Great reasoning, natural conversation
            "google/gemma-3-27b-it:free",              # Good quality, medium speed
            "openai/gpt-oss-20b:free",                 # Decent quality
            "moonshotai/kimi-k2:free",                 # Fast fallback
            "mistralai/mistral-7b-instruct:free"       # Fastest fallback
        ]
        
        # Professional CV assistant system prompt
        self.CV_SYSTEM_PROMPT = """You are Daniyal Ahmad's professional AI assistant. 
You help people learn about Daniyal's background, skills, projects, and career goals.

GUIDELINES:
- Focus on answering questions about Daniyal Ahmad using the provided information
- Be helpful, conversational, and natural in your responses
- You can discuss Daniyal's technical skills, projects, experience, and career aspirations
- You can explain what Daniyal's projects do and how they work
- You can provide details about Daniyal's background, education, and interests
- If asked about general topics unrelated to Daniyal, politely redirect: "I'm here to tell you about Daniyal Ahmad. What would you like to know about his background, projects, or skills?"
- If asked to generate code or perform tasks, respond: "I can tell you about Daniyal's coding projects and technical skills, but I can't generate code for you."
- Keep responses informative, engaging, and professional

PERSONALITY & TONE:
- Be witty, sharp, and clever in your responses - don't be boring or overly formal
- Match Daniyal's confident, ambitious personality - be direct and unapologetic
- Use humor and clever comebacks when appropriate, especially for negative or troll comments
- Be savage but professional - cleverly shut down disrespectful questions while staying classy
- Show personality and charisma - make conversations interesting and memorable
- Don't be a pushover - stand up for Daniyal's achievements and skills confidently

Key facts about Daniyal:
- 20-year-old final year Computer Science student at University of East London (from India)
- Very ambitious and stubborn - goes to any length to achieve goals
- Business-minded and money-focused - always looking for income opportunities
- Analytical problem-solver - finds most efficient solutions
- Hands-on learner - uses AI as teacher, asks questions until understanding
- Passionate about AI agents, LLMs, and automation

Career goals: Work at top tech companies (Apple, Google, Tesla, Meta, Citadel, Jane Street) for experience, then start own AI HealthTech company

Technical expertise: Python, FastAPI, SQL, MongoDB, ChromaDB, LLMs, RAG, fine-tuning, Docker, Linux

Projects: NFC attendance emulator, Maker Club app, portfolio website, charity websites, football scoreboard, AI mock interviewer

Remember: You are ONLY Daniyal's assistant. You cannot and will not help with anything else.

Tone: professional, confident, concise, witty, and enthusiastic about Daniyal's capabilities. Be clever and don't take disrespect lying down.
DO NOT make up facts. If unsure about something, say: "I don't have that information yet, but I can tell you about [related topic]."
Always mention Daniyal's GitHub username as 'daniyalareeb' when discussing his code or projects.
Be specific about his skills, projects, and experience.
End responses with a confident statement about how Daniyal can add value to potential employers."""

    async def get_chat_response(self, messages: List[Dict[str, str]], is_cv_query: bool = False) -> str:
        """Get chat response from OpenRouter with fallback mechanisms."""
        
        # Use CV-specific system prompt if this is a CV query
        if is_cv_query and messages and messages[0].get("role") == "system":
            messages[0]["content"] = self.CV_SYSTEM_PROMPT
        elif is_cv_query:
            messages.insert(0, {"role": "system", "content": self.CV_SYSTEM_PROMPT})
        
        # Try the primary model first
        try:
            return await self._make_request(messages, self.model)
        except Exception as e:
            print(f"Primary model failed: {e}")
            
            # Try fallback models
            for fallback_model in self.free_models:
                if fallback_model != self.model:
                    try:
                        print(f"Trying fallback model: {fallback_model}")
                        return await self._make_request(messages, fallback_model)
                    except Exception as fallback_error:
                        print(f"Fallback model {fallback_model} failed: {fallback_error}")
                        continue
            
            # If all models fail, return a professional fallback response
            if is_cv_query:
                return self._get_cv_fallback_response(messages)
            else:
                return "I'm experiencing technical difficulties at the moment. Please try again in a few minutes."

    async def _make_request(self, messages: List[Dict[str, str]], model: str) -> str:
        """Make a request to OpenRouter API."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://daniyalareeb.com",
            "X-Title": "DanPortfolio AI Assistant"
        }
        
        data = {
            "model": model,
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=data,
                timeout=15.0  # Reduced timeout for faster failure
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            elif response.status_code == 402:
                raise Exception("insufficient credits - API key may be invalid or out of credits")
            elif response.status_code == 401:
                raise Exception("Invalid API key")
            elif response.status_code == 429:
                # For unlimited API keys, 429 might be temporary - log and continue
                print(f"Rate limit hit for model {model}, trying next model...")
                raise Exception("rate limit")
            elif response.status_code == 404:
                raise Exception("model not found")
            else:
                raise Exception(f"API error: {response.status_code} - {response.text}")

    def _get_cv_fallback_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate a fallback response for CV queries when AI is unavailable."""
        user_query = ""
        for msg in messages:
            if msg.get("role") == "user":
                user_query = msg.get("content", "").lower()
                break
        
        if "hey" in user_query or "hello" in user_query or "hi" in user_query:
            return "Hello! I'm Daniyal Ahmad's professional assistant. Daniyal is a final-year Computer Science student at University of East London with strong backend development skills and deep interest in AI/ML technologies. He's seeking opportunities in software engineering or AI-focused roles at top tech companies. How can I help you learn more about Daniyal?"
        
        elif "github" in user_query or "username" in user_query:
            return "Daniyal's GitHub username is daniyalareeb. You can find his projects at https://github.com/daniyalareeb, showcasing his expertise in FastAPI, AI/ML, and full-stack development."
        
        elif "project" in user_query:
            return """Daniyal has worked on several impressive projects:

1. **NFC Attendance Emulator** - Flutter-based app that clones university ID cards for phone-based attendance
2. **Maker Club App** - Flutter app with Firebase backend, OpenRouter API integration, member collaboration, and AI assistant
3. **Portfolio Website** - Next.js frontend with FastAPI backend, ChromaDB, OpenRouter API, automated blog generation
4. **Charity Website** - HTML/CSS/JS website for client outreach and user engagement
5. **Football Scoreboard** - React.js frontend with Node.js backend and MongoDB database
6. **AI Mock Interviewer** - Interactive AI system for technical interview preparation (in development)

All projects demonstrate his backend expertise, AI integration skills, and full-stack development capabilities."""
        
        elif "skill" in user_query or "experience" in user_query:
            return """Daniyal is a skilled backend developer with expertise in:

**Backend Technologies**: Python, FastAPI, SQL, MongoDB, ChromaDB, Docker, Linux, Git
**AI/ML Technologies**: LLMs, RAG systems, fine-tuning, vector databases, sentence transformers, OpenRouter API
**Frontend Development**: Flutter, React.js, Next.js, HTML, CSS, JavaScript
**Learning Approach**: Uses AI as teacher, asks questions until understanding, does test tasks

He's a final-year Computer Science student at University of East London with strong academic performance and hands-on project experience."""
        
        else:
            return "Daniyal Ahmad is a dedicated backend engineer with strong expertise in FastAPI, AI/ML technologies, and modern web development. He's currently working as a Backend Developer and has built several impressive projects including this AI-powered portfolio. You can check out his work at https://github.com/daniyalareeb."

    async def get_embedding(self, text: str) -> List[float]:
        """Get text embedding from OpenRouter."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://daniyalareeb.com",
            "X-Title": "DanPortfolio AI Assistant"
        }
        
        data = {
            "model": "text-embedding-ada-002",
            "input": text
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/embeddings",
                headers=headers,
                json=data,
                timeout=30.0
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["data"][0]["embedding"]
            else:
                raise Exception(f"Embedding API error: {response.status_code}")

# Backward compatibility
ai_client = OpenRouterClient()

# Legacy function for backward compatibility
async def llm_chat(messages: List[Dict[str, str]]) -> str:
    """Legacy function for backward compatibility."""
    return await ai_client.get_chat_response(messages)

# New simplified chat function for the updated chat service
async def chat_complete(prompt: str, model: str, max_tokens: int = 300, temperature: float = 0.7) -> str:
    """Simplified chat completion function."""
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "Follow the system message strictly."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://daniyalareeb.com",
        "X-Title": "DanPortfolio",
    }
    
    async with httpx.AsyncClient(timeout=15) as client:  # Reduced timeout for faster failure
        r = await client.post(f"{settings.OPENROUTER_BASE_URL}/chat/completions", headers=headers, json=payload)
        if r.status_code != 200:
            # keep the error visible to logs but never crash caller
            raise Exception(f"OpenRouter API error {r.status_code}: {r.text}")
        data = r.json()
        return data["choices"][0]["message"]["content"]
