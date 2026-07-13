"use client";

import React, { useEffect, useState, useRef } from 'react';

interface Rule {
  id: string;
  title: string;
  description: string;
  active: boolean;
}

interface LogEvent {
  timestamp: string;
  message: string;
  level: string;
}

export default function GatesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const fetchRules = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/v1/dashboard/gates')
      .then(res => res.json())
      .then(data => {
        setRules(data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load rules.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    let eventSource: EventSource;
    
    const connectSSE = () => {
      setWsStatus('connecting');
      eventSource = new EventSource('http://localhost:8080/api/v1/dashboard/gates/events');
      
      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setLogs(prev => [...prev, data]);
        setWsStatus('online');
      };

      eventSource.onerror = () => {
        setWsStatus('offline');
        eventSource.close();
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const toggleRule = async (id: string, currentState: boolean) => {
    // Optimistic update
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !currentState } : r));
    
    try {
      const res = await fetch(`http://localhost:8080/api/v1/dashboard/gates/${id}/toggle`, {
        method: 'PATCH'
      });
      if (!res.ok) throw new Error('Toggle failed');
    } catch (err) {
      // Revert on failure
      setRules(prev => prev.map(r => r.id === id ? { ...r, active: currentState } : r));
      alert('Failed to toggle rule');
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Active Guardrail Hooks</h1>
          <p className="text-sm text-zinc-400 mt-1">GATES Intelligence - Automated workflow enforcement</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-0 flex-1">
        {/* Rules List */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#09090b] rounded-2xl sketchy-border border border-white/5 p-6 overflow-hidden">
          <h2 className="text-xl font-medium text-white mb-6 flex-shrink-0">System Rules</h2>
          
          <div className="overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {loading ? (
              <div className="text-zinc-500 animate-pulse">Loading rules...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : rules.length === 0 ? (
              <div className="text-zinc-400">ยังไม่มีการตั้งค่ากฎ</div>
            ) : (
              rules.map(rule => (
                <div key={rule.id} className="p-5 bg-white/5 border border-white/5 sketchy-border rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-zinc-200 font-medium mb-2">{rule.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{rule.description}</p>
                  </div>
                  <button 
                    onClick={() => toggleRule(rule.id, rule.active)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.active ? 'bg-brand-orange' : 'bg-zinc-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Log Panel */}
        <div className="w-full lg:w-[400px] flex flex-col min-h-0 bg-[#050505] rounded-2xl sketchy-border border border-white/5 overflow-hidden font-mono">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0c] flex-shrink-0">
            <div className="flex items-center gap-3">
              <i className="bx bx-terminal text-zinc-400 text-lg"></i>
              <span className="text-sm font-medium text-zinc-300">Hook Interceptor</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${wsStatus === 'online' ? 'bg-emerald-500' : wsStatus === 'connecting' ? 'bg-amber-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{wsStatus}</span>
              </span>
              <button 
                onClick={() => setLogs([])}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                CLEAR
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 text-xs space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-zinc-600 flex-shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                <span className="text-zinc-400 break-all">{log.message}</span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
