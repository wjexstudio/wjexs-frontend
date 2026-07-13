'use client';
import React from 'react';
import { Book, Folder, ExternalLink } from 'lucide-react';

interface Realm {
  id: string;
  name: string;
  description: string;
  fileCount: number;
}

const mockRealms: Realm[] = [
  { id: '1', name: 'PROJECTS', description: 'Active and archived project workspaces', fileCount: 42 },
  { id: '2', name: 'KNOWLEDGE', description: 'General knowledge base and concepts', fileCount: 156 },
  { id: '3', name: 'INBOX', description: 'Unprocessed notes and ideas', fileCount: 12 },
  { id: '4', name: 'PALM DIARY', description: 'Personal logs and reflections', fileCount: 89 },
  { id: '5', name: 'AGENTS', description: 'Agent configurations and memories', fileCount: 24 },
  { id: '6', name: 'SYSTEM', description: 'Core system documentation', fileCount: 18 },
];

export default function LibraryPage() {
  const VAULT_NAME = 'knowledge-base';

  const handleOpenObsidian = (realmName: string) => {
    // In a real scenario, this would open a specific file or folder.
    // For now, we link to the realm folder or index note.
    const url = `obsidian://open?vault=${VAULT_NAME}&file=${encodeURIComponent(realmName)}/INDEX.md`;
    window.location.href = url;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Library</h1>
        <p className="text-sm text-zinc-400 mt-1">Explore the 12 Realms of the Knowledge Base.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRealms.map(realm => (
          <div key={realm.id} className="bg-[#111113] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors flex flex-col group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/50 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                <Book size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">{realm.name}</h3>
                <p className="text-xs text-zinc-500 font-medium">{realm.fileCount} Files</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6 flex-1">
              {realm.description}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                <Folder size={14} />
                Browse Files
              </button>
              <button 
                onClick={() => handleOpenObsidian(realm.name)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-brand-orange hover:text-brand-orange/80 bg-brand-orange/10 hover:bg-brand-orange/20 rounded-xl transition-colors"
              >
                <ExternalLink size={14} />
                Open Obsidian
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
