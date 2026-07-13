'use client';
import React from 'react';
import { Activity, Clock, Terminal, CheckCircle2 } from 'lucide-react';

interface SessionItem {
  id: string;
  title: string;
  agent: string;
  time: string;
  status: 'completed' | 'in_progress' | 'failed';
}

const mockSessions: SessionItem[] = [
  { id: '1', title: 'Refactor UI Components', agent: 'Anna', time: '10 mins ago', status: 'completed' },
  { id: '2', title: 'Database Schema Update', agent: 'Yod', time: '1 hour ago', status: 'completed' },
  { id: '3', title: 'E2E Testing for Auth', agent: 'Tracy', time: '2 hours ago', status: 'in_progress' },
  { id: '4', title: 'Review Code Quality', agent: 'Tim', time: '5 hours ago', status: 'failed' },
  { id: '5', title: 'Project Initialization', agent: 'Lewis', time: 'Yesterday', status: 'completed' }
];

export default function ActivityPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Activity</h1>
        <p className="text-sm text-zinc-400 mt-1">Track agent sessions and system operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Recent Sessions</p>
            <h2 className="text-2xl font-bold text-zinc-100">142</h2>
          </div>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Success Rate</p>
            <h2 className="text-2xl font-bold text-zinc-100">98%</h2>
          </div>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
          <h2 className="text-lg font-medium text-zinc-200">Recent Sessions List</h2>
          <button className="text-sm text-brand-orange hover:text-brand-orange/80 font-medium transition-colors">
            Refresh Batch
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {mockSessions.map(session => (
            <div key={session.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  <Terminal size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors">{session.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <span className="font-medium text-zinc-400">{session.agent}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {session.time}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  session.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {session.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
