import React, { useState, useEffect } from 'react';
import './App.css';
import Leaderboard from './components/Leaderboard';

function App() {
  const [carrots, setCarrots] = useState(0);
  const [carrotsPerClick, setCarrotsPerClick] = useState(1);
  const [carrotsPerSecond, setCarrotsPerSecond] = useState(0);
  const [clickAnimations, setClickAnimations] = useState([]);
  const [username, setUsername] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [loadStatus, setLoadStatus] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Power-ups configuration
  const [powerUps, setPowerUps] = useState([
    {
      id: 1, 
      name: "Garden Gloves", 
      description: "Harvest 1 extra carrot per click",
      baseCost: 10, 
      count: 0, 
      clickIncrease: 1,
      autoIncrease: 0,
      image: "🧤"
    },
    {
      id: 2, 
      name: "Garden Hoe", 
      description: "Harvest 5 extra carrots per click",
      baseCost: 50, 
      count: 0, 
      clickIncrease: 5,
      autoIncrease: 0,
      image: "🔨"
    },
    {
      id: 3, 
      name: "Garden Gnome", 
      description: "Automatically harvest 1 carrot per second",
      baseCost: 100, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 1,
      image: "🧙‍♂️"
    },
    {
      id: 4, 
      name: "Sprinkler System", 
      description: "Automatically harvest 5 carrots per second",
      baseCost: 500, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 5,
      image: "💦"
    },
    {
      id: 5, 
      name: "Rabbit Helper", 
      description: "Automatically harvest 10 carrots per second",
      baseCost: 1000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 10,
      image: "🐰"
    },
    {
      id: 6, 
      name: "Carrot Tractor", 
      description: "Harvest 25 extra carrots per click",
      baseCost: 2000, 
      count: 0, 
      clickIncrease: 25,
      autoIncrease: 0,
      image: "🚜"
    },
    {
      id: 7, 
      name: "Carrot Farm", 
      description: "Automatically harvest 50 carrots per second",
      baseCost: 5000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 50,
      image: "🏡"
    },
    {
      id: 8, 
      name: "Carrot Research Lab", 
      description: "Genetically modified carrots yield 50 more per click",
      baseCost: 10000, 
      count: 0, 
      clickIncrease: 50,
      autoIncrease: 0,
      image: "🧪"
    },
    {
      id: 9, 
      name: "Carrot Harvesting Drone", 
      description: "Automatically harvest 100 carrots per second",
      baseCost: 25000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 100,
      image: "🛸"
    },
    {
      id: 10, 
      name: "Weather Control System", 
      description: "Perfect growing conditions yield 100 more carrots per click",
      baseCost: 50000, 
      count: 0, 
      clickIncrease: 100,
      autoIncrease: 0,
      image: "☀️"
    },
    {
      id: 11, 
      name: "Carrot Plantation", 
      description: "Automatically harvest 250 carrots per second",
      baseCost: 100000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 250,
      image: "🌱"
    },
    {
      id: 12, 
      name: "Carrot Harvesting Robot", 
      description: "Harvest 200 extra carrots per click",
      baseCost: 200000, 
      count: 0, 
      clickIncrease: 200,
      autoIncrease: 0,
      image: "🤖"
    },
    {
      id: 13, 
      name: "Carrot Factory", 
      description: "Automatically harvest 500 carrots per second",
      baseCost: 500000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 500,
      image: "🏭"
    },
    {
      id: 14, 
      name: "Carrot Army", 
      description: "An army of workers gets you 500 more carrots per click",
      baseCost: 750000, 
      count: 0, 
      clickIncrease: 500,
      autoIncrease: 0,
      image: "👥"
    },
    {
      id: 15, 
      name: "Carrot Corporation", 
      description: "Automatically harvest 1000 carrots per second",
      baseCost: 1000000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 1000,
      image: "🏢"
    },
    {
      id: 16, 
      name: "Carrot Time Machine", 
      description: "Travel through time to collect 1000 more carrots per click",
      baseCost: 2000000, 
      count: 0, 
      clickIncrease: 1000,
      autoIncrease: 0,
      image: "⏰"
    },
    {
      id: 17, 
      name: "Carrot Universe", 
      description: "Entire planets of carrots yield 2500 per second",
      baseCost: 5000000, 
      count: 0, 
      clickIncrease: 0,
      autoIncrease: 2500,
      image: "🌍"
    }
  ]);

  // Calculate cost of next power-up
  const calculateCost = (baseCost, count) => {
    return Math.floor(baseCost * Math.pow(1.15, count));
  };

  // Handle the main carrot click
  const handleCarrotClick = (e) => {
    setCarrots(carrots + carrotsPerClick);
    
    // Add click animation
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newAnimation = {
      id: Date.now(),
      x: x,
      y: y,
      value: `+${carrotsPerClick}`
    };
    
    setClickAnimations(prev => [...prev, newAnimation]);
    
    // Remove animation after it completes
    setTimeout(() => {
      setClickAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
    }, 1000);
  };

  // Buy a power-up
  const buyPowerUp = (id) => {
    const powerUp = powerUps.find(p => p.id === id);
    const cost = calculateCost(powerUp.baseCost, powerUp.count);
    
    if (carrots >= cost) {
      setCarrots(carrots - cost);
      
      setPowerUps(powerUps.map(p => {
        if (p.id === id) {
          return { ...p, count: p.count + 1 };
        }
        return p;
      }));
      
      if (powerUp.clickIncrease > 0) {
        setCarrotsPerClick(carrotsPerClick + powerUp.clickIncrease);
      }
      
      if (powerUp.autoIncrease > 0) {
        setCarrotsPerSecond(carrotsPerSecond + powerUp.autoIncrease);
      }
    }
  };

  // Auto-harvest carrots
  useEffect(() => {
    const interval = setInterval(() => {
      if (carrotsPerSecond > 0) {
        setCarrots(prev => prev + carrotsPerSecond);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [carrotsPerSecond]);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Save game state
  const saveGame = async () => {
    if (!username.trim()) {
      setSaveStatus('Please enter a username');
      return;
    }

    try {
      const gameState = {
        username,
        carrots,
        carrotsPerClick,
        carrotsPerSecond,
        powerUps,
        timestamp: Date.now()
      };

      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameState),
      });

      const data = await response.json();
      if (response.ok) {
        setSaveStatus('Game saved successfully!');
        
        // Update leaderboard if this is a high score
        if (carrots > 0) {
          await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              score: carrots
            }),
          });
        }
      } else {
        setSaveStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setSaveStatus('Error saving game');
      console.error('Error saving game:', error);
    }
  };

  // Load game state
  const loadGame = async () => {
    if (!username.trim()) {
      setLoadStatus('Please enter a username');
      return;
    }

    try {
      const response = await fetch(`/api/load/${username}`);
      
      if (response.ok) {
        const data = await response.json();
        setCarrots(data.carrots);
        setCarrotsPerClick(data.carrotsPerClick);
        setCarrotsPerSecond(data.carrotsPerSecond);
        setPowerUps(data.powerUps);
        setLoadStatus('Game loaded successfully!');
      } else {
        setLoadStatus('No saved game found for this username');
      }
    } catch (error) {
      setLoadStatus('Error loading game');
      console.error('Error loading game:', error);
    }
  };

  // Try to load game on initial render
  useEffect(() => {
    const savedUsername = localStorage.getItem('carrotClickerUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      // Don't auto-load to avoid unwanted API calls
    }
  }, []);

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username.trim()) {
      localStorage.setItem('carrotClickerUsername', username);
    }
  }, [username]);

  return (
    <div className="App">
      <div className="game-container">
        <div className="stats-section">
          <h1>Carrot Clicker</h1>
          <div className="stats">
            <p className="carrot-count">{formatNumber(carrots)} 🥕</p>
            <p>Per click: {formatNumber(carrotsPerClick)} 🥕</p>
            <p>Per second: {formatNumber(carrotsPerSecond)} 🥕</p>
          </div>
          
          <div className="user-controls">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="username-input"
            />
            <div className="save-load-buttons">
              <button onClick={saveGame} className="game-button">Save Game</button>
              <button onClick={loadGame} className="game-button">Load Game</button>
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)} 
                className="game-button leaderboard-button"
              >
                {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
              </button>
            </div>
            <div className="status-messages">
              {saveStatus && <p className="status-message">{saveStatus}</p>}
              {loadStatus && <p className="status-message">{loadStatus}</p>}
            </div>
          </div>
        </div>
        
        {showLeaderboard && <Leaderboard />}
        
        <div className="main-section">
          <div className="carrot-field">
            <button className="carrot-btn" onClick={handleCarrotClick}>
              <span className="carrot-emoji">🥕</span>
            </button>
            {clickAnimations.map(anim => (
              <div 
                key={anim.id} 
                className="click-animation"
                style={{ left: `${anim.x}px`, top: `${anim.y}px` }}
              >
                {anim.value}
              </div>
            ))}
          </div>
        </div>
        
        <div className="shop-section">
          <h2>Carrot Shop</h2>
          <div className="power-ups">
            {powerUps.map(powerUp => (
              <div 
                key={powerUp.id} 
                className={`power-up ${carrots >= calculateCost(powerUp.baseCost, powerUp.count) ? 'affordable' : 'not-affordable'}`}
                onClick={() => buyPowerUp(powerUp.id)}
              >
                <div className="power-up-icon">{powerUp.image}</div>
                <div className="power-up-info">
                  <h3>{powerUp.name} <span className="power-up-count">{powerUp.count > 0 ? `x${powerUp.count}` : ''}</span></h3>
                  <p>{powerUp.description}</p>
                  <p className="power-up-cost">Cost: {formatNumber(calculateCost(powerUp.baseCost, powerUp.count))} 🥕</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
