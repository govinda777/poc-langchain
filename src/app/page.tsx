'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const agentMessage = { role: 'assistant', content: data.response || 'No response' };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'system', content: '⚠ Error communicating with agent.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 text-zinc-100 font-sans selection:bg-teal-500/30">
      <header className="w-full max-w-4xl py-6 px-4 flex justify-between items-center border-b border-zinc-800/50 backdrop-blur-sm sticky top-0 bg-zinc-950/80 index-10">
        <h1 className="text-2xl font-light tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
          Cognitive Agent PoC
        </h1>
        <div className="text-xs font-mono text-zinc-500 flex gap-2 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          ONLINE
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col p-4 gap-4">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 opacity-50">
            <p>Start a conversation to begin...</p>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200 ${msg.role === 'user'
                    ? 'bg-zinc-800 text-zinc-50 rounded-br-none hover:bg-zinc-700'
                    : msg.role === 'system'
                      ? 'bg-red-900/20 text-red-400 border border-red-900/50'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none hover:border-zinc-700'
                  }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-none px-5 py-4 flex gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full max-w-4xl p-4 mb-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
          <div className="relative flex items-center bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl focus-within:ring-1 focus-within:ring-teal-500/50 transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent px-5 py-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-5 py-2 mr-2 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-lg hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-zinc-600">Cognitive Agent v2.0 • Powered by LangChain</p>
        </div>
      </footer>
    </div>
  );
}
