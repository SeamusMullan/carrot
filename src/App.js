import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import "./App.css";
import Leaderboard from "./components/Leaderboard";
import VegetableMarket from "./components/VegetableMarket";
import VegetableSelector from "./components/VegetableSelector";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import EditProfile from "./components/EditProfile";

// Game component - wrap the existing App content
function Game() {
  // Page navigation state
  const [currentPage, setCurrentPage] = useState("farm"); // 'farm', 'market', 'leaderboard'
  const navigate = useNavigate(); // For navigation

  // Get logged in username
  const [loggedInUser, setLoggedInUser] = useState('');

  // Track all vegetables
  const [playerVegetables, setPlayerVegetables] = useState({
    carrot: 10, // Start with 10 carrots so player isn't stuck
    potato: 0,
    tomato: 0,
    lettuce: 0,
    corn: 0,
    onion: 0,
  });

  // Currently selected vegetable for harvesting
  const [currentVegetable, setCurrentVegetable] = useState("carrot");

  // Vegetable-specific rates (per click and per second for each vegetable)
  const [vegetableStats, setVegetableStats] = useState({
    carrot: { perClick: 1, perSecond: 0 },
    potato: { perClick: 1, perSecond: 0 },
    tomato: { perClick: 1, perSecond: 0 },
    lettuce: { perClick: 1, perSecond: 0 },
    corn: { perClick: 1, perSecond: 0 },
    onion: { perClick: 1, perSecond: 0 },
  });

  // Vegetable-specific harvest rates
  const vegetableYields = {
    carrot: 1.0, // baseline
    potato: 0.8, // slower but more valuable
    tomato: 0.6, // slow but most valuable
    lettuce: 1.2, // faster yield
    corn: 1.3, // faster yield
    onion: 0.9, // medium yield
  };

  const [clickAnimations, setClickAnimations] = useState([]);
  const [username, setUsername] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [loadStatus, setLoadStatus] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar

  // Sign out function
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  // Navigate to profile page
  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Get username from localStorage on initial load
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedInUser(storedUsername);
    }
  }, []);

  // Power-ups configuration - now with vegetable-specific power-ups
  const [powerUps, setPowerUps] = useState([
    // Universal power-ups (apply to all vegetables)
    {
      id: "universal-1",
      name: "Gardening Gloves",
      description: "Harvest 1 extra vegetable per click for ALL vegetables",
      baseCost: 100,
      count: 0,
      clickIncrease: 1,
      autoIncrease: 0,
      affectsAll: true,
      image: "🧤",
    },
    {
      id: "universal-2",
      name: "Irrigation System",
      description: "Automatically harvest 1 of each vegetable per second",
      baseCost: 500,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      affectsAll: true,
      image: "💧",
    },

    // Carrot specific power-ups
    {
      id: "carrot-1",
      name: "Carrot Harvester",
      description: "Harvest 2 extra carrots per click",
      baseCost: 20,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "carrot",
      image: "🥕",
    },
    {
      id: "carrot-2",
      name: "Carrot Farm",
      description: "Automatically harvest 1 carrot per second",
      baseCost: 50,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "carrot",
      image: "🌱",
    },
    // Universal power-ups (apply to all vegetables)
    {
      id: "universal-1",
      name: "Gardening Gloves",
      description: "Harvest 1 extra vegetable per click for ALL vegetables",
      baseCost: 100,
      count: 0,
      clickIncrease: 1,
      autoIncrease: 0,
      affectsAll: true,
      image: "🧤",
    },
    {
      id: "universal-2",
      name: "Irrigation System",
      description: "Automatically harvest 1 of each vegetable per second",
      baseCost: 500,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      affectsAll: true,
      image: "💧",
    },

    // Carrot specific power-ups
    {
      id: "carrot-1",
      name: "Carrot Harvester",
      description: "Harvest 2 extra carrots per click",
      baseCost: 20,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "carrot",
      image: "🥕",
    },
    {
      id: "carrot-2",
      name: "Carrot Farm",
      description: "Automatically harvest 1 carrot per second",
      baseCost: 50,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "carrot",
      image: "🌱",
    },

    // Potato specific power-ups
    {
      id: "potato-1",
      name: "Potato Digger",
      description: "Harvest 2 extra potatoes per click",
      baseCost: 30,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "potato",
      image: "🥔",
    },
    {
      id: "potato-2",
      name: "Potato Field",
      description: "Automatically harvest 1 potato per second",
      baseCost: 75,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "potato",
      image: "🌾",
    },

    // Tomato specific power-ups
    {
      id: "tomato-1",
      name: "Tomato Picker",
      description: "Harvest 2 extra tomatoes per click",
      baseCost: 40,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "tomato",
      image: "🍅",
    },
    {
      id: "tomato-2",
      name: "Tomato Greenhouse",
      description: "Automatically harvest 1 tomato per second",
      baseCost: 100,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "tomato",
      image: "🏡",
    },

    // Lettuce specific power-ups
    {
      id: "lettuce-1",
      name: "Lettuce Cutter",
      description: "Harvest 2 extra lettuce per click",
      baseCost: 25,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "lettuce",
      image: "🥬",
    },
    {
      id: "lettuce-2",
      name: "Lettuce Patch",
      description: "Automatically harvest 1 lettuce per second",
      baseCost: 60,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "lettuce",
      image: "🌿",
    },

    // Corn specific power-ups
    {
      id: "corn-1",
      name: "Corn Husker",
      description: "Harvest 2 extra corn per click",
      baseCost: 20,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "corn",
      image: "🌽",
    },
    {
      id: "corn-2",
      name: "Corn Field",
      description: "Automatically harvest 1 corn per second",
      baseCost: 50,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "corn",
      image: "🌻",
    },

    // Onion specific power-ups
    {
      id: "onion-1",
      name: "Onion Uprooting Tool",
      description: "Harvest 2 extra onions per click",
      baseCost: 30,
      count: 0,
      clickIncrease: 2,
      autoIncrease: 0,
      vegetable: "onion",
      image: "🧅",
    },
    {
      id: "onion-2",
      name: "Onion Patch",
      description: "Automatically harvest 1 onion per second",
      baseCost: 70,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 1,
      vegetable: "onion",
      image: "🌰",
    },

    // Advanced upgrades for each vegetable
    // For carrot
    {
      id: "carrot-3",
      name: "Carrot Harvesting Robot",
      description: "Harvest 10 extra carrots per click",
      baseCost: 500,
      count: 0,
      clickIncrease: 10,
      autoIncrease: 0,
      vegetable: "carrot",
      image: "🤖",
    },
    {
      id: "carrot-4",
      name: "Automated Carrot Factory",
      description: "Automatically harvest 5 carrots per second",
      baseCost: 1000,
      count: 0,
      clickIncrease: 0,
      autoIncrease: 5,
      vegetable: "carrot",
      image: "🏭",
    },

    // Similar advanced upgrades for other vegetables
    // (Simplified here for brevity, but you would repeat for each vegetable)
  ]);

  // Calculate cost of next power-up
  const calculateCost = (baseCost, count) => {
    return Math.floor(baseCost * Math.pow(1.15, count));
  };

  // Handle the main vegetable click
  const handleVegetableClick = (e) => {
    // Get the yield and stats for current vegetable
    const yieldMultiplier = vegetableYields[currentVegetable] || 1.0;
    const vegStats = vegetableStats[currentVegetable] || {
      perClick: 1,
      perSecond: 0,
    };
    const harvestAmount = Math.ceil(vegStats.perClick * yieldMultiplier);

    // Update the appropriate vegetable count
    setPlayerVegetables((prev) => ({
      ...prev,
      [currentVegetable]: (prev[currentVegetable] || 0) + harvestAmount,
    }));

    // Add click animation
    if (e && e.target) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newAnimation = {
        id: Date.now(),
        x: x,
        y: y,
        value: `+${harvestAmount}`,
        vegetable: currentVegetable,
      };

      setClickAnimations((prev) => [...prev, newAnimation]);

      // Remove animation after it completes
      setTimeout(() => {
        setClickAnimations((prev) =>
          prev.filter((anim) => anim.id !== newAnimation.id)
        );
      }, 1000);
    }
  };

  // Buy a power-up with vegetable-specific effects
  const buyPowerUp = (id) => {
    const powerUp = powerUps.find((p) => p.id === id);
    if (!powerUp) return;

    const cost = calculateCost(powerUp.baseCost, powerUp.count);

    // Cost is paid in carrots (main currency)
    if (playerVegetables.carrot >= cost) {
      // Update carrot count
      setPlayerVegetables((prev) => ({
        ...prev,
        carrot: prev.carrot - cost,
      }));

      // Update power-up count
      setPowerUps(
        powerUps.map((p) => {
          if (p.id === id) {
            return { ...p, count: p.count + 1 };
          }
          return p;
        })
      );

      // Apply powerup effect based on type
      if (powerUp.affectsAll) {
        // Universal powerup affects all vegetables
        if (powerUp.clickIncrease > 0) {
          setVegetableStats((prev) => {
            const updated = { ...prev };
            // Update per-click for all vegetables
            Object.keys(updated).forEach((veg) => {
              updated[veg].perClick += powerUp.clickIncrease;
            });
            return updated;
          });
        }

        if (powerUp.autoIncrease > 0) {
          setVegetableStats((prev) => {
            const updated = { ...prev };
            // Update per-second for all vegetables
            Object.keys(updated).forEach((veg) => {
              updated[veg].perSecond += powerUp.autoIncrease;
            });
            return updated;
          });
        }
      } else if (powerUp.vegetable) {
        // Vegetable-specific powerup
        const veg = powerUp.vegetable;

        if (powerUp.clickIncrease > 0) {
          setVegetableStats((prev) => ({
            ...prev,
            [veg]: {
              ...prev[veg],
              perClick: prev[veg].perClick + powerUp.clickIncrease,
            },
          }));
        }

        if (powerUp.autoIncrease > 0) {
          setVegetableStats((prev) => ({
            ...prev,
            [veg]: {
              ...prev[veg],
              perSecond: prev[veg].perSecond + powerUp.autoIncrease,
            },
          }));
        }
      }
    }
  };

  // Auto-harvest vegetables
  useEffect(() => {
    const interval = setInterval(() => {
      // Check each vegetable for auto-harvesting
      let hasAutoHarvest = false;
      let updatedVegetables = { ...playerVegetables };

      Object.keys(vegetableStats).forEach((veg) => {
        const perSecond = vegetableStats[veg].perSecond;
        if (perSecond > 0) {
          hasAutoHarvest = true;
          updatedVegetables[veg] = (updatedVegetables[veg] || 0) + perSecond;
        }
      });

      if (hasAutoHarvest) {
        setPlayerVegetables(updatedVegetables);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [vegetableStats, playerVegetables]);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num;
  };

  // Save game state
  const saveGame = async () => {
    if (!username.trim()) {
      setSaveStatus("Please enter a username");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const gameState = {
        username,
        playerVegetables,
        vegetableStats,
        powerUps,
        timestamp: Date.now(),
      };

      // If we have a token, send to server
      if (token) {
        const response = await fetch('/api/game/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(gameState)
        });

        if (!response.ok) {
          throw new Error('Failed to save game to server');
        }
      } else {
        // Fall back to localStorage
        localStorage.setItem("vegetableTycoonSave", JSON.stringify(gameState));
      }
      
      setSaveStatus("Game saved successfully!");
    } catch (error) {
      setSaveStatus("Error saving game");
      console.error("Error saving game:", error);
      
      // Fall back to localStorage if server save fails
      try {
        const gameState = {
          username,
          playerVegetables,
          vegetableStats,
          powerUps,
          timestamp: Date.now(),
        };
        localStorage.setItem("vegetableTycoonSave", JSON.stringify(gameState));
        setSaveStatus("Game saved locally successfully!");
      } catch (localError) {
        setSaveStatus("Error saving game locally");
      }
    }
  };

  // Load game state
  const loadGame = async () => {
    if (!username.trim()) {
      setLoadStatus("Please enter a username");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      let userData = null;
      
      // Try to load from server if we have a token
      if (token) {
        try {
          const response = await fetch('/api/game/load', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            userData = await response.json();
          }
        } catch (serverError) {
          console.error("Error loading from server:", serverError);
        }
      }
      
      // Fall back to localStorage if no server data
      if (!userData) {
        const savedData = localStorage.getItem("vegetableTycoonSave");
        if (savedData) {
          userData = JSON.parse(savedData);
        }
      }

      if (userData) {
        if (userData.playerVegetables) {
          setPlayerVegetables(userData.playerVegetables);
        }

        if (userData.vegetableStats) {
          setVegetableStats(userData.vegetableStats);
        }

        if (userData.powerUps) {
          setPowerUps(userData.powerUps);
        }

        setLoadStatus("Game loaded successfully!");
      } else {
        setLoadStatus("No saved game found for this username");
      }
    } catch (error) {
      setLoadStatus("Error loading game");
      console.error("Error loading game:", error);
    }
  };

  // Get emoji for current vegetable
  const getCurrentVegetableEmoji = () => {
    const emojis = {
      carrot: "🥕",
      potato: "🥔",
      tomato: "🍅",
      lettuce: "🥬",
      corn: "🌽",
      onion: "🧅",
    };
    return emojis[currentVegetable] || "🥕";
  };

  // Get vegetable display name
  const getVegetableName = (veg) => {
    return veg.charAt(0).toUpperCase() + veg.slice(1);
  };

  // Save username to localStorage when it changes
  useEffect(() => {
    if (username.trim()) {
      localStorage.setItem("username", username);
    }
  }, [username]);

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Render the current page
  const renderPage = () => {
    switch (currentPage) {
      case "market":
        return (
          <VegetableMarket
            playerVegetables={playerVegetables}
            setPlayerVegetables={setPlayerVegetables}
          />
        );
      case "leaderboard":
        return <Leaderboard />;
      default: // farm
        return (
          <>
            <VegetableSelector
              currentVegetable={currentVegetable}
              setCurrentVegetable={setCurrentVegetable}
              vegetables={playerVegetables}
            />

            <div className="main-section">
              <div className="carrot-field">
                <button className="carrot-btn" onClick={handleVegetableClick}>
                  <span className="carrot-emoji">
                    {getCurrentVegetableEmoji()}
                  </span>
                </button>
                {clickAnimations.map((anim) => (
                  <div
                    key={anim.id}
                    className={`click-animation ${anim.vegetable}`}
                    style={{ left: `${anim.x}px`, top: `${anim.y}px` }}
                  >
                    {anim.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="shop-section">
              <h2>{getVegetableName(currentVegetable)} Upgrades</h2>
              <div className="power-ups-tabs">
                <button
                  className={`tab-button ${
                    currentVegetable === "universal" ? "active" : ""
                  }`}
                  onClick={() => setCurrentVegetable("universal")}
                >
                  Universal
                </button>
                {Object.keys(playerVegetables).map((veg) => (
                  <button
                    key={veg}
                    className={`tab-button ${
                      currentVegetable === veg ? "active" : ""
                    }`}
                    onClick={() => setCurrentVegetable(veg)}
                  >
                    {getVegetableName(veg)}{" "}
                    {vegetableStats[veg].perClick > 1 ||
                    vegetableStats[veg].perSecond > 0
                      ? "⭐"
                      : ""}
                  </button>
                ))}
              </div>

              <div className="power-ups">
                {powerUps
                  .filter((p) => {
                    if (currentVegetable === "universal") return p.affectsAll;
                    return p.vegetable === currentVegetable || p.affectsAll;
                  })
                  .map((powerUp) => (
                    <div
                      key={powerUp.id}
                      className={`power-up ${
                        playerVegetables.carrot >=
                        calculateCost(powerUp.baseCost, powerUp.count)
                          ? "affordable"
                          : "not-affordable"
                      }`}
                      onClick={() => buyPowerUp(powerUp.id)}
                    >
                      <div className="power-up-icon">{powerUp.image}</div>
                      <div className="power-up-info">
                        <h3>
                          {powerUp.name}{" "}
                          <span className="power-up-count">
                            {powerUp.count > 0 ? `x${powerUp.count}` : ""}
                          </span>
                        </h3>
                        <p>{powerUp.description}</p>
                        <p className="power-up-cost">
                          Cost:{" "}
                          {formatNumber(
                            calculateCost(powerUp.baseCost, powerUp.count)
                          )}{" "}
                          🥕
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="App">
      {/* Mobile menu toggle */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      <Sidebar
        username={username}
        setUsername={setUsername}
        saveGame={saveGame}
        loadGame={loadGame}
        saveStatus={saveStatus}
        loadStatus={loadStatus}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="game-container">
        <div className="stats-section">
          <h1>Vegetable Tycoon</h1>

          {/* User info display */}
          {loggedInUser && (
            <div className="user-info">
              <p>Playing as: <span className="username-display">{loggedInUser}</span></p>
            </div>
          )}

          <div className="navigation-tabs">
            <button
              className={`nav-button ${currentPage === "farm" ? "active" : ""}`}
              onClick={() => setCurrentPage("farm")}
            >
              Farm
            </button>
            <button
              className={`nav-button ${
                currentPage === "market" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("market")}
            >
              Market
            </button>
            <button
              className={`nav-button ${
                currentPage === "leaderboard" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("leaderboard")}
            >
              Leaderboard
            </button>
            <button
              className="nav-button profile-button"
              onClick={handleProfileClick}
            >
              Profile
            </button>
            <button
              className="nav-button signout-button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div className="current-veg-info">
            <div className="veg-icon-large">{getCurrentVegetableEmoji()}</div>
            <div className="veg-details">
              <h2>{getVegetableName(currentVegetable)}</h2>
              <div className="veg-stats">
                <p>
                  Per click:{" "}
                  {formatNumber(
                    vegetableStats[currentVegetable]?.perClick || 0
                  )}
                </p>
                <p>
                  Per second:{" "}
                  {formatNumber(
                    vegetableStats[currentVegetable]?.perSecond || 0
                  )}
                </p>
                <p>
                  Inventory:{" "}
                  {formatNumber(playerVegetables[currentVegetable] || 0)}{" "}
                  {getCurrentVegetableEmoji()}
                </p>
              </div>
            </div>
          </div>

          <div className="inventory-summary">
            {Object.keys(playerVegetables).map((veg) => (
              <div key={veg} className="inventory-item">
                <span className="inventory-emoji">
                  {
                    {
                      carrot: "🥕",
                      potato: "🥔",
                      tomato: "🍅",
                      lettuce: "🥬",
                      corn: "🌽",
                      onion: "🧅",
                    }[veg]
                  }
                </span>
                <span className="inventory-count">
                  {formatNumber(playerVegetables[veg] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {renderPage()}
      </div>
    </div>
  );
}

// Auth route component - redirects if not authenticated
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        } />
        <Route path="/game" element={
          <PrivateRoute>
            <Game />
          </PrivateRoute>
        } />
        {/* Redirect root to login or game depending on auth status */}
        <Route path="/" element={
          localStorage.getItem('authToken') ? <Navigate to="/game" /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
