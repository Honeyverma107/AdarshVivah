import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import SuccessStories from './pages/public/SuccessStories';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Profile Pages
import BrowseProfiles from './pages/profiles/BrowseProfiles';
import ProfileDetails from './pages/profiles/ProfileDetails';
import CreateProfile from './pages/profiles/CreateProfile';
import EditProfile from './pages/profiles/EditProfile';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import MyProfile from './pages/dashboard/MyProfile';
import RecommendedMatches from './pages/dashboard/RecommendedMatches';
import ShortlistedProfiles from './pages/dashboard/ShortlistedProfiles';
import SentInterests from './pages/dashboard/SentInterests';
import ReceivedInterests from './pages/dashboard/ReceivedInterests';
import AccountSettings from './pages/dashboard/AccountSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProfiles from './pages/admin/ManageProfiles';
import ProfileVerification from './pages/admin/ProfileVerification';
import ManageUsers from './pages/admin/ManageUsers';

// Scroll To Top helper component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        
        {/* Public & Profile Discovery Routes (MainLayout) */}
        <Route element={<MainLayout isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register onRegisterSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/profiles" element={<BrowseProfiles />} />
          <Route path="/profiles/:id" element={<ProfileDetails />} />
          <Route path="/create-profile" element={<CreateProfile />} />
        </Route>

        {/* User Dashboard Routes (DashboardLayout) */}
        <Route path="/dashboard" element={<DashboardLayout isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />}>
          <Route index element={<DashboardOverview />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="recommended" element={<RecommendedMatches />} />
          <Route path="shortlisted" element={<ShortlistedProfiles />} />
          <Route path="sent-interests" element={<SentInterests />} />
          <Route path="received-interests" element={<ReceivedInterests />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>

        {/* Admin Demo Routes (AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<ProfileVerification />} />
          <Route path="profiles" element={<ManageProfiles />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
