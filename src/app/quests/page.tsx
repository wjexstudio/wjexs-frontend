'use client';
import React, { useEffect, useState } from 'react';
import { Play, Clock, Activity, Calendar, Zap, RefreshCw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  project: string;
  mode: 'do_now' | 'do_later' | 'monitor' | 'reminder';
  priority: number;
  status: string;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = () => {
    setLoading(true);
    fetch('http://localhost:8080/api/v1/quests')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch quests');
        return res.json();
      })
      .then(data => setQuests(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'do_now': return <Play size={14} className="text-emerald-400" />;
      case 'do_later': return <Clock size={14} className="text-zinc-400" />;
      case 'monitor': return <Activity size={14} className="text-blue-400" />;
      case 'reminder': return <Calendar size={14} className="text-amber-400" />;
      default: return <Clock size={14} className="text-zinc-400" />;
    }
  };

  const getModeLabel = (mode: string) => {
    if (!mode) return 'Do Later';
    return mode.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleModeChange = async (id: string, newMode: Quest['mode']) => {
    // Optimistic update
    setQuests(prev => prev.map(q => q.id === id ? { ...q, mode: newMode } : q));
    
    try {
      const res = await fetch(`http://localhost:8080/api/v1/quests/${id}/mode`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode })
      });
      if (!res.ok) throw new Error('Failed to update mode');
    } catch (err) {
      console.error(err);
      fetchQuests(); // Revert on failure
    }
  };

  const triggerRun = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/quests/${id}/run`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to trigger run');
      alert('Quest triggered successfully!');
    } catch (err) {
      console.error(err);
      alert('Error triggering quest.');
    }
  };

  const triggerScheduler = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/quests/trigger', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to trigger scheduler');
      alert('Scheduler triggered successfully!');
    } catch (err) {
      console.error(err);
      alert('Error triggering scheduler.');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Quests Inbox</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and assign tasks to AI Agents.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchQuests} className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition-colors border border-white/5 bg-white/5">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button onClick={triggerScheduler} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 rounded-xl transition-all font-medium shadow-[0_2px_10px_rgba(232,89,12,0.2)]">
            <Zap size={16} />
            <span>Manual Trigger</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            Active Queue
            {loading && <RefreshCw size={14} className="animate-spin text-brand-orange" />}
          </h2>
          <span className="text-xs text-zinc-500 font-medium">Sorted by Priority (Milestone)</span>
        </div>
        
        <div className="divide-y divide-white/5">
          {error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : quests.length === 0 && !loading ? (
            <div className="p-8 text-center text-zinc-500">No quests found in tracked repositories.</div>
          ) : (
            quests.map((quest, index) => (
              <div key={quest.id} className="p-4 px-6 hover:bg-white/5 transition-colors flex items-center gap-6 group">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 text-zinc-500 font-semibold text-sm group-hover:bg-brand-orange/10 group-hover:text-brand-orange group-hover:border-brand-orange/20 transition-all">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium transition-colors truncate ${quest.status === 'closed' ? 'line-through text-zinc-500' : 'text-zinc-200 group-hover:text-zinc-100'}`}>
                    {quest.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 truncate">{quest.project} • {quest.status}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group/dropdown">
                    <select
                      value={quest.mode}
                      onChange={(e) => handleModeChange(quest.id, e.target.value as any)}
                      className="appearance-none bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-sm font-medium text-zinc-300 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-brand-orange transition-colors cursor-pointer"
                    >
                      <option value="do_now">Do Now</option>
                      <option value="do_later">Do Later</option>
                      <option value="monitor">Monitor</option>
                      <option value="reminder">Reminder</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getModeIcon(quest.mode)}
                    </div>
                  </div>

                  <button 
                    onClick={() => triggerRun(quest.id)}
                    className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                    title="Run Now"
                  >
                    <Play size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
