import React, { useState } from 'react';

// Import the images from the src/assets/Image folder
import pubgLogo from '../assets/Image/pubg.png';
import freefireLogo from '../assets/Image/free_fire.png';
import pesLogo from '../assets/Image/pes.png';
import placeholderLogo from '../assets/placeholder.png'; // A fallback

// Map game names to the imported images
const gameImageMap = {
  'PUBG': pubgLogo,
  'Free Fire': freefireLogo,
  'PES': pesLogo,
};

const GameCard = ({ game, selected, onSelect, orderCount }) => {
  const isSelected = selected === game.name;
  const imageSrc = gameImageMap[game.name] || placeholderLogo;

  return (
    <div
      className={`relative rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 ${isSelected ? 'scale-105 ring-4 ring-blue-500' : 'hover:scale-105 hover:-rotate-1'}`}
      onClick={() => onSelect(game.name)}
    >
      <img src={imageSrc} alt={`${game.name} Logo`} className="w-full h-48 object-cover bg-gray-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <h3 className="text-xl font-bold text-white">{game.name}</h3>
        {orderCount > 0 && (
            <p className="text-sm font-semibold text-gray-200 mt-1">
                💰 {orderCount.toLocaleString()} orders
            </p>
        )}
      </div>
    </div>
  );
};


const GameSelector = ({ value, onChange, orderCounts }) => {
  const games = [
    { name: 'PUBG' },
    { name: 'Free Fire' },
    { name: 'PES' },
  ];
  
  const [selected, setSelected] = useState(value || 'PUBG');

  const handleSelect = (game) => {
    setSelected(game);
    if (onChange) onChange(game);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
      {games.map((game) => (
        <GameCard
          key={game.name}
          game={game}
          selected={selected}
          onSelect={handleSelect}
          orderCount={orderCounts[game.name] || 0}
        />
      ))}
    </div>
  );
};

export default GameSelector; 