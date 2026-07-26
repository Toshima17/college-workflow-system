require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "college_workflow",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ Database Connected Successfully!");
    connection.release();
  }
});

const promisePool = pool.promise();

async function query(sql, params = []) {
  const [rows] = await promisePool.execute(sql, params);
  return rows;
}

module.exports = { query };