"use client";
import React, { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

export default function PolicyAssistant() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/policy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setChatHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        throw new Error('No reply generated');
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble accessing the policy database right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 border-b pb-3 mb-3">
        <MessageSquare className="w-5 h-5 text-[#0052CC]" />
        <h3 className="font-bold text-slate-800 text-sm">PLUS Policy Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 text-sm">
        {chatHistory.length === 0 && (
          <p className="text-slate-500 text-center mt-4">Ask me anything about PLUS HR, Leave, or Finance policies.</p>
        )}
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`p-3 rounded-xl max-w-[85%] ${msg.role === 'user' ? 'bg-[#0052CC] text-white ml-auto' : 'bg-slate-100 text-slate-800 mr-auto'}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="bg-slate-100 text-slate-500 p-3 rounded-xl mr-auto max-w-[85%] flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Searching policies...
          </div>
        )}
      </div>

      <form onSubmit={handleAskQuestion} className="relative mt-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., How many casual leaves am I allowed?"
          className="w-full bg-slate-50 border rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-[#0052CC]"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !query.trim()}
          className="absolute right-2 top-2 text-[#0052CC] disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
