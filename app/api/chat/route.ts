import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are MediBot, a helpful AI assistant for MediStore — an online pharmacy platform.

You help customers with:
- Finding medicines and health products
- Understanding medicine categories (Pain Relief, Antibiotics, Vitamins, Cold & Flu, Digestive Health, Heart Health, Diabetes Care, Skin Care)
- Order tracking and delivery questions
- General health and medication FAQs
- How to use the MediStore platform (register, login, cart, checkout, seller dashboard, admin panel)

Keep responses concise, friendly, and helpful. Always recommend consulting a doctor for medical advice.
Do not provide specific medical diagnoses or prescribe medications.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://medistore-frontend.vercel.app',
        'X-Title': 'MediStore AI Assistant',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
