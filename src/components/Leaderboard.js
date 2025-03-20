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
        const response = await fetch('/api/leaderboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
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
