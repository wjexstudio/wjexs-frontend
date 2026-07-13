import React from 'react';
import Link from 'next/link';
import { Home, Users, Zap, Book, Shield, Activity, Folder, MessageSquare } from 'lucide-react';

const MENU_ITEMS = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Dashboard', icon: Activity, path: '/dashboard' },
  { name: 'Characters', icon: Users, path: '/characters' },
  { name: 'Skills', icon: Zap, path: '/skills' },
  { name: 'Quests', icon: MessageSquare, path: '/quests' },
  { name: 'Library', icon: Book, path: '/library' },
  { name: 'Gates', icon: Shield, path: '/gates' },
  { name: 'Activity', icon: Activity, path: '/activity' },
  { name: 'Projects', icon: Folder, path: '/projects' },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-white/5 bg-[#09090b] flex flex-col p-4 z-20">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <div className="w-8 h-8 rounded bg-brand-orange flex items-center justify-center font-bold text-white shadow-sm">
          W
        </div>
        <span className="font-semibold text-lg tracking-wide">WJEXSTUDIO</span>
      </div>
      
      <nav className="flex-1 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:text-zinc-50 hover:bg-white/5 transition-all group"
            >
              <Icon size={18} className="group-hover:text-brand-orange transition-colors" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 bg-[#111113] border border-white/5 rounded-xl text-center">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-semibold">System Status</p>
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </div>
      </div>
    </aside>
  );
}
