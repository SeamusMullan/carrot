const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 6789;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Initialize database
db.initializeDatabase();

// Add dummy AI players to leaderboard
const addDummyPlayers = async () => {
  const aiPlayers = [
    { username: 'CarrotMaster9000', score: 15000000, isAI: true },
    { username: 'FarmBot3000', score: 9500000, isAI: true },
    { username: 'VeggieHarvester', score: 5200000, isAI: true },
    { username: 'RootVeggieFan', score: 2800000, isAI: true },
    { username: 'OrangeRootLover', score: 1200000, isAI: true }
  ];

  for (const player of aiPlayers) {
    await db.addLeaderboardEntry(player.username, player.score, player.isAI);
  }
  console.log('Dummy AI players added to leaderboard');
};

// Add dummy players after database initialization
setTimeout(addDummyPlayers, 1000);

// API Endpoints
// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Add or update leaderboard entry
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { username, score } = req.body;
    
    if (!username || score === undefined) {
      return res.status(400).json({ message: 'Username and score are required' });
    }
    
    await db.addLeaderboardEntry(username, score);
    res.json({ message: 'Leaderboard updated successfully' });
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ message: 'Error updating leaderboard' });
  }
});

// Save game state
app.post('/api/save', async (req, res) => {
  try {
    const gameState = req.body;
    
    if (!gameState.username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    await db.saveGameState(gameState);
    res.json({ message: 'Game saved successfully' });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ message: 'Error saving game' });
  }
});

// Load game state
app.get('/api/load/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    const gameState = await db.loadGameState(username);
    
    if (!gameState) {
      return res.status(404).json({ message: 'No saved game found for this username' });
    }
    
    res.json(gameState);
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).json({ message: 'Error loading game' });
  }
});

// Serve React frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
