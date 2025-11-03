const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

// Your MongoDB Atlas connection string
const mongoUri = "mongodb+srv://ashimdangol_db_user:1234@projectdb.dyeqeaf.mongodb.net/blog-api";

const envContent = `# MongoDB Atlas Connection String
MONGO_URI=${mongoUri}

# Server Port
PORT=5000

# Node Environment (development, production)
NODE_ENV=development
`;

try {
  const forceUpdate = process.argv.includes("--force");
  
  if (fs.existsSync(envPath) && !forceUpdate) {
    console.log("⚠️  .env file already exists. Skipping creation.");
    console.log("   If you want to update it, run: node setup.js --force");
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log("✅ .env file created/updated successfully!");
    console.log("   MongoDB URI configured with your Atlas connection string.");
    console.log("   Database: blog-api");
    console.log("   Port: 5000");
  }
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
  process.exit(1);
}

