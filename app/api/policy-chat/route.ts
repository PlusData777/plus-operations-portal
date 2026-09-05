import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GLOBAL_POLICY_CONTEXT = `
You are the official PLUS OPS Policy Assistant for the Pakistan Legal United Society.
Your job is to answer staff questions accurately based on PLUS operational policies.
If a staff member asks something not covered, advise them to contact their Line Manager.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: GLOBAL_POLICY_CONTEXT,
        temperature: 0.2,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Policy AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to query the policy assistant.' },
      { status: 500 }
    );
  }
}
