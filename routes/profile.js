// server/routes/profile.js
const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = "supersecret";

// Get user profile
router.get('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    db.get(`SELECT id, username, email FROM users WHERE id = ?`, [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    });
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
});

module.exports = router;
