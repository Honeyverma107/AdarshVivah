import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import BiodataModal from '../components/BiodataModal';
import { CURRENT_USER } from '../data/profiles';

export const DashboardLayout = ({ isLoggedIn = true, onLogout }) => {
  const [isBiodataOpen, setIsBiodataOpen] = useState(false);
  const navigate = useNavigate();

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

          {/* Main Dashboard Content Outlet */}
          <div className="flex-1 min-w-0 space-y-6">
            <Outlet context={{ openBiodataModal: () => setIsBiodataOpen(true) }} />
          </div>

        </div>
      </main>

      {/* Matrimonial Biodata Generator Modal */}
      <BiodataModal
        isOpen={isBiodataOpen}
        onClose={() => setIsBiodataOpen(false)}
        profile={CURRENT_USER}
      />

      <Footer />
    </div>
  );
};
export default DashboardLayout;
