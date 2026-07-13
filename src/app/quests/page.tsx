'use client';
import React, { useEffect, useState, useCallback } from 'react';

interface Quest {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  mode: string;
  priority: number;
  dueDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  project?: { name: string };
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuests = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/quests');
      if (!res.ok) throw new Error('Failed to fetch quests');
      const data = await res.json();
      setQuests(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuests();
  }, [fetchQuests]);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'do_now': return <i className="bx bx-play text-emerald-400 text-sm" />;
      case 'do_later': return <i className="bx bx-time text-zinc-400 text-sm" />;
      case 'monitor': return <i className="bx bx-activity text-blue-400 text-sm" />;
      case 'reminder': return <i className="bx bx-calendar text-amber-400 text-sm" />;
      default: return <i className="bx bx-time text-zinc-400 text-sm" />;
    }
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
          <button onClick={() => { setLoading(true); fetchQuests(); }} className="flex items-center gap-2 text-zinc-400 hover:text-white px-3 py-2 sketchy-border transition-colors border border-white/5 bg-white/5">
            <i className={`bx bx-refresh text-base ${loading ? 'bx-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button onClick={triggerScheduler} className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2.5 sketchy-border transition-all font-medium shadow-[0_2px_10px_rgba(232,89,12,0.2)]">
            <i className="bx bx-bolt text-base" />
            <span>Manual Trigger</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/5 sketchy-border overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-white/5 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            Active Queue
            {loading && <i className="bx bx-refresh bx-spin text-brand-orange text-sm" />}
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
                  <p className="text-xs text-zinc-500 mt-1 truncate">{quest.project?.name || quest.projectId} • {quest.status}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group/dropdown">
                    <select
                      value={quest.mode}
                      onChange={(e) => handleModeChange(quest.id, e.target.value)}
                      className="appearance-none bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 text-sm font-medium text-zinc-300 sketchy-border px-3 py-1.5 pr-8 focus:outline-none focus:border-brand-orange transition-colors cursor-pointer"
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
                    className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 sketchy-border transition-colors"
                    title="Run Now"
                  >
                    <i className="bx bx-play text-lg" />
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
