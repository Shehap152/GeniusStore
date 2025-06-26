import React from 'react';
import { FaShoppingCart, FaCoins, FaGem, FaFutbol } from 'react-icons/fa';
import { SiPubg } from 'react-icons/si';

const GameIcon = ({ game }) => {
    switch (game) {
        case 'PUBG':
            return <SiPubg className="text-orange-500 text-4xl flex-shrink-0" />;
        case 'Free Fire':
            return <FaGem className="text-cyan-400 text-4xl flex-shrink-0" />;
        case 'PES':
            return <FaCoins className="text-yellow-400 text-4xl flex-shrink-0" />;
        case 'FIFA':
            return <FaFutbol className="text-green-600 text-4xl flex-shrink-0" />;
        default:
            return <FaCoins className="text-gray-400 text-4xl flex-shrink-0" />;
    }
};

const PackageCard = ({ name, price, onTopUp, game }) => {
  return (
    <div className="flex flex-col bg-white/60 dark:bg-gray-800/60 p-6 rounded-xl border border-white/10 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-72 mx-auto">
      {/* Top section */}
      <div className="flex items-center gap-4 mb-5">
        <GameIcon game={game} />
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{name}</h3>
      </div>
      
      {/* Price */}
      <p className="text-2xl font-medium text-gray-600 dark:text-gray-300 mb-6">
        EGP {price}
      </p>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Button */}
      <button
        onClick={onTopUp}
        className="group w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-transform duration-300 text-base"
      >
        <span>Top Up Now</span>
        <FaShoppingCart className="transition-transform group-hover:rotate-12" />
      </button>
    </div>
  );
};

export default PackageCard; 