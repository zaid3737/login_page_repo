const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------ Middleware ------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ------------------ MySQL Connection Pool ------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "mysql-db", // Must match container name
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "login_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ------------------ Routes ------------------

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }

  try {
    console.log("Attempting login for:", email);
    
    // Check if user exists
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    console.log("Query results:", rows);

    if (rows.length > 0) {
      // Update last_login timestamp
      await pool.query(
        "UPDATE users SET last_login = NOW() WHERE email = ?",
        [email]
      );
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Debug endpoint to check database connection
app.get('/debug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    res.json({ 
      status: 'OK', 
      database: 'connected',
      userCount: rows[0].count
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});