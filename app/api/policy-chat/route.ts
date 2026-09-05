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
You assist staff with policy questions, lookup their request statuses, check policy compliance, and help draft requisitions.

CAPABILITIES:
1. Multilingual: Understand and respond in English, Urdu (اردو), or Roman Urdu based on user preference.
2. User Data Context:
   - Current Staff: ${JSON.stringify(currentUser || {})}
   - Active Expense Claims: ${JSON.stringify(userRequests || [])}
   - Active Leave Requests: ${JSON.stringify(userLeaves || [])}
3. Status Lookups: If the user asks about their recent claims, pending approvals, or leaves, summarize their actual data concisely.
4. Policy Enforcement:
   - Expenses > PKR 25,000 need Level 2 (Executive) approval.
   - Field meal allowance is PKR 1,500/day.
   - Casual leave: max 3 consecutive days, 10 days/year.
   - Sick leave: > 2 consecutive days requires medical prescription.
5. Form Auto-Fill Intent:
   If the user wants to apply for leave or submit a requisition (e.g. "I want 2 days casual leave next Monday for personal work" or "Claim 5000 for travel"), provide a helpful text reply AND include an action block at the very end formatted strictly as:
   <<<ACTION:{"type":"leave"|"finance","data":{...}}>>>

   - For leave: data should include {"leave_type":"Casual Leave"|"Annual Leave"|"Sick Leave","start_date":"YYYY-MM-DD","end_date":"YYYY-MM-DD","reason":"..."}
   - For finance: data should include {"expense_head":"...","amount":number,"notes":"..."}

OFFICIAL POLICIES:
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
