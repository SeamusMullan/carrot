import React, { useState } from 'react';
import '../styles/Sidebar.css';

function Sidebar({ username, setUsername, saveGame, loadGame, saveStatus, loadStatus, isOpen, onClose }) {
  const [localUsername, setLocalUsername] = useState(username || '');

  // Update parent component username when this component username changes
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setLocalUsername(newUsername);
    setUsername(newUsername);
  };

  // Handle saving game
  const handleSaveGame = () => {
    saveGame();
  };

  // Handle loading game
  const handleLoadGame = () => {
    loadGame();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Game Menu</h2>
        {/* Close button shown on all sizes for better UX */}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-content">
        <div className="save-load-section">
          <h3>Save & Load</h3>
          
          <div className="username-section">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={localUsername}
              onChange={handleUsernameChange}
              placeholder="Enter username"
              className="username-input"
            />
          </div>
          
          <div className="save-load-buttons">
            <button onClick={handleSaveGame} className="sidebar-button save-button">Save Game</button>
            <button onClick={handleLoadGame} className="sidebar-button load-button">Load Game</button>
          </div>
          
          <div className="status-messages">
            {saveStatus && <p className="status-message">{saveStatus}</p>}
            {loadStatus && <p className="status-message">{loadStatus}</p>}
          </div>
        </div>
        
        <div className="instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Click the vegetable to harvest it</li>
            <li>Purchase upgrades with your carrots</li>
            <li>Select different vegetables to harvest variety</li>
            <li>Trade vegetables at the market for profit</li>
            <li>Compete on the leaderboard with other farmers</li>
            <li>Save your progress using the form above</li>
          </ul>
        </div>
      </div>
      
      <div className="sidebar-footer">
        <p>Vegetable Tycoon v1.0</p>
      </div>
    </div>
  );
}

export default Sidebar;
