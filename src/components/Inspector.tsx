'use client';

import React from 'react';
import type { AgentState } from '@/server/agent/state';

interface InspectorProps {
  state: AgentState | null;
}

export const Inspector: React.FC<InspectorProps> = ({ state }) => {
  if (!state) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-sm border-l border-zinc-800 bg-zinc-900/50 p-4">
        waiting for agent state...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs bg-zinc-950 border-l border-zinc-800 overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
        <h2 className="text-sm font-semibold text-zinc-300 mb-2">Internal State Inspector</h2>
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Intent</span>
                <span className="text-emerald-400">{state.intent || 'N/A'}</span>
            </div>
            <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Security</span>
                <span className={state.securityOutcome === 'denied' ? 'text-red-400' : 'text-blue-400'}>
                    {state.securityOutcome || 'pending'}
                </span>
            </div>
             <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Verified</span>
                <span className={state.isVerified ? 'text-green-400' : 'text-zinc-400'}>
                    {state.isVerified ? 'TRUE' : 'FALSE'}
                </span>
            </div>
             <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                <span className="text-zinc-500 block mb-1">Session</span>
                <span className="text-zinc-300 truncate block" title={state.sessionId}>{state.sessionId}</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <div className="mb-4">
            <h3 className="text-zinc-500 mb-2 font-semibold">Message History ({state.messages?.length || 0})</h3>
            <div className="space-y-2">
                {state.messages?.map((m: any, i: number) => (
                    <div key={i} className="bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
                        <div className="text-zinc-500 text-[10px] uppercase mb-1 flex justify-between">
                            <span>{m.id || m.name || m.constructor?.name || 'Message'}</span>
                            <span>{m._getType ? m._getType() : 'unknown'}</span>
                        </div>
                        <div className="text-zinc-300 whitespace-pre-wrap break-words">
                            {typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}
                        </div>
                         {m.tool_calls && m.tool_calls.length > 0 && (
                            <div className="mt-2 pl-2 border-l-2 border-amber-500/30">
                                <span className="text-amber-500 block mb-1">Tool Calls:</span>
                                {m.tool_calls.map((tc: any, idx: number) => (
                                    <div key={idx} className="text-amber-300/80">
                                        {tc.name}({JSON.stringify(tc.args)})
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-zinc-500 mb-2 font-semibold">Raw State</h3>
            <pre className="text-[10px] text-zinc-400 bg-zinc-900 p-2 rounded overflow-x-auto border border-zinc-800">
                {JSON.stringify(state, null, 2)}
            </pre>
        </div>
      </div>
    </div>
  );
};
