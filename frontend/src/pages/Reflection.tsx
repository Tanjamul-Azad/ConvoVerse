import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Message, UserProfile } from '../types';

interface ReflectionProps {
  profile: UserProfile;
}

const EMOTION_SCALE = [
  { value: 1, emoji: '😟', label: 'Anxious' },
  { value: 2, emoji: '😐', label: 'Neutral' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😊', label: 'Confident' },
];

const REFLECTION_PROMPTS = [
  "What felt difficult during this session?",
  "What went better than expected?",
  "Would you try used strategies in real life?"
];

const Reflection: React.FC<ReflectionProps> = ({ profile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _messages = (location.state?.messages as Message[]) || []; // Keep for potential analysis

  const [step, setStep] = useState<'emotion' | 'questions' | 'done'>('emotion');
  const [sentiment, setSentiment] = useState<number | null>(null);
  const [answers, setAnswers] = useState<string[]>(new Array(REFLECTION_PROMPTS.length).fill(''));
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Auto-advance after sentiment selection
  const handleSentimentSelect = (value: number) => {
    setSentiment(value);
    setTimeout(() => {
      setStep('questions');
    }, 400);
  };

  const handleFinish = () => {
    setIsSynthesizing(true);
    // Simulate saving reflection data
    const reflectionData = {
      date: new Date().toISOString(),
      sentiment,
      answers,
      scenario: location.state?.scenario
    };

    const saved = localStorage.getItem('convoverse_reflections');
    const existing = saved ? JSON.parse(saved) : [];
    localStorage.setItem('convoverse_reflections', JSON.stringify([...existing, reflectionData]));

    setTimeout(() => {
      setIsSynthesizing(false);
      setStep('done');
      // Auto redirect after showing "Done" state for a moment
      setTimeout(() => navigate('/journey'), 3000);
    }, 2000);
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary animate-shine" />

        <div className="max-w-md w-full glass-card p-12 text-center animate-in zoom-in duration-500 border-none shadow-2xl relative z-10">
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-in slide-in-from-bottom-4 duration-700">
            <i className="fas fa-check text-4xl"></i>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Growth Captured</h2>
          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            Your insights have been added to your confidential journey log.
          </p>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <i className="fas fa-bolt text-amber-400"></i>
              Real-World Validation
            </h4>
            <p className="text-sm font-medium text-slate-700 italic">
              "If this happens in real life, a small step could be: Smile + say one sentence."
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
            Proceeding to Journey Map...
          </div>
        </div>
      </div>
    );
  }

  if (isSynthesizing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin mb-8"></div>
        <h2 className="text-xl font-bold text-slate-800 animate-pulse">Synthesizing your insights...</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center py-10 px-6 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-[50vh] h-[50vh] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20"></div>

      <header className="max-w-xl w-full text-center mb-10 relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Reflection Panel</h1>
        <p className="text-slate-500 font-medium">Pause. Breath. How did that feel?</p>
      </header>

      <div className="max-w-xl w-full relative z-10">
        {step === 'emotion' && (
          <div className="glass-card p-10 animate-in fade-in zoom-in duration-500">
            <h3 className="text-lg font-bold text-slate-800 mb-8 text-center">Rate your comfort level</h3>
            <div className="flex justify-between items-center gap-2">
              {EMOTION_SCALE.map((item, idx) => (
                <button
                  key={item.value}
                  onClick={() => handleSentimentSelect(item.value)}
                  className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="text-5xl filter grayscale group-hover:grayscale-0 transition-all transform group-hover:-translate-y-2 duration-300 drop-shadow-sm">{item.emoji}</span>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-brand-primary uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'questions' && (
          <div className="space-y-6">
            {REFLECTION_PROMPTS.map((prompt, idx) => (
              <div
                key={idx}
                className="glass-card p-6 animate-in slide-in-from-bottom-8 duration-700 fill-mode-forwards opacity-0"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <h3 className="text-sm font-bold text-slate-700 mb-3">{prompt}</h3>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all min-h-[100px] text-sm font-medium resize-none"
                  placeholder="Type a few words..."
                  value={answers[idx]}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[idx] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                />
              </div>
            ))}

            <div className="flex justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-forwards opacity-0">
              <button
                onClick={handleFinish}
                className="btn-primary"
              >
                Complete Reflection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;
