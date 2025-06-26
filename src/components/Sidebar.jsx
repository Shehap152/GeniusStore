import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  // In the future, you can use NavLink from react-router-dom for active styling
  const linkClasses = "flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700";
  const activeLinkClasses = "flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-48 h-screen bg-white dark:bg-gray-800 shadow-md flex flex-col lg:fixed lg:top-0 lg:left-0">
      <div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Genius Store</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          )}
        </div>
        <nav className="p-4">
          <ul>
            <li>
              <a href="/dashboard" className={activeLinkClasses}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                Dashboard
              </a>
            </li>
            {/* Add more links here in the future for Games, Payments, etc. */}
          </ul>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button onClick={handleLogout} className={`${linkClasses} w-full`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 