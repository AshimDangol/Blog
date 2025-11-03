# How to Run the Server Manually

## Prerequisites
1. Make sure dependencies are installed:
   ```bash
   npm install
   ```

2. Ensure `.env` file exists (or run setup):
   ```bash
   npm run setup
   ```

## Starting the Server

### Method 1: Using npm (Recommended)
```bash
npm start
```

### Method 2: Direct Node.js command
```bash
node server.js
```

## What You'll See When It Starts

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

If you see this, your server is running successfully!

## Stopping the Server

### If running in terminal:
- Press `Ctrl + C` to stop gracefully

### If running in background (checking processes):
```powershell
# Check if server is running
Get-Process -Name node -ErrorAction SilentlyContinue

# Stop all Node.js processes
Stop-Process -Name node -ErrorAction SilentlyContinue
```

## Testing the Server

### 1. Health Check
Open in browser: `http://localhost:5000`

Or use PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:5000
```

### 2. Register a User
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "SecurePass123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/users/register `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

Or use curl (Windows PowerShell):
```powershell
curl -Method POST "http://localhost:5000/api/users/register" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'
```

## Troubleshooting

### Server won't start
1. Check if port 5000 is already in use:
   ```powershell
   netstat -ano | findstr :5000
   ```

2. Check MongoDB connection:
   - Verify `.env` file has correct `MONGO_URI`
   - Make sure MongoDB Atlas network access allows your IP

3. Check if dependencies are installed:
   ```bash
   npm install
   ```

### Connection Errors
- MongoDB Atlas requires your IP to be whitelisted
- Go to MongoDB Atlas → Network Access → Add IP Address (or use 0.0.0.0/0 for development)

### Port Already in Use
If port 5000 is busy, either:
- Stop the process using port 5000
- Change `PORT` in `.env` file to a different port (e.g., 5001, 3000)

## Quick Reference

| Task | Command |
|------|---------|
| Start server | `npm start` or `node server.js` |
| Stop server | `Ctrl + C` (in terminal) |
| Check running | `Get-Process -Name node` |
| Health check | `http://localhost:5000` |
| Test API | See examples above |

