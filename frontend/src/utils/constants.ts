
import { Agent, SimulationStage, Scenario } from '../types';

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "You're at a campus coffee shop and see a classmate you've spoken to once. What's your internal reaction?",
    options: [
      { text: "Smile and wait to see if they say hi first.", type: "Quiet Observer" },
      { text: "Briefly say hi, then find a quiet corner to work.", type: "Thoughtful Connector" },
      { text: "Immediately worry about if you should go talk to them.", type: "Anxious Achiever" },
      { text: "Go straight over and ask what they're studying.", type: "Direct Communicator" }
    ]
  },
  {
    id: 2,
    text: "A professor asks a question in a large lecture hall. You know the answer. You...",
    options: [
      { text: "Keep it to yourself; someone else will answer.", type: "Quiet Observer" },
      { text: "Wait to see if anyone else raises their hand first.", type: "Thoughtful Connector" },
      { text: "Raise your hand while your heart beats at 100mph.", type: "Anxious Achiever" },
      { text: "Raise your hand immediately and answer concisely.", type: "Direct Communicator" }
    ]
  },
  {
    id: 3,
    text: "What is your main goal for using ConvoVerse?",
    options: [
      { text: "Feeling less 'invisible' in group settings.", type: "Quiet Observer" },
      { text: "Making deeper connections with peers.", type: "Thoughtful Connector" },
      { text: "Overcoming physical anxiety when speaking.", type: "Anxious Achiever" },
      { text: "Learning to be more diplomatic in my honesty.", type: "Direct Communicator" }
    ]
  }
];

export const AGENTS: Record<string, Agent> = {
  leo: {
    id: 'leo',
    name: 'Leo',
    role: 'peer',
    personality: 'Hyper-friendly and informal. He uses a lot of slang like "dude" or "totally" and often references his recent volleyball games or coding projects. He tends to be overly optimistic but struggles with deep emotional topics, often pivoting back to jokes.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo&backgroundColor=b6e3f4',
    color: 'bg-blue-500'
  },
  sarah: {
    id: 'sarah',
    name: 'Sarah',
    role: 'peer',
    personality: 'Intellectually intense and direct. She speaks in concise, rapid sentences and has a habit of correcting small factual errors. She is deeply curious but can come off as slightly interrogative if she likes a topic. She appreciates logic over small talk.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffdfbf',
    color: 'bg-emerald-500'
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    role: 'peer',
    personality: 'The "anchor" of the group. Very soft-spoken, pauses frequently before speaking (indicated by "..." in text), and always checks if others are comfortable. He hates conflict and will often try to find a middle ground or provide quiet support through listening.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=c0aede',
    color: 'bg-purple-500'
  },
  dr_aris: {
    id: 'dr_aris',
    name: 'Dr. Aris',
    role: 'facilitator',
    personality: 'Academic, measured, and observant. He uses clinical yet warm language ("I observe that," "Let\'s unpack"). He is purely focused on the dynamics of the group and will intervene if someone is being talked over or if the conversation veers off-objective.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aris&backgroundColor=ffd5dc',
    color: 'bg-amber-600'
  }
};

export const STAGE_DETAILS: Record<SimulationStage, { title: string, description: string, agents: Agent[], icon: string }> = {
  [SimulationStage.ONE_ON_ONE]: {
    title: 'Casual 1-on-1',
    description: 'A low-stakes, friendly chat with a single peer.',
    agents: [AGENTS.leo],
    icon: 'fa-user'
  },
  [SimulationStage.GUIDED_SMALL_GROUP]: {
    title: 'Guided Discussion',
    description: 'A structured talk with a facilitator and two peers.',
    agents: [AGENTS.dr_aris, AGENTS.leo, AGENTS.sarah],
    icon: 'fa-users-cog'
  },
  [SimulationStage.OPEN_GROUP]: {
    title: 'Open Group Flow',
    description: 'A more natural, dynamic group conversation.',
    agents: [AGENTS.leo, AGENTS.sarah, AGENTS.alex],
    icon: 'fa-users'
  },
  [SimulationStage.REFLECTION]: {
    title: 'Reflective Space',
    description: 'Pause and think about your interaction experience.',
    agents: [AGENTS.dr_aris],
    icon: 'fa-comment-alt'
  }
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'group-assignment',
    title: 'The Group Silence',
    category: 'Academic',
    difficulty: 'Intermediate',
    emotionalIntensity: 'Medium',
    description: 'A team project meeting where voices overlap. Practice finding your moment to speak.',
    objective: 'Break through the cycle by sharing a thought during a brief pause.',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-project-diagram',
    theme: {
      primary: '#3b82f6', // blue-500
      gradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-slate-800',
      userBubble: 'bg-blue-600 text-white',
      agentBubble: 'bg-white text-slate-700 border-blue-100',
      bgImage: 'radial-gradient(#e0e7ff 1px, transparent 1px)'
    }
  },
  {
    id: 'presentation-qa',
    title: 'The Spotlight Question',
    category: 'Academic',
    difficulty: 'Advanced',
    emotionalIntensity: 'High',
    description: 'The room goes quiet waiting for your answer. Navigate the internal pressure.',
    objective: 'Confidently acknowledge a question, even if you need to defer the answer.',
    stage: SimulationStage.GUIDED_SMALL_GROUP,
    icon: 'fa-chalkboard-teacher',
    theme: {
      primary: '#8b5cf6', // violet-500
      gradient: 'from-violet-50 to-fuchsia-100', // A bit more intense/spotlight feel
      textColor: 'text-slate-900',
      userBubble: 'bg-violet-600 text-white',
      agentBubble: 'bg-white text-slate-800 border-violet-100',
      bgImage: 'radial-gradient(#ddd6fe 1px, transparent 1px)'
    }
  },
  {
    id: 'fresher-intro',
    title: 'The Hallway Hello',
    category: 'Social',
    difficulty: 'Beginner',
    emotionalIntensity: 'Low',
    description: 'The awkwardness of a first "hello". Practice turning a nod into a connection.',
    objective: 'Ask a simple follow-up question about their journey.',
    stage: SimulationStage.ONE_ON_ONE,
    icon: 'fa-door-open',
    theme: {
      primary: '#10b981', // emerald-500
      gradient: 'from-emerald-50 to-teal-50',
      textColor: 'text-emerald-950',
      userBubble: 'bg-emerald-600 text-white',
      agentBubble: 'bg-white text-emerald-900 border-emerald-100',
      bgImage: 'radial-gradient(#d1fae5 1px, transparent 1px)'
    }
  },
  {
    id: 'hostel-adda',
    title: 'The Common Room Adda',
    category: 'Social',
    difficulty: 'Intermediate',
    emotionalIntensity: 'Medium',
    description: 'A casual breakout session. Overcome the feeling of being just an observer.',
    objective: 'Share an opinion on a casual topic without overthinking.',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-couch',
    theme: {
      primary: '#f59e0b', // amber-500
      gradient: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-950',
      userBubble: 'bg-amber-500 text-white',
      agentBubble: 'bg-white text-amber-900 border-amber-100',
    }
  },
  {
    id: 'job-interview',
    title: 'The Panel Interview',
    category: 'Professional',
    difficulty: 'Advanced',
    emotionalIntensity: 'High',
    description: 'High-stakes questions in a formal setting. Keep your voice steady.',
    objective: 'Answer a principled question without the internal critic taking over.',
    stage: SimulationStage.GUIDED_SMALL_GROUP,
    icon: 'fa-briefcase',
    theme: {
      primary: '#0f172a', // slate-900
      gradient: 'from-slate-100 to-slate-200', // Formal, cold
      textColor: 'text-slate-900',
      userBubble: 'bg-slate-900 text-white',
      agentBubble: 'bg-white text-slate-800 border-slate-300 shadow-sm',
    }
  },
  {
    id: 'team-conflict',
    title: 'The Polite "No"',
    category: 'Professional',
    difficulty: 'Intermediate',
    emotionalIntensity: 'Medium',
    description: 'Someone suggests a flawed plan. Practice gentle, constructive disagreement.',
    objective: 'Offer an alternative perspective using "I see it differently because..."',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-balance-scale',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=800&auto=format&fit=crop',
    theme: {
      primary: '#ef4444', // red-500 (conflict/tension)
      gradient: 'from-red-50 to-orange-50',
      textColor: 'text-red-950',
      userBubble: 'bg-red-500 text-white',
      agentBubble: 'bg-white text-red-900 border-red-100',
    }
  },
  {
    id: 'salary-negotiation',
    title: 'Asking for a Raise',
    category: 'Professional',
    difficulty: 'Advanced',
    emotionalIntensity: 'High',
    description: 'You have gathered your achievements. Now, the sit-down with your manager.',
    objective: 'State your desired number clearly without apologizing.',
    stage: SimulationStage.ONE_ON_ONE,
    icon: 'fa-money-bill-wave',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
    theme: {
      primary: '#15803d', // green-700 (money)
      gradient: 'from-green-50 to-emerald-100',
      textColor: 'text-green-950',
      userBubble: 'bg-green-700 text-white',
      agentBubble: 'bg-white text-green-900 border-green-200',
    },
    customAgents: [
      {
        id: 'manager_dave',
        name: 'Mr. Dave',
        role: 'peer', // technically a superior but uses peer slot for 1-1
        personality: 'Busy, results-oriented, slightly impatient but fair. He appreciates brevity and data.',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave&backgroundColor=e5e7eb&clothing=blazerAndShirt',
        color: 'bg-slate-600',
        category: 'Professional' // Optional custom field if needed, but not in type yet
      } as Agent
    ]
  },
  {
    id: 'return-item',
    title: 'Returning a Defective Item',
    category: 'Social',
    difficulty: 'Beginner',
    emotionalIntensity: 'Low',
    description: 'The store clerk says "final sale", but the item is broken. Stand your ground.',
    objective: 'Politely but firmly request a refund or exchange.',
    stage: SimulationStage.ONE_ON_ONE,
    icon: 'fa-shopping-bag',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'party-networking',
    title: 'Networking at a Party',
    category: 'Social',
    difficulty: 'Intermediate',
    emotionalIntensity: 'Medium',
    description: 'You don\'t know anyone. A group is laughing near the snacks.',
    objective: 'Join the circle and introduce yourself during a lull.',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-glass-cheers',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800&auto=format&fit=crop',
    theme: {
      primary: '#d946ef', // fuchsia-500
      gradient: 'from-fuchsia-50 to-pink-50',
      textColor: 'text-fuchsia-950',
      userBubble: 'bg-fuchsia-600 text-white',
      agentBubble: 'bg-white text-fuchsia-900 border-fuchsia-100',
      bgImage: 'radial-gradient(#f0abfc 2px, transparent 2px)'
    }
  },
  {
    id: 'comforting-friend',
    title: 'Comforting a Grieving Friend',
    category: 'Personal',
    difficulty: 'Advanced',
    emotionalIntensity: 'High',
    description: 'A friend has lost something important. They are crying.',
    objective: 'Offer presence and validation without trying to "fix" it.',
    stage: SimulationStage.ONE_ON_ONE,
    icon: 'fa-heart-broken',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800&auto=format&fit=crop',
    theme: {
      primary: '#64748b', // slate-500 (somber)
      gradient: 'from-slate-50 to-gray-100',
      textColor: 'text-slate-700',
      userBubble: 'bg-slate-600 text-white',
      agentBubble: 'bg-white text-slate-600 border-slate-200',
    }
  }
];
