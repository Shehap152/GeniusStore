import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Fallback to system preference if no saved theme
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      className="fixed top-4 right-4 z-50 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded shadow"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default DarkModeToggle; 