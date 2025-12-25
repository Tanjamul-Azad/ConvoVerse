
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, UserArchetype } from '../types';
import { QUIZ_QUESTIONS } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [quizResults, setQuizResults] = useState<UserArchetype[]>([]);
  const [interests] = useState<string[]>([]);
  const [socialGoal] = useState('');

  const navigate = useNavigate();

  const handleQuizAnswer = (type: UserArchetype) => {
    const newResults = [...quizResults, type];
    setQuizResults(newResults);
    if (step < QUIZ_QUESTIONS.length + 1) {
      setStep(step + 1);
    } else {
      finalizeProfile(newResults);
    }
  };

  const finalizeProfile = (results: UserArchetype[]) => {
    const counts: Record<string, number> = {};
    results.forEach(r => counts[r] = (counts[r] || 0) + 1);
    const archetype = (Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)) as UserArchetype;

    const profile: UserProfile = {
      name: name || 'Explorer',
      archetype,
      interests: interests.length ? interests : ['General'],
      painPoints: [],
      socialGoal: socialGoal || 'Social Ease'
    };

    onComplete(profile);
    navigate('/');
  };

  const currentQuestionIndex = step - 2;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fafafa] relative overflow-hidden">
      {/* Consistent Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.3]" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-brand-secondary/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      {/* Main Card */}
      <div className="max-w-2xl w-full relative z-10">
        <div className="glass-card p-1 md:p-1.5 backdrop-blur-2xl bg-white/80 border border-white/60 shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
          <div className="bg-white/50 rounded-[2rem] p-8 md:p-12 h-full min-h-[500px] flex flex-col justify-center relative overflow-hidden">

            {/* Step 1: Identity */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-brand-primary/20 rotate-3 transform hover:rotate-6 transition-transform">
                  <i className="fas fa-fingerprint text-3xl"></i>
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Identity First</h1>
                <p className="text-lg text-slate-500 mb-10 max-w-sm leading-relaxed">Let's personalize your simulation engine. How should we address you?</p>

                <div className="w-full max-w-sm space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <i className="fas fa-user text-slate-300 group-focus-within:text-brand-primary transition-colors"></i>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your name..."
                      value={name}
                      autoFocus
                      onChange={(e) => setName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
                      className="w-full pl-11 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all text-lg font-bold text-slate-800 placeholder:text-slate-300 shadow-sm"
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!name.trim()}
                    className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 py-5 text-white shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    <div className="relative flex items-center justify-center gap-2 font-bold tracking-wide">
                      Begin Calibration
                      <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Steps */}
            {step > 1 && step <= QUIZ_QUESTIONS.length + 1 && (
              <div className="max-w-xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-500">
                {/* Header with Progress */}
                <div className="flex justify-between items-center mb-10">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-slate-400 hover:text-slate-800 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors py-2"
                  >
                    <i className="fas fa-arrow-left"></i> Back
                  </button>
                  <div className="text-[10px] grid text-right">
                    <span className="font-black text-brand-primary uppercase tracking-widest mb-1">Calibration</span>
                    <span className="text-slate-400 font-bold">{step - 1} / {QUIZ_QUESTIONS.length}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-12 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-700 ease-out"
                    style={{ width: `${((step - 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>

                <div className="mb-10">
                  <span className="text-brand-primary font-black text-xs uppercase tracking-[0.2em] mb-3 block">Scenario {step - 1}</span>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">
                    {QUIZ_QUESTIONS[currentQuestionIndex].text}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(opt.type as UserArchetype)}
                      className="group relative w-full text-left p-6 bg-white border border-slate-200 rounded-2xl hover:border-brand-primary/50 hover:bg-brand-primary/[0.02] transition-all hover:shadow-lg hover:shadow-brand-primary/5 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-brand-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-slate-700 font-semibold group-hover:text-slate-900 transition-colors text-lg">{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
