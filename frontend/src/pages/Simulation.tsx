import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SimulationStage, Message, Scenario, Agent } from '../types';
import { generateAgentResponses } from '../services/conversationService';
import { STAGE_DETAILS } from '../utils/constants';

const MICRO_AFFIRMATIONS = [
  "That was a thoughtful response.",
  "It's okay to take pauses.",
  "You're doing great.",
  "Take your time.",
  "Nice way to precise that.",
  "Breathing is part of the process."
];

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '👏', '🔥', '🤔', '👋', '✨'];

const Simulation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stage, setStage] = useState<SimulationStage>(state?.stage || SimulationStage.ONE_ON_ONE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Safe Mode / HCI States
  const [isPaused, setIsPaused] = useState(false);
  const [showSafeMenu, setShowSafeMenu] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [microAffirmation, setMicroAffirmation] = useState<string | null>(null);

  // New HCI Features
  const [isObserverMode, setIsObserverMode] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    "That's an interesting perspective.",
    "Could you explain that more?",
    "I hadn't thought of it that way."
  ]);

  // Messaging Power-Ups
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaAttachment, setMediaAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scenario = state?.scenario as Scenario;
  const customAgents = state?.customAgents as Agent[];
  const agents = customAgents || (scenario && STAGE_DETAILS[stage] ? STAGE_DETAILS[stage].agents : []);

  useEffect(() => {
    if ((!scenario && !state?.stage) || !agents.length) {
      if (!agents.length && STAGE_DETAILS[stage]) {
        // Fallback
      } else if (!state?.startFree) {
        navigate('/');
        return;
      }
    }

    if (messages.length === 0 && agents.length > 0) {
      const initialAgent = agents[0];
      const greeting = scenario
        ? `Welcome to ${scenario.title}. I'm ${initialAgent.name}. ${scenario.description}`
        : "Hi there! I'm ready to practice. What's on your mind?";

      setMessages([{
        id: '1',
        senderId: initialAgent.id,
        senderName: initialAgent.name,
        text: greeting,
        timestamp: Date.now(),
        isUser: false
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, microAffirmation]);

  // Observer Mode Loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isObserverMode && !isPaused && !isProcessing) {
      // Auto-trigger response if in Observer Mode
      timeoutId = setTimeout(() => {
        handleSend(true); // true = autoTrigger from observer
      }, 3000); // 3s delay between turns
    }
    return () => clearTimeout(timeoutId);
  }, [isObserverMode, isPaused, isProcessing, messages]);


  const handleSend = async (isAutoTrigger = false) => {
    if ((!input.trim() && !mediaAttachment && !isAutoTrigger) || isPaused) return;

    let newMessages = [...messages];

    // Only add user message if NOT in Observer Mode autosend
    if (!isAutoTrigger) {
      let textToSend = input;
      if (mediaAttachment) {
        textToSend = `[Sent Attachment: ${mediaAttachment.name}] ${textToSend}`;
      }

      const userMsg: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        senderName: 'You',
        text: textToSend,
        timestamp: Date.now(),
        isUser: true
      };
      newMessages = [...newMessages, userMsg];
      setMessages(newMessages);
      setInput('');
      setMediaAttachment(null);

      // Random Affirmation
      if (Math.random() > 0.6) {
        const affirmation = MICRO_AFFIRMATIONS[Math.floor(Math.random() * MICRO_AFFIRMATIONS.length)];
        setTimeout(() => setMicroAffirmation(affirmation), 800);
        setTimeout(() => setMicroAffirmation(null), 5000);
      }
    }

    setIsProcessing(true);
    setMicroAffirmation(null);

    try {
      // Pass isObserverMode to service
      // @ts-ignore 
      const responseData = await generateAgentResponses(stage, agents, newMessages, input, scenario, undefined, isObserverMode);

      setTimeout(() => {
        if (isPaused) return;

        const botMessages = responseData.responses.map((r: any) => {
          const agent = agents.find(a => a.id === r.agentId) || agents[0];
          return {
            id: Date.now().toString() + Math.random(),
            senderId: r.agentId,
            senderName: agent.name,
            text: r.text,
            timestamp: Date.now(),
            isUser: false
          };
        });

        setMessages(prev => [...prev, ...botMessages]);

        // Update suggested prompts if available
        if (responseData.suggestedPrompts && responseData.suggestedPrompts.length > 0) {
          setSuggestedPrompts(responseData.suggestedPrompts);
        }

        setIsProcessing(false);
      }, 1500);

    } catch (error) {
      console.error('Error getting response:', error);
      setIsProcessing(false);
    }
  };

  const handleEndSimulation = () => {
    navigate('/reflect', { state: { messages, stage, scenario } });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    setShowSafeMenu(false);
  };

  const toggleObserverMode = () => {
    setIsObserverMode(!isObserverMode);
    setShowSafeMenu(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      if ('webkitSpeechRecognition' in window) {
        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.bg = 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + " " + transcript);
          setIsRecording(false);
        };
        recognition.start();
      } else {
        alert("Voice input not supported in this browser context.");
        setIsRecording(false);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaAttachment(e.target.files[0]);
    }
  };

  const addEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-[#f8f9fc] relative overflow-hidden transition-colors duration-700 ${isPaused ? 'grayscale-[0.5] bg-slate-100' : ''} p-0 lg:p-8`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Decorative Gradients (Desktop Only) */}
      <div className="hidden lg:block absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="hidden lg:block absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20 animate-pulse" style={{ animationDuration: '10s' }}></div>

      {/* Safe Mode Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300 lg:rounded-[2rem]">
          <div className="glass-card p-8 max-w-sm text-center shadow-2xl scale-110 mx-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <i className="fas fa-pause"></i>
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Session Paused</h2>
            <p className="text-slate-500 mb-6 font-medium">Take a breath. The agents are waiting for you.</p>
            <button
              onClick={togglePause}
              className="btn-primary w-full shadow-amber-500/20"
            >
              Resume Session
            </button>
          </div>
        </div>
      )}

      {/* Mobile Participants Drawer */}
      {showParticipants && (
        <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-xl animate-in slide-in-from-right duration-300 lg:hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-800">Active Participants</h2>
            <button onClick={() => setShowParticipants(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto">
            {/* User */}
            {!isObserverMode && (
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  YOU
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">You</h3>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Active Learner</p>
                </div>
              </div>
            )}
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                  <img src={agent.avatarUrl} alt={agent.name} className="w-12 h-12 rounded-xl bg-slate-50" />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{agent.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{agent.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Container to create the "More Inside" margin effect */}
      <div className="flex-1 flex max-w-[1400px] w-full h-full lg:h-[88vh] mx-auto bg-white/50 backdrop-blur-sm shadow-none lg:shadow-2xl border-0 lg:border border-white/60 overflow-hidden relative z-10 lg:rounded-[2.5rem]">

        {/* Participants Sidebar (Desktop) */}
        <aside className="hidden lg:flex w-72 flex-col bg-white/40 backdrop-blur-md border-r border-slate-200/50 z-20 p-6">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <i className="fas fa-users"></i> Active Participants
          </h2>
          <div className="space-y-3">
            {/* User */}
            {!isObserverMode && (
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl border border-white/50 shadow-sm animate-in fade-in">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                  YOU
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">You</h3>
                  <p className="text-[9px] font-bold text-brand-primary uppercase tracking-wider">Active Learner</p>
                </div>
              </div>
            )}

            {isObserverMode && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-purple-700 text-xs font-bold text-center animate-in zoom-in">
                <i className="fas fa-eye mb-2 text-xl"></i>
                <p>You are in Observer Mode</p>
              </div>
            )}

            {/* Agents */}
            {agents.map(agent => (
              <div key={agent.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 transition-colors border border-transparent hover:border-white/50 group cursor-default">
                <div className="relative">
                  <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-xl bg-white shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{agent.name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{agent.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-200/50">
            <div className="bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
              <h4 className="text-[9px] font-black uppercase tracking-widest text-brand-primary mb-2 opacity-70">Scenario Objective</h4>
              <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                "{scenario?.objective || "Practice natural conversation flow."}"
              </p>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-full relative z-10 bg-white/30">
          {/* Header */}
          <header className="flex-none px-4 md:px-8 py-3 md:py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* EXIT / HOME BUTTON (Cross Button) */}
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm group"
                title="Exit Mission"
              >
                <i className="fas fa-times text-sm group-hover:scale-110 transition-transform"></i>
              </button>

              <div className="flex-1 min-w-0 mr-2">
                <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 md:gap-3 min-w-0">
                  <span className="truncate">{scenario?.title || 'Free Practice'}</span>
                  <span className="flex-none px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] uppercase font-black tracking-widest border border-red-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="hidden md:inline">{isObserverMode ? 'Observing' : 'Live'}</span>
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Only: Show Participants Toggle */}
              <button
                onClick={() => setShowParticipants(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all flex items-center justify-center shadow-sm"
              >
                <i className="fas fa-users"></i>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSafeMenu(!showSafeMenu)}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-brand-secondary hover:border-brand-secondary/30 transition-all flex items-center justify-center shadow-sm"
                  title="Safe Mode Controls"
                >
                  <i className="fas fa-shield-alt"></i>
                </button>

                {showSafeMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 p-2 z-50 transform origin-top-right">
                    <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-300">Session Controls</div>
                    <button onClick={togglePause} className="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 text-slate-700 hover:text-amber-600 font-bold text-sm flex items-center gap-3 transition-colors mb-1">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-500"><i className="fas fa-pause"></i></div>
                      Pause Session
                    </button>
                    <button onClick={toggleObserverMode} className="w-full text-left px-4 py-3 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-600 font-bold text-sm flex items-center gap-3 transition-colors mb-1">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-500"><i className={`fas ${isObserverMode ? 'fa-user' : 'fa-eye'}`}></i></div>
                      {isObserverMode ? 'Join Conversation' : 'Just Observe'}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleEndSimulation}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center gap-2"
              >
                <span>Finish</span>
                <i className="fas fa-flag-checkered"></i>
              </button>
            </div>
          </header>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 relative z-10 scroll-smooth">
            <div className="max-w-4xl mx-auto space-y-8 pb-10 pt-4">
              <div className="flex justify-center">
                <span className="px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Session Started</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-4 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'} group animate-in slide-in-from-bottom-4 duration-500`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`flex-none w-9 h-9 md:w-11 md:h-11 rounded-[1.2rem] flex items-center justify-center shadow-lg overflow-hidden border-2 transition-transform hover:scale-110 duration-300 ${msg.isUser ? 'border-brand-primary' : 'border-white'}`}>
                      {msg.isUser ? (
                        <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                          YOU
                        </div>
                      ) : (
                        <img
                          src={`https://i.pravatar.cc/150?u=${msg.senderId}`}
                          alt={msg.senderName}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className={`max-w-[75%] relative`}>
                    {/* Message Bubble */}
                    <div className={`px-4 py-3 md:px-6 md:py-4 text-sm md:text-[15px] leading-relaxed shadow-md transition-all break-words ${msg.isUser
                      ? 'bg-slate-900 text-white rounded-[2rem] rounded-br-[4px] shadow-slate-900/20'
                      : 'bg-white text-slate-700 border border-transparent hover:border-slate-200 rounded-[2rem] rounded-bl-[4px] shadow-sm'
                      }`}>
                      {msg.text}
                    </div>

                    {/* Name & Time */}
                    <span className={`absolute -bottom-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest ${msg.isUser ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}>
                      {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-4 pl-1">
                  <div className="w-11 h-11 rounded-[1.2rem] bg-slate-200/50 animate-pulse"></div>
                  <div className="bg-white/60 border border-white/60 px-6 py-5 rounded-[2rem] rounded-bl-sm shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}

              {microAffirmation && (
                <div className="flex justify-center py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/10 flex items-center gap-2 shadow-lg shadow-brand-primary/5 backdrop-blur-sm">
                    <i className="fas fa-heart text-[10px] animate-pulse"></i> {microAffirmation}
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Rich Input Area (Figma-Style) */}
          <div className="flex-none px-4 md:px-8 pb-4 md:pb-8 pt-2 md:pt-4 relative z-20">
            <div className="max-w-4xl mx-auto relative group">

              {/* Social Scaffolding (Suggested Chips) */}
              {!isObserverMode && !isPaused && suggestedPrompts.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar md:scrollbar-none transform transition-all duration-300 mask-linear-fade">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 bg-white/80 backdrop-blur-md border border-brand-primary/20 text-brand-primary text-xs font-bold rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-brand-primary/25 whitespace-nowrap animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      ✨ {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Floating Toolbar / Input Container */}
              <div className={`bg-white/90 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-2xl shadow-slate-200/50 flex flex-col relative z-10 transition-all focus-within:ring-4 focus-within:ring-brand-primary/5 focus-within:border-brand-primary/30 ${isObserverMode ? 'opacity-50 pointer-events-none grayscale' : ''}`}>

                {/* Attachment Preview */}
                {mediaAttachment && (
                  <div className="px-4 pt-4 flex">
                    <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-500 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-image"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{mediaAttachment.name}</p>
                      </div>
                      <button onClick={() => setMediaAttachment(null)} className="w-6 h-6 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors ml-2">
                        <i className="fas fa-times text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center p-2 pl-3 md:pl-4">
                  {/* Rich Tools Left */}
                  <div className="flex items-center gap-1 pr-2 md:pr-3 border-r border-slate-100 mr-2 md:mr-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 md:w-9 md:h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-brand-primary transition-all flex items-center justify-center"
                    >
                      <i className="fas fa-paperclip text-xs md:text-sm"></i>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

                    <div className="relative">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="hidden md:flex w-9 h-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-all items-center justify-center"
                      >
                        <i className="far fa-smile"></i>
                      </button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-3 bg-white border border-slate-100 shadow-2xl rounded-2xl p-3 grid grid-cols-5 gap-1 w-64 animate-in zoom-in-95 duration-200">
                          {EMOJIS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addEmoji(emoji)}
                              className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-xl transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={isObserverMode ? "Observer Mode: Watching agents..." : input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isPaused ? "Paused..." : "Type message..."}
                    className="flex-1 min-w-0 bg-transparent border-none focus:ring-0 py-3 md:py-4 text-slate-700 placeholder:text-slate-400 font-medium outline-none text-sm md:text-[15px]"
                    disabled={isProcessing || isPaused || isObserverMode}
                  />

                  {/* Rich Tools Right */}
                  <div className="flex items-center gap-2 pl-2">
                    <button
                      onClick={toggleRecording}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-xl transition-all flex items-center justify-center ${isRecording ? 'bg-red-50 text-red-500 animate-pulse border border-red-200' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'}`}
                    >
                      <i className={`fas fa-microphone${isRecording ? '-alt' : ''} text-xs md:text-sm`}></i>
                    </button>

                    <button
                      onClick={() => handleSend()}
                      disabled={(!input.trim() && !mediaAttachment) || isProcessing || isPaused || isObserverMode}
                      className="h-9 md:h-10 px-4 md:px-6 rounded-xl bg-slate-900 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100 flex items-center gap-2"
                    >
                      <span className="hidden md:inline">Send</span>
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Simulation;
