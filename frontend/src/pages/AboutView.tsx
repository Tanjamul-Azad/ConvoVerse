
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20"></div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="relative">
                            <div className="relative w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                                <i className="fas fa-comment-dots text-lg"></i>
                            </div>
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Verse</span></span>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                    >
                        Start Mission
                    </button>
                </div>
            </nav>


            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
                <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-block px-6 py-2 bg-white/50 backdrop-blur-md text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-brand-primary/20 shadow-sm hover:scale-105 transition-transform cursor-default">
                        Project Research Goal
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                        An LLM-Based Multi-Agent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary animate-gradient-x">Social Practice System</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                        Supporting introverted learners in developing confidence through <span className="text-slate-800 font-bold border-b-2 border-brand-primary/20">safe, low-pressure</span> simulated environments.
                    </p>
                </div>

                <div className="grid gap-10">
                    {/* Core Idea */}
                    <section className="group glass-card p-12 rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-slate-200/50 hover:shadow-brand-primary/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-brand-primary/10 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-brand-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 transform group-hover:rotate-12 transition-transform duration-500">
                                    <i className="fas fa-lightbulb"></i>
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Core Idea</h2>
                            </div>
                            <p className="text-slate-600 leading-loose text-xl font-medium max-w-4xl">
                                ConvoVerse simulates realistic social interaction scenarios using multiple AI agents, each representing a social role such as a peer, group member, or facilitator.
                                Instead of replacing human interaction, the system prepares learners for it by providing a <strong className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">psychologically safe sandbox</strong> to practice self-expression.
                            </p>
                        </div>
                    </section>

                    {/* Problem Statement */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="group bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-amber-200/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                The Problem
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex gap-5 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mt-1"><i className="fas fa-times"></i></span>
                                    <span className="text-slate-600 font-medium text-lg leading-snug">Fear of speaking in groups or classrooms due to anxiety.</span>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mt-1"><i className="fas fa-times"></i></span>
                                    <span className="text-slate-600 font-medium text-lg leading-snug">Social withdrawal despite having strong academic abilities.</span>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs mt-1"><i className="fas fa-times"></i></span>
                                    <span className="text-slate-600 font-medium text-lg leading-snug">Educational platforms overlook emotional comfort and social readiness.</span>
                                </li>
                            </ul>
                        </section>

                        <section className="group bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 hover:shadow-brand-primary/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-brand-primary/20 transition-colors duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-secondary/10 rounded-full blur-[60px] -ml-10 -mb-10 group-hover:bg-brand-secondary/20 transition-colors duration-500"></div>

                            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center text-lg backdrop-blur-sm">
                                    <i className="fas fa-bullseye"></i>
                                </div>
                                Expected Impact
                            </h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] text-white mt-1 shadow-lg shadow-brand-primary/40">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <span className="text-slate-300 font-medium text-lg leading-snug">Increased confidence in discussions and group activities.</span>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] text-white mt-1 shadow-lg shadow-brand-primary/40">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <span className="text-slate-300 font-medium text-lg leading-snug">Better inclusion of quiet but capable learners.</span>
                                </li>
                                <li className="flex gap-5 items-start">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-[10px] text-white mt-1 shadow-lg shadow-brand-primary/40">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <span className="text-slate-300 font-medium text-lg leading-snug">A replicable HCI model for AI-supported social practice.</span>
                                </li>
                            </ul>
                        </section>
                    </div>

                    {/* Key Features */}
                    <section className="mb-20 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">System Architecture</h2>
                            <p className="text-slate-500 font-medium text-lg">Built on core HCI principles for maximum effectiveness.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: 'fa-users', title: 'Multi-Agent Simulation', desc: 'AI agents model peer dynamics and group roles.', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { icon: 'fa-shoe-prints', title: 'Gradual Participation', desc: 'Progress from 1-on-1 to small-group discussions.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { icon: 'fa-shield-heart', title: 'Safe Environment', desc: 'No public exposure or forced participation.', color: 'text-rose-500', bg: 'bg-rose-50' },
                                { icon: 'fa-sliders', title: 'Adaptive Flow', desc: 'Conversation complexity adjusts to user comfort.', color: 'text-amber-500', bg: 'bg-amber-50' },
                                { icon: 'fa-comments', title: 'Supportive Feedback', desc: 'Reflective, non-evaluative feedback after interactions.', color: 'text-purple-500', bg: 'bg-purple-50' },
                                { icon: 'fa-brain', title: 'HCI-Focused Design', desc: 'Emphasis on emotional safety and low cognitive load.', color: 'text-cyan-500', bg: 'bg-cyan-50' }
                            ].map((feature, idx) => (
                                <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-brand-primary/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${feature.bg} rounded-bl-[60px] -mr-6 -mt-6 opacity-50 group-hover:scale-125 transition-transform duration-500`}></div>

                                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:rotate-6 transition-transform duration-300`}>
                                        <i className={`fas ${feature.icon}`}></i>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-brand-primary transition-colors">{feature.title}</h4>
                                    <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Creator Credit */}
                <div className="border-t border-slate-200 mt-20 pt-16 text-center opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl mb-2 shadow-inner">
                            <i className="fas fa-code"></i>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Designed & Developed By</p>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Md. Tanzamul Azad</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 ConvoVerse</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
