
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

export interface Agent {
  id: string;
  name: string;
  role: 'peer' | 'facilitator';
  personality: string;
  avatarUrl: string;
  color: string;
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

export interface Scenario {
  id: string;
  title: string;
  category: 'Academic' | 'Social' | 'Professional';
  description: string;
  objective: string;
  stage: SimulationStage;
  icon: string;
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
