
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scenario, UserProfile, SimulationStage } from '../types';
import { SCENARIOS } from '../utils/constants';
import SidebarLayout from '../components/SidebarLayout';

interface ScenarioLibraryProps {
    profile?: UserProfile;
}

const ScenarioLibrary: React.FC<ScenarioLibraryProps> = ({ profile }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<'All' | 'Academic' | 'Social' | 'Professional' | 'Custom'>('All');
    const [customScenarios, setCustomScenarios] = useState<Scenario[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('custom_scenarios');
        if (saved) {
            setCustomScenarios(JSON.parse(saved));
        }
    }, []);

    const handleStartScenario = (scenario: Scenario) => {
        navigate('/simulate', { state: { stage: scenario.stage, scenario, customAgents: scenario.customAgents } });
    };

    // Placeholder for "Add to Main Interface" - for now just adds to custom list or similar? 
    // The user said "add them to main interface". For now we'll assume starting them is the primary action, 
    // or we could add a "Pin" feature later.
    const addToDashboard = (e: React.MouseEvent, scenario: Scenario) => {
        e.stopPropagation();
        alert(`Added ${scenario.title} to your Dashboard! (Simulation)`);
        // Logic to add to a "pinned" list could go here
    };

    const deleteScenario = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = customScenarios.filter(s => s.id !== id);
        setCustomScenarios(updated);
        localStorage.setItem('custom_scenarios', JSON.stringify(updated));
    };

    const allScenarios = [...SCENARIOS, ...customScenarios];

    const filteredScenarios = allScenarios.filter(scenario => {
        const matchesCategory = selectedCategory === 'All' ? true :
            selectedCategory === 'Custom' ? scenario.id.startsWith('custom-') :
                scenario.category === selectedCategory;

        const matchesSearch = scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scenario.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDifficulty = selectedDifficulty ? scenario.difficulty === selectedDifficulty : true;

        return matchesCategory && matchesSearch && matchesDifficulty;
    });

    const categories = ['All', 'Academic', 'Social', 'Professional', 'Custom'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const sidebarContent = (
        <>
            {/* Search */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Search Library</h3>
                <div className="relative">
                    <i className="fas fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search by keyword..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat
                                ? 'bg-brand-primary text-white border-brand-primary'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                    {difficulties.map(diff => (
                        <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedDifficulty === diff
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            {/* Popular Tags Hint */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {['Negotiation', 'Empathy', 'Feedback', 'Interview', 'Teamwork', 'Presentation'].map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    const headerActions = (
        <div className="flex items-center gap-4">
            <Link to="/create" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                <i className="fas fa-plus"></i>
                <span className="hidden md:inline">New Mission</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-2 py-2 pr-4 bg-white rounded-full border border-slate-200 hover:shadow-md transition-all">
                {profile && (
                    <>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-xs font-bold">
                            {profile.name[0]}
                        </div>
                        <span className="text-xs font-bold text-slate-700 hidden sm:inline">{profile.name}</span>
                    </>
                )}
            </Link>
        </div>
    );

    return (
        <SidebarLayout
            title="Scenario Library"
            description="Explore the full collection of simulations. Add scenarios to your dashboard to practice later."
            sidebar={sidebarContent}
            actions={headerActions}
        >
            <div className="animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Scenario Library</h1>
                        <p className="text-slate-500 font-medium">Explore and practice diverse social situations.</p>
                    </div>

                    <Link to="/create" className="btn-primary flex items-center gap-2 !py-3 !px-6 !text-xs !rounded-xl">
                        <i className="fas fa-plus"></i>
                        <span>Create Custom</span>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                    {filteredScenarios.length > 0 ? (
                        filteredScenarios.map((scenario, idx) => (
                            <div
                                key={scenario.id}
                                onClick={() => handleStartScenario(scenario)}
                                className="group glass-card glass-card-hover relative p-6 cursor-pointer border-t-[3px] border-t-white/50 overflow-hidden animate-slide-up"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Decorative Blur */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-bl-[80px] transition-opacity group-hover:opacity-10
                                    ${scenario.category === 'Academic' ? 'from-cyan-400 to-blue-500' :
                                        scenario.category === 'Social' ? 'from-fuchsia-400 to-violet-500' :
                                            'from-purple-400 to-indigo-500'
                                    }`}
                                ></div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 duration-300 ${scenario.category === 'Academic' ? 'bg-cyan-50 text-cyan-500' :
                                            scenario.category === 'Social' ? 'bg-fuchsia-50 text-fuchsia-500' :
                                                'bg-violet-50 text-violet-500'
                                            }`}>
                                            <i className={`fas ${scenario.icon}`}></i>
                                        </div>

                                        <div className="flex gap-2">
                                            {scenario.id.startsWith('custom-') && (
                                                <button
                                                    onClick={(e) => deleteScenario(scenario.id, e)}
                                                    className="w-8 h-8 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                                    title="Delete Custom Scenario"
                                                >
                                                    <i className="fas fa-trash-alt text-xs"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest mb-2 border ${scenario.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                            scenario.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {scenario.difficulty}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-brand-primary transition-colors">
                                            {scenario.title}
                                        </h3>
                                    </div>

                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                                        {scenario.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between group-hover:border-slate-200 transition-colors">
                                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                                            {scenario.stage === SimulationStage.ONE_ON_ONE ? '1-on-1' : 'Group'}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs font-black uppercase tracking-widest text-brand-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                                            Start <i className="fas fa-chevron-right text-[10px]"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass-panel">
                            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                <i className="fas fa-search"></i>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No scenarios found</h3>
                            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                            <button
                                onClick={() => { setSelectedCategory('All'); setSearchTerm(''); setSelectedDifficulty(null) }}
                                className="mt-6 text-brand-primary font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default ScenarioLibrary;

