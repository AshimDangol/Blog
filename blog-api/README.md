# Blog API - User Registration

A secure user registration API using Node.js, Express, and MongoDB (Mongoose) with password hashing, input validation, and proper error handling.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB connection string

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment (already configured with MongoDB Atlas):**
```bash
npm run setup
```
Or manually create a `.env` file:
```bash
MONGO_URI=mongodb+srv://ashimdangol_db_user:1234@projectdb.dyeqeaf.mongodb.net/blog-api
PORT=5000
NODE_ENV=development
```

3. **Start the server:**
```bash
npm start
```

**Note:** The `.env` file is already configured with your MongoDB Atlas connection string. The server will connect to your Atlas cluster automatically.

## Health Check

Visit `http://localhost:5000/` in your browser or use curl:
```bash
curl http://localhost:5000
```

This will return API information and available endpoints.

## API
### Register User
- Method: `POST`
- URL: `/api/users/register`
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters, letters and spaces only
- `email`: Required, must be a valid email format
- `password`: Required, minimum 6 characters, must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
- Success (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "Alice Doe",
    "email": "alice@example.com"
  }
}
```
- Error Responses (400):
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    }
  ]
}
```

- Status Codes:
  - 201: User registered successfully
  - 400: Validation failed or email already registered
  - 500: Server error

## Testing

### Health Check
```bash
curl http://localhost:5000
```

### Register User (Windows PowerShell)
```bash
curl -Method POST "http://localhost:5000/api/users/register" `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"name":"Alice Doe","email":"alice@example.com","password":"SecurePass123"}'
```

### Register User (Linux/Mac/Git Bash)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Doe","email":"alice@example.com","password":"SecurePass123"}'
```

## Project Structure
```
blog-api/
├── controllers/
│   └── userController.js      # User business logic
├── middleware/
│   ├── errorHandler.js         # Centralized error handling
│   └── validation.js           # Input validation rules
├── models/
│   └── User.js                 # User Mongoose model
├── routes/
│   └── userRoutes.js           # User API routes
├── server.js                   # Express app and MongoDB connection
├── setup.js                    # Setup script for .env file
├── package.json
└── .env                        # Environment variables (gitignored)
```

## Security Features
- ✅ Passwords are hashed using bcryptjs (10 salt rounds)
- ✅ Email validation and normalization
- ✅ Password strength requirements enforced
- ✅ Input sanitization (trim, lowercase)
- ✅ CORS enabled for cross-origin requests
- ✅ Error messages don't expose sensitive information
- ✅ Server waits for MongoDB connection before accepting requests
- ✅ Graceful shutdown handling

## Scripts

- `npm start` - Start the server
- `npm run setup` - Create/update .env file (use `--force` to overwrite existing)

## Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `express-validator` - Input validation
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

## Server Features

- ✅ Server starts only after successful MongoDB connection
- ✅ Graceful shutdown (Ctrl+C) - properly closes connections
- ✅ Health check endpoint at root (`/`)
- ✅ All routes protected with validation
- ✅ Comprehensive error handling
