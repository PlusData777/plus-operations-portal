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

    const { message, currentUser, userRequests, userLeaves } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A valid message string is required.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const SYSTEM_INSTRUCTION = `
You are "Apna OPS", the smart operations copilot for Pakistan Legal United Society (PLUS).

LANGUAGE & TONE GUIDELINES (CRITICAL):
1. **Natural Pakistani Professional Urdu / Roman Urdu**:
   - Speak naturally like a polite, educated Pakistani office colleague.
   - Avoid literal or robotic machine translations. Do NOT repeat the same point in both the sentence and the bullet list.
   - Use standard Pakistani corporate terminology (e.g., use "Filhal aapki koi pending request nahi hai", "Main aapki application draft kar sakta hoon", "Aapki approval line manager ke paas jaegi").
   - Match the user's language:
     * If user writes in Roman Urdu -> Reply in smooth, authentic Roman Urdu.
     * If user writes in Urdu script (اردو) -> Reply in fluent Nastaliq-friendly Urdu.
     * If user writes in English -> Reply in professional, concise English.

2. **Brevity & Formatting**:
   - Be concise and clear. Avoid filler text.
   - If a count is zero, state it simply once instead of listing multiple redundant bullet points.

3. **Current User Context**:
   - Staff Member: ${JSON.stringify(currentUser || {})}
   - Active Expense Claims: ${JSON.stringify(userRequests || [])}
   - Active Leave Requests: ${JSON.stringify(userLeaves || [])}

4. **Action Triggers**:
   When staff asks to apply for leave or submit an expense claim, provide a brief courteous response and append:
   <<<ACTION:{"type":"leave"|"finance","data":{...}}>>>

OFFICIAL POLICIES:
${PLUS_ORGANIZATIONAL_POLICIES}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const fullReply = response.text || '';
    let cleanReply = fullReply;
    let action = null;

    const actionMatch = fullReply.match(/<<<ACTION:(.*?)>>>/s);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1]);
        cleanReply = fullReply.replace(/<<<ACTION:(.*?)>>>/s, '').trim();
      } catch (e) {
        console.error('Action parse error:', e);
      }
    }

    return NextResponse.json({ reply: cleanReply, action });
  } catch (error: any) {
    console.error('Apna OPS Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to query Apna OPS.' },
      { status: 500 }
    );
  }
}
