import React, { useState, useEffect } from 'react';

const ToastNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
      </div>
    </div>
  );
};

export default ToastNotification; 