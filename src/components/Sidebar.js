import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ username, setUsername, saveGame, loadGame, saveStatus, loadStatus, isOpen, onClose }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Game Menu</h2>
        {/* Close button for mobile */}
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
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="username-input"
            />
          </div>
          
          <div className="save-load-buttons">
            <button onClick={saveGame} className="sidebar-button save-button">Save Game</button>
            <button onClick={loadGame} className="sidebar-button load-button">Load Game</button>
          </div>
          
          <div className="status-messages">
            {saveStatus && <p className="status-message">{saveStatus}</p>}
            {loadStatus && <p className="status-message">{loadStatus}</p>}
          </div>
        </div>
        
        <div className="instructions">
          <h3>How to Play</h3>
          <ul>
            <li>Click to harvest vegetables</li>
            <li>Buy upgrades with carrots</li>
            <li>Trade vegetables in the market</li>
            <li>Compete on the leaderboard</li>
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
