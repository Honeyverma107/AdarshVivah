import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import BiodataModal from '../components/BiodataModal';
import ErrorBoundary from '../components/ErrorBoundary';
import profileApi from '../api/profileApi';

export const DashboardLayout = ({ isLoggedIn = true, onLogout }) => {
  const [isBiodataOpen, setIsBiodataOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    profileApi.getMe()
      .then((res) => setUserProfile(res.data))
      .catch((err) => console.error('Error fetching layout profile:', err));
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 font-sans text-dark-800">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Dashboard Sidebar */}
          <Sidebar 
            onLogout={handleLogout} 
            onOpenBiodata={() => setIsBiodataOpen(true)} 
          />

          {/* Main Dashboard Content Outlet Wrapped in ErrorBoundary */}
          <div className="flex-1 min-w-0 space-y-6">
            <ErrorBoundary>
              <Outlet context={{ openBiodataModal: () => setIsBiodataOpen(true) }} />
            </ErrorBoundary>
          </div>

        </div>
      </main>

      {/* Matrimonial Biodata Generator Modal */}
      {userProfile && (
        <BiodataModal
          isOpen={isBiodataOpen}
          onClose={() => setIsBiodataOpen(false)}
          profile={userProfile}
        />
      )}

      <Footer />
    </div>
  );
};
export default DashboardLayout;
