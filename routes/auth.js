const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const SECRET = "supersecret";

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, existingUser) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: "Password hashing failed" });

      db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function (err) {
        if (err) return res.status(500).json({ error: "Registration failed" });

        res.status(201).json({ message: "Registered", user: { id: this.lastID, name, email } });
      });
    });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful", token, user: { id: user.id, name: user.username, email: user.email } });
  });
});

// Get all users (optional)
router.get('/users', (req, res) => {
  db.all(`SELECT id, username as name, email FROM users`, [], (err, users) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(users);
  });
});

module.exports = router;
