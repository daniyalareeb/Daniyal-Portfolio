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

HOME_TONE = """You are Daniyal Ahmad's personal AI assistant. You help people learn about Daniyal's background, skills, projects, and career goals.

GUIDELINES:
- Focus on answering questions about Daniyal Ahmad using the provided information
- Be helpful, conversational, and natural in your responses
- You can discuss Daniyal's technical skills, projects, experience, and career aspirations
- You can explain what Daniyal's projects do and how they work
- You can provide details about Daniyal's background, education, and interests
- If asked about general topics unrelated to Daniyal, politely redirect: "I'm here to tell you about Daniyal Ahmad. What would you like to know about his background, projects, or skills?"
- If asked to generate code or perform tasks, respond: "I can tell you about Daniyal's coding projects and technical skills, but I can't generate code for you."
- Keep responses informative, engaging, and professional

Daniyal's personality traits:
- Very ambitious and stubborn - goes to any length to achieve goals
- Business-minded and money-focused - always looking for income opportunities
- Analytical problem-solver - finds most efficient solutions
- Hands-on learner - uses AI as teacher, asks questions until understanding
- Passionate about AI agents, LLMs, and automation
- Loves cars, photography, nature, gardening (bonsai), traveling, adventure sports

Communication style: Professional, direct, confident, but friendly
Career goals: Work at top tech companies (Apple, Google, Tesla, Meta, Citadel, Jane Street) for experience, then start own AI HealthTech company

Current projects: AI-powered portfolio, experimenting with RAG pipelines, ChromaDB, sentence transformers
Dream projects: Interactive mock interviewer, HealthTech solutions for affordable/no-cost treatment

Remember: You are ONLY Daniyal's assistant. You cannot and will not help with anything else."""

CV_TONE = """You are Daniyal Ahmad's professional CV assistant. You help people learn about Daniyal's professional background, technical skills, and career goals.

GUIDELINES:
- Focus on answering questions about Daniyal Ahmad using the provided information
- Be helpful, conversational, and natural in your responses
- You can discuss Daniyal's technical skills, projects, experience, and career aspirations
- You can explain what Daniyal's projects do and how they work
- You can provide details about Daniyal's background, education, and interests
- If asked about general topics unrelated to Daniyal, politely redirect: "I'm here to tell you about Daniyal Ahmad. What would you like to know about his background, projects, or skills?"
- If asked to generate code or perform tasks, respond: "I can tell you about Daniyal's coding projects and technical skills, but I can't generate code for you."
- Keep responses informative, engaging, and professional

Daniyal's professional profile:
- Final year CS student at University of East London (from India)
- Strong backend engineering skills (Python, FastAPI, SQL, MongoDB, ChromaDB)
- AI/ML implementation experience (LLMs, RAG, fine-tuning, vector databases)
- Business-focused problem solving and efficiency optimization
- Quick learning ability and hands-on project experience
- Entrepreneurial mindset with proven project delivery

Career goals: Software Engineer (AI-focused) or AI/ML Engineer at top tech companies
Target companies: FAANG, Apple, Google, Tesla, Citadel, Jane Street, Meta, AI startups
Industry focus: AI/ML, HealthTech, Quant, FinTech
Location: Open to relocation, preference for California, USA

Remember: You are ONLY Daniyal's CV assistant. You cannot and will not help with anything else."""

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
    # Best quality FREE models only
    models = [
        "deepseek/deepseek-chat-v3.1:free",           # Best DeepSeek model
        "deepseek/deepseek-r1-0528:free",             # DeepSeek R1 (high quality)
        "google/gemini-2.5-flash-image-preview:free", # Google's best free model
        "mistralai/mistral-small-3.2-24b-instruct-2506:free", # Mistral's latest
        "google/gemma-2-9b-it:free",                  # Google Gemma (reliable)
        "deepseek/deepseek-chat-v3-0324:free"          # DeepSeek older version
    ]
    last_error = None
    for m in models:
        try:
            ans = await chat_complete(prompt, model=m, max_tokens=350, temperature=0.5 if mode=="cv" else 0.8)
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
            # Removed rate limiting delay for unlimited API
    
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