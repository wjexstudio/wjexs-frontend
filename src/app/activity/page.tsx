"use client";
import React, { useEffect, useState } from 'react';

interface SessionItem {
  id: string;
  title: string;
  agent: string;
  time: string;
  status: 'completed' | 'verified' | 'cancelled';
}

export default function ActivityPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = () => {
    setLoading(true);
    fetch('http://localhost:8090/api/v1/dashboard/activity')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          setSessions(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'verified': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'completed': return 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20';
      case 'cancelled': return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700';
    }
  };

  const successRate = sessions.length > 0 
    ? Math.round((sessions.filter(s => s.status !== 'cancelled').length / sessions.length) * 100) 
    : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Activity Logs</h1>
        <p className="text-sm text-zinc-400 mt-1">Track system operations and agent sessions from Markdown history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 flex-shrink-0">
        <div className="bg-[#09090b] sketchy-border border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
            <i className="bx bx-pulse text-2xl"></i>
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Logged Activities</p>
            <h2 className="text-2xl font-bold text-zinc-100">{sessions.length}</h2>
          </div>
        </div>
        <div className="bg-[#09090b] sketchy-border border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <i className="bx bx-check-shield text-2xl"></i>
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Completion Rate</p>
            <h2 className="text-2xl font-bold text-zinc-100">{successRate}%</h2>
          </div>
        </div>
      </div>

      <div className="bg-[#09090b] sketchy-border border border-white/5 rounded-2xl overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#0a0a0c] flex-shrink-0">
          <h2 className="text-lg font-medium text-zinc-200">Historical Timeline</h2>
          <button onClick={fetchActivity} className="text-sm text-brand-orange hover:text-brand-orange/80 font-medium transition-colors flex items-center gap-2">
            <i className={`bx bx-refresh text-lg ${loading ? 'bx-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {loading ? (
             <div className="p-8 text-center text-zinc-500">Loading activities...</div>
          ) : sessions.length === 0 ? (
             <div className="p-8 text-center text-zinc-500">No activities found in history.</div>
          ) : (
            <div className="divide-y divide-white/5">
              {sessions.map(session => (
                <div key={session.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition-colors flex-shrink-0">
                      <i className="bx bx-terminal text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors line-clamp-2 pr-4">{session.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                        <span className="font-medium text-zinc-400">{session.agent}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <i className="bx bx-time"></i>
                          {session.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
