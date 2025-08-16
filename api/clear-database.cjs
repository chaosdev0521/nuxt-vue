const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Clearing database...');

db.serialize(() => {
  // Clear all data from transactions table first (due to foreign key constraints)
  db.run("DELETE FROM transactions", (err) => {
    if (err) {
      console.error('Error clearing transactions table:', err);
    } else {
      console.log('✓ Cleared transactions table');
    }
  });

  // Clear all data from users table
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error('Error clearing users table:', err);
    } else {
      console.log('✓ Cleared users table');
    }
  });

  // Reset auto-increment counters
  db.run("DELETE FROM sqlite_sequence WHERE name IN ('users', 'transactions')", (err) => {
    if (err) {
      console.error('Error resetting auto-increment counters:', err);
    } else {
      console.log('✓ Reset auto-increment counters');
    }
  });

  // Vacuum to reclaim space
  db.run("VACUUM", (err) => {
    if (err) {
      console.error('Error vacuuming database:', err);
    } else {
      console.log('✓ Database vacuumed');
    }
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('✅ Database cleared successfully!');
  }
});
