
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimulationStage, Agent, Scenario } from '../types';

const CustomCreator: React.FC = () => {
    const navigate = useNavigate();

    // Scenario State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [objective, setObjective] = useState('');
    const [category, setCategory] = useState<'Academic' | 'Social' | 'Professional'>('Social');
    const [stage, setStage] = useState<SimulationStage>(SimulationStage.ONE_ON_ONE);

    // Custom Agent State
    const [customAgents, setCustomAgents] = useState<Agent[]>([]);
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentPersonality, setNewAgentPersonality] = useState('');
    const [newAgentRole, setNewAgentRole] = useState<'peer' | 'facilitator'>('peer');

    const addAgent = () => {
        if (!newAgentName.trim()) return;
        const agent: Agent = {
            id: `custom-${customAgents.length}-${Date.now()}`,
            name: newAgentName,
            personality: newAgentPersonality,
            role: newAgentRole,
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newAgentName}&backgroundColor=b6e3f4`,
            color: newAgentRole === 'facilitator' ? 'bg-amber-600' : 'bg-brand-primary'
        };
        setCustomAgents([...customAgents, agent]);
        setNewAgentName('');
        setNewAgentPersonality('');
    };

    const removeAgent = (id: string) => {
        setCustomAgents(customAgents.filter(a => a.id !== id));
    };

    const handleSave = () => {
        if (!title || !description || customAgents.length === 0) {
            alert("Please provide a title, description, and at least one agent.");
            return;
        }


        const existing = JSON.parse(localStorage.getItem('custom_scenarios') || '[]');
        localStorage.setItem('custom_scenarios', JSON.stringify([...existing, {
            id: `custom-${Date.now()}`,
            title,
            description,
            objective,
            category,
            stage,
            icon: category === 'Academic' ? 'fa-graduation-cap' : category === 'Professional' ? 'fa-briefcase' : 'fa-heart',
            customAgents // Embedding agents directly for custom scenarios
        }]));

        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-5 mb-12 animate-in fade-in slide-in-from-left-4 duration-500">
                    <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-brand-primary transition-all">
                        <i className="fas fa-arrow-left text-sm"></i>
                    </button>
                    <h1 className="text-3xl font-black text-slate-900">Environment Architect</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Advanced Tools Link */}
                    <div className="lg:col-span-2 flex justify-end -mt-8 mb-4">
                        <button
                            onClick={() => navigate('/agent-editor')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-primary transition-all shadow-lg shadow-slate-900/10"
                        >
                            <i className="fas fa-robot"></i>
                            Open Agent Editor
                        </button>
                    </div>
                    {/* Scenario Configuration */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center gap-2">
                                <i className="fas fa-map"></i> Blueprint
                            </h2>

                            <div className="space-y-4">
                                <input
                                    placeholder="Scenario Title (e.g., Coffee Shop Debate)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                <textarea
                                    placeholder="Describe the environment and vibe..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/10 min-h-[100px] transition-all"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                                <input
                                    placeholder="Mission Objective (e.g., Order coffee with a smile)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                    value={objective}
                                    onChange={e => setObjective(e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none"
                                        value={category}
                                        onChange={e => setCategory(e.target.value as any)}
                                    >
                                        <option value="Social">Social</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Professional">Professional</option>
                                    </select>
                                    <select
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none"
                                        value={stage}
                                        onChange={e => setStage(e.target.value as any)}
                                    >
                                        <option value={SimulationStage.ONE_ON_ONE}>1-on-1</option>
                                        <option value={SimulationStage.OPEN_GROUP}>Group</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Agent Configuration */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <section className="glass-card p-8 space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary mb-4 flex items-center gap-2">
                                <i className="fas fa-users"></i> Behavioral Cast
                            </h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Agent Name"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                                        value={newAgentName}
                                        onChange={e => setNewAgentName(e.target.value)}
                                    />
                                    <select
                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none"
                                        value={newAgentRole}
                                        onChange={e => setNewAgentRole(e.target.value as any)}
                                    >
                                        <option value="peer">Peer</option>
                                        <option value="facilitator">Facilitator</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="How should they behave? (Linguistic quirks, mood, etc.)"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-primary/10 min-h-[80px] transition-all"
                                    value={newAgentPersonality}
                                    onChange={e => setNewAgentPersonality(e.target.value)}
                                />
                                <button onClick={addAgent} className="btn-primary w-full py-2.5 text-xs font-black">Add Agent to Scene</button>
                            </div>

                            <div className="space-y-3">
                                {customAgents.map(agent => (
                                    <div key={agent.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                        <div className="flex items-center gap-4">
                                            <img src={agent.avatarUrl} className="w-10 h-10 rounded-xl bg-white shadow-sm" alt={agent.name} />
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{agent.name}</p>
                                                <p className="text-[10px] text-slate-400 capitalize">{agent.role}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeAgent(agent.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <i className="fas fa-trash-alt text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <button
                            onClick={handleSave}
                            className="btn-primary w-full py-5 text-base shadow-2xl shadow-brand-primary/30"
                        >
                            Construct Environment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomCreator;
