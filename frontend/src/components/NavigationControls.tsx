
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationControls: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex gap-3">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:scale-110 hover:shadow-xl transition-all duration-300 group active:scale-95"
                title="Go Back"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform opacity-70 group-hover:opacity-100">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={() => navigate(1)}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 hover:scale-110 hover:shadow-xl transition-all duration-300 group active:scale-95"
                title="Go Forward"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform opacity-70 group-hover:opacity-100">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                </svg>
            </button>
            <button
                onClick={() => navigate('/settings')}
                className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-xl border border-white/60 rounded-full shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-600 hover:bg-white hover:text-brand-primary hover:scale-110 hover:shadow-xl transition-all duration-300 group active:scale-95"
                title="Accessibility & Settings"
            >
                <i className="fas fa-cog text-lg transition-transform group-hover:rotate-90"></i>
            </button>
        </div>
    );
};

export default NavigationControls;
