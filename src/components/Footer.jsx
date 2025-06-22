import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const socialLinks = [
  { name: 'Facebook', icon: <FaFacebook />, url: 'https://facebook.com' },
  { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com' },
  { name: 'TikTok', icon: <FaTiktok />, url: 'https://tiktok.com' },
  { name: 'YouTube', icon: <FaYoutube />, url: 'https://youtube.com' },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900/50 w-full mt-auto">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TopUp Store. All Rights Reserved.
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
