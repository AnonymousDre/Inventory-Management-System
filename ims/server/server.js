import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
const db = await mysql.createConnection({
  host: "localhost",
  user: "root",           // change if your MySQL username is different
  password: "", // replace with your MySQL password
  database: "ims_db"         // replace with your database name
});

// Register route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if user exists
    const [existing] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hash]);

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
