import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { PLUS_ORGANIZATIONAL_POLICIES } from '@/lib/policyContent';

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
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const SYSTEM_INSTRUCTION = `
You are the official PLUS OPS Policy Assistant for the Pakistan Legal United Society.
Your job is to assist organizational staff members with questions regarding operational, HR, and program compliance policies.

GUIDELINES:
1. Always base your answers directly on the official policies provided below.
2. Clearly cite the relevant policy section (e.g., "Under the Anti-Harassment Policy..." or "According to the Child Protection Policy...").
3. Be professional, supportive, objective, and precise.
4. If a user asks about an operational matter not covered in these texts (such as specific travel per diems or hardware budgets), clearly advise them to refer to their Line Manager or the Operations/HR department.

${PLUS_ORGANIZATIONAL_POLICIES}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
