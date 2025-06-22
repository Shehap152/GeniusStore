import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import SelectPackage from './pages/SelectPackage';
import PaymentPage from './pages/PaymentPage';
import PaymentInstructionsPage from './pages/PaymentInstructionsPage';
import SuccessPage from './pages/SuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PrivateRoute from './routes/PrivateRoute';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/select-package" element={<SelectPackage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-instructions/:method" element={<PaymentInstructionsPage />} />
      <Route path="/success" element={<SuccessPage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <AdminDashboard />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes; 