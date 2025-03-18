// database/config.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'snam0007@student.monash.edu',        // MySQL 사용자명 (필요시 변경)
  password: 'Sksms852@',  // MySQL 비밀번호로 변경
  database: 'uv_protection_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;