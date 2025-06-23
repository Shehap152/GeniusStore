import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameSelector from '../components/GameSelector';
import { getOrders } from '../logic/orderService';
import FAQ from '../components/FAQ';
import Testimonials from '../components/Testimonials';
import PaymentIcons from '../components/PaymentIcons';
import SEO from '../components/SEO';

const HomePage = () => {
  const [selectedGame, setSelectedGame] = useState('PUBG');
  const [orderCounts, setOrderCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderCounts = async () => {
      const orders = await getOrders();
      const counts = orders.reduce((acc, order) => {
        const gameName = order.game;
        if (gameName) {
          acc[gameName] = (acc[gameName] || 0) + 1;
        }
        return acc;
      }, {});
      setOrderCounts(counts);
    };

    fetchOrderCounts();
  }, []);

  const handleStart = () => {
    navigate('/select-package', { state: { game: selectedGame } });
  };

  return (
    <main className="bg-gray-100 dark:bg-gray-900">
      <SEO
        title="Home"
        description="The fastest and most reliable place to top up your favorite games like PUBG and Free Fire. Choose your package and get back in the action."
        keywords="game topup, home, pubg, free fire"
      />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 animate-fade-in-down">
            Top Up Your Game
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 max-w-2xl animate-fade-in-up">
            Select your game, choose your package, and get back in the action faster than ever.
          </p>
          <GameSelector value={selectedGame} onChange={setSelectedGame} orderCounts={orderCounts} />

          <div className="h-8 mt-6">
            <p
              key={selectedGame}
              className="text-lg font-semibold text-gray-800 dark:text-gray-200 animate-fade-in-up"
            >
              You selected: <span className="font-bold text-blue-600 dark:text-blue-400">{selectedGame}</span>
            </p>
          </div>

          <button
            className="mt-8 group inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 animate-pulse-slow"
            onClick={handleStart}
          >
            Get Started
            <svg className="w-5 h-5 ml-2 transition-transform transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </button>
        </div>
        {/* <PaymentIcons /> */}
      </section>

      {/* FAQ Section */}
      <section>
        <FAQ />
      </section>

      {/* Testimonials Section */}
      <section>
        <Testimonials />
      </section>
    </main>
  );
};

export default HomePage; 