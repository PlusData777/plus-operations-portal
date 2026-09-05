"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Minimize2 } from 'lucide-react';

export default function PolicyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: 'Assalam-o-Alaikum! I am **Apna OPS**, your AI operations guide. Ask me anything about leaves, expense policies, code of conduct, or child protection.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setChatHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/policy-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      setChatHistory(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', text: 'Sorry, I am having trouble connecting to the policy network right now.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING SIDE LAUNCHER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        {!isOpen && (
          <div className="hidden sm:flex items-center px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-lg shadow-black/20 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1.5 animate-pulse" />
            Talk to Apna OPS
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0052CC]/80 via-blue-600/70 to-cyan-500/70 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,82,204,0.37)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Toggle Apna OPS"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
          {isOpen ? <X className="w-6 h-6 drop-shadow" /> : <Bot className="w-7 h-7 drop-shadow" />}
        </button>
      </div>

      {/* FROSTED GLASS CHAT POPUP */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[80vh] flex flex-col rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95">
          {/* POPUP HEADER */}
          <div className="flex items-center justify-between px-5 py-4 bg-white/10 border-b border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-inner border border-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Apna OPS
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-[10px] text-blue-200/80 font-medium">PLUS AI Policy Companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* CHAT LOG */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/20">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 border ${
                    chat.role === 'user'
                      ? 'bg-blue-600/60 border-blue-400/40 text-white'
                      : 'bg-white/15 border-white/20 text-cyan-300'
                  }`}
                >
                  {chat.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    chat.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600/80 to-[#0052CC]/90 text-white border border-blue-400/30 rounded-tr-none shadow-md'
                      : 'bg-white/15 text-slate-100 border border-white/15 rounded-tl-none backdrop-blur-md shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{chat.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-white/70 text-xs pl-2">
                <Bot className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Apna OPS is checking policy documents...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTION CHIPS */}
          <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-white/5 bg-black/10">
            <button
              onClick={() => handleSendMessage("How many annual leaves do I have?")}
              className="whitespace-nowrap text-[10px] text-blue-100 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-full transition"
            >
              🏖️ Leave Quotas
            </button>
            <button
              onClick={() => handleSendMessage("What is the daily field meal allowance?")}
              className="whitespace-nowrap text-[10px] text-blue-100 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-full transition"
            >
              🍽️ Meal Allowance
            </button>
            <button
              onClick={() => handleSendMessage("Who approves expenses over 25,000?")}
              className="whitespace-nowrap text-[10px] text-blue-100 bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-full transition"
            >
              📝 Approval Limits
            </button>
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-white/10 border-t border-white/10 backdrop-blur-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-black/20 border border-white/20 rounded-2xl px-3 py-1.5 focus-within:border-cyan-400/60 focus-within:ring-1 focus-within:ring-cyan-400/40 transition-all"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Apna OPS anything..."
                className="flex-1 bg-transparent text-xs text-white placeholder-white/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
