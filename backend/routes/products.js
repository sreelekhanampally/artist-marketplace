const express = require('express');
const db = require('../db');

const router = express.Router();

// Get all products (NO AUTH)
router.get('/', (req, res) => {
  db.all(`SELECT * FROM products`, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(rows);
  });
});

// Add new product (NO AUTH)
router.post('/create', (req, res) => {
  const { name, price, imageUrl } = req.body;

  if (!name || typeof price !== 'number' || !imageUrl) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const insertQuery = `INSERT INTO products (name, price, imageUrl) VALUES (?, ?, ?)`;
  db.run(insertQuery, [name, price, imageUrl], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create product' });
    }

    res.status(201).json({
      message: 'Product created successfully',
      productId: this.lastID
    });
  });
});

module.exports = router;
