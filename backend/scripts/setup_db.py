#!/usr/bin/env python3
"""
Setup script for DanPortfolio backend.
Creates database tables and populates ChromaDB with CV data.
"""
import sys
import os
import json
from pathlib import Path
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import engine, Base
from app.models import BlogPost, Tool, ChatMessage, CVChunk, ContactSubmission, Project
from app.core.vectorstore import add_documents

# Import all models to ensure they're registered with Base
from app.models import *

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def setup_chromadb():
    """Setup ChromaDB with structured CV data."""
    print("Setting up ChromaDB with CV data...")
    
    # Load structured CV data
    cv_data_path = Path(__file__).parent.parent / "data" / "cv_data.json"
    
    if not cv_data_path.exists():
        print("❌ CV data file not found. Creating default CV data...")
        create_default_cv_data()
        return
    
    with open(cv_data_path, 'r') as f:
        cv_data = json.load(f)
    
    # Create multiple document embeddings for better RAG
    documents = []
    
    # 1. Personal branding document
    branding_doc = f"""
    PERSONAL BRANDING:
    {cv_data['personal_info']['full_name']} - {cv_data['personal_info']['branding']}
    
    Professional Summary: {cv_data['professional_summary']}
    
    Contact Information:
    - GitHub: https://github.com/{cv_data['personal_info']['github']}
    - LinkedIn: https://{cv_data['personal_info']['linkedin']}
    - Portfolio: https://{cv_data['personal_info']['portfolio']}
    - Email: {cv_data['personal_info']['email']}
    - Location: {cv_data['personal_info']['location']}
    """
    documents.append(("personal_branding", branding_doc))
    
    # 2. Skills document
    skills_doc = f"""
    TECHNICAL SKILLS:
    Core Skills: {', '.join(cv_data['core_skills'])}
    
    Daniyal is proficient in modern backend technologies including FastAPI, Python, and AI/ML tools.
    He has hands-on experience with LLMs, RAG systems, and vector databases.
    """
    documents.append(("technical_skills", skills_doc))
    
    # 3. Experience document
    experience_doc = "WORK EXPERIENCE:\n"
    for exp in cv_data['experience']:
        experience_doc += f"""
        {exp['role']} at {exp['company']} ({exp['duration']})
        {exp['description']}
        """
    documents.append(("work_experience", experience_doc))
    
    # 4. Projects document
    projects_doc = "PROJECTS:\n"
    for project in cv_data['projects']:
        projects_doc += f"""
        {project['name']}:
        {project['description']}
        Technologies: {', '.join(project['tech'])}
        URL: {project['url']}
        """
    documents.append(("projects", projects_doc))
    
    # 5. Portfolio details document
    portfolio_doc = f"""
    PORTFOLIO WEBSITE DETAILS:
    {cv_data['portfolio_details']['description']}
    
    Backend Features: {', '.join(cv_data['portfolio_details']['backend_features'])}
    Frontend Features: {', '.join(cv_data['portfolio_details']['frontend_features'])}
    
    This portfolio demonstrates Daniyal's full-stack capabilities and AI integration skills.
    """
    documents.append(("portfolio_details", portfolio_doc))
    
    # 6. Additional info document
    additional_doc = f"""
    ADDITIONAL INFORMATION:
    Education: {cv_data['education']}
    Languages: {', '.join(cv_data['languages'])}
    Interests: {', '.join(cv_data['interests'])}
    Certifications: {', '.join(cv_data['certifications'])}
    """
    documents.append(("additional_info", additional_doc))
    
    # Add all documents to ChromaDB
    add_documents(documents)
    print(f"✅ Added {len(documents)} structured documents to ChromaDB!")
    
    # Also add the raw JSON for comprehensive search
    raw_doc = json.dumps(cv_data, indent=2)
    add_documents([("raw_cv_data", raw_doc)])
    print("✅ Added raw CV data to ChromaDB!")

def create_default_cv_data():
    """Create default CV data if the JSON file doesn't exist."""
    default_cv = {
        "personal_info": {
            "full_name": "Daniyal Ahmad",
            "github": "daniyalareeb",
            "linkedin": "linkedin.com/in/daniyalareeb",
            "portfolio": "daniyalareeb.com",
            "email": "daniyalareeb@gmail.com",
            "branding": "Backend developer with FastAPI and AI expertise"
        },
        "core_skills": ["Python", "FastAPI", "LLMs", "RAG", "ChromaDB"],
        "experience": ["Backend Developer at Manage Your Sales"],
        "projects": ["Portfolio Website", "AI Doctor", "Crypto Gateway"]
    }
    
    # Save default data
    cv_data_path = Path(__file__).parent.parent / "data" / "cv_data.json"
    cv_data_path.parent.mkdir(exist_ok=True)
    
    with open(cv_data_path, 'w') as f:
        json.dump(default_cv, f, indent=2)
    
    print("✅ Created default CV data file!")
    setup_chromadb()

def add_sample_data():
    """Add sample data to the database."""
    print("Adding sample data...")
    
    from app.database import SessionLocal
    from app.models import Tool, Project, BlogPost
    
    db = SessionLocal()
    try:
        # Clear existing data to avoid duplicates
        db.query(Tool).delete()
        db.query(Project).delete()
        db.query(BlogPost).delete()
        db.commit()
        print("✅ Cleared existing data to prevent duplicates")
        
        # Add sample tools
        sample_tools = [
            Tool(
                name="ChatGPT",
                description="Advanced conversational AI assistant for various tasks",
                category="Chat Assistant",
                status="Active",
                url="https://chat.openai.com",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Claude",
                description="AI assistant with advanced reasoning capabilities",
                category="Chat Assistant",
                status="Active",
                url="https://claude.ai",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="DALL-E 3",
                description="AI image generation from text descriptions",
                category="Image Generation",
                status="Active",
                url="https://openai.com/dall-e-3",
                pricing="Paid",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Midjourney",
                description="AI art generation platform for creative imagery",
                category="Image Generation",
                status="Active",
                url="https://midjourney.com",
                pricing="Paid",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Stable Diffusion",
                description="Open source image generation model",
                category="Image Generation",
                status="Active",
                url="https://stability.ai",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Runway ML",
                description="AI-powered video editing and generation platform",
                category="Video Editing",
                status="Active",
                url="https://runwayml.com",
                pricing="Paid",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Synthesia",
                description="AI video generation with virtual avatars",
                category="Video Editing",
                status="Active",
                url="https://synthesia.io",
                pricing="Paid",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Canva AI",
                description="AI-powered design and presentation tool",
                category="Presentation",
                status="Active",
                url="https://canva.com",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Beautiful.ai",
                description="AI presentation design platform",
                category="Presentation",
                status="Active",
                url="https://beautiful.ai",
                pricing="Paid",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="ElevenLabs",
                description="AI voice generation and text-to-speech platform",
                category="Voice",
                status="Active",
                url="https://elevenlabs.io",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="Murf AI",
                description="AI voice generator for videos and presentations",
                category="Voice",
                status="Active",
                url="https://murf.ai",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="OpenRouter API",
                description="AI model aggregation service providing access to multiple LLMs",
                category="API Services",
                status="Active",
                url="https://openrouter.ai",
                pricing="Freemium",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            ),
            Tool(
                name="LangChain",
                description="Framework for developing applications powered by language models",
                category="API Services",
                status="Active",
                url="https://langchain.com",
                pricing="Open source",
                source="Manual",
                auto_fetched=False,
                last_checked=datetime.utcnow()
            )
        ]
        
        # Add sample blog posts
        sample_blogs = [
            BlogPost(
                title="Building AI-Powered Portfolios with FastAPI and Next.js",
                excerpt="Learn how to create a modern portfolio website with AI integration, automated content generation, and seamless user experience.",
                content="In this comprehensive guide, we'll explore how to build a portfolio website that leverages AI capabilities for content generation, chat functionality, and dynamic updates. We'll use FastAPI for the backend with AI integration via OpenRouter, and Next.js for a modern, responsive frontend.\n\n## Key Features\n\n- **AI Chat Integration**: Real-time chat with your CV using RAG (Retrieval-Augmented Generation)\n- **Automated Content**: AI-powered blog posts and tool listings\n- **Dynamic Updates**: Background jobs for content refresh\n- **Modern UI**: Responsive design with Framer Motion animations\n\n## Technical Stack\n\n- **Backend**: FastAPI, SQLAlchemy, ChromaDB\n- **AI**: OpenRouter API, LLM integration\n- **Frontend**: Next.js, React, Tailwind CSS\n- **Database**: SQLite with vector embeddings\n\nThis approach demonstrates how to create a portfolio that's not just static, but actively showcases your technical skills through AI integration.",
                category="Development",
                published=True,

                featured=True
            ),
            BlogPost(
                title="The Future of AI in Web Development",
                excerpt="Exploring how artificial intelligence is transforming the way we build and maintain web applications.",
                content="Artificial Intelligence is revolutionizing web development in unprecedented ways. From automated code generation to intelligent user interfaces, AI is becoming an integral part of modern web applications.\n\n## AI-Powered Development Tools\n\n- **Code Generation**: Tools like GitHub Copilot and Cursor AI\n- **Testing Automation**: AI-driven test case generation\n- **Performance Optimization**: Intelligent caching and optimization\n- **User Experience**: Personalized content and recommendations\n\n## Real-World Applications\n\n- **E-commerce**: AI-powered product recommendations\n- **Content Management**: Automated content generation and curation\n- **Customer Support**: Intelligent chatbots and support systems\n- **Analytics**: Predictive analytics and user behavior analysis\n\nThe integration of AI in web development is not just a trend—it's the future of how we build digital experiences.",
                category="AI/ML",
                published=True,

                featured=False
            ),
            BlogPost(
                title="Mastering FastAPI: Building Scalable APIs",
                excerpt="A deep dive into FastAPI best practices for building high-performance, scalable web APIs.",
                content="FastAPI has emerged as one of the most popular Python web frameworks for building APIs. Its combination of speed, automatic documentation, and type hints makes it an excellent choice for modern web development.\n\n## Why FastAPI?\n\n- **Performance**: Built on top of Starlette and Pydantic\n- **Type Safety**: Automatic validation and serialization\n- **Documentation**: Auto-generated OpenAPI documentation\n- **Async Support**: Native async/await support\n- **Modern Python**: Uses Python 3.6+ features\n\n## Best Practices\n\n- **Project Structure**: Organize your code with proper separation of concerns\n- **Dependency Injection**: Use FastAPI's dependency injection system\n- **Error Handling**: Implement comprehensive error handling\n- **Testing**: Write thorough tests with pytest\n- **Deployment**: Use Docker and cloud platforms\n\nFastAPI's simplicity and power make it perfect for building APIs that scale from startup to enterprise.",
                category="Development",
                published=True,

                featured=True
            )
        ]
        
        # Add sample projects
        sample_projects = [
            Project(
                name="Portfolio Website",
                description="Full-stack portfolio with AI integration, built with FastAPI backend and Next.js frontend. Features AI-powered chat, ChromaDB vector database, and modern 3D UI animations.",
                url="https://daniyalareeb.com",
                github_url="https://github.com/daniyalareeb/portfolio",
                category="Web Development",
                technologies="FastAPI, Next.js, Python, React, ChromaDB, OpenRouter API"
            ),
            Project(
                name="AI Doctor",
                description="AI-powered medical consultation system using LLMs and RAG technology for accurate medical information retrieval and diagnostics.",
                url="https://github.com/daniyalareeb/ai-doctor",
                github_url="https://github.com/daniyalareeb/ai-doctor",
                category="AI/ML",
                technologies="Python, FastAPI, LLMs, RAG, Medical AI"
            ),
            Project(
                name="Crypto Gateway",
                description="Secure cryptocurrency payment gateway with blockchain integration and real-time market data processing.",
                url="https://github.com/daniyalareeb/crypto-gateway",
                github_url="https://github.com/daniyalareeb/crypto-gateway",
                category="Blockchain",
                technologies="Python, Blockchain, Cryptocurrency, Payment Processing"
            ),
            Project(
                name="Proxmox VE Home Lab",
                description="Virtualization cluster with multiple VMs, LXC containers, and integrated NAS storage for development and testing.",
                url="https://github.com/daniyalareeb/proxmox-lab",
                github_url="https://github.com/daniyalareeb/proxmox-lab",
                category="DevOps",
                technologies="Proxmox, Virtualization, Linux, NAS, Docker"
            ),
            Project(
                name="NFC Attendance System",
                description="Mobile-based NFC emulator for attendance tracking with real-time monitoring and reporting capabilities.",
                url="https://github.com/daniyalareeb/nfc-attendance",
                github_url="https://github.com/daniyalareeb/nfc-attendance",
                category="Mobile Development",
                technologies="Flutter, NFC, Mobile App, Attendance System"
            )
        ]
        
        # Insert tools
        for tool in sample_tools:
            db.add(tool)
        
        # Insert projects
        for project in sample_projects:
            db.add(project)
        
        # Insert blogs
        for blog in sample_blogs:
            db.add(blog)
        
        db.commit()
        print(f"✅ Added {len(sample_tools)} tools, {len(sample_projects)} projects, and {len(sample_blogs)} blogs to database!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

def main():
    """Main setup function."""
    print("🚀 Setting up DanPortfolio backend...")
    
    try:
        create_tables()
        setup_chromadb()
        add_sample_data()
        
        print("\n🎉 Setup completed successfully!")
        print("You can now start the backend with: python -m uvicorn app.main:app --reload")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

