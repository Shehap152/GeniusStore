import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import LoadingIndicator from '../components/LoadingIndicator';

const ADMIN_EMAIL = 'abdo.nasef.web@gmail.com';

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    // Handle the error appropriately
    console.error("Authentication error:", error);
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute; 