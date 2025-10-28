# 🚀 DanPortfolio - AI-Powered Portfolio Website

A modern, full-stack portfolio website showcasing Daniyal Ahmad's work with AI integration, automated content generation, and interactive features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

DanPortfolio is a comprehensive portfolio website that demonstrates modern web development practices with AI integration. It features:

- **AI-Powered Chat**: Interactive chat with CV using RAG (Retrieval-Augmented Generation)
- **Automated Content**: AI-generated blog posts and tool listings
- **Dynamic Updates**: Background jobs for content refresh
- **Modern UI**: Responsive design with 3D animations and smooth interactions
- **Admin Dashboard**: Content management system for portfolio updates

## ✨ Features

### Frontend Features
- 🎨 **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- 🎭 **3D Avatar**: Interactive 3D character using Three.js
- 💬 **AI Chat**: Real-time conversation with CV using AI
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Performance**: Optimized loading and smooth animations
- 🔒 **Secure Admin**: JWT-based authentication system

### Backend Features
- 🤖 **AI Integration**: OpenRouter API for LLM capabilities
- 🗄️ **Vector Database**: ChromaDB for semantic search and RAG
- 📝 **Content Management**: Automated blog and tool generation
- 🔐 **Security**: JWT authentication with secure session management
- 📊 **Analytics**: Portfolio statistics and engagement tracking
- 🚀 **Scalable**: FastAPI with async support

### AI Features
- 💭 **RAG System**: Retrieval-Augmented Generation for CV chat
- 📰 **Content Generation**: AI-powered blog post creation
- 🔍 **Semantic Search**: Vector-based content discovery
- 🎯 **Smart Categorization**: Automatic content categorization

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **State Management**: React Hooks
- **HTTP Client**: Fetch API with custom wrapper

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (development) / PostgreSQL (production)
- **Vector DB**: ChromaDB
- **Authentication**: JWT with secure cookies
- **AI Integration**: OpenRouter API
- **Background Jobs**: APScheduler
- **File Handling**: Python Multipart

### AI/ML
- **LLM Provider**: OpenRouter (DeepSeek, GPT models)
- **Vector Embeddings**: Sentence Transformers
- **RAG Pipeline**: ChromaDB + Custom retrieval
- **Content Generation**: Prompt engineering

### DevOps
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Heroku
- **Environment**: Container-ready
- **CI/CD**: Git-based deployments

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[Home Page] --> B[3D Avatar]
        A --> C[AI Chat]
        A --> D[Projects]
        A --> E[Blog]
        F[Admin Dashboard] --> G[Content Management]
    end
    
    subgraph "Backend (FastAPI)"
        H[API Gateway] --> I[Authentication]
        H --> J[Content APIs]
        H --> K[AI Services]
        L[Background Scheduler] --> M[Content Updates]
    end
    
    subgraph "Data Layer"
        N[SQLite/PostgreSQL] --> O[Portfolio Data]
        P[ChromaDB] --> Q[Vector Embeddings]
        R[Static Files] --> S[Images/Assets]
    end
    
    subgraph "External Services"
        T[OpenRouter API] --> U[LLM Models]
        V[SMTP] --> W[Email Service]
    end
    
    A --> H
    F --> H
    H --> N
    H --> P
    K --> T
    J --> V
```

## 📁 Project Structure (Monorepo)

This is a **monorepo** containing both frontend and backend applications:

```
DanPortfolio/
├── frontend/                 # Next.js frontend (Vercel deployment)
│   ├── components/          # Reusable React components
│   │   ├── ThreeAvatar.jsx  # 3D avatar component
│   │   ├── Hero.jsx         # Hero section
│   │   ├── About.jsx        # About section
│   │   └── ...
│   ├── pages/               # Next.js pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── api/             # API routes
│   │   ├── chat/            # AI chat page
│   │   └── ...
│   ├── lib/                 # Utility libraries
│   ├── utils/               # Helper functions
│   ├── styles/              # Global styles
│   └── public/              # Static assets
│
├── backend/                 # FastAPI backend (Heroku deployment)
│   ├── app/                 # Main application code
│   │   ├── api/             # API endpoints
│   │   │   └── v1/          # API version 1
│   │   ├── core/            # Core functionality
│   │   │   ├── security.py  # Authentication & security
│   │   │   ├── ai_client.py # AI service integration
│   │   │   └── vectorstore.py # Vector database
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── schemas/         # Pydantic schemas
│   │   └── utils/           # Utility functions
│   ├── data/                # Data files
│   │   ├── cv_data.json     # CV information
│   │   └── chroma/          # Vector database files
│   ├── scripts/             # Setup and utility scripts
│   └── static/              # Static file serving
│
├── .gitignore              # Monorepo gitignore
├── README.md               # This file
├── FRONTEND_VERCEL_CONFIG.md         # Vercel deployment guide
└── docs/                    # Additional documentation
```

### 🚀 Deployment Configuration

- **Frontend**: Deploy from `frontend/` directory to Vercel
- **Backend**: Deploy from `backend/` directory to Heroku
- **Domain**: `daniyalareeb.com` (Namecheap + Vercel)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git**

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp env.example .env

# Edit environment variables
nano .env

# Initialize database
python3 scripts/setup_db.py

# Start development server
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```bash
# Server Configuration
APP_NAME="Daniyal Portfolio Backend"
APP_ENV="development"
APP_HOST="0.0.0.0"
APP_PORT=8000

# Database
DATABASE_URL="sqlite:///./data/portfolio.db"

# AI Configuration
OPENROUTER_API_KEY="your-openrouter-key"
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
OPENROUTER_MODEL="deepseek/deepseek-chat-v3-0324:free"

# Security (CHANGE IN PRODUCTION!)
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET_KEY="your-jwt-secret"
ADMIN_SECRET="your-admin-secret"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
ADMIN_EMAIL="your-email@gmail.com"

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/login`
Admin login with JWT session creation.

**Request:**
```json
{
  "password": "your-admin-password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful"
}
```

#### POST `/api/v1/logout`
Admin logout with session cleanup.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Content Management Endpoints

#### GET `/api/v1/tools/list`
Get list of AI tools.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "description": "Advanced conversational AI",
      "category": "Chat Assistant",
      "url": "https://chat.openai.com",
      "pricing": "Freemium",
      "status": "Active"
    }
  ]
}
```

#### GET `/api/v1/projects/list`
Get list of projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Portfolio Website",
      "description": "AI-powered portfolio with modern UI",
      "url": "https://daniyalareeb.com",
      "github_url": "https://github.com/daniyalareeb/portfolio",
      "category": "Web Development",
      "technologies": "FastAPI, Next.js, Python, React"
    }
  ]
}
```

### AI Chat Endpoint

#### POST `/api/v1/chat/send`
Send message to AI chat system.

**Request:**
```json
{
  "message": "Tell me about your experience with FastAPI",
  "mode": "cv"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "I have extensive experience with FastAPI...",
    "sources": ["work_experience", "technical_skills"]
  }
}
```

### Admin Endpoints (Requires Authentication)

#### POST `/api/v1/add-project`
Add new project (Admin only).

#### PUT `/api/v1/update-project/{id}`
Update project (Admin only).

#### DELETE `/api/v1/delete-project/{id}`
Delete project (Admin only).

#### POST `/api/v1/generate-blog`
Generate AI blog post (Admin only).

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Configure Build**: Vercel auto-detects Next.js
3. **Set Environment Variables**: Add `NEXT_PUBLIC_API_URL`
4. **Deploy**: Automatic deployment on push

### Backend Deployment (Heroku)

1. **Install Heroku CLI**: `brew install heroku/brew/heroku` (Mac) or visit heroku.com
2. **Login**: `heroku login`
3. **Create App**: `heroku create your-app-name`
4. **Add PostgreSQL**: `heroku addons:create heroku-postgresql:mini`
5. **Set Config Vars**: `heroku config:set KEY=value`
6. **Deploy**: `git push heroku main`

### Environment Variables for Production

#### Frontend (Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
```

#### Backend (Heroku)
```bash
APP_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGINS=["https://your-frontend.vercel.app"]
# ... other production variables
```

## 🔧 Development

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black + isort for Python formatting
- **Comments**: Comprehensive docstrings and inline comments

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python -m pytest
```

### Database Migrations

```bash
# Create new migration
cd backend
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Add comprehensive comments for complex logic
- Update documentation for new features
- Test all changes thoroughly
- Ensure security best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Daniyal Ahmad**
- GitHub: [@daniyalareeb](https://github.com/daniyalareeb)
- LinkedIn: [daniyalareeb](https://linkedin.com/in/daniyalareeb)
- Portfolio: [daniyalareeb.me](https://daniyalareeb.me)
- Email: daniyalareeb@gmail.com

## 🙏 Acknowledgments

- **OpenRouter** for AI model access
- **Vercel** for frontend hosting
- **Heroku** for backend hosting
- **Three.js** community for 3D graphics
- **FastAPI** team for the excellent framework

---

## 📊 Project Statistics

- **Frontend**: ~15,000 lines of code
- **Backend**: ~8,000 lines of code
- **AI Integration**: RAG system with vector embeddings
- **Database**: 6 models with relationships
- **API Endpoints**: 25+ RESTful endpoints
- **Components**: 20+ reusable React components

## 🔮 Future Enhancements

- [ ] **Multi-language Support**: i18n implementation
- [ ] **Advanced Analytics**: User engagement tracking
- [ ] **Mobile App**: React Native companion app
- [ ] **Real-time Features**: WebSocket integration
- [ ] **Advanced AI**: Custom model fine-tuning
- [ ] **Performance**: CDN and caching optimization

---

**Built with ❤️ by Daniyal Ahmad**

*This portfolio demonstrates modern full-stack development with AI integration, showcasing the future of web development.*

