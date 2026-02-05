'use client';

import { useState } from 'react';
import { Inspector } from '@/components/Inspector';
import type { AgentState } from '@/server/agent/state';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestAgentState, setLatestAgentState] = useState<AgentState | null>(null);

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

      if (data.agentState) {
        setLatestAgentState(data.agentState);
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

  const clearChat = () => {
    setMessages([]);
    setLatestAgentState(null);
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 font-sans selection:bg-teal-500/30 overflow-hidden">
      {/* Left Panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-zinc-800">
        <header className="flex-none py-4 px-6 flex justify-between items-center border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm z-10">
          <h1 className="text-xl font-light tracking-tight bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Cognitive Agent PoC
          </h1>
          <div className="flex items-center gap-3">
             <button
              onClick={clearChat}
              className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
             >
                Clear
             </button>
            <div className="text-xs font-mono text-zinc-500 flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50">
                <p>Start a conversation to begin...</p>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200 ${msg.role === 'user'
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
          </div>

          <div className="flex-none pt-2">
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
          </div>
        </main>
      </div>

      {/* Right Panel: Inspector */}
      <div className="w-[400px] hidden lg:block h-full bg-zinc-950 flex-none">
        <Inspector state={latestAgentState} />
      </div>
    </div>
  );
}
