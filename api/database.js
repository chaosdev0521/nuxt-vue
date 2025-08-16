const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          roles TEXT NOT NULL DEFAULT '["user"]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
          return;
        }
        console.log('Users table created/verified');
      });

      // Create transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sender_id INTEGER NOT NULL,
          receiver_id INTEGER NOT NULL,
          reason TEXT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sender_id) REFERENCES users (id),
          FOREIGN KEY (receiver_id) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating transactions table:', err);
          reject(err);
        } else {
          console.log('Transactions table created/verified');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDatabase };
