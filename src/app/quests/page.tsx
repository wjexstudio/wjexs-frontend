'use client';
import React, { useState } from 'react';
import { Play, Clock, Activity, Calendar, MoreVertical, Zap, CheckCircle2 } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  project: string;
  mode: 'do_now' | 'do_later' | 'monitor' | 'reminder';
  priority: number;
}

const initialQuests: Quest[] = [
  { id: '1', title: 'Implement Characters API', project: 'wjexs-backend', mode: 'do_now', priority: 1 },
  { id: '2', title: 'Update README documentation', project: 'wjexstudio-os', mode: 'do_later', priority: 2 },
  { id: '3', title: 'Monitor server memory usage', project: 'wjexstudio-infra', mode: 'monitor', priority: 3 },
  { id: '4', title: 'Weekly sync meeting notes', project: 'organization', mode: 'reminder', priority: 4 },
];

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'do_now': return <Play size={14} className="text-emerald-400" />;
      case 'do_later': return <Clock size={14} className="text-zinc-400" />;
      case 'monitor': return <Activity size={14} className="text-blue-400" />;
      case 'reminder': return <Calendar size={14} className="text-amber-400" />;
      default: return null;
    }
  };

  const getModeLabel = (mode: string) => {
    return mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleModeChange = (id: string, newMode: Quest['mode']) => {
    setQuests(prev => prev.map(q => q.id === id ? { ...q, mode: newMode } : q));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Quests Inbox</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and assign tasks to AI Agents.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-xl transition-all font-medium shadow-[0_2px_10px_rgba(232,89,12,0.2)]">
          <Zap size={16} />
          <span>Manual Trigger</span>
        </button>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-sm font-medium text-zinc-300">Active Queue</h2>
          <span className="text-xs text-zinc-500 font-medium">Sorted by Priority</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {quests.map((quest, index) => (
            <div key={quest.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center gap-6 group">
              <div className="w-8 h-8 flex-shrink-0 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 text-zinc-500 font-semibold text-sm group-hover:bg-brand-orange/10 group-hover:text-brand-orange group-hover:border-brand-orange/20 transition-all">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors truncate">{quest.title}</h3>
                <p className="text-xs text-zinc-500 mt-1 truncate">{quest.project}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group/dropdown">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-sm font-medium transition-colors">
                    {getModeIcon(quest.mode)}
                    <span className="text-zinc-300">{getModeLabel(quest.mode)}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-zinc-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-10 py-1 overflow-hidden">
                    {(['do_now', 'do_later', 'monitor', 'reminder'] as const).map(m => (
                      <button 
                        key={m}
                        onClick={() => handleModeChange(quest.id, m)}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${quest.mode === m ? 'bg-white/5 text-zinc-100' : 'text-zinc-400'}`}
                      >
                        {getModeIcon(m)}
                        {getModeLabel(m)}
                      </button>
                    ))}
                  </div>
                </div>

                {quest.mode === 'do_now' && (
                  <button className="flex items-center justify-center gap-2 px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-semibold transition-colors">
                    <Play size={14} />
                    Run
                  </button>
                )}
                
                <button className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-white/5">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
