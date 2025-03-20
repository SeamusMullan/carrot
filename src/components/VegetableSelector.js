import React from 'react';
import '../styles/VegetableSelector.css';

function VegetableSelector({ currentVegetable, setCurrentVegetable, vegetables }) {
  // Vegetable emoji mapping
  const vegetableEmojis = {
    carrot: '🥕',
    potato: '🥔',
    tomato: '🍅',
    lettuce: '🥬',
    corn: '🌽',
    onion: '🧅'
  };

  // Vegetable harvest yield modifiers
  const vegetableYields = {
    carrot: 1.0,   // baseline
    potato: 0.8,   // slower but more valuable
    tomato: 0.6,   // slow but most valuable
    lettuce: 1.2,  // faster yield
    corn: 1.3,     // faster yield
    onion: 0.9     // medium yield
  };

  return (
    <div className="vegetable-selector">
      <h3>Select Vegetable to Harvest</h3>
      <div className="selector-buttons">
        {Object.keys(vegetableEmojis).map(veg => (
          <button
            key={veg}
            onClick={() => setCurrentVegetable(veg)}
            className={`veg-button ${currentVegetable === veg ? 'selected' : ''}`}
            title={`${veg.charAt(0).toUpperCase() + veg.slice(1)} - Yield: ${vegetableYields[veg] * 100}%`}
          >
            <span className="veg-emoji">{vegetableEmojis[veg]}</span>
            <span className="veg-name">{veg.charAt(0).toUpperCase() + veg.slice(1)}</span>
            <span className="veg-count">{vegetables[veg] || 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default VegetableSelector;
