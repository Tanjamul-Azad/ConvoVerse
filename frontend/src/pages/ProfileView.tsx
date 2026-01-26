
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';


interface ProfileViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
  onReset: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, onLogout, onReset }) => {
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.socialGoal);
  const navigate = useNavigate();

  const handleSave = () => {
    onUpdate({ ...profile, name, socialGoal: goal });
    navigate('/');
  };

  const handleResetConfirm = () => {
    if (window.confirm("Are you sure? This will erase all your custom scenarios and history, but keep your account.")) {
      onReset();
      alert("Progress reset successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-20 px-6 relative overflow-hidden">
      {/* Ambient Background Lights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/5 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-500/5 rounded-full blur-[100px] animate-float-delayed"></div>
      </div>

      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-5">
            <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-brand-primary transition-all">
              <i className="fas fa-arrow-left text-sm"></i>
            </button>
            <h1 className="text-2xl font-black text-slate-900">User Configuration</h1>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleResetConfirm}
              className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
              title="Clear all progress but keep account"
            >
              <i className="fas fa-trash-alt"></i>
              Reset Data
            </button>

            <button
              onClick={() => {
                onLogout();
                navigate('/');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>

        <div className="glass-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50">
          <div className="flex items-center gap-8 pb-10 border-b border-slate-100">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-brand-primary/20">
              {name[0]}
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 border border-brand-primary/10">
                {profile.archetype}
              </span>
              <p className="text-slate-400 text-xs leading-relaxed font-medium">
                The environment is specifically <br />calibrated for your social pulse.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Handle</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-semibold text-slate-800 shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Active Objective</label>
              <input
                type="text"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-semibold text-slate-800 shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="group w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10"
          >
            Update Configuration
          </button>
        </div>

        <div className="mt-10 p-8 bg-gradient-to-br from-slate-900 to-[#1a1c2e] rounded-[2rem] shadow-xl shadow-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h4 className="font-black text-white text-xs uppercase tracking-widest mb-4 flex items-center gap-3">
              <i className="fas fa-lightbulb text-brand-accent"></i>
              Neural Insight
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Based on your <strong className="text-white border-b border-white/20">{profile.archetype}</strong> profile,
              we suggest focusing on "The Group Silence" mission to build resilience in dynamic settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

