
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Message, UserProfile } from '../types';
import { getReflectionQuestions } from '../services/conversationService';
import { AGENTS } from '../constants';

interface ReflectionProps {
  profile: UserProfile;
}

const Reflection: React.FC<ReflectionProps> = ({ profile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const messages = (location.state?.messages as Message[]) || [];

  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const q = await getReflectionQuestions(messages);
        setQuestions(q);
        setAnswers(new Array(q.length).fill(''));
      } catch (error) {
        console.error("Failed to fetch reflection questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [messages]);

  const handleFinish = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden relative">
        <div className="absolute inset-0 bg-brand-primary/5 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-brand-primary rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synthesizing Insights...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 overflow-hidden">
        <div className="max-w-md w-full glass-card p-12 text-center animate-in zoom-in duration-500 border-none shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <i className="fas fa-check-circle text-4xl"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Growth Locked In</h2>
          <p className="text-slate-500 leading-relaxed mb-8 font-medium">
            Your reflection has been synthesized. Every session builds a deeper understanding of your social self.
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-widest animate-pulse">
            Returning to Command Center
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-20 px-6">
      <header className="max-w-3xl mx-auto mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <img src={AGENTS.dr_aris.avatarUrl} className="w-24 h-24 rounded-3xl border-4 border-white shadow-2xl" alt="Lead Facilitator" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center text-white text-xs border-2 border-white">
              <i className="fas fa-brain"></i>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Reflective Analysis</h1>
        <p className="text-slate-500 font-medium">Processing the nuances of your last interaction, {profile.name}.</p>
      </header>

      <div className="max-w-x-3xl mx-auto space-y-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {questions.map((q, idx) => (
            <div key={idx} className="glass-card p-10 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="flex items-start gap-5 mb-8">
                <span className="bg-brand-primary text-white w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black shadow-lg shadow-brand-primary/20">{idx + 1}</span>
                <h3 className="text-xl font-black text-slate-800 leading-tight pt-1">
                  {q}
                </h3>
              </div>
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-700 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all min-h-[160px] font-medium placeholder:text-slate-300"
                placeholder="Unpack your experience here..."
                value={answers[idx]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[idx] = e.target.value;
                  setAnswers(newAnswers);
                }}
              />
            </div>
          ))}

          <div className="flex justify-center pt-8">
            <button
              onClick={handleFinish}
              className="btn-primary"
            >
              Commit to Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflection;
