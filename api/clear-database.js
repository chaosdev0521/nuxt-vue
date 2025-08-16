const { db, initDatabase } = require('./database');

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing database...');
    
    // Delete all transactions first (due to foreign key constraints)
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM transactions', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ All transactions deleted');
          resolve();
        }
      });
    });
    
    // Delete all users
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ All users deleted');
          resolve();
        }
      });
    });
    
    // Reset auto-increment counters
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM sqlite_sequence', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('✅ Auto-increment counters reset');
          resolve();
        }
      });
    });
    
    console.log('🎉 Database cleared successfully!');
    console.log('📊 Database is now empty and ready for fresh data');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function resetDatabase() {
  try {
    await clearDatabase();
    console.log('🔄 Database reset complete - ready for new data');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  resetDatabase();
}

module.exports = { clearDatabase, resetDatabase };
