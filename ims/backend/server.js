require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Azure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.AZURE_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to Azure PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Middleware to verify Supabase JWT token
const verifySupabaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/user`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': process.env.SUPABASE_ANON_KEY
        }
      }
    );

    if (!response.ok) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = await response.json();
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Token verification failed' });
  }
};

// Test route (no authentication required)
app.get("/api/test", async (req, res) => {
  try {
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('Database query successful:', result.rows[0]);
    res.json({ 
      message: "Successfully connected to Azure PostgreSQL",
      time: result.rows[0].current_time 
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      error: err.message,
      code: err.code,
      detail: err.detail
    });
  }
});

// Get all inventory items (requires authentication)
app.get("/api/inventory", verifySupabaseToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT i.*, c.name as category_name 
      FROM inventory_items i 
      LEFT JOIN categories c ON i.category = c.name 
      ORDER BY i.created_at DESC
    `);
    res.json({
      message: "Inventory data from Azure PostgreSQL",
      user: req.user.email,
      data: rows
    });
  } catch (err) {
    console.error('Inventory query error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add new inventory item (requires authentication)
app.post("/api/inventory", verifySupabaseToken, async (req, res) => {
  try {
    const { name, description, quantity, unit_price, category } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO inventory_items (name, description, quantity, unit_price, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, quantity, unit_price, category]
    );
    res.json({
      message: "Item added successfully",
      data: rows[0]
    });
  } catch (err) {
    console.error('Add item error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get categories (requires authentication)
app.get("/api/categories", verifySupabaseToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({
      message: "Categories from Azure PostgreSQL",
      data: rows
    });
  } catch (err) {
    console.error('Categories query error:', err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend server running on port ${port}`));
