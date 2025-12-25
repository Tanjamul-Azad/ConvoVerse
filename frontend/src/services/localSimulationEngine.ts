
import { Agent, SimulationStage } from "../types";

// A robust local simulation engine to ensure "functionable" agents even without an API key
export class LocalSimulationEngine {
    private static templates = {
        [SimulationStage.ONE_ON_ONE]: [
            "That's an interesting perspective. How does that make you feel personally?",
            "I see. Can you tell me more about why you think that?",
            "It sounds like this is important to you. What would be your ideal outcome?",
            "I appreciate you sharing that. It takes courage to be open.",
            "That makes sense. Have you considered how others might see it?"
        ],
        [SimulationStage.GUIDED_SMALL_GROUP]: [
            "I'd like to jump in here. I agree with what you said about...",
            "Wait, I have a slightly different view. Have we thought about...",
            "That's a great point! It reminds me of...",
            "I'm not sure I fully agree, but I respect your opinion.",
            "Does anyone else have thoughts on what was just said?"
        ],
        [SimulationStage.OPEN_GROUP]: [
            "I understand your frustration, but we need to find a middle ground.",
            "I hear what you're saying. Let's try to focus on the solution.",
            "That came across a bit strong. Can we take a step back?",
            "I want to understand your side better. Can you explain that again?",
            "Let's check in with everyone else. How are we all feeling about this?"
        ],
        [SimulationStage.REFLECTION]: [
            "Reflecting on our chat, what was the most challenging part for you?",
            "How do you feel about your progress in this session?",
            "What is one thing you would do differently next time?",
            "It's great to look back and see how far you've come.",
            "Take a moment to appreciate the effort you put in today."
        ]
    };

    private static specificResponses: Record<string, string[]> = {
        // Keywords to match against user input
        "nervous": ["It's completely normal to feel nervous. We're just exploring ideas here.", "Take your time. There's no rush properly."],
        "scared": ["Fear is often just excitement without breath. You're doing great.", "We are here to support you, not judge you."],
        "agree": ["I'm glad we're on the same page!", "It's great to find common ground."],
        "disagree": ["Disagreement is healthy! It helps us explore new ideas.", "I appreciate your honesty. It's okay to see things differently."],
        "hello": ["Hello! It's great to meet you.", "Hi there! Ready to get started?"],
        "hi": ["Hey! Glad you're here.", "Hello! Looking forward to our chat."],
        "help": ["I'm here to help. What do you need specifically?", "We can work through this together."],
        "bye": ["Great session today! Take care.", "See you next time! You did well."],
        "thanks": ["You're very welcome!", "Happy to help."],
        "sorry": ["No need to apologize! We're just practicing.", "It's all part of the learning process."],
    };

    static generateResponse(
        stage: SimulationStage,
        agent: Agent,
        lastUserMessage: string
    ): { text: string; emotion: string } {
        const lowerInput = lastUserMessage.toLowerCase();

        // 1. Check for specific keyword triggers
        for (const [keyword, responses] of Object.entries(this.specificResponses)) {
            if (lowerInput.includes(keyword)) {
                return {
                    text: responses[Math.floor(Math.random() * responses.length)],
                    emotion: "supportive"
                };
            }
        }

        // 2. Fallback to stage-based contextual templates (more variety)
        const templates = this.templates[stage] || this.templates[SimulationStage.ONE_ON_ONE];
        const template = templates[Math.floor(Math.random() * templates.length)];

        // Customize heavily based on role to feel "real"
        let responseText = template;
        let emotion = "neutral";

        if (agent.role === 'peer') {
            if (agent.personality.includes('Skeptic') || agent.personality.includes('Direct')) {
                responseText = `Hmm. ${responseText} But are we sure about that?`;
                emotion = "challenging";
            } else {
                responseText = `(Smiling) ${responseText}`;
                emotion = "encouraging";
            }
        } else if (agent.role === 'facilitator') {
            responseText = `Valid point. ${responseText} Let's explore that further.`;
            emotion = "thoughtful";
        }

        // Inject agent personality flavor
        if (agent.personality.includes("Direct")) {
            responseText = responseText.replace("I see.", "Got it.").replace("That's an interesting perspective.", "Interesting take.");
        } else if (agent.personality.includes("Warm")) {
            responseText = responseText.replace(".", "!").replace("I see.", "I totally get that.");
        }

        return { text: responseText, emotion };
    }
}
