import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GLOBAL_POLICY_CONTEXT = `
You are the official PLUS OPS Policy Assistant for the Pakistan Legal United Society.
Answer staff questions accurately based on PLUS operational policies.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: GLOBAL_POLICY_CONTEXT,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Policy AI Error:', error);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
