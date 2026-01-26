
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilitySettings: React.FC = () => {
    const navigate = useNavigate();
    const {
        textSize, reducedMotion, highContrast, calmPalette,
        toggleTextSize, toggleReducedMotion, toggleHighContrast, toggleCalmPalette, resetSettings
    } = useAccessibility();

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-20 px-6 relative overflow-hidden">
            {/* Background Pattern (Calm) */}
            <div className="absolute inset-0 z-0 opacity-[0.3] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '32px 32px'
            }}></div>

            <div className="max-w-xl w-full relative z-10 space-y-8">
                <div className="flex items-center gap-5 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                    <button onClick={() => navigate(-1)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-brand-primary transition-all">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support & Comfort</h1>
                        <p className="text-slate-500 font-medium">Adjust the environment to suit your needs.</p>
                    </div>
                </div>

                <div className="glass-card p-6 md:p-10 space-y-10 shadow-xl border border-white/60">

                    {/* Visual Comfort Section */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <i className="fas fa-eye text-brand-primary"></i> Visual Comfort
                        </h2>

                        {/* Text Size */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-lg">
                                    <i className="fas fa-text-height"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Text Size</h3>
                                    <p className="text-xs text-slate-400 font-medium">Current: {textSize === 'normal' ? 'Regular' : textSize === 'large' ? 'Large' : 'Extra Large'}</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTextSize}
                                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:border-brand-primary hover:text-brand-primary transition-all shadow-sm"
                            >
                                Adjust
                            </button>
                        </div>

                        {/* High Contrast */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-lg">
                                    <i className="fas fa-adjust"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">High Contrast</h3>
                                    <p className="text-xs text-slate-400 font-medium">Increases distinction between elements.</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleHighContrast}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${highContrast ? 'bg-brand-primary' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${highContrast ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {/* Calm Palette */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center text-lg">
                                    <i className="fas fa-palette"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Calm Palette</h3>
                                    <p className="text-xs text-slate-400 font-medium">Softens colors and reduces stimulation.</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleCalmPalette}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${calmPalette ? 'bg-teal-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${calmPalette ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </section>

                    {/* Cognitive Ease Section */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <i className="fas fa-brain text-brand-secondary"></i> Cognitive Ease
                        </h2>

                        {/* Reduced Motion */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-lg">
                                    <i className="fas fa-wind"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">Reduced Motion</h3>
                                    <p className="text-xs text-slate-400 font-medium">Minimizes animations and transitions.</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleReducedMotion}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${reducedMotion ? 'bg-purple-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${reducedMotion ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </section>

                    <button
                        onClick={resetSettings}
                        className="w-full py-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest border-t border-slate-100 mt-4"
                    >
                        <i className="fas fa-undo mr-2"></i> Reset to Default
                    </button>
                </div>

                <div className="p-6 bg-slate-900 rounded-[2rem] shadow-xl text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <h3 className="text-white font-bold mb-2 relative z-10">Need a break?</h3>
                    <p className="text-slate-400 text-sm mb-4 relative z-10">You can exit any simulation anytime by clicking "End Session".</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform relative z-10">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettings;
