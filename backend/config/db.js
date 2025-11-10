const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,       // Database host from .env
  user: process.env.DB_USER,       // Database username from .env
  password: process.env.DB_PASSWORD, // Database password from .env
  database: process.env.DB_NAME,   // Database name from .env
  port: process.env.DB_PORT || 3306, // Optional: Default to 3306 if not specified
});

module.exports = {
    query: async (sql, params) => {
        const [rows] = await db.execute(sql, params); // Return rows directly
        return rows; // Do not wrap rows in an array
    },
};