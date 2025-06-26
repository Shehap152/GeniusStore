import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import LoadingIndicator from '../components/LoadingIndicator';

// TODO: In the future, consider using a roles array for more flexible access control
const ADMIN_EMAIL = 'abdo.nasef.web@gmail.com';

/**
 * PrivateRoute protects admin-only routes.
 * Only authenticated users with the admin email can access children.
 * Others are redirected to login or unauthorized page.
 */
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

  // Only allow admin
  if (user.email !== ADMIN_EMAIL) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute; 