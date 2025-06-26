import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameSelector from '../components/GameSelector';
import PackageCard from '../components/PackageCard';
import { subscribeToPackages } from '../logic/packageService';
import SEO from '../components/SEO';
import LoadingIndicator from '../components/LoadingIndicator';

const SelectPackage = () => {
  const location = useLocation();
  const initialGame = location.state?.game || 'PUBG';
  const [selectedGame, setSelectedGame] = useState(initialGame);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToPackages((allPackages) => {
      const gamePackages = allPackages.filter(p => p.game === selectedGame);
      setPackages(gamePackages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedGame]);

  const handleTopUp = (pkg) => {
    navigate('/payment', { state: { game: selectedGame, package: pkg } });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingIndicator /></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gradient-to-b dark:from-[#0e0e2d] dark:to-[#1b1b3f] py-8 px-4">
      <SEO
        title={`${selectedGame} Top-Up | Buy ${selectedGame} Credits`}
        description={`Get ${selectedGame} credits instantly with our competitive packages. Choose from a variety of options to recharge your account.`}
        keywords={`${selectedGame} topup, ${selectedGame} vouchers, game packages, buy ${selectedGame} credits`}
      />
      <div className="w-full max-w-5xl text-center relative">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 animate-fade-in-down">
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Get Your {selectedGame} UC Now!
          </span>
        </h1>
        <p className="text-lg text-gray-300 dark:text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up">
          Choose one of our competitive packages to recharge your account instantly.
        </p>
            
            {/* We can hide the game selector here if we want a more focused flow */}
            {/* <GameSelector value={selectedGame} onChange={setSelectedGame} /> */}
            
            <div className="flex flex-wrap justify-center gap-6 mt-8">
                {packages.map((pkg) => (
                    <PackageCard
                        key={pkg.id}
                        name={pkg.name}
                        price={pkg.price}
                        game={pkg.game}
                        onTopUp={() => handleTopUp(pkg)}
                    />
                ))}
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={() => navigate(-1)}
                className="mt-8 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back
              </button>
            </div>
        </div>
    </div>
  );
};

export default SelectPackage; 