
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scenario, UserProfile, Agent } from '../types';
import { SCENARIOS } from '../utils/constants';

interface LandingProps {
    profile: UserProfile;
}

const Landing: React.FC<LandingProps> = ({ profile }) => {
    const navigate = useNavigate();
    const [customScenarios, setCustomScenarios] = useState<(Scenario & { customAgents?: Agent[] })[]>([]);
    const [myActiveScenarios, setMyActiveScenarios] = useState<Scenario[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('custom_scenarios');
        if (saved) {
            setCustomScenarios(JSON.parse(saved));
        }
        // Initialize active scenarios with a few defaults if none exist
        // In a real app this would be user state
        setMyActiveScenarios(SCENARIOS.slice(0, 3));
    }, []);

    const handleStartScenario = (scenario: Scenario & { customAgents?: Agent[] }) => {
        navigate('/simulate', { state: { stage: scenario.stage, scenario, customAgents: scenario.customAgents } });
    };

    const allScenarios = [...SCENARIOS, ...customScenarios];

    return (
        <div className="min-h-screen bg-[#f8fafc] relative pb-24 overflow-x-hidden">
            {/* Ambient Background Lights */}
            <div className="fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/10 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-cyan-400/10 rounded-full blur-[80px] animate-float-delayed"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/40 supports-[backdrop-filter]:bg-white/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-primary blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 transform group-hover:rotate-6 transition-all duration-300">
                                <i className="fas fa-comment-dots text-lg"></i>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">Convo<span className="text-gradient">Verse</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/library" className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-white/80 border border-white/60 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-brand-primary/50 hover:text-brand-primary transition-all shadow-sm active:scale-95 group backdrop-blur-sm">
                            <i className="fas fa-book-open group-hover:scale-110 transition-transform"></i>
                            Library
                        </Link>
                        <Link to="/create" className="hidden md:flex items-center gap-2 btn-primary !py-2.5 !px-6 !text-xs !rounded-xl">
                            <i className="fas fa-plus group-hover:rotate-90 transition-transform"></i>
                            New Mission
                        </Link>
                        <Link to="/profile" className="flex items-center gap-3 px-2 py-2 pr-5 bg-white/80 rounded-full border border-white/60 hover:border-brand-primary/30 hover:bg-white transition-all group shadow-sm hover:shadow-md backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-sm font-bold shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                {profile.name[0]}
                            </div>
                            <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{profile.name}</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 relative z-10">
                {/* Hero / Welcome Banner */}
                <section className="mb-20 animate-slide-up">
                    <div className="w-full relative overflow-hidden rounded-[3rem] shadow-2xl shadow-brand-primary/20 group transition-all duration-500 hover:shadow-brand-primary/30">
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 bg-slate-900">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 opacity-90"></div>
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/20 rounded-full blur-[100px] mix-blend-screen animate-float"></div>
                        </div>

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

                        <div className="relative z-10 p-8 md:p-16 lg:p-20 flex flex-col md:flex-row justify-between items-end gap-10">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/20 text-brand-accent shadow-lg animate-fade-in delay-100">
                                    <i className="fas fa-fingerprint"></i>
                                    Social Pulse: {profile.archetype}
                                </div>
                                <h1 className="heading-xl text-white mb-8 animate-slide-up delay-200 drop-shadow-lg">
                                    Master the art of <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400">Human Connection</span>.
                                </h1>
                                <p className="text-slate-200 text-lg md:text-xl font-medium max-w-xl mb-0 leading-relaxed animate-slide-up delay-300 text-shadow-sm">
                                    Your active goal is <strong className="text-white border-b-2 border-brand-accent/40 mx-1 px-1">{profile.socialGoal}</strong>.
                                    <br />Every mission is mathematically tuned to challenge your social comfort zone.
                                </p>
                            </div>

                            <div
                                className="group/btn flex items-center gap-6 bg-white/10 backdrop-blur-md px-10 py-8 rounded-[2.5rem] border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer shadow-xl animate-slide-up delay-300"
                                onClick={() => navigate('/library')}
                            >
                                <div className="text-center">
                                    <span className="block text-5xl font-black text-white mb-1 drop-shadow-md group-hover/btn:scale-110 transition-transform duration-300">{allScenarios.length}</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">Available Missions</span>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg group-hover/btn:rotate-[-45deg] transition-transform duration-500">
                                    <i className="fas fa-arrow-right text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Journey & Stats */}
                <section className="mb-24 px-4 animate-slide-up delay-200">
                    <div className="max-w-5xl mx-auto relative group">
                        {/* Connecting Line */}
                        <div className="absolute top-[40%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10"></div>

                        <div className="grid grid-cols-4 gap-4" onClick={() => navigate('/journey')}>
                            {[
                                { icon: 'fa-map', label: 'Select', color: 'text-cyan-500' },
                                { icon: 'fa-comments', label: 'Practice', color: 'text-violet-500' },
                                { icon: 'fa-brain', label: 'Reflect', color: 'text-fuchsia-500' },
                                { icon: 'fa-arrow-trend-up', label: 'Grow', color: 'text-emerald-500' }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-6 cursor-pointer group/step">
                                    <div className={`w-20 h-20 rounded-full bg-white border-4 border-white shadow-xl shadow-slate-200/60 flex items-center justify-center text-2xl ${step.color} transition-transform duration-300 group-hover/step:scale-110 group-hover/step:-translate-y-2`}>
                                        <i className={`fas ${step.icon}`}></i>
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover/step:text-slate-800 transition-colors bg-[#f8fafc] px-3 z-10">{step.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Main Interface / Missions */}
                <section className="animate-slide-up delay-300">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6 px-2">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight flex items-center gap-3">
                                Your Dashboard <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg">Active scenarios pinned from the library.</p>
                        </div>

                        <button
                            onClick={() => navigate('/library')}
                            className="btn-secondary flex items-center gap-3 !py-3 !px-6 text-xs"
                        >
                            <i className="fas fa-plus"></i> Add from Library
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myActiveScenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                onClick={() => handleStartScenario(scenario)}
                                className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-slate-100 overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] transition-colors group-hover:bg-white/50 z-0"></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 shadow-sm ${scenario.category === 'Academic' ? 'bg-cyan-50 text-cyan-600' :
                                            scenario.category === 'Social' ? 'bg-fuchsia-50 text-fuchsia-600' :
                                                'bg-violet-50 text-violet-600'
                                            }`}>
                                            <i className={`fas ${scenario.icon}`}></i>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-secondary transition-all tracking-tight leading-tight">
                                        {scenario.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium flex-grow border-l-2 border-slate-100 pl-4 group-hover:border-brand-primary/30 transition-colors">
                                        {scenario.description}
                                    </p>

                                    <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between group-hover:border-slate-100 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-primary transition-colors"></span>
                                            <span className="text-[10px] text-slate-400 group-hover:text-brand-primary font-black uppercase tracking-[0.2em] transition-colors">
                                                Start Simulation
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-brand-primary/30">
                                            <i className="fas fa-play text-xs ml-0.5"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Placeholder */}
                        <div
                            onClick={() => navigate('/library')}
                            className="group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-3 border-dashed border-slate-200 hover:border-brand-primary hover:bg-brand-primary/[0.02] transition-all min-h-[360px] cursor-pointer"
                        >
                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-brand-primary group-hover:bg-white group-hover:shadow-xl group-hover:shadow-brand-primary/10 transition-all duration-500 mb-6 group-hover:scale-110">
                                <i className="fas fa-plus text-3xl"></i>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-primary transition-colors">Add Scenario</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Landing;
