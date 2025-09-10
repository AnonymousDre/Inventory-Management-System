# Backend Supabase Authentication Integration

## Overview

This document outlines how the backend server integrates with Supabase authentication to secure API endpoints and manage user sessions. The backend uses Supabase JWT tokens to verify user authentication and authorize access to protected resources.

## Architecture

```
Frontend (React) → Supabase Auth → Backend (Express) → Azure PostgreSQL
     ↓                ↓                ↓                    ↓
  User Login    JWT Token        Token Verification    Data Storage
```

## Prerequisites

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Azure PostgreSQL Database
AZURE_DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=4000
```

### Required Dependencies

The backend uses the following key dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "pg": "^8.8.0",
    "dotenv": "^16.0.0"
  }
}
```

## Authentication Flow

### 1. User Authentication (Frontend)

```javascript
// Frontend login process
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Store JWT token in session
const token = data.session.access_token;
```

### 2. Token Transmission

The frontend includes the JWT token in API requests:

```javascript
// Frontend API calls
const response = await fetch('/api/inventory', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 3. Backend Token Verification

The backend verifies the JWT token using Supabase's auth API:

```javascript
const verifySupabaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.SUPABASE_ANON_KEY
        }
      }
    );

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await response.json();
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Token verification failed' });
  }
};
```

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Test Database Connection
```http
GET /api/test
```

**Response:**
```json
{
  "message": "Successfully connected to Azure PostgreSQL",
  "time": "2024-01-15T10:30:00.000Z"
}
```

### Protected Endpoints (Authentication Required)

All protected endpoints use the `verifySupabaseToken` middleware.

#### Get Inventory Items
```http
GET /api/inventory
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Inventory data from Azure PostgreSQL",
  "user": "user@example.com",
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "quantity": 100,
      "unit_price": 29.99,
      "category": "Electronics",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Add Inventory Item
```http
POST /api/inventory
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product Description",
  "quantity": 50,
  "unit_price": 19.99,
  "category": "Electronics"
}
```

**Response:**
```json
{
  "message": "Item added successfully",
  "data": {
    "id": 2,
    "name": "New Product",
    "description": "Product Description",
    "quantity": 50,
    "unit_price": 19.99,
    "category": "Electronics",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Categories
```http
GET /api/categories
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "message": "Categories from Azure PostgreSQL",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and components"
    }
  ]
}
```

## Security Implementation

### 1. JWT Token Validation

- **Token Extraction**: Extracts Bearer token from Authorization header
- **Supabase Verification**: Validates token with Supabase auth API
- **User Context**: Attaches user information to request object
- **Error Handling**: Returns appropriate HTTP status codes for auth failures

### 2. Middleware Pattern

```javascript
// Apply middleware to protected routes
app.get("/api/inventory", verifySupabaseToken, async (req, res) => {
  // req.user contains authenticated user data
  const userEmail = req.user.email;
  // ... handle request
});
```

### 3. Error Responses

| Status Code | Description | Response |
|-------------|-------------|----------|
| 401 | No token provided | `{ "error": "No token provided" }` |
| 401 | Invalid token | `{ "error": "Invalid token" }` |
| 401 | Token verification failed | `{ "error": "Token verification failed" }` |

## Database Integration

### Azure PostgreSQL Connection

```javascript
const pool = new Pool({
  connectionString: process.env.AZURE_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
```

### Connection Monitoring

```javascript
pool.on('connect', () => {
  console.log('Connected to Azure PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create `.env` file with required variables (see Prerequisites section).

### 3. Start Development Server

```bash
npm run dev
```

### 4. Start Production Server

```bash
npm start
```

## Testing Authentication

### 1. Test Public Endpoint

```bash
curl http://localhost:4000/api/test
```

### 2. Test Protected Endpoint (Without Token)

```bash
curl http://localhost:4000/api/inventory
# Expected: 401 Unauthorized
```

### 3. Test Protected Endpoint (With Valid Token)

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:4000/api/inventory
```

## Troubleshooting

### Common Issues

1. **"No token provided"**
   - Ensure Authorization header is included
   - Check token format: `Bearer <token>`

2. **"Invalid token"**
   - Verify token is not expired
   - Check Supabase URL and anon key configuration

3. **"Token verification failed"**
   - Check network connectivity to Supabase
   - Verify environment variables are set correctly

### Debug Mode

Enable detailed logging by adding console.log statements in the `verifySupabaseToken` middleware:

```javascript
console.log('Token received:', token);
console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Response status:', response.status);
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **HTTPS**: Use HTTPS in production for secure token transmission
3. **Token Expiration**: Implement token refresh logic in frontend
4. **Rate Limiting**: Consider implementing rate limiting for auth endpoints
5. **Logging**: Log authentication attempts for security monitoring

## Future Enhancements

1. **Role-Based Access Control**: Implement user roles and permissions
2. **Token Refresh**: Add automatic token refresh mechanism
3. **Audit Logging**: Log all authenticated actions
4. **API Rate Limiting**: Implement rate limiting per user
5. **Database Connection Pooling**: Optimize database connections

## Related Files

- `server.js` - Main backend server file
- `package.json` - Dependencies and scripts
- `.env` - Environment configuration (create this file)
- `SUPABASE_AUTH_INTEGRATION.md` - This documentation file

## Support

For issues related to Supabase authentication integration, check:

1. Supabase Dashboard for project configuration
2. Backend server logs for error details
3. Network connectivity to Supabase services
4. Environment variable configuration
