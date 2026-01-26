
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface JourneyProps {
    profile?: UserProfile;
}

const Journey: React.FC<JourneyProps> = ({ profile }) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('convoverse_reflections');
        if (saved) {
            setHistory(JSON.parse(saved).reverse()); // Newest first
        }
    }, []);

    // Derived Stats
    const totalSessions = history.length;
    const scenariosExplored = Array.from(new Set(history.map(h => h.scenario?.title))).filter(Boolean).length;

    // Comfort Trend (Reverse ordered for display but computed from chronological)
    // We take the last 7 sessions from the original chronological order (which is reversed of 'history')
    // history is [Newest, ..., Oldest]
    // chronological is [Oldest, ..., Newest]
    const chronologicalHistory = [...history].reverse();
    const recentHistory = chronologicalHistory.slice(-7);
    const comfortTrend = recentHistory.map(h => h.sentiment || 2);

    // Mock Milestones derived from simple activity counts
    const milestones = [
        { title: "First Step", desc: "You practiced your first scenario.", completed: totalSessions >= 1, icon: "fa-seedling" },
        { title: "Consistency", desc: "You showed up for 3 practice sessions.", completed: totalSessions >= 3, icon: "fa-tree" },
        { title: "Explorer", desc: "You explored 3 different types of scenarios.", completed: scenariosExplored >= 3, icon: "fa-compass" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
            {/* Ambient Background Lights */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-500/5 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-teal-500/5 rounded-full blur-[100px] animate-float-delayed"></div>
            </div>

            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
                <header className="mb-12 flex items-center justify-between animate-fade-in">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Progress & Analytics</h1>
                        <p className="text-slate-500 font-medium text-sm">Your private growth tracking, visible only to you.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-md transition-all active:scale-95"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Comfort Indicators */}
                    <div className="glass-card p-8 bg-white/60 backdrop-blur-xl border border-white/60 shadow-xl shadow-indigo-500/5 rounded-[2.5rem] animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                            <i className="fas fa-chart-bar text-brand-primary"></i> Comfort Trend
                        </h2>

                        <div className="flex items-end justify-between h-40 gap-4 px-2">
                            {comfortTrend.length > 0 ? comfortTrend.map((level: number, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative" title={`Session ${i + 1}: Level ${level}`}>
                                    <div className="w-full bg-slate-100/50 rounded-t-2xl h-full absolute bottom-0 left-0 -z-10"></div>
                                    <div
                                        className="w-full rounded-t-2xl relative transition-all duration-700 bg-gradient-to-t from-brand-primary to-brand-secondary/80 group-hover:from-brand-secondary group-hover:to-brand-primary shadow-lg shadow-brand-primary/20 min-h-[10px]"
                                        style={{ height: `${(level / 4) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded-lg text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl z-20">
                                            {level === 1 ? 'Anxious' : level === 2 ? 'Neutral' : level === 3 ? 'Good' : 'Confident'}
                                            <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center text-sm text-slate-400 font-medium italic">
                                    No data yet. Complete a session to see your trend.
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-6 px-2">
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Last 7 Sessions</p>
                            <p className="text-[10px] text-brand-primary font-bold tracking-widest uppercase">Latest <i className="fas fa-chevron-right ml-1"></i></p>
                        </div>
                    </div>

                    {/* Activity Stats */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="glass-card p-8 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] flex items-center gap-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-3xl shadow-inner rotate-3 hover:rotate-6 transition-transform">
                                <i className="fas fa-history"></i>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 mb-1">{totalSessions}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Sessions</p>
                            </div>
                        </div>

                        <div className="glass-card p-8 bg-white/80 backdrop-blur-md border border-white/60 rounded-[2.5rem] flex items-center gap-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-3xl shadow-inner -rotate-3 hover:-rotate-6 transition-transform">
                                <i className="fas fa-map-signs"></i>
                            </div>
                            <div>
                                <h3 className="text-5xl font-black text-slate-900 mb-1">{scenariosExplored}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Scenarios</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Milestones */}
                <section className="mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center"><i className="fas fa-flag"></i></span>
                        Milestones
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {milestones.map((m, idx) => (
                            <div key={idx} className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group ${m.completed
                                ? 'bg-white border-brand-primary/20 shadow-xl shadow-brand-primary/5'
                                : 'bg-slate-50/50 border-slate-100 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                                }`}>
                                {m.completed && <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent rounded-bl-[100px] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>}

                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-xl transition-transform group-hover:scale-110 duration-300 ${m.completed
                                    ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg'
                                    : 'bg-slate-200 text-slate-400'
                                    }`}>
                                    <i className={`fas ${m.icon}`}></i>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
                                {m.completed && (
                                    <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-1.5">
                                        <div className="w-4 h-4 rounded-full bg-brand-primary text-white flex items-center justify-center text-[8px]"><i className="fas fa-check"></i></div>
                                        Unlocked
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Session History & Reflections */}
                <section className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                    <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-500 flex items-center justify-center"><i className="fas fa-book-open"></i></span>
                        History & Reflections
                    </h2>

                    <div className="space-y-6">
                        {history.length > 0 ? history.map((session, idx) => (
                            <div key={idx} className="glass-card p-8 bg-white/90 border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1 group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100 md:border-none md:pb-0">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                            <i className="fas fa-comment-alt"></i>
                                        </div>
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">
                                                {new Date(session.date).toLocaleDateString()}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900">{session.scenario?.title || 'Unknown Scenario'}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comfort</span>
                                        <span className="text-3xl filter drop-shadow-sm group-hover:scale-125 transition-transform">{session.sentiment === 1 ? '😟' : session.sentiment === 2 ? '😐' : session.sentiment === 3 ? '🙂' : '😊'}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {session.answers && session.answers.map((answer: string, aIdx: number) => (
                                        <div key={aIdx} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                {aIdx === 0 ? <><i className="fas fa-bolt text-amber-400"></i> Challenges</> :
                                                    aIdx === 1 ? <><i className="fas fa-magic text-purple-400"></i> Improvements</> :
                                                        <><i className="fas fa-ghost text-slate-400"></i> Unsaid</>}
                                            </p>
                                            <p className="text-sm text-slate-700 font-medium italic leading-relaxed">"{answer || 'No answer provided'}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="p-16 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-3xl">
                                    <i className="fas fa-pencil-alt"></i>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2">No History Yet</h3>
                                <p className="text-slate-400 font-medium">Complete a simulation to start tracking your journey.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Journey;
