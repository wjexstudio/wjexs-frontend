"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Zap, Book, Shield, Activity, Folder, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';

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

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`
      h-screen border-r border-white/5 bg-[#09090b] flex flex-col p-4 z-20 transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header */}
      <div className={`flex items-center mb-8 px-2 py-4 relative ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <div className="min-w-8 w-8 h-8 rounded bg-brand-orange flex items-center justify-center font-bold text-white shadow-sm">
            W
          </div>
          {!isCollapsed && <span className="font-semibold text-lg tracking-wide hidden md:block whitespace-nowrap">WJEXSTUDIO</span>}
          {/* Mobile title */}
          <span className="font-semibold text-lg tracking-wide md:hidden">WJEXSTUDIO</span>
        </div>
        
        {/* Mobile Close Button */}
        <button onClick={onCloseMobile} className="md:hidden p-1 text-zinc-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.name} 
              href={item.path}
              title={isCollapsed ? item.name : undefined}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (window.innerWidth < 768) {
                  onCloseMobile();
                }
              }}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden
                ${isActive 
                  ? 'bg-brand-orange/10 text-brand-orange font-medium' 
                  : 'text-zinc-400 hover:text-zinc-50 hover:bg-white/5'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className={`min-w-5 ${isActive ? 'text-brand-orange' : 'group-hover:text-brand-orange transition-colors'}`} />
              
              {!isCollapsed && (
                <span className="text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}
              {/* Mobile text is always shown because sidebar is not collapsed on mobile */}
              <span className={`text-sm whitespace-nowrap md:hidden ${isCollapsed ? 'hidden' : 'block'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      {/* Collapse Toggle Button (Desktop Only) */}
      <div className="hidden md:flex flex-col gap-4 mt-auto">
        <button 
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        {/* System Status */}
        <div className={`p-4 bg-[#111113] border border-white/5 rounded-xl transition-all ${isCollapsed ? 'flex justify-center items-center p-3' : 'text-center'}`}>
          {!isCollapsed && <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-semibold whitespace-nowrap">System Status</p>}
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400" title="Online">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse min-w-2" />
            {!isCollapsed && "Online"}
          </div>
        </div>
      </div>

      {/* Mobile System Status (Always expanded look) */}
      <div className="md:hidden mt-auto p-4 bg-[#111113] border border-white/5 rounded-xl text-center">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1 font-semibold whitespace-nowrap">System Status</p>
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse min-w-2" />
          Online
        </div>
      </div>
      
    </aside>
  );
}
