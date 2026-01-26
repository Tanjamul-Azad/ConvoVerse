
export enum SimulationStage {
  ONE_ON_ONE = 'ONE_ON_ONE',
  GUIDED_SMALL_GROUP = 'GUIDED_SMALL_GROUP',
  OPEN_GROUP = 'OPEN_GROUP',
  REFLECTION = 'REFLECTION'
}

export type Emotion = 'neutral' | 'encouraging' | 'thoughtful' | 'challenging' | 'friendly' | 'supportive';

export type UserArchetype = 'Quiet Observer' | 'Thoughtful Connector' | 'Anxious Achiever' | 'Direct Communicator';

export interface UserProfile {
  name: string;
  archetype: UserArchetype;
  interests: string[];
  painPoints: string[];
  socialGoal: string;
}

export interface User {
  id: string;
  email: string;
  password?: string; // stored in localstorage for mock auth only
  name: string;
  profile?: UserProfile;
}

export interface Agent {
  id: string;
  name: string;
  role: 'peer' | 'facilitator';
  personality: string;
  avatarUrl: string;
  color: string;
  // Advanced Config (Optional)
  communicationStyle?: string;
  emotionalTone?: string;
  behavioralIntent?: 'supportive' | 'neutral' | 'encouraging';
  traits?: {
    formality: number; // 0-100
    empathy: number; // 0-100
    directness: number; // 0-100
    responseLength: number; // 0-100
  };
  anchors?: { input: string; response: string }[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isUser: boolean;
  isFacilitator?: boolean;
  emotion?: Emotion;
}

export interface ScenarioTheme {
  primary: string;         // Main accent color (buttons, active states)
  gradient: string;        // Gradient for backgrounds
  textColor: string;       // Primary text color
  userBubble: string;      // User message bubble color/style
  agentBubble: string;     // Agent message bubble color/style
  bgImage?: string;        // Optional background image pattern
}

export interface Scenario {
  id: string;
  title: string;
  category: 'Academic' | 'Social' | 'Professional' | 'Personal';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  emotionalIntensity: 'Low' | 'Medium' | 'High';
  description: string;
  objective: string;
  stage: SimulationStage;
  icon: string;
  image?: string;
  // Dynamic Theming & Overrides
  theme?: ScenarioTheme;
  customAgents?: Agent[];
}

export interface SimulationSession {
  stage: SimulationStage;
  messages: Message[];
  activeAgents: Agent[];
  topic: string;
}

export interface SimulationResponse {
  responses: {
    agentId: string;
    text: string;
    emotion: Emotion;
  }[];
  suggestedPrompts: string[];
}
