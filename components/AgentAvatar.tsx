
import React from 'react';
import { Agent, Emotion } from '../types';

interface AgentAvatarProps {
  agent: Agent;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isSpeaking?: boolean;
  emotion?: Emotion;
  isInactive?: boolean;
}

const emotionColors: Record<Emotion, string> = {
  neutral: 'ring-transparent',
  encouraging: 'ring-emerald-400 shadow-emerald-100',
  thoughtful: 'ring-amber-400 shadow-amber-100',
  challenging: 'ring-indigo-400 shadow-indigo-100',
  friendly: 'ring-blue-400 shadow-blue-100',
  supportive: 'ring-brand-primary shadow-brand-primary/10'
};

const emotionIcons: Record<Emotion, string> = {
  neutral: '',
  encouraging: 'fa-sparkles',
  thoughtful: 'fa-brain-circuit',
  challenging: 'fa-shield-halved',
  friendly: 'fa-face-smile-beam',
  supportive: 'fa-hand-heart'
};

const AgentAvatar: React.FC<AgentAvatarProps> = ({ agent, size = 'md', isSpeaking, emotion = 'neutral', isInactive }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const ringColor = isSpeaking ? 'ring-brand-primary shadow-brand-primary/20' : emotionColors[emotion];
  const iconClass = emotionIcons[emotion];

  return (
    <div className={`relative group cursor-help transition-all duration-500 ${isInactive ? 'opacity-40 grayscale-[0.2] scale-95' : 'opacity-100'}`}>
      {/* Speaking Glow Effect */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping -z-10 scale-125"></div>
      )}

      <div className={`
        ${sizeClasses[size]} 
        rounded-3xl p-0.5 
        ring-2 ${ringColor}
        ${isSpeaking ? 'ring-4 ring-offset-2 animate-pulse scale-105 shadow-xl' : 'ring-offset-0'}
        transition-all duration-500 ease-out relative z-0 bg-white
      `}>
        <img
          src={agent.avatarUrl}
          alt={agent.name}
          className="w-full h-full rounded-[1.25rem] object-cover shadow-sm border border-slate-100"
        />
      </div>

      {/* Role Indicator */}
      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${agent.color} shadow-sm transition-transform duration-300 ${isSpeaking ? 'scale-125' : 'scale-100'}`}></div>

      {/* Emotion Badge */}
      {emotion !== 'neutral' && (
        <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-lg bg-white shadow-xl flex items-center justify-center border border-slate-100 animate-in zoom-in duration-300`}>
          <i className={`fas ${iconClass} text-[8px] text-brand-primary`}></i>
        </div>
      )}

      {/* Premium Tooltip */}
      <div className="absolute z-[100] hidden group-hover:block w-48 p-4 bg-slate-900/95 backdrop-blur-xl text-white text-[11px] rounded-2xl shadow-2xl -top-2 left-full ml-4 animate-in fade-in slide-in-from-left-2 duration-300">
        <div className="flex items-center justify-between mb-2">
          <p className="font-black text-xs uppercase tracking-widest">{agent.name}</p>
          {isSpeaking && <span className="text-[8px] bg-brand-primary px-1.5 py-0.5 rounded-md animate-pulse font-black uppercase tracking-widest">Active</span>}
        </div>
        <p className="opacity-50 font-black uppercase tracking-[0.2em] text-[9px] mb-3">{agent.role === 'facilitator' ? 'Facilitator' : 'Peer Agent'}</p>
        <p className="leading-relaxed border-t border-white/5 pt-3 font-medium opacity-80">{agent.personality}</p>
        {emotion !== 'neutral' && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-brand-accent">
            <i className={`fas ${iconClass} text-[10px]`}></i>
            <span className="capitalize font-black uppercase tracking-widest text-[9px]">Internal State: {emotion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentAvatar;
