# Quick Start Guide

## ✅ Your API is Ready!

Everything has been set up and configured with your MongoDB Atlas connection string.

## Start the Server

```bash
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Test the API

### 1. Health Check
Open your browser and visit: `http://localhost:5000`

Or use curl:
```bash
curl http://localhost:5000
```

### 2. Register a User

**Windows PowerShell:**
```powershell
curl -Method POST "http://localhost:5000/api/users/register" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

**Linux/Mac/Git Bash:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

### Expected Success Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## What's Configured

- ✅ MongoDB Atlas connection string
- ✅ All dependencies installed
- ✅ Password hashing with bcrypt
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Graceful shutdown

## Troubleshooting

If you see connection errors:
1. Make sure MongoDB Atlas allows connections from your IP address
2. Check that your Atlas cluster is running
3. Verify the connection string in `.env` file

For more details, see `README.md`

