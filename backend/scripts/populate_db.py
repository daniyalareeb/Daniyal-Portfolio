#!/usr/bin/env python3
"""
Populate database with sample data for testing.
"""
import os
import sys
from pathlib import Path

# Add the parent directory to the Python path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal, engine
from app.models import BlogPost, Tool, Project, ContactSubmission
from datetime import date

def populate_database():
    """Add sample data to the database"""
    db = SessionLocal()
    
    try:
        # Add sample tools
        tools = [
            Tool(
                id=1,
                name="Midjourney",
                description="AI-powered image generation with stunning artistic results",
                category="Image Generation",
                status="Popular",
                url="https://midjourney.com",
                pricing="Paid"
            ),
            Tool(
                id=2,
                name="ChatGPT",
                description="Advanced language model for conversation and content creation",
                category="Text Generation",
                status="Popular",
                url="https://chat.openai.com",
                pricing="Freemium"
            ),
            Tool(
                id=3,
                name="DALL-E 3",
                description="OpenAI's latest image generation model",
                category="Image Generation",
                status="Popular",
                url="https://openai.com/dall-e-2",
                pricing="Paid"
            ),
            Tool(
                id=4,
                name="Runway ML",
                description="Professional video editing and generation using AI",
                category="Video Generation",
                status="Trending",
                url="https://runwayml.com",
                pricing="Freemium"
            ),
            Tool(
                id=5,
                name="Gamma",
                description="AI-powered presentation creation and design",
                category="Presentation",
                status="Trending",
                url="https://gamma.app",
                pricing="Freemium"
            )
        ]
        
        for tool in tools:
            existing = db.query(Tool).filter(Tool.id == tool.id).first()
            if not existing:
                db.add(tool)
        
        # Add sample blog posts
        blogs = [
            BlogPost(
                id=1,
                title="AI in Healthcare: Revolutionizing Patient Care",
                excerpt="How artificial intelligence is transforming diagnosis, treatment planning, and patient monitoring in modern healthcare systems.",
                content="Artificial intelligence is revolutionizing healthcare by providing faster, more accurate diagnoses and personalized treatment plans. From medical imaging analysis to drug discovery, AI is becoming an integral part of modern medicine.",
                category="Healthcare",
                published=date(2024, 1, 15),
                read_time="5 min read",
                featured=True
            ),
            BlogPost(
                id=2,
                title="The Future of AI in Marketing: Personalization at Scale",
                excerpt="Exploring how AI-powered marketing tools are creating hyper-personalized customer experiences and driving conversion rates.",
                content="AI is transforming marketing by enabling hyper-personalization at scale. Machine learning algorithms analyze customer behavior to deliver targeted content, recommendations, and advertisements that resonate with individual preferences.",
                category="Marketing",
                published=date(2024, 1, 10),
                read_time="4 min read",
                featured=False
            ),
            BlogPost(
                id=3,
                title="Generative AI: Beyond Text and Images",
                excerpt="A deep dive into the next generation of AI models that can create music, code, and even 3D content.",
                content="Generative AI is expanding beyond text and images to create music, code, 3D models, and even video content. These advancements are opening new possibilities for creative professionals and developers.",
                category="Technology",
                published=date(2024, 1, 8),
                read_time="6 min read",
                featured=True
            )
        ]
        
        for blog in blogs:
            existing = db.query(BlogPost).filter(BlogPost.id == blog.id).first()
            if not existing:
                db.add(blog)
        
        # Add sample projects
        projects = [
            Project(
                id=1,
                name="AI Doctor",
                description="AI healthcare assistant for diagnostics and treatment planning",
                url="https://github.com/daniyalareeb/ai-doctor"
            ),
            Project(
                id=2,
                name="Crypto Gateway",
                description="Blockchain-secured payment gateway with AI fraud detection",
                url="https://github.com/daniyalareeb/crypto-gateway"
            ),
            Project(
                id=3,
                name="Maker Club App",
                description="Flutter and Firebase-based app for student collaboration with AI features",
                url="https://github.com/daniyalareeb/maker-club-app"
            )
        ]
        
        for project in projects:
            existing = db.query(Project).filter(Project.id == project.id).first()
            if not existing:
                db.add(project)
        
        db.commit()
        print("✅ Sample data added successfully!")
        
    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database()




