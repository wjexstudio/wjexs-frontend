"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 border-b border-white/5 bg-[#09090b] z-30 flex items-center px-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 -ml-2 text-zinc-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="ml-4 font-semibold tracking-wide">WJEXSTUDIO</div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
