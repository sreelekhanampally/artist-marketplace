const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./db'); // Ensures DB and tables are initialized
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const profileRoutes = require('./routes/profile'); // ✅ include profile route
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Optional: Debugging – print users table structure
db.serialize(() => {
  console.log('\n[DEBUG] Users Table Structure:');
  db.each("PRAGMA table_info(cart)", (err, row) => {
    if (err) {
      console.error("Table info error:", err.message);
    } else {
      console.log(row);
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes); // ✅ registered here
app.use('/api/products', productRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
