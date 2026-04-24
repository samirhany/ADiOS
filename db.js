const mysql = require('mysql2');

// استخدام Pool لضمان استقرار الاتصال
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'adios_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// اختبار الاتصال
db.getConnection((err, connection) => {
  if (err) {
    console.log('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL');
    connection.release();
  }
});

module.exports = db;
