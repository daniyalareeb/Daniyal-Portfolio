import os, json, asyncio
from app.core.ai_client import chat_complete
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "cv_data.json")

# Load Daniyal facts with fallback
try:
    with open(os.path.abspath(DATA_PATH), "r", encoding="utf-8") as f:
        CV = json.load(f)
except FileNotFoundError:
    # Fallback CV data if file is not found (e.g., in deployment)
    CV = {
        "personal_info": {
            "full_name": "Daniyal Ahmad",
            "github": "daniyalareeb",
            "linkedin": "linkedin.com/in/daniyalareeb"
        },
        "education": {
            "university": "University of East London",
            "degree": "Computer Science",
            "year": "Final year"
        },
        "skills": ["Python", "JavaScript", "React", "FastAPI", "SQL"],
        "experience": [
            {"role": "Software Developer", "company": "Freelance"},
            {"role": "Web Developer", "company": "Personal Projects"},
            {"role": "AI/ML Developer", "company": "University Projects"}
        ],
        "projects": [
            {"name": "Portfolio Website"},
            {"name": "AI Chat Application"},
            {"name": "Various Web Projects"}
        ]
    }

BRIEF_FACTS = f"""
Full Name: {CV.get('personal_info', {}).get('full_name','Daniyal Ahmad')}
Age: 20 (born 11/12/2004)
Location: London, UK (from India originally)
Education: Final year Computer Science student at University of East London
GitHub: {CV.get('personal_info', {}).get('github','daniyalareeb')}
LinkedIn: {CV.get('personal_info', {}).get('linkedin','linkedin.com/in/daniyalareeb')}
Portfolio: {CV.get('personal_info', {}).get('portfolio','daniyalareeb.com')}
Key Skills: {", ".join(CV.get('core_skills', []))}
Experience: {", ".join([f"{exp.get('role', '')} at {exp.get('company', '')}" for exp in CV.get('experience', [])])}
Projects: {", ".join([p.get('name','') for p in CV.get('projects', [])])}
Branding: {CV.get('personal_info', {}).get('branding','')}
"""

HOME_TONE = """You ARE Daniyal Ahmad. Speak in FIRST PERSON as yourself. Say "I" not "he".

STYLE:
- Casual, confident, friendly - like texting a friend
- SHORT responses (1-3 sentences for simple questions)
- PLAIN TEXT ONLY: no markdown, no bullets, no emojis, no special characters
- NEVER use em-dashes or en-dashes. Use commas or "and" instead
- Be witty and sharp when appropriate

GREETINGS: When someone says hi/hey/hello, respond warmly like "Hey! I'm Daniyal. What do you want to know about me?" or "What's up! Ask me anything about my work or background."

HANDLING INSULTS: If someone asks if you're dumb/stupid/bad, respond confidently with your achievements. Example: "Dumb? I'm a final year CS student building AI systems, RAG pipelines, and full-stack apps. I'd say that's the opposite of dumb."

ABOUT ME:
- 20 years old, from India, studying CS in London (University of East London)
- Backend developer: Python, FastAPI, SQL, MongoDB, ChromaDB, LLMs, RAG
- Very ambitious - I go to any length to achieve my goals
- Business-minded, analytical problem-solver
- Love cars, photography, bonsai, travel, adventure sports

MY GOALS:
- Work at Apple, Google, Tesla, or Meta for experience
- Then start my own AI HealthTech company

MY PROJECTS:
- NFC attendance emulator, Maker Club app, this portfolio website, AI mock interviewer

If asked something totally unrelated: "I'm here to talk about myself and my work. What would you like to know?"
If asked to write code: "I can tell you about my projects but can't write code for you here."

Remember: You ARE Daniyal. Be natural, confident, and engaging."""

CV_TONE = """You ARE Daniyal Ahmad. You speak in FIRST PERSON as Daniyal himself. This is a professional CV chat - be slightly more formal but still speak as yourself.

CRITICAL RULES:
- Speak as Daniyal in first person: "I am...", "My experience...", "I developed..."
- Be professional but personable - like a confident job interview
- Keep responses concise and focused on professional topics
- NO markdown, NO bullet points - natural professional conversation
- If asked something unrelated: "I'm happy to discuss my professional background and skills."
- If asked to generate code: "I can walk you through my projects but can't write code here."

YOUR PROFESSIONAL PROFILE:
- Final year CS student at University of East London (from India)
- Backend engineering: Python, FastAPI, SQL, MongoDB, ChromaDB
- AI/ML: LLMs, RAG systems, fine-tuning, vector databases, sentence transformers
- Quick learner with hands-on project experience
- Entrepreneurial mindset with proven delivery

YOUR PROJECTS:
- NFC attendance emulator (Flutter + backend)
- Maker Club app (Flutter + Firebase + OpenRouter API)
- This portfolio website (Next.js + FastAPI + ChromaDB + AI)
- AI mock interviewer (in development)

YOUR CAREER GOALS:
- Target: Software Engineer (AI-focused) or AI/ML Engineer
- Dream companies: Apple, Google, Tesla, Meta, Citadel, Jane Street
- Long-term: Start my own AI HealthTech company
- Open to relocation, preference for California

Remember: You ARE Daniyal. Speak professionally as yourself."""

def build_prompt(user_message: str, mode: str):
    if mode == "cv":
        system = CV_TONE
    else:
        system = HOME_TONE
    
    # Enhanced context with structured personal details
    personal_context = f"""
DANIYAL AHMAD - PERSONAL INFORMATION:

PERSONAL BACKGROUND:
- Age: 20 (born 11/12/2004)
- From India, now in London for university
- Final year Computer Science student at University of East London
- Very ambitious and stubborn - goes to any length to achieve goals
- Business-minded, always looking for income opportunities
- Analytical problem-solver, finds efficient solutions
- Loves cars, photography, nature, gardening (bonsai), traveling, adventure sports

TECHNICAL SKILLS:
- Python, FastAPI, SQL, MongoDB, ChromaDB
- LLMs, RAG systems, fine-tuning, vector databases
- Docker, Linux, Git
- Learning approach: Uses AI as teacher, asks questions, does test tasks

PROJECTS:
- NFC attendance emulator (Flutter + backend)
- Charity website (HTML/CSS/JS)
- Football scoreboard (React + Node.js + MongoDB)
- Maker Club app (Flutter + Firebase + OpenRouter API)
- Portfolio website (Next.js + FastAPI + ChromaDB + OpenRouter)
- AI mock interviewer (in development)

CAREER GOALS:
- Work at top tech companies (Apple, Google, Tesla, Meta, Citadel, Jane Street)
- Gain industry experience, then start own AI HealthTech company
- Build affordable/no-cost healthcare solutions
- Create interactive mock interviewer

ADDITIONAL FACTS:
{BRIEF_FACTS}

Use this information to answer questions about Daniyal Ahmad. Be helpful and conversational while staying focused on Daniyal's background, skills, and projects."""
    
    return system + "\n\nDANIYAL'S INFORMATION:\n" + personal_context + "\n\nUSER QUESTION:\n" + user_message

async def ask_model(message: str, mode: str | None = "home") -> str:
    # Simple check for obvious non-Daniyal questions
    message_lower = message.lower()
    
    # Only reject if it's clearly asking for general help unrelated to Daniyal
    if any(keyword in message_lower for keyword in [
        "generate code for me", "write code for me", "create code for me", 
        "write email for me", "create email for me", "draft email for me",
        "help me with my", "solve my problem", "fix my code", "debug my"
    ]):
        return "I can tell you about Daniyal's coding projects and technical skills, but I can't generate code for you. What would you like to know about Daniyal's background, projects, or skills?"
    
    prompt = build_prompt(message, mode or "home")
    # Best free models for natural conversation (no "think" models that expose reasoning)
    models = [
        "openai/gpt-oss-20b:free",
        "google/gemma-3-27b-it:free",
        "mistralai/mistral-7b-instruct:free",
        "nex-agi/deepseek-v3.1-nex-n1:free",
    ]
    last_error = None
    for m in models:
        try:
            ans = await chat_complete(prompt, model=m, max_tokens=350, temperature=0.5 if mode=="cv" else 0.8)
            # Skip empty responses (some models return empty strings)
            if not ans or not ans.strip():
                print(f"Model {m} returned empty response, trying next...")
                continue
            # Clean up special characters (em-dashes, en-dashes)
            ans = ans.replace('‑', '-').replace('–', '-').replace('—', '-')
            # If it refused to talk about Daniyal, force guardrail
            if "I can only answer about Daniyal" in ans:
                return ans
            # If hallucinated another GitHub, override with correct handle when explicitly asked
            if "github" in message.lower() and "daniyal" in message.lower():
                ans += f"\n\nGitHub: {CV.get('personal_info', {}).get('github','daniyalareeb')}"
            return ans.strip()
        except Exception as e:
            last_error = e
            print(f"Model {m} failed: {e}")
    
    # All models failed - return a clear error message with fallback info
    error_msg = "⚠️ **AI Service Temporarily Unavailable**\n\n"
    
    if "rate limit" in str(last_error).lower() or "429" in str(last_error):
        error_msg += "The AI service is currently experiencing high demand (rate limited). Please try again in a few minutes.\n\n"
    elif "insufficient credits" in str(last_error).lower() or "402" in str(last_error):
        error_msg += "The AI service credits have been exhausted. Please contact the administrator.\n\n"
    elif "model not found" in str(last_error).lower() or "404" in str(last_error):
        error_msg += "The AI model is temporarily unavailable. Please try again later.\n\n"
    else:
        error_msg += "The AI service is experiencing technical difficulties. Please try again later.\n\n"
    
    error_msg += "**Here's what I can tell you about Daniyal:**\n"
    
    if mode == "cv":
        return error_msg + "Daniyal is a skilled backend developer with expertise in FastAPI, AI/ML, and modern web development. You can check out his work at https://github.com/daniyalareeb."
    else:
        # Provide specific information about Daniyal's projects when AI is unavailable
        if "project" in message.lower():
            return error_msg + """Daniyal has worked on several impressive projects:

1. **NFC Attendance Emulator** - A Flutter-based app that clones university ID cards (Mifare Classic 1K) to enable phone-based attendance tapping.

2. **Maker Club App** - A comprehensive Flutter app with Firebase backend and OpenRouter API integration. Features include member communication, project collaboration, CDT coin leaderboard system, news section, branded AI assistant using DeepSeek model, and DSA buddy with daily challenges.

3. **Portfolio Website** - This AI-powered portfolio with Next.js frontend and FastAPI backend. Features OpenRouter DeepSeek API integration, ChromaDB for CV data, automated blog generation, AI tool management system, and SMTP email integration.

4. **Charity Website** - Built responsive charity website using HTML, CSS, and JavaScript to improve client outreach and user engagement.

5. **Football Scoreboard** - Real-time football scoreboard application with React.js frontend, Node.js backend, and MongoDB database.

6. **AI Mock Interviewer** - Interactive AI-powered mock interviewer system to help users prepare for technical interviews (in development).

All projects showcase Daniyal's backend expertise, AI integration skills, and ability to build full-stack applications."""
        elif "skill" in message.lower():
            return error_msg + """Daniyal's technical skills include:

**Backend Development**: Python, FastAPI, SQL, MongoDB, ChromaDB, Docker, Linux, Git

**AI/ML Technologies**: LLMs, RAG systems, fine-tuning, vector databases, sentence transformers, OpenRouter API

**Frontend Development**: Flutter, React.js, Next.js, HTML, CSS, JavaScript

**Learning Approach**: Uses AI as teacher, asks questions until understanding, does test tasks

**Personality Traits**: Very ambitious and stubborn, business-minded, analytical problem-solver, hands-on learner"""
        elif "github" in message.lower() or "linkedin" in message.lower():
            return error_msg + "Daniyal's GitHub username is daniyalareeb. You can find his projects at https://github.com/daniyalareeb. His LinkedIn profile is at https://linkedin.com/in/daniyalareeb."
        elif "hey" in message.lower() or "hello" in message.lower() or "hi" in message.lower():
            return error_msg + "Hi! I'm Daniyal Ahmad's AI assistant. I'm currently experiencing some technical difficulties, but I can tell you about Daniyal! He's a 20-year-old final year Computer Science student at University of East London, passionate about AI/ML and backend development. Ask me about his projects, skills, or career goals!"
        else:
            return error_msg + "I'm having trouble connecting to my AI services right now. However, I can tell you about Daniyal! He's a skilled backend developer with expertise in Python, FastAPI, AI/ML technologies, and modern web development. Ask me about his projects, skills, or career goals!"