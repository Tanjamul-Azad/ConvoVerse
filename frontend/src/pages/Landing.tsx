
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SimulationStage, Scenario, UserProfile, Agent } from '../types';
import { SCENARIOS } from '../utils/constants';

interface LandingProps {
  profile: UserProfile;
}

const Landing: React.FC<LandingProps> = ({ profile }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Academic' | 'Social' | 'Professional' | 'Custom'>('All');
  const [customScenarios, setCustomScenarios] = useState<(Scenario & { customAgents?: Agent[] })[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('custom_scenarios');
    if (saved) {
      setCustomScenarios(JSON.parse(saved));
    }
  }, []);

  const handleStartScenario = (scenario: Scenario & { customAgents?: Agent[] }) => {
    navigate('/simulate', { state: { stage: scenario.stage, scenario, customAgents: scenario.customAgents } });
  };

  const deleteScenario = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customScenarios.filter(s => s.id !== id);
    setCustomScenarios(updated);
    localStorage.setItem('custom_scenarios', JSON.stringify(updated));
  };

  const allScenarios = [...SCENARIOS, ...customScenarios];

  const filteredScenarios = selectedCategory === 'All'
    ? allScenarios
    : selectedCategory === 'Custom'
      ? customScenarios
      : allScenarios.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fafafa] relative pb-24 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Decorative Gradients */}
      <div className="absolute -top-[20%] right-0 w-[50vw] h-[50vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-5xl xl:max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-all duration-300">
                <i className="fas fa-comment-dots text-lg"></i>
              </div>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Verse</span></span>
          </div>


          <div className="flex items-center gap-4">
            <Link to="/about" className="text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors mr-4">
              How it Works
            </Link>
            <Link to="/create" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 group">
              <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
              New Mission
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-2 py-2 pr-5 bg-white rounded-full border border-slate-200 hover:border-brand-primary/30 hover:bg-slate-50 transition-all group shadow-sm hover:shadow-md">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-sm font-bold shadow-inner">
                {profile.name[0]}
              </div>
              <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{profile.name}</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl xl:max-w-7xl mx-auto px-6 py-8 md:py-10 relative z-10">
        {/* Welcome Banner */}
        <section className="mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-full relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-brand-primary/20 group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#1a1c2e] to-brand-primary/90"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[80px] -ml-20 -mb-20"></div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest mb-6 border border-white/20 text-brand-accent shadow-sm">
                  <i className="fas fa-fingerprint"></i>
                  Social Pulse: {profile.archetype}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] text-white tracking-tight">
                  Master the art of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Human Connection</span>.
                </h1>
                <p className="text-slate-300 text-lg font-medium max-w-lg mb-0 leading-relaxed">
                  Your active goal is <strong className="text-white border-b border-brand-accent/30 mx-1">{profile.socialGoal}</strong>.
                  Every mission is mathematically tuned to challenge your social comfort zone.
                </p>

                {/* Emotion Check-in (Optional) */}
                <div className="mt-8 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                  <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">How do you feel?</span>
                  <div className="flex gap-2">
                    {['🙂', '😐', '😟'].map(emoji => (
                      <button
                        key={emoji}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-xl relative group"
                        title="Check-in"
                      >
                        {emoji}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          Log mood
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 bg-white/5 backdrop-blur-md px-8 py-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-center">
                  <span className="block text-4xl font-black text-white mb-1">{allScenarios.length}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Missions</span>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div className="text-center">
                  <span className="block text-4xl font-black text-white mb-1">{customScenarios.length}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Custom</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Journey Indicator */}
        <section className="mb-24 max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10"></div>

            <div className="flex justify-between items-center">
              {[
                { icon: 'fa-map', label: 'Choose Scenario', color: 'text-blue-500' },
                { icon: 'fa-comments', label: 'Practice', color: 'text-indigo-500' },
                { icon: 'fa-brain', label: 'Reflect', color: 'text-purple-500' },
                { icon: 'fa-arrow-trend-up', label: 'Improve', color: 'text-emerald-500' }
              ].map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 bg-[#fafafa] px-4 group cursor-default">
                  <div className={`w-14 h-14 rounded-full bg-white border-4 border-white shadow-lg shadow-slate-200 flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${step.color}`}>
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors bg-[#fafafa] px-2">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Categories */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Available Missions</h2>
              <p className="text-slate-500 font-medium text-lg">Select a simulation designed to evolve your social intelligence.</p>
            </div>

            <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full">
              {['All', 'Academic', 'Social', 'Professional', 'Custom'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Create Card for Custom Filter */}
            {selectedCategory === 'Custom' && (
              <Link
                to="/create"
                className="group relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-300 hover:border-brand-primary hover:bg-brand-primary/[0.02] transition-all min-h-[360px] cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300 mb-6 shadow-inner">
                  <i className="fas fa-plus text-3xl"></i>
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-brand-primary transition-colors">Create Personal Mission</span>
              </Link>
            )}

            {filteredScenarios.map((scenario, idx) => (
              <div
                key={scenario.id}
                onClick={() => handleStartScenario(scenario)}
                className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-slate-100 overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-[1.2rem] flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 shadow-sm ${scenario.category === 'Academic' ? 'bg-blue-50 text-blue-600' :
                      scenario.category === 'Social' ? 'bg-indigo-50 text-indigo-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>
                      <i className={`fas ${scenario.icon}`}></i>
                    </div>

                    <div className="flex items-center gap-2">
                      {scenario.id.startsWith('custom-') ? (
                        <div className="flex gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                            Custom
                          </span>
                          <button
                            onClick={(e) => deleteScenario(scenario.id, e)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <i className="fas fa-trash-alt text-[10px]"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                          {scenario.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-brand-primary transition-colors tracking-tight leading-tight">
                    {scenario.title}
                  </h3>

                  <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium flex-grow">
                    {scenario.description}
                  </p>

                  {/* Agent Visibility Hint */}
                  <div className="mb-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 self-start px-2 py-1 rounded-md border border-slate-100">
                    <div className="flex -space-x-1">
                      <div className="w-4 h-4 rounded-full bg-brand-primary/20 flex items-center justify-center text-[8px] text-brand-primary border border-white"><i className="fas fa-user"></i></div>
                      <div className="w-4 h-4 rounded-full bg-brand-secondary/20 flex items-center justify-center text-[8px] text-brand-secondary border border-white"><i className="fas fa-robot"></i></div>
                    </div>
                    <span>Multi-Agent Simulation</span>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-auto flex items-center justify-between group-hover:border-slate-200 transition-colors">
                    <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Initialize Mission
                    </span>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-brand-primary/30">
                      <i className="fas fa-arrow-right text-xs -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Reflection / Feedback Cue */}
          <div className="mt-12 flex justify-center">
            <div className="group flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-brand-primary/10 transition-all hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg animate-bounce-slow">
                <span className="transform group-hover:scale-110 transition-transform">🧠</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Private Feedback</p>
                <p className="text-xs text-slate-500 font-medium">After each session, you receive private, constructive analysis.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="mt-28 mb-10">
          <div className="glass-card bg-gradient-to-r from-slate-900 to-[#2d2f45] p-8 md:p-10 rounded-[2.5rem] text-center relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] -ml-32 -mb-32"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-2xl border border-white/10 shadow-lg">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Risk-Free Environment</h2>
              <p className="text-slate-300 font-medium mb-10 leading-relaxed text-lg">
                Remember, every interaction is local and private. No real humans are involved—just our simulation agents designed for your growth.
              </p>
              <button
                onClick={() => navigate('/simulate', { state: { stage: SimulationStage.ONE_ON_ONE } })}
                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
              >
                Quick Casual Match
              </button>
            </div>
          </div>


          {/* Accessibility Signal */}
          <div className="mt-16 text-center opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-transparent hover:border-slate-200 hover:bg-white/50 transition-all">
              <i className="fas fa-universal-access text-slate-400"></i>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Designed for accessibility: low cognitive load • private • adjustable difficulty
              </span>
            </div>
          </div>
        </section >
      </div >
    </div >
  );
};

export default Landing;
