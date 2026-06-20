import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';


const SYSTEM_PROMPT = `You are "Eco", the friendly and knowledgeable AI Carbon Coach for CarbonQuest.
Your mission is to help individuals understand, track, and reduce their carbon footprint.
You should:
1. Keep responses highly personalized, encouraging, action-oriented, and concise (under 3 paragraphs).
2. Avoid generic advice; instead, suggest micro-habits that make a high impact.
3. Help users connect their carbon numbers (kg CO2) to understandable metaphors (e.g., "That's like charging X smartphones" or "driving Y miles").
4. Always maintain a positive, gamified tone. Celebrate their streak and level.
5. If the user asks a question about sustainability, diet, transport, or energy, give them a factual, clear, and actionable answer.
`;

const FALLBACK_RESPONSES = [
  "Hi! I'm Eco, your AI Carbon Coach. To unlock custom real-time advice powered by Llama 3, please configure the `GROQ_API_KEY` in your `.env.local` file.\n\nIn the meantime, looking at your logged activities, here is an action plan: try reducing dairy consumption or swapping one car commute for public transit. That can save up to 3.2 kg of CO₂ today!",
  "Great job logging your activities! 🌱 Fun fact: switching laundry washing from hot water to cold saves about 0.3 kg of CO₂ per cycle and extends the life of your clothes. What area of your footprint are you looking to reduce next?",
  "Streak check! 🔥 Keeping up your daily logging builds awareness. Try setting a mini-goal this week: walk any trip under 2 kilometers. It's great for your health and keeps emissions at absolute zero!",
];

export async function POST(req: Request) {
  try {
    const { message, userContext, chatHistory, customApiKey } = await req.json();

    const apiKeyToUse = customApiKey || process.env.GROQ_API_KEY || '';

    if (!apiKeyToUse) {
      if (message === 'ping') {
        return NextResponse.json({
          content: "NO_API_KEY_CONFIGURED",
          isConfigured: false
        });
      }
      const randomIdx = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
      return NextResponse.json({
        content: FALLBACK_RESPONSES[randomIdx],
        isConfigured: false
      });
    }

    if (message === 'ping') {
      try {
        const groqTest = new Groq({
          apiKey: apiKeyToUse,
        });
        await groqTest.chat.completions.create({
          messages: [{ role: 'user', content: 'ping' }],
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1,
        });
        return NextResponse.json({
          content: 'pong',
          isConfigured: true
        });
      } catch (err: unknown) {
        console.error('API key verification failed:', err);
        return NextResponse.json({
          content: 'NO_API_KEY_CONFIGURED',
          isConfigured: false
        });
      }
    }

    const groq = new Groq({
      apiKey: apiKeyToUse,
    });

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.slice(-6).map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: `User Context:
Name: ${userContext.name}
Level: ${userContext.level}
XP: ${userContext.xp}
Streak: ${userContext.streak}
Today's CO2: ${userContext.todayCO2.toFixed(2)} kg
Total CO2 Saved: ${userContext.totalCO2Saved.toFixed(2)} kg
Preferred Diet: ${userContext.diet}
Primary Transport: ${userContext.transport}
Home Energy Source: ${userContext.energySource}

User message: ${message}`,
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm having trouble analyzing the data right now. Keep up the green work!";

    return NextResponse.json({ content: reply });
  } catch (error: unknown) {
    console.error('Error in AI Coach API:', error);
    return NextResponse.json(
      { content: "I'm experiencing some traffic, but here is a quick tip: unplugging household chargers when not in use stops standby power consumption, saving about 0.1 kg of CO2 daily!" },
      { status: 200 } // Return 200 with standard tip so the UI doesn't crash
    );
  }
}
