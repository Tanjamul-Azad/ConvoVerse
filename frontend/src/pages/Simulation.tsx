
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SimulationStage, Message, Scenario, Agent } from '../types';
import { generateAgentResponses } from '../services/conversationService';
import { STAGE_DETAILS } from '../utils/constants';

const Simulation: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage] = useState<SimulationStage>(state?.stage || SimulationStage.ONE_ON_ONE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = state?.scenario as Scenario;
  const customAgents = state?.customAgents as Agent[];
  const agents = customAgents || (scenario && STAGE_DETAILS[stage] ? STAGE_DETAILS[stage].agents : []);

  useEffect(() => {
    if ((!scenario && !state?.stage) || !agents.length) {
      if (!agents.length && STAGE_DETAILS[stage]) {
        // Fallback if no agents found but valid stage
      } else if (!state?.startFree) {
        navigate('/');
        return;
      }
    }

    // Initial greeting
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
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      text: input,
      timestamp: Date.now(),
      isUser: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      const responses = await generateAgentResponses(stage, agents, messages, input, scenario);

      // Simulate typing delay for realism
      setTimeout(() => {
        const newMessages = responses.responses.map((r: any) => {
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
        setMessages(prev => [...prev, ...newMessages]);
        setIsProcessing(false);
      }, 1500);

    } catch (error) {
      console.error('Error getting response:', error);
      setIsProcessing(false);
    }
  };

  const handleEndSimulation = () => {
    navigate('/reflect', { state: { messages, stage } });
  };

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20"></div>

      {/* Header */}
      <header className="relative z-20 flex-none bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              {scenario?.title || 'Free Practice'}
              <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] uppercase font-bold tracking-widest border border-brand-primary/20">
                Live
              </span>
            </h1>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              {agents.length} Agent{agents.length !== 1 ? 's' : ''} Active
            </p>
          </div>
        </div>

        <button
          onClick={handleEndSimulation}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center gap-2"
        >
          <i className="fas fa-flag-checkered"></i>
          <span>Finalize</span>
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-6 relative z-10 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'} group animate-in fade-in slide-in-from-bottom-2 duration-500`}
            >
              {/* Avatar */}
              <div className={`flex-none w-10 h-10 rounded-full flex items-center justify-center shadow-md overflow-hidden border-2 ${msg.isUser ? 'border-brand-primary/20' : 'border-white'}`}>
                {msg.isUser ? (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                    YOU
                  </div>
                ) : (
                  <img
                    src={`https://i.pravatar.cc/150?u=${msg.senderId}`}
                    alt={msg.senderName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${msg.senderName}&background=random`
                    }}
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[80%] relative`}>
                <div className={`px-6 py-4 text-[15px] leading-relaxed shadow-sm ${msg.isUser
                  ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-[1.5rem] rounded-br-[4px]'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-[1.5rem] rounded-bl-[4px]'
                  }`}>
                  {msg.text}
                </div>

                {/* Name Label */}
                <span className={`absolute -bottom-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${msg.isUser ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-200/50"></div>
              <div className="bg-white/50 border border-white/60 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-brand-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-6 relative z-20">
        <div className="max-w-3xl mx-auto relative group">
          {/* Magic blur effect behind input */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-purple-500 to-brand-secondary rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl flex items-center p-2 relative z-10 transition-all focus-within:ring-4 focus-within:ring-brand-primary/10">
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-brand-primary transition-all flex items-center justify-center">
              <i className="fas fa-microphone"></i>
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 placeholder:text-slate-400 font-medium outline-none"
              disabled={isProcessing}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100"
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              AI Agents are active & listening
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
