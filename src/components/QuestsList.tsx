"use client";

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface Quest {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  mode: string;
  priority: number;
  status: string;
  createdAt: string;
}

export default function QuestsList({ projectId, triggerRefresh }: { projectId: string, triggerRefresh: number }) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/quests?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => {
        setQuests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId, triggerRefresh]);

  const updateQuestStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:8080/api/v1/quests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      // Update local state optimistically
      setQuests(quests.map(q => q.id === id ? { ...q, status } : q));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 text-sm text-center flex-grow flex items-center justify-center">กำลังโหลด Quests...</div>;
  }

  if (quests.length === 0) {
    return (
      <div className="text-sm text-zinc-500 text-center flex-grow flex flex-col items-center justify-center">
        ยังไม่มีคิวงานในโปรเจกต์นี้ <br/>พิมพ์คำสั่งด้านล่างเพื่อสร้าง Quest ใหม่ได้เลยค่ะ
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      {quests.map(quest => (
        <div key={quest.id} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 group hover:border-orange-500/30 transition-all flex-shrink-0">
          <div className="flex gap-3 items-start">
            <button 
              onClick={() => updateQuestStatus(quest.id, quest.status === 'completed' ? 'pending' : 'completed')}
              className="mt-0.5 text-zinc-500 hover:text-orange-500 transition-colors flex-shrink-0"
            >
              {quest.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
            </button>
            <div>
              <p className={`text-sm ${quest.status === 'completed' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                {quest.title}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${quest.status === 'completed' ? 'border-zinc-800 text-zinc-600' : 'border-orange-500/20 text-orange-400 bg-orange-500/5'}`}>
                  {quest.mode}
                </span>
                <span className="text-[10px] text-zinc-600">
                  {new Date(quest.createdAt).toLocaleDateString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
