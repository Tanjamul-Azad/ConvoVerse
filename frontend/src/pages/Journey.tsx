import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface JourneyProps {
    profile?: UserProfile;
}

const Journey: React.FC<JourneyProps> = ({ profile }) => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('convoverse_reflections');
        if (saved) {
            setHistory(JSON.parse(saved).reverse()); // Newest first
        }
    }, []);

    // Mock milestones if history is empty for demo purposes
    const milestones = [
        { title: "First Step", desc: "Started with 1-on-1 conversations", status: "completed", date: "Jan 10" },
        { title: "Building Confidence", desc: "Practiced with peer agents", status: "current", date: "Today" },
        { title: "Group Dynamics", desc: "Initiating conversation in small groups", status: "locked", date: "Future" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none"></div>

            <div className="max-w-2xl mx-auto px-6 py-12 relative z-10">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Your Journey</h1>
                        <p className="text-slate-500 font-medium text-sm">Every interaction builds your path.</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </header>

                <div className="relative pl-8 space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                    {milestones.map((milestone, idx) => (
                        <div key={idx} className={`relative animate-in slide-in-from-bottom-4 duration-700`} style={{ animationDelay: `${idx * 150}ms` }}>
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 shadow-sm z-10
                        ${milestone.status === 'completed' ? 'bg-brand-primary' :
                                    milestone.status === 'current' ? 'bg-brand-accent animate-pulse' : 'bg-slate-200'}
                    `}></div>

                            <div className={`glass-card p-6 border transition-all hover:scale-[1.02] duration-300
                         ${milestone.status === 'current' ? 'border-brand-primary/30 ring-4 ring-brand-primary/5 shadow-xl' : 'border-slate-100'}
                         ${milestone.status === 'locked' ? 'opacity-60 grayscale' : ''}
                    `}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-900 text-lg">{milestone.title}</h3>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{milestone.date}</span>
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed">{milestone.desc}</p>

                                {milestone.status === 'completed' && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-primary">
                                        <i className="fas fa-check-circle"></i> Completed
                                    </div>
                                )}
                                {milestone.status === 'current' && (
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-lg shadow-lg shadow-brand-primary/20">
                                        <i className="fas fa-play"></i> In Progress
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Journey;
