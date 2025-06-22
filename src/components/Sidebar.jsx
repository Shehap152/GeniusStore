import React from 'react';

const Sidebar = () => {
  // In the future, you can use NavLink from react-router-dom for active styling
  const linkClasses = "flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700";
  const activeLinkClasses = "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg";

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TopUp Store</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
      </div>
      <nav className="p-4">
        <ul>
          <li>
            <a href="/admin" className={activeLinkClasses}>
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Dashboard
            </a>
          </li>
          {/* Add more links here in the future for Games, Payments, etc. */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 