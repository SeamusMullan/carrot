import React, { useState, useEffect } from 'react';
import '../styles/Leaderboard.css';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        
        // For development/testing - mock data
        const mockData = [
          { username: 'CarrotMaster9000', score: 15000000, isAI: true, timestamp: Date.now() },
          { username: 'FarmBot3000', score: 9500000, isAI: true, timestamp: Date.now() },
          { username: 'VeggieHarvester', score: 5200000, isAI: true, timestamp: Date.now() },
          { username: 'RootVeggieFan', score: 2800000, isAI: true, timestamp: Date.now() },
          { username: 'OrangeRootLover', score: 1200000, isAI: true, timestamp: Date.now() },
          { username: 'Player1', score: 800000, isAI: false, timestamp: Date.now() },
          { username: 'VeggieKing', score: 500000, isAI: false, timestamp: Date.now() },
          { username: 'FarmQueen', score: 300000, isAI: false, timestamp: Date.now() },
          { username: 'NewFarmer', score: 100000, isAI: false, timestamp: Date.now() },
          { username: 'GardenBeginner', score: 50000, isAI: false, timestamp: Date.now() }
        ];
        
        // Try to fetch real data if available
        try {
          const response = await fetch('/api/leaderboard');
          if (response.ok) {
            const data = await response.json();
            setLeaderboardData(data);
          } else {
            // Use mock data if API fails
            setLeaderboardData(mockData);
          }
        } catch (fetchErr) {
          console.log('Using mock leaderboard data');
          setLeaderboardData(mockData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error with leaderboard:', err);
        setError('Could not load leaderboard data');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="leaderboard">
      <h2>🏆 Carrot Champions 🏆</h2>
      
      {loading ? (
        <p className="loading">Loading leaderboard...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Carrots</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={index} className={entry.isAI ? 'ai-player' : ''}>
                <td>#{index + 1}</td>
                <td>{entry.username} {entry.isAI && '🤖'}</td>
                <td>{formatNumber(entry.score)} 🥕</td>
                <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
