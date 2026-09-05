"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Minimize2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

export default function PolicyAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: 'Assalam-o-Alaikum! I am **Apna OPS**, your AI operations guide. You can type or tap the microphone to ask questions.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Configure Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setInputMessage(spokenText);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-to-Speech Handler
  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop active speech

    // Clean markdown formatting before speaking
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported by your browser. Chrome or Edge is recommended.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

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
      speakText(data.reply);
    } catch (err: any) {
      const fallback = 'Sorry, I am having trouble connecting to the policy network right now.';
      setChatHistory(prev => [...prev, { role: 'ai', text: fallback }]);
      speakText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING LAUNCHER */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
        {!isOpen && (
          <div className="hidden sm:flex items-center px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-lg shadow-black/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1.5 animate-pulse" />
            Talk to Apna OPS
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0052CC]/80 via-blue-600/70 to-cyan-500/70 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center shadow-[0_8px_32px_0_rgba(0,82,204,0.37)] hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Toggle Apna OPS"
        >
          {isOpen ? <X className="w-6 h-6 drop-shadow" /> : <Bot className="w-7 h-7 drop-shadow" />}
        </button>
      </div>

      {/* GLASS CHAT MODAL */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[80vh] flex flex-col rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300">
          
          {/* HEADER WITH VOICE TOGGLE */}
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
                <p className="text-[10px] text-blue-200/80 font-medium">Interactive Voice Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  const nextState = !isVoiceOutputEnabled;
                  setIsVoiceOutputEnabled(nextState);
                  if (!nextState && typeof window !== 'undefined') window.speechSynthesis?.cancel();
                }}
                title={isVoiceOutputEnabled ? "Mute Spoken Replies" : "Enable Spoken Replies"}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isVoiceOutputEnabled
                    ? 'bg-cyan-500/30 border-cyan-400/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                }`}
              >
                {isVoiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
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

          {/* INPUT BAR WITH MICROPHONE */}
          <div className="p-3 bg-white/10 border-t border-white/10 backdrop-blur-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-black/20 border border-white/20 rounded-2xl px-3 py-1.5 focus-within:border-cyan-400/60 focus-within:ring-1 focus-within:ring-cyan-400/40 transition-all"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-1.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-500/80 border-rose-400 text-white animate-pulse'
                    : 'bg-white/10 border-white/10 text-white/70 hover:text-white'
                }`}
                title={isListening ? "Stop listening" : "Speak to Apna OPS"}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask Apna OPS anything..."}
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
