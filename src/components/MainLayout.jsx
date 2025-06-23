import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import DarkModeToggle from './DarkModeToggle';
import ContactButton from './ContactButton';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <DarkModeToggle />
      <main className="flex-grow pb-20">
        <Outlet />
      </main>
      <ContactButton />
      <Footer />
    </div>
  );
};

export default MainLayout; 