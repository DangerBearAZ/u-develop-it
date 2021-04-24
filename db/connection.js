// 12.4.4 stuck 
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'Root',
  database: 'election'
});

module.exports = db;