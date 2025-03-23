const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'carrot_clicker.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with required tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        resetToken TEXT,
        resetTokenExpiry INTEGER,
        createdAt INTEGER
      )
    `);

    // Create leaderboard table
    db.run(`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        score INTEGER,
        isAI BOOLEAN DEFAULT 0,
        timestamp INTEGER
      )
    `);

    // Create game_states table for saving/loading
    db.run(`
      CREATE TABLE IF NOT EXISTS game_states (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        username TEXT,
        game_data TEXT,
        timestamp INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    console.log('Database initialized successfully');
  });
};

// User Management Functions
// Create a new user
const createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    
    db.run(
      'INSERT INTO users (username, email, password, createdAt) VALUES (?, ?, ?, ?)',
      [username, email, password, timestamp],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      }
    );
  });
};

// Get user by email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
};

// Get user by id
const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
};

// Get user by username or email (for checking duplicates)
const getUserByUsernameOrEmail = (username, email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
};

// Store password reset token
const storeResetToken = (userId, resetToken, resetTokenExpiry) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?',
      [resetToken, resetTokenExpiry, userId],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// Get user by reset token
const getUserByResetToken = (resetToken) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE resetToken = ?',
      [resetToken],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      }
    );
  });
};

// Update password and clear reset token
const updatePasswordAndClearResetToken = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?',
      [hashedPassword, userId],
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// Update user profile (username and/or email)
const updateUserProfile = (userId, username, email) => {
  return new Promise((resolve, reject) => {
    // Build dynamic update query based on what's provided
    let query = 'UPDATE users SET ';
    const params = [];
    
    if (username) {
      query += 'username = ?';
      params.push(username);
      if (email) {
        query += ', email = ?';
        params.push(email);
      }
    } else if (email) {
      query += 'email = ?';
      params.push(email);
    }
    
    query += ' WHERE id = ?';
    params.push(userId);
    
    db.run(query, params, function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
};

// Update user password
const updateUserPassword = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes);
      }
    );
  });
};

// Get top 10 leaderboard entries
const getLeaderboard = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT username, score, isAI, timestamp 
       FROM leaderboard 
       ORDER BY score DESC 
       LIMIT 10`,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
};

// Add or update leaderboard entry
const addLeaderboardEntry = (username, score, isAI = false) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    
    // Get current score for this username if it exists
    db.get(
      'SELECT score FROM leaderboard WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        // If user exists and new score is not higher, do nothing
        if (row && row.score >= score) {
          resolve();
          return;
        }
        
        // Insert or update the score
        db.run(
          `INSERT INTO leaderboard (username, score, isAI, timestamp)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(username)
           DO UPDATE SET score = ?, timestamp = ? WHERE score < ?`,
          [username, score, isAI ? 1 : 0, timestamp, score, timestamp, score],
          function(err) {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          }
        );
      }
    );
  });
};

// Save game state
const saveGameState = (gameState) => {
  return new Promise((resolve, reject) => {
    const { userId, username } = gameState;
    const timestamp = Date.now();
    const gameData = JSON.stringify(gameState);
    
    db.run(
      `INSERT INTO game_states (userId, username, game_data, timestamp)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(userId)
       DO UPDATE SET game_data = ?, timestamp = ?`,
      [userId, username, gameData, timestamp, gameData, timestamp],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
};

// Load game state by username (legacy)
const loadGameState = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT game_data FROM game_states WHERE username = ?',
      [username],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        try {
          const gameState = JSON.parse(row.game_data);
          resolve(gameState);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    );
  });
};

// Load game state by user ID
const loadGameStateByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT game_data FROM game_states WHERE userId = ?',
      [userId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        try {
          const gameState = JSON.parse(row.game_data);
          resolve(gameState);
        } catch (parseErr) {
          reject(parseErr);
        }
      }
    );
  });
};

module.exports = {
  initializeDatabase,
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsernameOrEmail,
  storeResetToken,
  getUserByResetToken,
  updatePasswordAndClearResetToken,
  updateUserProfile,
  updateUserPassword,
  getLeaderboard,
  addLeaderboardEntry,
  saveGameState,
  loadGameState,
  loadGameStateByUserId
};
