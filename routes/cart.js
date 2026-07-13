// server/routes/cart.js
const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = "supersecret";

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// Add item to cart
router.post('/add', authenticateToken, (req, res) => {
  const { itemName, price, quantity } = req.body;

  const query = `INSERT INTO cart (userId, itemName, price, quantity) VALUES (?, ?, ?, ?)`;

  db.run(query, [req.userId, itemName, price, quantity], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add item' });
    }

    res.status(201).json({ message: 'Item added', cartItemId: this.lastID });
  });
});

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM cart WHERE userId = ?`, [req.userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch cart' });
    }

    res.json(rows);
  });
});

module.exports = router;

// Place Order (Dummy)
router.post('/checkout', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM cart WHERE userId = ?`, [req.userId], (err, items) => {
    if (err || !items.length) return res.status(400).json({ error: "Cart is empty or DB error" });

    const stmt = db.prepare(`INSERT INTO orders (userId, itemName, price, quantity) VALUES (?, ?, ?, ?)`);

    items.forEach(item => {
      stmt.run(req.userId, item.itemName, item.price, item.quantity);
    });

    stmt.finalize(() => {
      // Clear the cart after placing order
      db.run(`DELETE FROM cart WHERE userId = ?`, [req.userId], (err) => {
        if (err) return res.status(500).json({ error: "Order placed but cart not cleared" });

        res.json({ message: "Order placed successfully!" });
      });
    });
  });
});

// Get user order history
router.get('/orders', authenticateToken, (req, res) => {
  const query = `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`;

  db.all(query, [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });

    res.json(rows);
  });
});
