
import React, { useState, useRef, useEffect } from 'react';
import { generateCoachResponse } from '../services/conversationService';
import { UserProfile } from '../types';

interface SupportChatProps {
  profile: UserProfile;
}

const SupportChat: React.FC<SupportChatProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string, isUser: boolean }[]>([
    { text: `Hi ${profile.name}! I'm your Social Coach. How can I help you reach your goal of "${profile.socialGoal}" today?`, isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isOpen, messages, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { text, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Real AI Coach Response
      const responseText = await generateCoachResponse(profile, [...messages, userMsg]);

      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "I'm having trouble connecting to my thought process. Please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Optional: Auto-send on voice end
    };
    recognition.start();
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-6 w-80 md:w-[380px] h-[520px] glass-card flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500 origin-bottom-right border-none shadow-2xl">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <i className="fas fa-magic text-sm"></i>
              </div>
              <div>
                <span className="font-black block leading-none text-sm uppercase tracking-widest">Social Coach</span>
                <span className="text-[9px] opacity-50 uppercase tracking-[0.2em] font-black">Active Pulse</span>
              </div>
            </div>
            <button onClick={toggleChat} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white/50 scroll-smooth no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${m.isUser ? 'bg-brand-primary text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm">
                  <div className="w-1 h-1 bg-brand-primary/40 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-brand-primary/40 rounded-full animate-bounce [animation-delay:200ms]"></div>
                  <div className="w-1 h-1 bg-brand-primary/40 rounded-full animate-bounce [animation-delay:400ms]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={startVoiceRecording}
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5'}`}
            >
              <i className={`fas ${isRecording ? 'fa-stop text-xs' : 'fa-microphone text-sm'} transition-all`}></i>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask for advice..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 font-semibold text-slate-800 placeholder:text-slate-300"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${!input.trim() || isLoading ? 'text-slate-200' : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95'}`}
            >
              <i className="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-90 z-[60] border-4 border-white ${isOpen ? 'bg-slate-900 rotate-180' : 'bg-brand-primary shadow-brand-primary/30'}`}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-magic'} text-xl`}></i>
      </button>
    </div>
  );
};

export default SupportChat;
