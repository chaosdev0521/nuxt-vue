const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { db, initDatabase } = require('./database');
const { authenticateToken, requireManager, getUserById, JWT_SECRET } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware - Open CORS for network access
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Initialize database
initDatabase().then(() => {
  console.log('Database initialized');
}).catch((err) => {
  console.error('Database initialization error:', err);
});

// CORS Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'CORS is working! API server is accessible.',
    timestamp: new Date().toISOString(),
    origin: req.get('Origin') || 'No origin header',
    userAgent: req.get('User-Agent') || 'No user agent'
  });
});

// AUTH ROUTES

// Check email availability
app.post('/api/auth/check-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        available: false, 
        error: emailValidation.error 
      });
    }

    const normalizedEmail = emailValidation.normalizedEmail;

    // Check if user already exists with normalized email
    const emailExists = await checkEmailExists(normalizedEmail);
    
    res.json({ 
      available: !emailExists,
      message: emailExists 
        ? 'This email address is already registered' 
        : 'Email address is available'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email validation function
const validateEmail = (email) => {
  // Check if email is provided
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Normalize email first (trim and convert to lowercase)
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check email format using regex after normalization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Check email length
  if (normalizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }
  
  return { isValid: true, normalizedEmail };
};

// Check if email already exists in database
const checkEmailExists = async (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT email FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(!!row); // Returns true if user exists, false otherwise
    });
  });
};

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.error });
    }

    const normalizedEmail = emailValidation.normalizedEmail;

    // Check if user already exists with normalized email
    const emailExists = await checkEmailExists(normalizedEmail);
    if (emailExists) {
      return res.status(409).json({ 
        error: 'An account with this email address already exists. Please try logging in instead.' 
      });
    }

    // Check if this is the first user (should be manager)
    const userCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    const roles = userCount === 0 ? ['manager'] : ['user'];
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with normalized email
    const userId = await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password, roles) VALUES (?, ?, ?)', 
        [normalizedEmail, hashedPassword, JSON.stringify(roles)], 
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    const token = jwt.sign({ id: userId, email: normalizedEmail, roles }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'User registered successfully',
      user: { id: userId, email: normalizedEmail, roles },
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Normalize email for lookup
    const normalizedEmail = email.toLowerCase().trim();

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const roles = JSON.parse(user.roles);
    const token = jwt.sign({ id: user.id, email: user.email, roles }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful',
      user: { id: user.id, email: user.email, roles },
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TRANSACTION ROUTES

// Get transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    let query = `
      SELECT t.*, 
             s.email as sender_email, 
             r.email as receiver_email 
      FROM transactions t
      JOIN users s ON t.sender_id = s.id
      JOIN users r ON t.receiver_id = r.id
    `;
    let params = [];

    // If user is not manager, only show their transactions
    if (!req.user.roles.includes('manager')) {
      query += ' WHERE t.sender_id = ? OR t.receiver_id = ?';
      params = [req.user.id, req.user.id];
    }

    query += ' ORDER BY t.created_at DESC';

    const transactions = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single transaction
app.get('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transactionId = req.params.id;
    
    let query = `
      SELECT t.*, 
             s.email as sender_email, 
             r.email as receiver_email 
      FROM transactions t
      JOIN users s ON t.sender_id = s.id
      JOIN users r ON t.receiver_id = r.id
      WHERE t.id = ?
    `;
    let params = [transactionId];

    // If user is not manager, only allow viewing their own transactions
    if (!req.user.roles.includes('manager')) {
      query += ' AND (t.sender_id = ? OR t.receiver_id = ?)';
      params.push(req.user.id, req.user.id);
    }

    const transaction = await new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create transaction (manager only)
app.post('/api/transactions', authenticateToken, requireManager, async (req, res) => {
  try {
    const { sender_id, receiver_id, reason, amount, status = 'completed' } = req.body;

    if (!sender_id || !receiver_id || !reason || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify sender and receiver exist
    const sender = await getUserById(sender_id);
    const receiver = await getUserById(receiver_id);

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Invalid sender or receiver' });
    }

    const transactionId = await new Promise((resolve, reject) => {
      db.run('INSERT INTO transactions (sender_id, receiver_id, reason, amount, status) VALUES (?, ?, ?, ?, ?)',
        [sender_id, receiver_id, reason, amount, status],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.json({ 
      message: 'Transaction created successfully',
      id: transactionId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction (manager only)
app.put('/api/transactions/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { sender_id, receiver_id, reason, amount, status } = req.body;

    if (!sender_id || !receiver_id || !reason || !amount || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify sender and receiver exist
    const sender = await getUserById(sender_id);
    const receiver = await getUserById(receiver_id);

    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Invalid sender or receiver' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('UPDATE transactions SET sender_id = ?, receiver_id = ?, reason = ?, amount = ?, status = ? WHERE id = ?',
        [sender_id, receiver_id, reason, amount, status, transactionId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction (manager only)
app.delete('/api/transactions/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const transactionId = req.params.id;

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM transactions WHERE id = ?', [transactionId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });

    if (result === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// USER ROUTES (manager only)

// Get all users
app.get('/api/users', authenticateToken, requireManager, async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT id, email, roles, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({ ...row, roles: JSON.parse(row.roles) })));
      });
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single user
app.get('/api/users/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, requireManager, async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, roles } = req.body;

    if (!email || !roles) {
      return res.status(400).json({ error: 'Email and roles are required' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('UPDATE users SET email = ?, roles = ? WHERE id = ?',
        [email, JSON.stringify(roles), userId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://66.94.117.199:${PORT}`);
  console.log(`  Ready for network access!`);
});
