
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';
import Simulation from './pages/Simulation';
import Reflection from './pages/Reflection';
import ProfileView from './pages/ProfileView';
import CustomCreator from './pages/CustomCreator';
import Journey from './pages/Journey';
import AboutView from './pages/AboutView';
import AgentEditor from './pages/AgentEditor';
import Mentorship from './pages/Mentorship';
import ScenarioLibrary from './pages/ScenarioLibrary';
import AccessibilitySettings from './pages/AccessibilitySettings';
import Login from './pages/Login';
import Signup from './pages/Signup';

import SupportChat from './components/SupportChat';
import Navbar from './components/Navbar';
import NavigationControls from './components/NavigationControls';
import Footer from './components/Footer';
import { UserProfile } from './types';

const AppRoutes: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const location = useLocation();

  const handleProfileUpdate = (newProfile: UserProfile) => {
    if (user) {
      updateUser({ ...user, profile: newProfile });
    }
  };

  const handleResetData = () => {
    // Clear all custom data and history
    localStorage.removeItem('custom_scenarios');
    localStorage.removeItem('convoverse_reflections');
    localStorage.removeItem('custom_agents_library');
    // Force a reload to ensure all states (like Journey history) are reset visually
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-body relative transition-colors duration-300">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user ? (
              user.profile ? <Landing profile={user.profile} /> : <Navigate to="/onboarding" />
            ) : (
              <Welcome />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutView />} />

        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireProfile={false}>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileView
                profile={user?.profile!}
                onUpdate={handleProfileUpdate}
                onLogout={logout}
                onReset={handleResetData}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulate"
          element={
            <ProtectedRoute>
              <Simulation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CustomCreator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agent-editor"
          element={
            <ProtectedRoute>
              <AgentEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <AccessibilitySettings />
          }
        />

        <Route
          path="/mentorship"
          element={
            <ProtectedRoute>
              <Mentorship />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reflect"
          element={
            <ProtectedRoute>
              <Reflection profile={user?.profile!} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <ScenarioLibrary profile={user?.profile!} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <Journey profile={user?.profile!} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {user && <Navbar />}
      {user && user.profile && <SupportChat profile={user.profile} />}
      <NavigationControls />
      {/* Show footer on most pages, check path using location hook */}
      {location.pathname !== '/simulate' && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default App;
