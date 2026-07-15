const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET = "supersecret";

// ✅ Auth Middleware
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

// ✅ Add product to cart (PROTECTED)
router.post('/add', authenticateToken, (req, res) => {
  const { quantity, productId } = req.body;

  if (typeof quantity !== 'number' || typeof productId !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const userId = Number(req.userId);

  // First, get product name for this productId (optional but for itemName field)
  const productQuery = `SELECT name FROM products WHERE id = ?`;
  db.get(productQuery, [productId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const itemName = row.name;
    const insertQuery = `INSERT INTO cart (userId, quantity, itemName, productId) VALUES (?, ?, ?, ?)`;

    db.run(insertQuery, [userId, quantity, itemName, productId], function (err) {
      if (err) {
        console.error("SQLite Error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: 'Product added to cart',
        cartItemId: this.lastID
      });
    });
  });
});



router.get('/my-cart', authenticateToken, (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT cart.id as cartItemId, cart.itemName, cart.quantity, 
           products.price, products.imageUrl,
           (products.price * cart.quantity) as totalPrice
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.userId = ?
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch cart' });
    res.json(rows);
  });
});




module.exports = router;
