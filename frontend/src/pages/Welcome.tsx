
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] py-12 md:py-24">
      {/* Background Pattern - Dot Matrix */}
      <div className="absolute inset-0 z-0 opacity-[0.4]" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-br from-brand-primary/20 to-purple-500/10 rounded-full blur-[120px] animate-float opacity-60"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-gradient-to-tr from-brand-secondary/20 to-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Floating Elements (Decorative) */}
      <div className="absolute top-20 right-[15%] w-16 h-16 bg-white rounded-2xl shadow-xl shadow-brand-primary/10 flex items-center justify-center animate-bounce duration-[3000ms] hidden lg:flex">
        <i className="fas fa-comment-dots text-2xl text-brand-primary"></i>
      </div>
      <div className="absolute bottom-32 left-[15%] w-12 h-12 bg-white rounded-xl shadow-xl shadow-brand-secondary/10 flex items-center justify-center animate-bounce duration-[4000ms] hidden lg:flex">
        <i className="fas fa-heart text-xl text-brand-secondary"></i>
      </div>

      {/* Top Corner animated link */}
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-50">
        <button
          onClick={() => navigate('/about')}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-lg shadow-slate-200/50 hover:bg-white hover:scale-105 transition-all duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <i className="fas fa-question text-sm animate-pulse-slow"></i>
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">How it works</span>
        </button>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
        {/* Main Hero Content */}
        <div className="mb-12 inline-flex relative group cursor-pointer">
          <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-primary/30 transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
            <i className="fas fa-comment-dots text-3xl md:text-4xl text-white drop-shadow-md"></i>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 md:mb-8 leading-[0.9]">
          Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Verse</span>
          <span className="text-brand-primary text-xl md:text-2xl align-top ml-2">●</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 font-medium mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed">
          The <span className="font-bold text-slate-800">psychologically safe space</span> to practice social intelligence through realistic, AI-driven simulations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-lg mx-auto mb-16 md:mb-24">
          {/* Start Practice Button */}
          <button
            onClick={() => navigate('/signup')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3 text-lg font-bold">
              Start Practice
              <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>

          {/* Sign In Button - Upfront & Distinct */}
          <button
            onClick={() => navigate('/login')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-white px-8 py-4 text-slate-900 border-2 border-slate-900 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-brand-primary/10 active:scale-[0.98]"
          >
            <span className="relative flex items-center justify-center gap-3 text-lg font-black">
              Sign In
              <i className="fas fa-sign-in-alt text-base text-slate-900 group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>
        </div>

        {/* Feature Cards - Figma Aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'fa-user-shield',
              title: 'Safe Haven',
              desc: 'Practice in a completely risk-free environment where you can fail and learn without judgment.',
              color: 'text-blue-500',
              bg: 'bg-blue-500/10'
            },
            {
              icon: 'fa-microchip',
              title: 'Neural Engine',
              desc: 'Our AI adapts to your specific personality style, pain points, and social goals in real-time.',
              color: 'text-purple-500',
              bg: 'bg-purple-500/10'
            },
            {
              icon: 'fa-chart-line',
              title: 'Real Growth',
              desc: 'Track your progress with detailed analytics and transfer your skills to the real world.',
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10'
            }
          ].map((item, idx) => (
            <div key={idx} className="group relative bg-white/60 backdrop-blur-md border border-white/40 p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 hover:-translate-y-2 hover:bg-white/80 transition-all duration-300 text-left overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} rounded-bl-[100px] -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform`}></div>

              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm relative z-10 group-hover:rotate-6 transition-transform`}>
                <i className={`fas ${item.icon}`}></i>
              </div>

              <h4 className="text-xl font-bold text-slate-800 mb-3 relative z-10">{item.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm font-medium relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 text-center space-y-2 pb-4">
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-slate-300"></span>
          Neural Simulation Engine
          <span className="w-8 h-px bg-slate-300"></span>
        </p>
        <p className="text-[9px] font-bold text-slate-300 hover:text-slate-400 transition-colors uppercase tracking-widest cursor-default">
          Designed by Md. Tanzamul Azad
        </p>
      </div>
    </div>
  );
};

export default Welcome;
