
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarLayoutProps {
    title: string;
    description?: string;
    sidebar: ReactNode;
    children: ReactNode;
    actions?: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ title, description, sidebar, children, actions }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#fafafa] flex">
            {/* Sidebar */}
            <aside className="w-80 h-screen sticky top-0 bg-white border-r border-slate-200 overflow-y-auto hidden lg:flex flex-col shrink-0 z-40">
                <div className="p-8">
                    {/* Brand Logo - Clickable to Home */}
                    <div
                        className="flex items-center gap-3 mb-10 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="relative w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-all duration-300">
                            <i className="fas fa-comment-dots text-xs"></i>
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                            Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Verse</span>
                        </span>
                    </div>

                    {/* Sidebar Content (Filters etc) */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                        {sidebar}
                    </div>
                </div>

                {/* Optional Footer in Sidebar */}
                <div className="mt-auto p-8 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Smart Filters Active
                    </p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden">
                {/* Header for Mobile/Tablet or Integrated Header */}
                <header className="px-6 py-6 md:px-12 md:py-10 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            {/* Mobile Menu Trigger (Visual only for now, would need state) */}
                            <div className="lg:hidden mb-4 flex items-center gap-2 text-slate-500 font-bold" onClick={() => navigate('/')}>
                                <i className="fas fa-arrow-left"></i> Back
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-slate-500 font-medium max-w-2xl text-lg">
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {actions}
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default SidebarLayout;
