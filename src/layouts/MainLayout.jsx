import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const MainLayout = ({ isLoggedIn, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 font-sans text-dark-800">
      <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
