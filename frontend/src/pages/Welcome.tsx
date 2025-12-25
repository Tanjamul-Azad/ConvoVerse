
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
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

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full">
        {/* Main Hero Content */}
        <div className="mb-12 inline-flex relative group cursor-pointer">
          <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-primary/30 transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300">
            <i className="fas fa-comment-dots text-4xl text-white drop-shadow-md"></i>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight mb-8 leading-[0.9]">
          Convo<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Verse</span>
          <span className="text-brand-primary text-2xl align-top ml-2">●</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 font-medium mb-14 max-w-2xl mx-auto leading-relaxed">
          The <span className="font-bold text-slate-800">psychologically safe space</span> to practice social intelligence through realistic, AI-driven simulations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md mx-auto mb-24">
          <button
            onClick={() => navigate('/onboarding')}
            className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3 text-lg font-bold">
              Start Practice
              <i className="fas fa-arrow-right text-sm"></i>
            </span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-lg"
          >
            How it works
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

      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-300 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-slate-300"></span>
          Neural Simulation Engine v2.0
          <span className="w-8 h-px bg-slate-300"></span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
