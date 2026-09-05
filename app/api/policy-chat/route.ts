import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is not defined in Vercel.' },
        { status: 500 }
      );
    }

    const { message } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    const GLOBAL_POLICY_CONTEXT = `
You are the official PLUS OPS Policy Assistant for the Pakistan Legal United Society.
Your job is to answer staff questions accurately based on PLUS operational policies.
If a staff member asks something not covered, advise them to contact their Line Manager.
`;

    // Attempt generation with gemini-2.0-flash or gemini-1.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: message,
      config: {
        systemInstruction: GLOBAL_POLICY_CONTEXT,
        temperature: 0.2,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Policy AI Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to query the policy assistant.' },
      { status: 500 }
    );
  }
}
