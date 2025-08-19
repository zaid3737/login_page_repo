// Import required modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // promise-based MySQL client

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------ Middleware ------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files (index.html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// ------------------ MySQL Connection Pool ------------------
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "login_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ------------------ Routes ------------------

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query database for user
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ success: true, message: "Login successful!" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
