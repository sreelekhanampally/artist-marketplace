const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET = "supersecret";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  // Check if the user already exists
  db.get(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username], (err, existingUser) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email or username" });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      // Insert the new user into the database
      const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      db.run(query, [username, email, hashedPassword], function (err) {
        if (err) {
          return res.status(500).json({ error: "Error registering user" });
        }

        // Respond with the user details (no token here)
        res.status(201).json({
          message: "User registered successfully",
          user: { id: this.lastID, username, email }
        });
      });
    });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find the user in the database by email
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  });
});

// Get all users (Protected route, requires token)
router.get('/users', verifyToken, (req, res) => {
  db.all(`SELECT id, username, email FROM users`, [], (err, users) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(users);
  });
});

module.exports = router;
