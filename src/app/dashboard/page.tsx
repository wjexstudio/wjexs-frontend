import React from 'react';
import Link from 'next/link';
import { Users, Zap, MessageSquare, Book, Shield, Activity, Folder } from 'lucide-react';

export default function Dashboard() {
  const menus = [
    { name: 'Characters', icon: Users, path: '/characters', desc: 'Active AI Agents: 4', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Skills', icon: Zap, path: '/skills', desc: 'Available Skills: 12', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'Quests', icon: MessageSquare, path: '/quests', desc: 'Pending Quests: 8', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { name: 'Library', icon: Book, path: '/library', desc: 'Knowledge Base: Synced', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Gates', icon: Shield, path: '/gates', desc: 'Active Policies: 3', color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Activity', icon: Activity, path: '/activity', desc: 'System Events: Normal', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Projects', icon: Folder, path: '/projects', desc: 'Active Projects: 28', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Dashboard Overview
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          สรุปภาพรวมของทุกระบบใน WJEXSTUDIO OS
        </p>
      </div>

      {/* Grid of Menus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menus.map(menu => {
          const Icon = menu.icon;
          return (
            <Link 
              key={menu.name}
              href={menu.path}
              className="bg-[#111113] border border-white/5 hover:border-white/20 rounded-2xl p-6 transition-all group flex flex-col items-start gap-4 hover:-translate-y-1 shadow-lg"
            >
              <div className={`p-3 rounded-xl ${menu.bg}`}>
                <Icon className={`w-6 h-6 ${menu.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-brand-orange transition-colors">
                  {menu.name}
                </h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {menu.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      
    </div>
  );
}
