// server/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./siri.db');

db.serialize(() => {
  // Users Table (if needed for future)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  // Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      imageUrl TEXT
    )
  `);

  // Cart Table - Refers to Product ID instead of duplicating itemName/price
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      itemName TEXT NOT NULL,
      productId INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(productId) REFERENCES products(id)
    )
  `);

  // db.run(`ALTER TABLE cart ADD COLUMN productId INTEGER`);

  
});

module.exports = db;
