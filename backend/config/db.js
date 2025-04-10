const mysql = require('mysql2/promise');

// Conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // o la que tengas configurada en UniServer
  database: 'musicalendaria', // asegurate de crear esta base en phpMyAdmin o HeidiSQL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
