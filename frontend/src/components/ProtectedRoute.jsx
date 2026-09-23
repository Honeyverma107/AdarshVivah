import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream-50 gap-4">
        <div className="w-12 h-12 rounded-2xl bg-maroon-600 text-white flex items-center justify-center animate-bounce shadow-lg">
          <Heart className="w-6 h-6 fill-gold-400 text-gold-400" />
        </div>
        <p className="text-xs font-semibold text-maroon-700 tracking-wider uppercase">
          Verifying Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
