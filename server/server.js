const express = require('express');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 6789;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

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

// User Authentication Endpoints
// User registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    // Check if username or email already exists
    const existingUser = await db.getUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userId = await db.createUser(username, email, hashedPassword);
    
    // Generate JWT token
    const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      username
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Get user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful', 
      token,
      username: user.username
    });
  } catch (error) {
    console.error('Error in user login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user exists
    const user = await db.getUserByEmail(email);
    if (!user) {
      // Don't reveal that email doesn't exist - security best practice
      return res.json({ message: 'If this email exists, a password reset link will be sent' });
    }
    
    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    
    // Store the reset token
    await db.storeResetToken(user.id, resetToken, resetTokenExpiry);
    
    // In a real app, we would send an email here
    // For development, we'll just log it
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({ message: 'If this email exists, a password reset link will be sent' });
  } catch (error) {
    console.error('Error generating password reset:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// Reset password using token
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }
    
    // Find user with this token
    const user = await db.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Check if token is expired
    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password and clear reset token
    await db.updatePasswordAndClearResetToken(user.id, hashedPassword);
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// User Profile Endpoints
// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Send user data without sensitive information
    res.json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (!username && !email) {
      return res.status(400).json({ message: 'Nothing to update' });
    }
    
    // Check if new username or email already exists
    if (username || email) {
      const existingUser = await db.getUserByUsernameOrEmail(username, email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }
    }
    
    // Update user profile
    await db.updateUserProfile(req.user.id, username, email);
    
    // If username was updated, update it in the token
    let newToken = null;
    if (username && username !== req.user.username) {
      newToken = jwt.sign({ id: req.user.id, username }, JWT_SECRET, { expiresIn: '7d' });
    }
    
    res.json({ 
      message: 'Profile updated successfully',
      token: newToken
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// Change password
app.put('/api/user/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    
    // Get user
    const user = await db.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await db.updateUserPassword(req.user.id, hashedPassword);
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

// Game State Endpoints
// Save game state
app.post('/api/game/save', authenticateToken, async (req, res) => {
  try {
    const gameState = req.body;
    
    if (!gameState) {
      return res.status(400).json({ message: 'Game state is required' });
    }
    
    // Add user ID to game state
    gameState.userId = req.user.id;
    
    // Save to database
    await db.saveGameState(gameState);
    
    // Also update leaderboard with current carrot count
    if (gameState.playerVegetables && gameState.playerVegetables.carrot) {
      await db.addLeaderboardEntry(req.user.username, gameState.playerVegetables.carrot, false);
    }
    
    res.json({ message: 'Game saved successfully' });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ message: 'Error saving game' });
  }
});

// Load game state
app.get('/api/game/load', authenticateToken, async (req, res) => {
  try {
    const gameState = await db.loadGameStateByUserId(req.user.id);
    
    if (!gameState) {
      return res.status(404).json({ message: 'No saved game found' });
    }
    
    res.json(gameState);
  } catch (error) {
    console.error('Error loading game:', error);
    res.status(500).json({ message: 'Error loading game' });
  }
});

// Existing API Endpoints
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

// Serve React frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
