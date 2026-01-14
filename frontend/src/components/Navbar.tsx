import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const location = useLocation();

    // Don't show navbar on Onboarding or Welcome if needed, currently showing on all internal pages
    if (['/', '/onboarding'].includes(location.pathname) && !localStorage.getItem('convoverse_profile')) {
        return null;
    }

    const navItems = [
        { path: '/', label: 'Practice', icon: 'fas fa-brain' },
        { path: '/journey', label: 'Journey', icon: 'fas fa-map-marked-alt' },
        { path: '/profile', label: 'Profile', icon: 'fas fa-user-astronaut' },
        { path: '/about', label: 'System', icon: 'fas fa-info-circle' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-auto">
            <nav className="glass-card px-2 py-2 rounded-full flex items-center gap-1 shadow-2xl border border-white/50 bg-white/80 backdrop-blur-xl">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            relative px-6 py-3 rounded-full flex flex-col items-center gap-1 transition-all duration-300 group
                            ${isActive
                                ? 'text-brand-primary bg-brand-primary/10 shadow-inner'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
                        `}
                    >
                        <i className={`${item.icon} text-lg mb-0.5 transition-transform group-hover:scale-110 group-active:scale-95`}></i>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 text-white px-2 py-1 rounded transition-all pointer-events-none whitespace-nowrap">
                            {item.label}
                        </span>
                        {/* Active Indicator Dot */}
                        <NavLink to={item.path} className={({ isActive }) => isActive ? "absolute bottom-1 w-1 h-1 bg-brand-primary rounded-full" : "hidden"} />
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Navbar;
