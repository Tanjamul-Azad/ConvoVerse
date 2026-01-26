
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateAgentResponses, generateCoachResponse } from '../services/conversationService';
import { Message, Agent, SimulationStage, Scenario } from '../types';
import { STAGE_DETAILS, AGENTS } from '../utils/constants';

interface SimulationState {
    stage: SimulationStage;
    scenario?: Scenario;
    customAgents?: Agent[];
}

const Simulation: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as SimulationState;

    // Defaults if state is missing (fallback safety)
    const stage = state?.stage || SimulationStage.ONE_ON_ONE;
    const scenario = state?.scenario;

    // Determine Agents: Use scenario custom agents -> state custom agents -> stage default -> fallback
    const activeAgents = scenario?.customAgents || state?.customAgents || (scenario ? STAGE_DETAILS[scenario.stage]?.agents : STAGE_DETAILS[stage].agents) || [AGENTS.leo];

    // Determine Theme
    const theme = scenario?.theme || {
        primary: '#6366f1',
        gradient: 'from-slate-50 to-slate-100', // Keeps it clean but we will add ambient lights
        textColor: 'text-slate-900',
        userBubble: 'bg-slate-900 text-white shadow-md',
        agentBubble: 'bg-white/80 backdrop-blur-sm text-slate-700 border border-white/50 shadow-sm',
        bgImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)'
    };

    // Core State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(['Hello, everyone.']);

    // Coach State
    const [coachAdvice, setCoachAdvice] = useState<string | null>(null);
    const [isCoachThinking, setIsCoachThinking] = useState(false);
    const [showCoach, setShowCoach] = useState(false);

    // Scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    // Initial Greeting
    useEffect(() => {
        if (messages.length === 0) {
            const initialGreeting: Message = {
                id: 'init-1',
                senderId: activeAgents[0].id,
                senderName: activeAgents[0].name,
                text: `Hey ${user?.profile?.name || 'there'}! ` + (scenario ? `Ready to talk about "${scenario.title}"?` : "Good to see you."),
                timestamp: Date.now(),
                isUser: false,
                emotion: 'friendly'
            };
            setMessages([initialGreeting]);

            // Generate initial prompts based on context
            if (scenario) {
                setSuggestedPrompts([
                    "Hi! Yes, I'm ready.",
                    "I'm a bit nervous, to be honest.",
                    "Let's get started."
                ]);
            }
        }
    }, []); // Run once

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isProcessing) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            senderId: user?.id || 'user',
            senderName: user?.profile?.name || 'You',
            text: text,
            timestamp: Date.now(),
            isUser: true
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsProcessing(true);
        setSuggestedPrompts([]);

        try {
            // 1. Generate Agent Responses
            const result = await generateAgentResponses(
                stage,
                activeAgents,
                [...messages, userMsg],
                scenario?.title || 'General Chat',
                scenario,
                user?.profile
            );

            // Add agent responses with slight natural delays
            if (result.responses.length > 0) {
                const newMessages: Message[] = [];

                for (const resp of result.responses) {
                    const agent = activeAgents.find(a => a.id === resp.agentId) || activeAgents[0];
                    const msg: Message = {
                        id: Date.now() + Math.random().toString(),
                        senderId: agent.id,
                        senderName: agent.name,
                        text: resp.text,
                        timestamp: Date.now(),
                        isUser: false,
                        emotion: resp.emotion
                    };
                    newMessages.push(msg);
                }

                // Update state once with all new messages to avoid varying delays for now (simpler UI)
                // Or sequentially:
                setTimeout(() => {
                    setMessages(prev => [...prev, ...newMessages]);
                    setSuggestedPrompts(result.suggestedPrompts);
                    setIsProcessing(false);
                }, 1500); // Simulated "thinking" time
            } else {
                setIsProcessing(false);
            }

            // 2. Coach Logic (Background)
            if (user?.profile) {
                setIsCoachThinking(true);
                // Only trigger coach occasionally or on specific triggers? For now, every turn.
                generateCoachResponse(user.profile, [...messages, userMsg].map(m => ({ text: m.text, isUser: m.isUser })))
                    .then(advice => {
                        setCoachAdvice(advice);
                        setIsCoachThinking(false);
                        // Auto-show coach if advice is critical? Optional.
                        if (!showCoach) setShowCoach(true);
                    });
            }

        } catch (err) {
            console.error("Simulation Error", err);
            setIsProcessing(false);
        }
    };

    const handleEndSession = () => {
        navigate('/reflect', { state: { messages, scenario } });
    };

    return (
        <div className={`flex flex-col h-screen overflow-hidden relative bg-[#f8fafc]`}>
            {/* Ambient Background Lights */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-violet-600/5 rounded-full blur-[100px] animate-float"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-500/5 rounded-full blur-[100px] animate-float-delayed"></div>
            </div>

            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            {/* Header */}
            <header className="flex-none bg-white/70 backdrop-blur-xl border-b border-white/40 px-6 py-4 flex justify-between items-center z-20 transition-all duration-500">
                <div className="flex flex-col">
                    <h1 className={`text-xl font-black tracking-tight flex items-center gap-3 text-slate-900`}>
                        {scenario ? scenario.title : STAGE_DETAILS[stage].title}
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-100 shadow-sm text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                            {stage.replace(/_/g, ' ')}
                        </span>
                    </h1>
                    {scenario && (
                        <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Mission: {scenario.objective}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowCoach(!showCoach)}
                        className={`relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${showCoach
                            ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary'
                            }`}
                    >
                        <i className="fas fa-life-ring mr-2"></i>
                        AI Coach
                        {activeAgents.length > 0 && isCoachThinking && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping border-2 border-white"></span>
                        )}
                    </button>

                    <button
                        onClick={handleEndSession}
                        className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 border border-transparent"
                    >
                        End Session
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full relative">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 scroll-smooth">
                        {messages.map((msg) => {
                            const agent = activeAgents.find(a => a.id === msg.senderId);
                            const isUser = msg.isUser;

                            return (
                                <div key={msg.id} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{ animationDelay: '50ms' }}>
                                    {!isUser && (
                                        <div className="flex-none flex flex-col items-center gap-1 mt-1">
                                            <div className="relative">
                                                <img
                                                    src={agent?.avatarUrl || AGENTS.leo.avatarUrl}
                                                    alt={msg.senderName}
                                                    className="w-10 h-10 rounded-2xl border border-white shadow-md object-cover bg-slate-100"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm text-sm leading-relaxed relative group transition-all duration-300 ${isUser
                                        ? 'bg-slate-900 text-white rounded-tr-sm shadow-xl shadow-slate-900/10'
                                        : 'bg-white/90 backdrop-blur-sm text-slate-700 rounded-tl-sm border border-white/60 shadow-md'
                                        }`}>
                                        {!isUser && (
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between items-center border-b border-slate-100 pb-1 border-dashed">
                                                {msg.senderName}
                                                {msg.emotion && <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 font-bold ml-2">{msg.emotion}</span>}
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>

                                    {isUser && (
                                        <div className="flex-none flex flex-col items-center gap-1 mt-1">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center font-bold border border-white shadow-md">
                                                {user?.profile?.name?.[0] || 'U'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isProcessing && (
                            <div className="flex gap-4 justify-start animate-pulse">
                                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-white shadow-sm"></div>
                                <div className="px-6 py-4 rounded-2xl bg-white/60 border border-white shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-1.5 h-1.5 bg-brand-primary/50 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Coach Overlay (Floating) */}
                    {showCoach && (
                        <div className="absolute top-4 right-4 max-w-xs w-full glass-card p-6 animate-in slide-in-from-right-4 duration-500 z-30 border-l-4 border-l-brand-primary">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-brand-primary">
                                    <i className="fas fa-robot"></i> AI Coach
                                </h4>
                                <button onClick={() => setShowCoach(false)} className="w-6 h-6 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"><i className="fas fa-times text-[10px]"></i></button>
                            </div>

                            {isCoachThinking && !coachAdvice ? (
                                <div className="flex items-center gap-3 text-slate-400 text-xs italic">
                                    <span className="w-4 h-4 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></span>
                                    Analyzing conversation...
                                </div>
                            ) : (
                                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {coachAdvice}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="flex-none p-4 md:p-6 z-20">
                        {/* Suggested Prompts */}
                        {suggestedPrompts.length > 0 && !isProcessing && (
                            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2 justify-center">
                                {suggestedPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSendMessage(prompt)}
                                        className="flex-none px-5 py-2.5 bg-white/80 backdrop-blur-md border border-white/50 text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap text-brand-primary"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="max-w-3xl mx-auto relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-xl"></div>

                            <div className="relative flex items-end bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-white/60 p-2 transition-all">
                                <textarea
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage(inputText);
                                        }
                                    }}
                                    placeholder="Type your response..."
                                    className="flex-1 max-h-32 min-h-[56px] bg-transparent border-none focus:ring-0 p-4 text-slate-700 text-sm font-medium placeholder:text-slate-400 resize-none outline-none"
                                    disabled={isProcessing}
                                />
                                <button
                                    onClick={() => handleSendMessage(inputText)}
                                    disabled={!inputText.trim() || isProcessing}
                                    className="w-12 h-12 mb-1 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <i className="fas fa-paper-plane text-sm"></i>
                                </button>
                            </div>
                            <p className="text-center text-[10px] text-slate-400/80 mt-3 font-bold uppercase tracking-widest">
                                Press Enter to send
                            </p>
                        </div>
                    </div>
                </main>

                {/* Participants Sidebar (Desktop) */}
                <aside className="hidden xl:flex w-80 bg-white/60 backdrop-blur-md border-l border-white/50 flex-col p-8 overflow-y-auto">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
                        <i className="fas fa-users text-slate-400"></i> Participants
                    </h3>

                    <div className="space-y-4">
                        {activeAgents.map(agent => (
                            <div key={agent.id} className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
                                <div className="relative">
                                    <img src={agent.avatarUrl} alt={agent.name} className="w-12 h-12 rounded-2xl bg-slate-50 object-cover shadow-sm" />
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{agent.name}</p>
                                    <p className="text-[10px] text-brand-primary font-black uppercase tracking-wider">{agent.role}</p>
                                </div>
                            </div>
                        ))}

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200 border-dashed"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-transparent px-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">You</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 border-dashed opacity-80">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {user?.profile?.name?.[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">You</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.profile?.archetype}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto bg-blue-50/50 p-5 rounded-2xl border border-blue-100 backdrop-blur-sm">
                        <h4 className="text-[10px] uppercase font-black text-blue-500 mb-3 flex items-center gap-2">
                            <i className="fas fa-heart text-blue-400"></i> Safe Space
                        </h4>
                        <p className="text-xs text-blue-700/80 leading-relaxed font-medium">
                            AI simulation. No human monitoring. Take your time to practice meaningful connection.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Simulation;
