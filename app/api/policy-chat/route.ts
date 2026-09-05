import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Replace this string with the actual text of your PLUS policies, 
// or fetch it from a Supabase 'policies' table if you prefer dynamic updates.
const GLOBAL_POLICY_CONTEXT = `
You are the official PLUS OPS Policy Assistant for the Pakistan Legal United Society.
Your job is to answer staff questions accurately based ONLY on the following policies:

[INSERT FULL HR MANUAL TEXT HERE]
[INSERT FINANCE REQUISITION RULES HERE]
[INSERT LEAVE ACCRUAL POLICIES HERE]

If a staff member asks something not covered in these texts, politely state that you do not have that information and advise them to contact their Line Manager.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: GLOBAL_POLICY_CONTEXT,
        temperature: 0.2, // Low temperature keeps answers factual and strictly tied to policies
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Policy AI Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to the policy knowledge base.' }, 
      { status: 500 }
    );
  }
}
