import React from 'react';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';

const socialLinks = [
  { name: 'Facebook', icon: <FaFacebook />, url: 'https://www.facebook.com/share/16R2bBKjxd/' },
  { name: 'YouTube', icon: <FaYoutube />, url: 'https://youtube.com/@user-geniuspes?si=48nRLH-8-NueOhy6' },
  { name: 'Telegram', icon: <FaTelegramPlane />, url: 'http://t.me/Geniuspes1' },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900/50 w-full mt-auto">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Genius Store. All Rights Reserved.
        </p>
        <div className="flex space-x-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors text-2xl"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
