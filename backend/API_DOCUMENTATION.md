# Personal Website Backend API Documentation

## Base URL
- Development: `http://localhost:5001/api`
- Production: `https://your-api-domain.com/api`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentication Routes (`/api/auth`)

#### GitHub OAuth Login
```http
GET /api/auth/github
```
Redirects to GitHub OAuth authorization page.

#### GitHub OAuth Callback
```http
GET /api/auth/github/callback
```
Handles GitHub OAuth callback and redirects to frontend with token.

#### Get Current User
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "userId": "string",
    "login": "string"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```
**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 👤 User Routes (`/api/users`)

#### Get Current User Profile
```http
GET /api/users/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "login": "string"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
```
**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "string",
  "bio": "string",
  "location": "string",
  "website": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "login": "string",
    "name": "string",
    "bio": "string",
    "location": "string",
    "website": "string",
    "updatedAt": "string"
  }
}
```

#### Get User Statistics
```http
GET /api/users/stats
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProjects": 12,
    "totalViews": 1250,
    "totalLikes": 89,
    "joinedDate": "2023-01-15",
    "lastActive": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 📧 Contact Routes (`/api/contact`)

#### Submit Contact Form
```http
POST /api/contact/submit
```
**Body:**
```json
{
  "name": "string (2-50 chars)",
  "email": "valid-email@example.com",
  "subject": "string (5-100 chars)",
  "message": "string (10-1000 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message! I will get back to you soon.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

#### Get Contact Information
```http
GET /api/contact/info
```
**Response:**
```json
{
  "success": true,
  "contact": {
    "email": "your.email@example.com",
    "phone": "+1 (555) 123-4567",
    "location": "San Francisco, CA",
    "social": {
      "github": "https://github.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername",
      "twitter": "https://twitter.com/yourusername"
    },
    "availability": {
      "status": "available",
      "message": "Currently available for new projects and opportunities"
    }
  }
}
```

---

### 🚀 Project Routes (`/api/projects`)

#### Get All Projects
```http
GET /api/projects
```
**Query Parameters:**
- `category` (optional): `frontend`, `backend`, `fullstack`, or `all`
- `featured` (optional): `true` to get only featured projects
- `status` (optional): `completed`, `in-progress`
- `limit` (optional): Number to limit results

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": 1,
      "title": "E-commerce Platform",
      "description": "A full-stack e-commerce platform...",
      "technologies": ["React", "TypeScript", "Node.js"],
      "githubUrl": "https://github.com/username/project",
      "liveUrl": "https://project-demo.com",
      "category": "fullstack",
      "featured": true,
      "status": "completed",
      "startDate": "2023-01-15",
      "endDate": "2023-03-20",
      "views": 245,
      "likes": 18
    }
  ],
  "total": 6,
  "categories": ["frontend", "backend", "fullstack"],
  "filters": {
    "category": "all",
    "featured": null,
    "status": null,
    "limit": null
  }
}
```

#### Get Single Project
```http
GET /api/projects/:id
```
**Response:**
```json
{
  "success": true,
  "project": {
    "id": 1,
    "title": "E-commerce Platform",
    "description": "A full-stack e-commerce platform...",
    "technologies": ["React", "TypeScript", "Node.js"],
    "githubUrl": "https://github.com/username/project",
    "liveUrl": "https://project-demo.com",
    "category": "fullstack",
    "featured": true,
    "status": "completed",
    "startDate": "2023-01-15",
    "endDate": "2023-03-20",
    "views": 246,
    "likes": 18
  }
}
```

#### Get Project Statistics
```http
GET /api/projects/stats/summary
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "total": 6,
    "completed": 5,
    "inProgress": 1,
    "featured": 3,
    "totalViews": 1125,
    "totalLikes": 104,
    "categories": {
      "frontend": 3,
      "backend": 1,
      "fullstack": 2
    },
    "technologies": [
      { "name": "React", "count": 5 },
      { "name": "TypeScript", "count": 5 },
      { "name": "Node.js", "count": 4 }
    ],
    "recentProjects": [
      {
        "id": 6,
        "title": "Chat Application",
        "startDate": "2023-11-01"
      }
    ]
  }
}
```

---

### 🏥 Health Check

#### Health Status
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.123
}
```

---

## Error Responses

### Common Error Formats

#### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "details": [...]
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "User not authenticated"
}
```

#### 403 Forbidden
```json
{
  "error": "Invalid token",
  "message": "The provided token is invalid or malformed"
}
```

#### 404 Not Found
```json
{
  "error": "Route not found",
  "path": "/api/invalid-route"
}
```

#### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```

---

## Rate Limiting
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Rate limit info included in response headers

## Security Features
- **Helmet.js:** Security headers
- **CORS:** Cross-origin resource sharing configured
- **Compression:** Response compression enabled
- **Input Validation:** All inputs validated and sanitized
- **JWT:** Secure token-based authentication
- **Session Security:** Secure session configuration

## Environment Variables
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

---

## Testing the API

### Using curl
```bash
# Get all projects
curl -X GET http://localhost:5001/api/projects

# Submit contact form
curl -X POST http://localhost:5001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Hello",
    "message": "This is a test message"
  }'

# Get user profile (with auth)
curl -X GET http://localhost:5001/api/users/me \
  -H "Authorization: Bearer your-jwt-token"
```

### Using JavaScript/Fetch
```javascript
// Get projects
const projects = await fetch('http://localhost:5001/api/projects')
  .then(res => res.json())

// Submit contact form
const response = await fetch('http://localhost:5001/api/contact/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'This is a test message'
  })
})
```

---

**API Version:** 1.0.0  
**Last Updated:** January 2024  
**Documentation:** Complete and ready for production use