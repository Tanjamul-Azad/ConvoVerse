
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../types';

const AgentEditor: React.FC = () => {
    const navigate = useNavigate();

    // 1. Agent Profile
    const [name, setName] = useState('');
    const [role, setRole] = useState<'peer' | 'facilitator'>('peer');
    const [description, setDescription] = useState('');

    // 2. Persona Definition
    const [commStyle, setCommStyle] = useState('');
    const [emotionalTone, setEmotionalTone] = useState('');
    const [intent, setIntent] = useState<'supportive' | 'neutral' | 'encouraging'>('supportive');

    // 3. Response Style Sliders (0-100)
    const [formality, setFormality] = useState(50);
    const [empathy, setEmpathy] = useState(80);
    const [directness, setDirectness] = useState(40);
    const [length, setLength] = useState(50);

    // 4. Behavior Anchors
    const [anchors, setAnchors] = useState<{ input: string; response: string }[]>([
        { input: "I'm feeling really anxious about this.", response: "It's completely normal to feel that way. Take a breath." }
    ]);

    const handleAddAnchor = () => {
        setAnchors([...anchors, { input: '', response: '' }]);
    };

    const updateAnchor = (index: number, field: 'input' | 'response', value: string) => {
        const newAnchors = [...anchors];
        newAnchors[index][field] = value;
        setAnchors(newAnchors);
    };

    const handleSave = () => {
        if (!name.trim()) return;

        const newAgent: Agent = {
            id: `custom-agent-${Date.now()}`,
            name,
            role,
            personality: description, // Base personality
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&backgroundColor=e2e8f0`,
            color: 'bg-indigo-500', // Default color for custom agents
            communicationStyle: commStyle,
            emotionalTone,
            behavioralIntent: intent,
            traits: {
                formality,
                empathy,
                directness,
                responseLength: length
            },
            anchors
        };

        // Save to library
        const existing = JSON.parse(localStorage.getItem('custom_agents_library') || '[]');
        localStorage.setItem('custom_agents_library', JSON.stringify([...existing, newAgent]));

        // Navigate back to creator or home
        // For now, go back to create to use it
        navigate('/create');
    };

    const SliderControl = ({ label, value, onChange, leftLabel, rightLabel, color = "brand-primary" }: any) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>{label}</span>
                <span className="text-slate-800">{value}%</span>
            </div>
            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-${color}`}
            />
            <div className="flex justify-between text-[10px] font-medium text-slate-400">
                <span>{leftLabel}</span>
                <span>{rightLabel}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-6 pb-24">
            <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in width-full">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/create')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-brand-primary transition-all">
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agent Editor</h1>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Advanced Configuration</p>
                        </div>
                    </div>

                    <button onClick={handleSave} className="btn-primary px-6 py-3 text-xs font-black">
                        Save Agent to Library
                    </button>
                </div>

                {/* 1. Agent Profile */}
                <section className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[4rem] transition-all group-hover:bg-brand-primary/10"></div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">1</span>
                        Identity Profile
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 ml-1">Agent Name</label>
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. Dr. Sarah"
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-500 ml-1">Social Role</label>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                {['peer', 'facilitator'].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRole(r as any)}
                                        className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${role === r ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <label className="text-xs font-bold text-slate-500 ml-1">Role Description</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Briefly describe who they are (e.g., 'A supportive listener who validates feelings first')..."
                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all min-h-[100px]"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Persona Definition */}
                <section className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">2</span>
                        Persona Definition
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Communication Style</label>
                            <input
                                value={commStyle}
                                onChange={e => setCommStyle(e.target.value)}
                                placeholder="e.g. Socratic, Warm"
                                className="w-full p-3 bg-slate-50 border-b-2 border-slate-100 focus:border-brand-primary outline-none transition-colors font-semibold text-slate-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emotional Tone</label>
                            <input
                                value={emotionalTone}
                                onChange={e => setEmotionalTone(e.target.value)}
                                placeholder="e.g. Calm, Curious"
                                className="w-full p-3 bg-slate-50 border-b-2 border-slate-100 focus:border-brand-primary outline-none transition-colors font-semibold text-slate-700"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Behavioral Intent</label>
                            <select
                                value={intent}
                                onChange={e => setIntent(e.target.value as any)}
                                className="w-full p-3 bg-slate-50 border-b-2 border-slate-100 focus:border-brand-primary outline-none transition-colors font-semibold text-slate-700"
                            >
                                <option value="supportive">Supportive</option>
                                <option value="encouraging">Encouraging</option>
                                <option value="neutral">Neutral</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 3. Response Style Sliders */}
                <section className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">3</span>
                        Response Dynamics
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <SliderControl
                            label="Formality"
                            value={formality}
                            onChange={setFormality}
                            leftLabel="Casual (Hey!)"
                            rightLabel="Professional (Greetings.)"
                        />
                        <SliderControl
                            label="Empathy Level"
                            value={empathy}
                            onChange={setEmpathy}
                            leftLabel="Neutral"
                            rightLabel="Deeply Empathetic"
                            color="emerald-400"
                        />
                        <SliderControl
                            label="Directness"
                            value={directness}
                            onChange={setDirectness}
                            leftLabel="Polite/Indirect"
                            rightLabel="Blunt/Direct"
                        />
                        <SliderControl
                            label="Response Length"
                            value={length}
                            onChange={setLength}
                            leftLabel="Concise"
                            rightLabel="Detailed"
                        />
                    </div>
                </section>

                {/* 4. Behavior Anchors */}
                <section className="bg-white/80 backdrop-blur-sm border border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs">4</span>
                        Behavioral Anchors
                    </h2>
                    <p className="text-xs text-slate-500 mb-6 max-w-lg">
                        Provide specific examples of how this agent should respond. This "anchors" the AI's behavior to your expectations.
                    </p>

                    <div className="space-y-6">
                        {anchors.map((anchor, idx) => (
                            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group/item hover:bg-white hover:shadow-sm transition-all">
                                <div className="absolute top-4 left-4 text-[10px] font-black uppercase text-slate-300">Ex {idx + 1}</div>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">User Says:</label>
                                        <input
                                            value={anchor.input}
                                            onChange={e => updateAnchor(idx, 'input', e.target.value)}
                                            placeholder="e.g. I made a mistake."
                                            className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-brand-primary transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-0.5 bg-brand-primary/20 rounded-full my-2"></div>
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest ml-1">Agent Responds:</label>
                                            <textarea
                                                value={anchor.response}
                                                onChange={e => updateAnchor(idx, 'response', e.target.value)}
                                                placeholder="e.g. Mistakes are proof that you are trying."
                                                className="w-full mt-2 p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-brand-primary transition-colors min-h-[60px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleAddAnchor}
                            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-plus"></i> Add Another Example
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AgentEditor;
