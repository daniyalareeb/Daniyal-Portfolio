# 📚 DanPortfolio API Documentation

Complete API reference for the DanPortfolio backend, including authentication, endpoints, request/response formats, and examples.

## 📋 Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Public APIs](#public-apis)
  - [Admin APIs](#admin-apis)
- [Data Models](#data-models)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌐 Base URL

```
Development: http://localhost:8000
Production: https://your-backend-domain.com
```

All API endpoints are prefixed with `/api/v1/`

## 🔐 Authentication

The API uses JWT-based authentication with secure HTTP-only cookies.

### Authentication Flow

1. **Login**: POST `/api/v1/login` with password
2. **Session Cookie**: Server sets `admin_session` cookie
3. **Authenticated Requests**: Include cookie automatically
4. **Logout**: POST `/api/v1/logout` clears session

### Security Features

- **HttpOnly Cookies**: Prevents XSS attacks
- **SameSite=Strict**: Prevents CSRF attacks
- **Secure Flag**: HTTPS-only in production
- **JWT Expiration**: 2-hour session timeout
- **Session Extension**: POST `/api/v1/extend-session`

## ⚠️ Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "details": "Optional additional details"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## 🚀 Endpoints

### Authentication Endpoints

#### POST `/api/v1/login`
Admin login with session creation.

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

**Headers Set:**
```
Set-Cookie: admin_session=jwt_token; HttpOnly; SameSite=Strict; Max-Age=7200
```

---

#### POST `/api/v1/logout`
Admin logout with session cleanup.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Headers Set:**
```
Set-Cookie: admin_session=; HttpOnly; SameSite=Strict; Max-Age=0
```

---

#### POST `/api/v1/extend-session`
Extend admin session expiration.

**Response:**
```json
{
  "success": true,
  "message": "Session extended successfully"
}
```

### Public APIs

#### GET `/api/v1/tools/list`
Get list of AI tools with optional filtering.

**Query Parameters:**
- `q` (string, optional): Search query
- `category` (string, optional): Filter by category
- `limit` (number, optional): Maximum results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ChatGPT",
      "description": "Advanced conversational AI assistant",
      "category": "Chat Assistant",
      "url": "https://chat.openai.com",
      "pricing": "Freemium",
      "status": "Active",
      "source": "Manual",
      "auto_fetched": false,
      "last_checked": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### GET `/api/v1/projects/list`
Get list of portfolio projects.

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
      "technologies": "FastAPI, Next.js, Python, React",
      "image_url": "/static/uploads/project1.jpg"
    }
  ]
}
```

---

#### GET `/api/v1/news/list`
Get list of blog posts and news articles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Building AI-Powered Portfolios",
      "excerpt": "Learn how to create modern portfolio websites...",
      "content": "Full blog post content...",
      "category": "Development",
      "published": true,
      "featured": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

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
    "sources": ["work_experience", "technical_skills"],
    "mode": "cv"
  }
}
```

**Modes:**
- `"home"`: General portfolio chat
- `"cv"`: CV-specific questions
- `"projects"`: Project-related questions

---

#### POST `/api/v1/contact/submit`
Submit contact form.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

---

#### POST `/api/v1/cv/query`
Query CV data with specific questions.

**Request:**
```json
{
  "question": "What programming languages do you know?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "I'm proficient in Python, Java, and JavaScript...",
    "sources": ["technical_skills", "programming_languages"]
  }
}
```

### Admin APIs

All admin endpoints require authentication via session cookie.

#### GET `/api/v1/admin/dashboard`
Get admin dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total_tools": 25,
    "total_projects": 8,
    "total_blogs": 12,
    "recent_activity": [...]
  }
}
```

---

#### POST `/api/v1/add-project`
Add new project (Admin only).

**Request:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "url": "https://project.com",
  "github_url": "https://github.com/user/project",
  "category": "Web Development",
  "technologies": "React, Node.js",
  "image_url": "/static/uploads/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project added successfully",
  "data": {
    "id": 9,
    "name": "New Project",
    ...
  }
}
```

---

#### PUT `/api/v1/update-project/{id}`
Update existing project (Admin only).

**Request:** Same as add-project
**Response:** Same as add-project

---

#### DELETE `/api/v1/delete-project/{id}`
Delete project (Admin only).

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

#### POST `/api/v1/add-tool`
Add new AI tool (Admin only).

**Request:**
```json
{
  "name": "New AI Tool",
  "description": "Tool description",
  "url": "https://tool.com",
  "category": "Chat Assistant",
  "pricing": "Freemium",
  "status": "Active"
}
```

---

#### POST `/api/v1/upload-image`
Upload image file (Admin only).

**Request:** Multipart form data
- `file`: Image file (jpg, png, gif, webp)

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "image_url": "/static/uploads/filename.jpg"
  }
}
```

---

#### POST `/api/v1/generate-blog`
Generate AI blog post (Admin only).

**Request:**
```json
{
  "topic": "AI in Web Development",
  "category": "Development",
  "tone": "professional",
  "length": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "The Future of AI in Web Development",
    "excerpt": "AI is revolutionizing web development...",
    "content": "Full blog post content...",
    "topic": "AI in Web Development"
  }
}
```

---

#### POST `/api/v1/save-generated-blog`
Save generated blog post (Admin only).

**Request:**
```json
{
  "title": "Blog Title",
  "excerpt": "Blog excerpt",
  "content": "Full blog content",
  "category": "Development",
  "published": true,
  "featured": false
}
```

---

#### GET `/api/v1/scheduler/status`
Get background scheduler status.

**Response:**
```json
{
  "success": true,
  "data": {
    "running": true,
    "next_blog_update": "2024-01-18T10:30:00Z",
    "last_update": "2024-01-15T10:30:00Z"
  }
}
```

## 📊 Data Models

### Tool Model
```typescript
interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  pricing: string;
  status: "Active" | "Inactive";
  source: "Manual" | "Auto";
  auto_fetched: boolean;
  last_checked: string;
}
```

### Project Model
```typescript
interface Project {
  id: number;
  name: string;
  description: string;
  url?: string;
  github_url?: string;
  category: string;
  technologies?: string;
  image_url?: string;
}
```

### BlogPost Model
```typescript
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  published: boolean;
  featured: boolean;
  created_at: string;
}
```

### ContactSubmission Model
```typescript
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
```

## 🚦 Rate Limiting

- **Public APIs**: 100 requests per minute per IP
- **Admin APIs**: 200 requests per minute per authenticated user
- **Chat API**: 10 requests per minute per IP (AI processing intensive)

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 💡 Examples

### Frontend Integration

#### JavaScript/React
```javascript
// Using the API client
import { ApiClient } from './lib/api';

// Get projects
const projects = await ApiClient.getProjects();

// Send chat message
const response = await ApiClient.sendChatMessage(
  "Tell me about your Python experience",
  "cv"
);

// Submit contact form
await ApiClient.submitContact(
  "John Doe",
  "john@example.com",
  "Hello, I'd like to discuss a project..."
);
```

#### cURL Examples
```bash
# Login
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"password": "your-password"}' \
  -c cookies.txt

# Get tools (authenticated)
curl -X GET http://localhost:8000/api/v1/tools/list \
  -b cookies.txt

# Add project (authenticated)
curl -X POST http://localhost:8000/api/v1/add-project \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "category": "Web Development"
  }'

# Send chat message
curl -X POST http://localhost:8000/api/v1/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What technologies do you use?",
    "mode": "cv"
  }'
```

### Error Handling Example
```javascript
try {
  const response = await ApiClient.getProjects();
  console.log('Projects:', response.data);
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Request timed out, please try again');
  } else if (error.message.includes('401')) {
    console.error('Authentication required');
  } else {
    console.error('API Error:', error.message);
  }
}
```

## 🔧 Development

### Testing API Endpoints

1. **Start Backend**: `python3 -m uvicorn app.main:app --reload`
2. **Access Docs**: http://localhost:8000/docs (Swagger UI)
3. **Alternative Docs**: http://localhost:8000/redoc (ReDoc)

### Environment Variables

```bash
# Required for API functionality
OPENROUTER_API_KEY=your-openrouter-key
ADMIN_PASSWORD=your-secure-password
JWT_SECRET_KEY=your-jwt-secret

# Optional for enhanced features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- File uploads are limited to 10MB
- Supported image formats: JPG, PNG, GIF, WebP
- API versioning: `/api/v1/` prefix
- CORS enabled for frontend domains
- Automatic API documentation at `/docs`

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Daniyal Ahmad  
**Repository**: https://github.com/daniyalareeb/portfolio

