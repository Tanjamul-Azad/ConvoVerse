
import { Agent, SimulationStage, Scenario } from './types';

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
    description: 'A team project meeting where voices overlap and the heavy silence between ideas feels impossible to break. Practice finding your moment when the conversation moves at 100mph.',
    objective: 'Break through the "dominator" cycle by sharing a thought during a brief pause.',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-project-diagram'
  },
  {
    id: 'presentation-qa',
    title: 'The Spotlight Question',
    category: 'Academic',
    description: 'You\'ve finished your slides, and now the room goes quiet, waiting for the Q&A. Navigate the sea of curious faces and the internal pressure to have perfect answers.',
    objective: 'Confidently acknowledge and answer a question, even if your answer is "Let me look into that further."',
    stage: SimulationStage.GUIDED_SMALL_GROUP,
    icon: 'fa-chalkboard-teacher'
  },
  {
    id: 'fresher-intro',
    title: 'The Hallway Hello',
    category: 'Social',
    description: 'The orientation hall is echoing with laughter from strangers. The awkwardness of the first "hello" is the hurdle. Practice turning a nod into a genuine connection.',
    objective: 'Navigate the post-hello pause by asking a follow-up about their journey to the university.',
    stage: SimulationStage.ONE_ON_ONE,
    icon: 'fa-door-open'
  },
  {
    id: 'hostel-adda',
    title: 'The Common Room Adda',
    category: 'Social',
    description: 'A casual hangout session where everyone seems to know the inside jokes. Overcome the feeling of being an observer and become a participant in the local dorm chatter.',
    objective: 'Share an opinion on a pop-culture topic without overthinking if it\'s "cool enough."',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-couch'
  },
  {
    id: 'job-interview',
    title: 'The Staring Panel',
    category: 'Professional',
    description: 'Three interviewers, one desk, and high-stakes questions. The room feels small, and the pressure is high. Practice keeping your voice steady under formal scrutiny.',
    objective: 'Answer a difficult question without the internal critic taking over.',
    stage: SimulationStage.GUIDED_SMALL_GROUP,
    icon: 'fa-briefcase'
  },
  {
    id: 'team-conflict',
    title: 'The Polite "No"',
    category: 'Professional',
    description: 'Someone suggests a plan that clearly won\'t work. The lump in your throat tells you to stay quiet, but the project needs your honesty. Practice gentle disagreement.',
    objective: 'State "I see it differently because..." and offer an alternative.',
    stage: SimulationStage.OPEN_GROUP,
    icon: 'fa-balance-scale'
  }
];
