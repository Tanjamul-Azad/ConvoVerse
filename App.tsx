
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './views/Welcome';
import Onboarding from './views/Onboarding';
import Landing from './views/Landing';
import Simulation from './views/Simulation';
import Reflection from './views/Reflection';
import ProfileView from './views/ProfileView';
import CustomCreator from './views/CustomCreator';
import AboutView from './views/AboutView';
import SupportChat from './components/SupportChat';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('convoverse_profile');
    return saved ? JSON.parse(saved) : null;
  });


  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('convoverse_profile', JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('convoverse_profile');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-body relative">
        <Routes>
          <Route
            path="/"
            element={profile ? <Landing profile={profile} /> : <Welcome />}
          />
          <Route
            path="/onboarding"
            element={<Onboarding onComplete={updateProfile} />}
          />
          <Route
            path="/profile"
            element={profile ? <ProfileView profile={profile} onUpdate={updateProfile} onReset={clearProfile} /> : <Navigate to="/" />}
          />
          <Route
            path="/simulate"
            element={profile ? <Simulation /> : <Navigate to="/" />}
          />
          <Route
            path="/create"
            element={profile ? <CustomCreator /> : <Navigate to="/" />}
          />

          <Route
            path="/reflect"
            element={profile ? <Reflection profile={profile} /> : <Navigate to="/" />}
          />
          <Route
            path="/about"
            element={<AboutView />}
          />
        </Routes>
        {profile && <SupportChat profile={profile} />}
      </div>
    </Router>
  );
};

export default App;
