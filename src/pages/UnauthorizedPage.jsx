import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-center text-red-500">Unauthorized Access</h1>
        <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
          You do not have permission to view this page.
        </p>
        <Link to="/" className="block w-full px-4 py-2 font-bold text-center text-white bg-blue-500 rounded hover:bg-blue-700">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 