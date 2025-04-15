require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,       // Database host from .env
  user: process.env.DB_USER,       // Database username from .env
  password: process.env.DB_PASSWORD, // Database password from .env
  database: process.env.DB_NAME,   // Database name from .env
  port: process.env.DB_PORT || 3306, // Optional: Default to 3306 if not specified
});

module.exports = db;

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Missing required database environment variables');
}