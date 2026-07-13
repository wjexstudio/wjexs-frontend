import React from "react";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background Orbs for Premium Gradient Look */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-orange/15 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      
      <main className="z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 hover:bg-white/5 transition-all cursor-pointer">
          <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">WJEXSTUDIO OS - NEXT GENERATION</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Start Fresh.<br />
          <span className="bg-gradient-to-r from-brand-orange to-red-500 text-transparent bg-clip-text">Build the Future.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          The blank slate for your new agentic operating system. High-performance, minimal, and designed with premium aesthetics. 
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 rounded-xl bg-brand-orange hover:bg-[#ff6a1a] text-white font-semibold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(232,89,12,0.3)] active:scale-95">
            Initialize Workspace
          </button>
          <button className="px-8 py-4 rounded-xl glass-panel text-zinc-200 font-medium hover:bg-white/10 transition-all transform hover:-translate-y-1">
            View Architecture
          </button>
        </div>
      </main>
      
      <footer className="absolute bottom-8 text-zinc-600 text-xs font-semibold tracking-[0.2em] uppercase">
        © 2026 WJEXSTUDIO
      </footer>
    </div>
  );
}
