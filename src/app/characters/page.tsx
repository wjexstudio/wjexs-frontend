'use client';
import React, { useState } from 'react';
import { Plus, Edit2, Archive, User, Search } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'archived';
  description: string;
}

const initialAgents: Agent[] = [
  { id: '1', name: 'Lewis', role: 'Main Coordinator', status: 'active', description: 'Central Brain Coordinator' },
  { id: '2', name: 'Yod', role: 'Backend / Architecture', status: 'active', description: 'Go and Prisma Expert' },
  { id: '3', name: 'Anna', role: 'Frontend UI', status: 'active', description: 'Next.js and UI Developer' },
  { id: '4', name: 'Tim', role: 'QA Automation', status: 'active', description: 'Testing and Rules Enforcement' },
  { id: '5', name: 'Tracy', role: 'QA Gate', status: 'active', description: 'Final E2E Testing' },
  { id: '6', name: 'Pam', role: 'Project Manager', status: 'active', description: 'Tracking and Scrum' },
  { id: '7', name: 'Stella', role: 'Legacy', status: 'archived', description: 'Legacy Agent' }
];

export default function CharactersPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [search, setSearch] = useState('');

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()));

  const handleArchive = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'archived' } : a));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Characters</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage AI Agent Personas and Roles.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white px-4 py-2 rounded-xl transition-all font-medium text-sm shadow-[0_2px_10px_rgba(232,89,12,0.2)]">
          <Plus size={16} />
          <span>New Agent</span>
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="Search characters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111113] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="bg-[#111113] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors flex flex-col group relative">
            {agent.status === 'archived' && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-zinc-800/50 text-zinc-400 px-2 py-1 rounded-md">
                Archived
              </span>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${agent.status === 'active' ? 'bg-zinc-800/50 text-zinc-300' : 'bg-zinc-900 text-zinc-600'}`}>
                <User size={24} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${agent.status === 'active' ? 'text-zinc-100' : 'text-zinc-500'}`}>{agent.name}</h3>
                <p className="text-sm text-brand-orange/90 font-medium">{agent.role}</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-2">
              {agent.description}
            </p>

            <div className="flex items-center gap-2 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Edit2 size={14} />
                Edit
              </button>
              {agent.status === 'active' && (
                <button 
                  onClick={() => handleArchive(agent.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
                >
                  <Archive size={14} />
                  Archive
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
