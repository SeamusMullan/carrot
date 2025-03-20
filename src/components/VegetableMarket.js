import React, { useState, useEffect } from 'react';
import '../styles/VegetableMarket.css';

function VegetableMarket({ playerVegetables, setPlayerVegetables }) {
  // Initial market prices to prevent undefined errors
  const initialPrices = {
    carrot: 1.00,
    potato: 1.50,
    tomato: 2.00,
    lettuce: 1.25,
    corn: 0.75,
    onion: 0.90
  };
  
  const [marketPrices, setMarketPrices] = useState(initialPrices);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [tradeAmount, setTradeAmount] = useState(1);
  const [marketStatus, setMarketStatus] = useState('stable'); // stable, bull, bear, volatile
  const [tradeHistory, setTradeHistory] = useState([]);

  // Initialize vegetable market
  useEffect(() => {
    updateMarketPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(() => {
      updateMarketPrices();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Simulate market changes
  const updateMarketPrices = () => {
    // Ensure current prices exist
    const currentPrices = { ...marketPrices };
    
    // Randomly change market status occasionally (20% chance)
    if (Math.random() < 0.2) {
      const statuses = ['stable', 'bull', 'bear', 'volatile'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setMarketStatus(newStatus);
    }
    
    // Calculate new prices based on market status and random fluctuations
    const newPrices = {};
    Object.keys(currentPrices).forEach(veg => {
      let baseChange = 0;
      let volatility = 0;
      
      // Set base trends based on market status
      switch (marketStatus) {
        case 'bull':
          baseChange = 0.05; // trending up
          volatility = 0.1;
          break;
        case 'bear':
          baseChange = -0.05; // trending down
          volatility = 0.1;
          break;
        case 'volatile':
          baseChange = 0;
          volatility = 0.2; // high volatility
          break;
        default: // stable
          baseChange = 0;
          volatility = 0.05; // low volatility
      }
      
      // Apply random fluctuation
      const randomFactor = (Math.random() * volatility * 2) - volatility;
      const percentChange = baseChange + randomFactor;
      
      // Ensure price doesn't go below minimum
      let newPrice = currentPrices[veg] * (1 + percentChange);
      newPrice = Math.max(newPrice, 0.1); // minimum price
      newPrice = parseFloat(newPrice.toFixed(2)); // round to 2 decimal places
      
      newPrices[veg] = newPrice;
    });
    
    // Add to price history if we already have market prices
    if (Object.keys(marketPrices).length > 0) {
      setHistory(prev => [...prev.slice(-9), {
        timestamp: new Date().toLocaleTimeString(),
        prices: { ...marketPrices }
      }]);
    }
    
    setMarketPrices(newPrices);
  };

  // Buy vegetables with carrots
  const buyVegetable = (vegetable) => {
    if (!vegetable || !marketPrices[vegetable]) return;
    
    const price = marketPrices[vegetable] * tradeAmount;
    
    if (playerVegetables.carrot >= price) {
      // Update carrots (currency)
      setPlayerVegetables(prev => ({
        ...prev,
        carrot: prev.carrot - price
      }));
      
      // Update vegetable inventory
      setPlayerVegetables(prev => ({
        ...prev,
        [vegetable]: (prev[vegetable] || 0) + tradeAmount
      }));
      
      // Add to trade history
      addTradeToHistory('buy', vegetable, tradeAmount, price);
    }
  };

  // Sell vegetables for carrots
  const sellVegetable = (vegetable) => {
    if (!vegetable || !marketPrices[vegetable]) return;
    
    const currentAmount = playerVegetables[vegetable] || 0;
    
    if (currentAmount >= tradeAmount) {
      const price = marketPrices[vegetable] * tradeAmount;
      
      // Update carrots (currency)
      setPlayerVegetables(prev => ({
        ...prev,
        carrot: prev.carrot + price
      }));
      
      // Update vegetable inventory
      setPlayerVegetables(prev => ({
        ...prev,
        [vegetable]: prev[vegetable] - tradeAmount
      }));
      
      // Add to trade history
      addTradeToHistory('sell', vegetable, tradeAmount, price);
    }
  };

  // Add trade to history
  const addTradeToHistory = (type, vegetable, amount, price) => {
    const newTrade = {
      id: Date.now(),
      type,
      vegetable,
      amount,
      price,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setTradeHistory(prev => [newTrade, ...prev.slice(0, 4)]);
  };

  // Get market status indicator
  const getMarketStatusIndicator = () => {
    switch (marketStatus) {
      case 'bull':
        return '📈 Bull Market (Trending Up)';
      case 'bear':
        return '📉 Bear Market (Trending Down)';
      case 'volatile':
        return '🔄 Volatile Market (Unpredictable)';
      default:
        return '⚖️ Stable Market';
    }
  };

  // Vegetable emoji mapping
  const vegetableEmojis = {
    carrot: '🥕',
    potato: '🥔',
    tomato: '🍅',
    lettuce: '🥬',
    corn: '🌽',
    onion: '🧅'
  };

  // Format price with trend indicator
  const formatPrice = (veg) => {
    if (!veg || !marketPrices[veg]) return "0.00";
    
    if (history.length < 2) return `${marketPrices[veg].toFixed(2)}`;
    
    const currentPrice = marketPrices[veg];
    const previousPrice = history[history.length - 1]?.prices?.[veg] || currentPrice;
    
    if (currentPrice > previousPrice) {
      return `${currentPrice.toFixed(2)} ↑`;
    } else if (currentPrice < previousPrice) {
      return `${currentPrice.toFixed(2)} ↓`;
    } else {
      return `${currentPrice.toFixed(2)} →`;
    }
  };

  return (
    <div className="vegetable-market">
      <h2>Vegetable Stock Exchange</h2>
      
      <div className="market-status">
        {getMarketStatusIndicator()}
      </div>
      
      <div className="market-controls">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="market-history-button"
        >
          {showHistory ? 'Hide Price History' : 'Show Price History'}
        </button>
        <div className="trade-controls">
          <span>Trade Amount:</span>
          <input 
            type="number" 
            min="1" 
            value={tradeAmount} 
            onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
      </div>
      
      {showHistory && (
        <div className="price-history">
          <h3>Price History</h3>
          <div className="history-table-container">
            {history.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    {Object.keys(vegetableEmojis).map(veg => (
                      <th key={veg}>{vegetableEmojis[veg]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, i) => (
                    <tr key={i}>
                      <td>{entry.timestamp}</td>
                      {Object.keys(vegetableEmojis).map(veg => (
                        <td key={veg}>{entry.prices?.[veg]?.toFixed(2) || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-history">No price history available yet. History will appear after price updates.</p>
            )}
          </div>
        </div>
      )}
      
      <div className="market-main-container">
        <div className="market-table-container">
          <table className="market-table">
            <thead>
              <tr>
                <th>Vegetable</th>
                <th>Current Price</th>
                <th>Your Inventory</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(vegetableEmojis).map(veg => (
                <tr key={veg} className={selectedVegetable === veg ? 'selected-row' : ''}>
                  <td>
                    <span className="vegetable-icon">{vegetableEmojis[veg]}</span>
                    {veg.charAt(0).toUpperCase() + veg.slice(1)}
                  </td>
                  <td className="price-cell">{formatPrice(veg)}</td>
                  <td>{playerVegetables[veg] || 0}</td>
                  <td className="action-cell">
                    <button
                      onClick={() => buyVegetable(veg)}
                      disabled={playerVegetables.carrot < marketPrices[veg] * tradeAmount}
                      className="buy-button"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => sellVegetable(veg)}
                      disabled={!playerVegetables[veg] || playerVegetables[veg] < tradeAmount}
                      className="sell-button"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="trade-history-container">
          <h3>Recent Trades</h3>
          {tradeHistory.length > 0 ? (
            <div className="trade-history-list">
              {tradeHistory.map(trade => (
                <div key={trade.id} className={`trade-item ${trade.type}`}>
                  <div className="trade-icon">
                    {trade.type === 'buy' ? '🔽' : '🔼'}
                  </div>
                  <div className="trade-details">
                    <span className="trade-action">
                      {trade.type === 'buy' ? 'Bought' : 'Sold'} {trade.amount} {vegetableEmojis[trade.vegetable]}
                    </span>
                    <span className="trade-price">
                      {trade.type === 'buy' ? '-' : '+'}{trade.price.toFixed(2)} 🥕
                    </span>
                    <span className="trade-time">{trade.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-trades">No trades yet. Start trading!</p>
          )}
        </div>
      </div>
      
      <div className="market-tips">
        <h3>Trading Tips</h3>
        <ul>
          <li>Buy low, sell high to maximize profits</li>
          <li>Watch for market trends indicated by arrows</li>
          <li>In bull markets, prices tend to rise</li>
          <li>In bear markets, prices tend to fall</li>
          <li>Volatile markets are unpredictable but offer opportunities</li>
        </ul>
      </div>
    </div>
  );
}

export default VegetableMarket;
