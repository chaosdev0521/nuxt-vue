const jwt = require('jsonwebtoken');
const { db } = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'nuxt-transaction-secret-key-2024-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is manager
const requireManager = (req, res, next) => {
  if (!req.user || !req.user.roles.includes('manager')) {
    return res.status(403).json({ error: 'Manager role required' });
  }
  next();
};

// Get user from database by ID
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        row.roles = JSON.parse(row.roles);
        resolve(row);
      } else {
        resolve(null);
      }
    });
  });
};

module.exports = { authenticateToken, requireManager, getUserById, JWT_SECRET };
