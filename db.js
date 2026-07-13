// server/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./siri.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      itemName TEXT,
      price REAL,
      quantity INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id)
    )
  `);
});

db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    itemName TEXT,
    price REAL,
    quantity INTEGER,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);


module.exports = db;
