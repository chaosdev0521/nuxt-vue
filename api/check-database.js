const { db } = require('./database');

async function checkDatabase() {
  try {
    console.log('📊 Database Status Check\n');
    
    // Check users table
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].count);
        }
      });
    });
    
    // Check transactions table
    const transactions = await new Promise((resolve, reject) => {
      db.all('SELECT COUNT(*) as count FROM transactions', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0].count);
        }
      });
    });
    
    console.log(`👥 Users: ${users}`);
    console.log(`💳 Transactions: ${transactions}`);
    
    if (users === 0 && transactions === 0) {
      console.log('\n✅ Database is completely empty - ready for fresh data!');
    } else {
      console.log('\n📋 Database contains data:');
      
      if (users > 0) {
        console.log('\n👥 Current Users:');
        const userList = await new Promise((resolve, reject) => {
          db.all('SELECT id, email, roles, created_at FROM users', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
        userList.forEach(user => {
          console.log(`  - ID: ${user.id}, Email: ${user.email}, Roles: ${user.roles}`);
        });
      }
      
      if (transactions > 0) {
        console.log('\n💳 Current Transactions:');
        const transactionList = await new Promise((resolve, reject) => {
          db.all('SELECT id, sender_id, receiver_id, amount, reason, status FROM transactions', (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
        transactionList.forEach(tx => {
          console.log(`  - ID: ${tx.id}, From: ${tx.sender_id} -> To: ${tx.receiver_id}, Amount: $${tx.amount}, Status: ${tx.status}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  checkDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Failed to check database:', error);
    process.exit(1);
  });
}

module.exports = { checkDatabase };
