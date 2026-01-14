
import { Message, Agent, SimulationStage, SimulationResponse, Scenario, UserProfile } from "../types";

const API_KEY = import.meta.env.VITE_CONVO_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

if (!API_KEY) {
    console.warn("⚠️ VITE_CONVO_API_KEY is missing in .env.local. Conversations will fail until a valid key is provided.");
}

const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        responses: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    agentId: { type: "string" },
                    text: { type: "string" },
                    emotion: {
                        type: "string",
                        enum: ['neutral', 'encouraging', 'thoughtful', 'challenging', 'friendly', 'supportive']
                    }
                },
                required: ["agentId", "text", "emotion"]
            }
        },
        suggestedPrompts: {
            type: "array",
            items: { type: "string" }
        }
    },
    required: ["responses", "suggestedPrompts"]
};

import { LocalSimulationEngine } from './localSimulationEngine';
import { Emotion } from '../types';

const SCENARIO_VIBES: Record<string, string> = {
    'conflict': 'Atmosphere: Tense, High Pressure. Agents are firm and may interrupt. Noise Level: Medium.',
    'casual': 'Atmosphere: Relaxed, Friendly, Low Stakes. Agents are chatty and supportive. Noise Level: Low.',
    'professional': 'Atmosphere: Formal, Polite, structured. Agents use professional jargon. Noise Level: Quiet Office.',
    'public': 'Atmosphere: Noisy, Distracting, fast-paced. Agents may be truncated or distracted. Noise Level: High.'
};

export const generateAgentResponses = async (
    stage: SimulationStage,
    activeAgents: Agent[],
    messages: Message[],
    topic: string,
    scenario?: Scenario,
    userProfile?: UserProfile,
    isObserverMode: boolean = false
): Promise<SimulationResponse> => {
    if (!activeAgents || activeAgents.length === 0) {
        return { responses: [], suggestedPrompts: [] };
    }

    const agentsContext = activeAgents.map(a => `${a.name} (${a.role}) [ID: ${a.id}]: ${a.personality}`).join("\n");
    const conversationHistory = messages.map(m => `${m.senderName}: ${m.text}`).join("\n");

    // Context Intelligence: Determine Vibe
    const scenarioType = scenario?.difficulty === 'Hard' ? 'conflict' : (scenario?.title.toLowerCase().includes('interview') ? 'professional' : 'casual');
    const vibe = SCENARIO_VIBES[scenarioType] || SCENARIO_VIBES['casual'];

    const systemPrompt = `
    You are the "Simulation Director" for ConvoVerse.
    
    GOAL:
    Create a highly realistic, non-repetitive conversation flow between the user (${userProfile?.name}) and multiple simulation agents.
    
    CURRENT STATE:
    - User Identity: ${userProfile?.name} (Style: ${userProfile?.archetype})
    - Social Goal: ${userProfile?.socialGoal}
    - MODE: ${isObserverMode ? "OBSERVER MODE (User is silently watching. Agents must converse with EACH OTHER.)" : "INTERACTIVE MODE (User is participating)."}
    
    SIMULATION CONTEXT (ACCURATE REALISM REQUIRED):
    - Mission: ${scenario ? `${scenario.title} (${scenario.objective})` : topic}
    - Setting: ${scenario?.description || 'A casual interaction space'}
    - VIBE SETTING: ${vibe}
    
    AGENTS INVOLVED (STRICT PERSONA ENFORCEMENT):
    ${agentsContext}
    (Agents must NEVER break character. If an agent is rude, they stay rude unless convinced otherwise.)

    PREVIOUS DIALOGUE:
    ${conversationHistory || '(Scene Start: Acknowledge the user and set the mood based on the Vibe)'}

    HCI SCAFFOLDING & BEHAVIORAL DIRECTIVES:
    1. ACTIVE LISTENING: Agents must acknowledge what the previous speaker said.
    2. OPEN-ENDED QUESTIONS: Keep the conversation moving.
    3. ${isObserverMode ? "OBSERVER DYNAMICS: The user is watching to learn. Agents should demonstrate healthy debate, active listening, and conflict resolution between THEMSELVES. Do NOT address the user directly unless inviting them in." : "ADAPTIVE CHALLENGE: If the user is doing well, push them slightly."}
    4. MULTI-AGENT DYNAMICS:
       - Agents should refer to each other.
       - Leo might disagree with Dr. Aris.
       - Sarah might support the user's point.
    5. SPEECH PATTERNS: Use natural, premium-quality dialogue. Avoid "As an AI..." or robotic structures.
    6. TURN-TAKING: Max 2 agents speak per turn.
    7. CONTEXT AWARENESS: Agents should react to each other.
    8. HUMAN FLAVOR: Use "Um," "Oh," "Actually," and varying sentence lengths.
    9. NO REPETITION: Do not repeat previous points.
    10. IDENTITIES: Use the exact agentId provided in the AGENTS list.

    OUTPUT:
    Return a JSON object with "responses" (max 2 agents per turn) and "suggestedPrompts" (3 items - relevant to what the user MIGHT say if they joined in).
  `;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generation_config: {
                    response_mime_type: "application/json",
                    response_schema: RESPONSE_SCHEMA,
                    temperature: 0.9,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No content from API");
        }

        const textResponse = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(textResponse);

        // Safety check for agent IDs
        parsed.responses = (parsed.responses || []).filter((r: any) => activeAgents.some(a => a.id === r.agentId));

        if (parsed.responses.length === 0) {
            // If no valid response, just continue or use fallback silently
            // For now, we'll let the fallback block catch it if needed, or return empty if logical
        }

        return parsed;

    } catch (error) {
        console.warn("Falling back to Local Engine:", error);

        // FALLBACK: Use Local Simulation Engine (Smart Mode)
        const agentToRespond = activeAgents[Math.floor(Math.random() * activeAgents.length)];
        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].text : "";

        const localResponse = LocalSimulationEngine.generateResponse(stage, agentToRespond, lastUserMessage);

        return {
            responses: [{
                agentId: agentToRespond.id,
                text: localResponse.text,
                emotion: localResponse.emotion as Emotion
            }],
            suggestedPrompts: [
                "Tell me more about that.",
                "I'm not sure I agree.",
                "Can we move to the next topic?"
            ]
        };
    }
};

export const generateCoachResponse = async (
    userProfile: UserProfile,
    messages: { text: string, isUser: boolean }[]
): Promise<string> => {
    const history = messages.map(m => `${m.isUser ? 'User' : 'Coach'}: ${m.text}`).join("\n");

    const systemPrompt = `
    You are the "Social Coach" for ConvoVerse.
    
    YOUR IDENTITY:
    - You are an empathetic, expert Social Communication Mentor.
    - Your tone is encouraging, non-judgmental, and practical.
    - You are NOT a simulation agent. You are outside the simulation, helping the user improve.

    USER CONTEXT:
    - Name: ${userProfile.name}
    - Archetype: ${userProfile.archetype || 'Learner'}
    - Goal: ${userProfile.socialGoal || 'To improve social confidence'}

    TASK:
    - Analyze the user's latest question.
    - Provide short, actionable advice (max 2-3 sentences).
    - Focus on psychological safety and practical tips.
    - If the user is discouraged, validate their feelings first.

    CHAT HISTORY:
    ${history}

    OUTPUT:
    Return explicitly the response text only. No JSON.
    `;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generation_config: {
                    temperature: 0.7,
                }
            })
        });

        if (!response.ok) return "I'm having a little trouble connecting to my brain, but remember: you're doing great! Try again in a moment.";

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        return text;
    } catch (error) {
        console.error("Coach API Error:", error);
        return "I'm here for you, but my connection is weak. You've got this!";
    }
};

export const getReflectionQuestions = async (messages: Message[]): Promise<string[]> => {
    const history = messages.map(m => `${m.senderName}: ${m.text}`).join("\n");
    const prompt = `
    Analyze this social practice session. Create 3 deep, empathetic reflection questions for the user.
    Focus on internal feelings, specific successes, and real-life application.
    
    Session History:
    ${history}

    Return JSON with a "questions" array of strings.
  `;

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generation_config: {
                    response_mime_type: "application/json",
                    response_schema: {
                        type: "object",
                        properties: {
                            questions: { type: "array", items: { type: "string" } }
                        },
                        required: ["questions"]
                    }
                }
            })
        });

        if (!response.ok) return ["How did it feel when the agents first spoke to you?", "Was there a moment you felt like saying more?", "What's one thing you'd change for next time?"];

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse).questions;
    } catch (error) {
        return ["How did it feel when the agents first spoke to you?", "Was there a moment you felt like saying more?", "What's one thing you'd change for next time?"];
    }
};
