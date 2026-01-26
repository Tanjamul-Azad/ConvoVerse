
import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { UserProfile } from '../types';

interface MentorshipProps {
    profile?: UserProfile;
}

const MENTORS = [
    {
        id: 1,
        name: "Dr. Anya Sharma",
        role: "Executive Coach",
        rating: 4.9,
        reviews: 125,
        image: "https://i.pravatar.cc/150?u=anya",
        tags: ["Communication Coaching", "Leadership", "Public Speaking"],
        description: "Specializes in executive communication and leadership development. With over 15 years of experience guiding CEOs and founders.",
        available: true
    },
    {
        id: 2,
        name: "Emily White",
        role: "Virtual Communication Specialist",
        rating: 4.8,
        reviews: 70,
        image: "https://i.pravatar.cc/150?u=emily",
        tags: ["Remote Work", "Digital Body Language", "Interview Prep"],
        description: "Passionate about improving communication in the digital age. Guides individuals on effective virtual presence and remote team dynamics.",
        available: true
    },
    {
        id: 3,
        name: "Marcus Chen",
        role: "Conflict Resolution Expert",
        rating: 4.7,
        reviews: 94,
        image: "https://i.pravatar.cc/150?u=marcus",
        tags: ["Conflict Resolution", "Negotiation", "Teamwork"],
        description: "Expert in de-escalation and turning conflict into collaboration. Helping teams navigate difficult conversations with empathy.",
        available: false
    }
];

const EXPERTISE_OPTIONS = [
    "Communication Coaching",
    "Public Speaking",
    "Conflict Resolution",
    "Interview Skills",
    "Leadership"
];

const Mentorship: React.FC<MentorshipProps> = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
    const [minRating, setMinRating] = useState(0);

    const toggleExpertise = (tag: string) => {
        setSelectedExpertise(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredMentors = MENTORS.filter(mentor => {
        const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = mentor.rating >= minRating;
        const matchesTags = selectedExpertise.length === 0 ||
            mentor.tags.some(tag => selectedExpertise.some(et => tag.includes(et) || et.includes(tag)));
        return matchesSearch && matchesRating && matchesTags;
    });

    const sidebarContent = (
        <>
            {/* Search */}
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Find Your Mentor</h3>
                <div className="relative">
                    <i className="fas fa-search absolute left-4 top-3.5 text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search mentors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                    />
                </div>
            </div>

            {/* Expertise Filter */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Expertise</h3>
                <div className="space-y-2.5">
                    {EXPERTISE_OPTIONS.map(option => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedExpertise.includes(option) ? 'bg-brand-primary border-brand-primary' : 'bg-white border-slate-300 group-hover:border-brand-primary'
                                }`}>
                                {selectedExpertise.includes(option) && <i className="fas fa-check text-white text-[10px]"></i>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedExpertise.includes(option)}
                                onChange={() => toggleExpertise(option)}
                            />
                            <span className={`text-sm font-medium transition-colors ${selectedExpertise.includes(option) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                                {option}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Minimum Rating</h3>
                    <span className="text-xs font-bold text-brand-primary">{minRating > 0 ? `${minRating}+ Stars` : 'Any'}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span>0</span>
                    <span>5</span>
                </div>
            </div>
        </>
    );

    return (
        <SidebarLayout
            title="Mentorship"
            description="Connect with human experts to refine your skills through personalized coaching."
            sidebar={sidebarContent}
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredMentors.map(mentor => (
                    <div key={mentor.id} className="glass-card bg-white p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all duration-300 group">
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="relative">
                                <img src={mentor.image} alt={mentor.name} className="w-20 h-20 rounded-full object-cover shadow-md group-hover:scale-105 transition-transform duration-500" />
                                <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${mentor.available ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="mt-3 flex items-center gap-1 text-amber-400 text-xs font-bold">
                                <i className="fas fa-star"></i>
                                <span className="text-slate-700">{mentor.rating}</span>
                                <span className="text-slate-400 font-normal">({mentor.reviews})</span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{mentor.name}</h3>
                                    <p className="text-sm font-semibold text-brand-primary">{mentor.role}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {mentor.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed mb-6">
                                {mentor.description}
                            </p>

                            <div className="flex items-center gap-3 mt-auto">
                                <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    View Profile
                                </button>
                                <button className="flex-1 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Schedule Call
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </SidebarLayout>
    );
};

export default Mentorship;
