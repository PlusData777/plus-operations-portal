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
You are "Apna OPS", the official AI Policy and Operations Companion for the Pakistan Legal United Society (PLUS).
Your role is to assist team members with questions regarding operational rules, leave entitlements, travel allowances, anti-harassment, disability inclusion, safeguarding, and child protection.

GUIDELINES:
1. Greet team members warmly (e.g., "Assalam-o-Alaikum!").
2. Answer based strictly on the policies provided below.
3. Be concise, respectful, and direct. Use bold highlights and clear bullet points for numbers and rules.
4. Always cite the exact policy section when quoting an entitlement or regulation.
5. If an operational question is not found in the documents, state it plainly and advise the user to contact their Line Manager or the Operations/HR department.

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
    console.error('Apna OPS Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to query Apna OPS.' },
      { status: 500 }
    );
  }
}
