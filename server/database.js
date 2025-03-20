const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'carrot_clicker.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with required tables
const initializeDatabase = () => {
  db.serialize(() => {
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
        username TEXT UNIQUE,
        game_data TEXT,
        timestamp INTEGER
      )
    `);

    console.log('Database initialized successfully');
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
    const { username } = gameState;
    const timestamp = Date.now();
    const gameData = JSON.stringify(gameState);
    
    db.run(
      `INSERT INTO game_states (username, game_data, timestamp)
       VALUES (?, ?, ?)
       ON CONFLICT(username)
       DO UPDATE SET game_data = ?, timestamp = ?`,
      [username, gameData, timestamp, gameData, timestamp],
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

// Load game state
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

module.exports = {
  initializeDatabase,
  getLeaderboard,
  addLeaderboardEntry,
  saveGameState,
  loadGameState
};
