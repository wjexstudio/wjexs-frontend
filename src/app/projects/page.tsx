"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import { FolderGit2, CheckCircle2, Clock, ArrowUpRight, Search, Filter, ArrowDownUp, ChevronDown, Star, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress_percent: number;
  total_issues: number;
  closed_issues: number;
  repo_url: string;
  created_at: string;
  updated_at: string;
  topics: string[];
}

// Custom Dropdown Component
function CustomDropdown({ icon: Icon, value, options, onChange }: { icon: any, value: string, options: {label: string, value: string}[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0c0c0e] hover:bg-[#0c0c0e] border border-white/5 hover:border-white/20 rounded-xl px-4 py-2 text-sm text-white transition-all w-[200px] justify-between focus:outline-none focus:ring-1 focus:ring-orange-500/50"
      >
        <div className="flex items-center gap-2 truncate">
          <Icon className="w-4 h-4 text-zinc-400" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[220px] bg-zinc-900/95 backdrop-blur-xl border border-white/5 rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                value === option.value ? 'text-orange-400 font-medium' : 'text-zinc-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('updated_desc');
  const [viewMode, setViewMode] = useState<'Tracked' | 'All'>('Tracked');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleTrack = async (e: React.MouseEvent, repoName: string, currentlyTracked: boolean) => {
    e.preventDefault(); // Prevent opening the link when clicking star
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${repoName}/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: !currentlyTracked })
      });
      if (!res.ok) throw new Error('Failed to toggle tracking');
      const data = await res.json();
      
      setProjects(prev => prev.map(p => {
        if (p.name === repoName) {
          return { ...p, topics: data.topics };
        }
        return p;
      }));
    } catch (err: any) {
      alert('Error updating track status: ' + err.message);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (viewMode === 'Tracked') {
      result = result.filter((p) => p.topics?.includes('wjex-active'));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'updated_desc':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'updated_asc':
          return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'progress_desc':
          return b.progress_percent - a.progress_percent;
        case 'progress_asc':
          return a.progress_percent - b.progress_percent;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [projects, searchQuery, statusFilter, sortBy, viewMode]);

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Archived', value: 'Archived' },
  ];

  const sortOptions = [
    { label: 'อัปเดตล่าสุด', value: 'updated_desc' },
    { label: 'อัปเดตนานที่สุด', value: 'updated_asc' },
    { label: 'สร้างใหม่ล่าสุด', value: 'created_desc' },
    { label: 'ความคืบหน้ามากที่สุด', value: 'progress_desc' },
    { label: 'ความคืบหน้าน้อยที่สุด', value: 'progress_asc' },
    { label: 'เรียงตามตัวอักษร (A-Z)', value: 'name_asc' },
  ];

  const totalTracked = projects.filter(p => p.topics?.includes('wjex-active')).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <FolderGit2 className="w-8 h-8 text-orange-400" />
              Projects
            </h1>
            
            {/* View Mode Toggle */}
            <div className="flex bg-[#0c0c0e] border border-white/5 rounded-xl p-1 ml-4">
              <button 
                onClick={() => setViewMode('Tracked')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'Tracked' ? 'bg-orange-500/20 text-orange-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Star className={`w-4 h-4 ${viewMode === 'Tracked' ? 'fill-orange-400' : ''}`} />
                Active
              </button>
              <button 
                onClick={() => setViewMode('All')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'All' ? 'bg-zinc-700/50 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                All Github
              </button>
            </div>
          </div>
          <p className="text-zinc-400 mt-3 text-sm leading-relaxed max-w-2xl">
            {viewMode === 'Tracked' 
              ? 'โปรเจกต์สำคัญที่ถูกติดตาม (มี Tag wjex-active บน GitHub) จัดการและดูภาพรวมได้ที่นี่' 
              : 'คลังโปรเจกต์ทั้งหมดบน GitHub ของคุณ สามารถกดสัญลักษณ์ดาวเพื่อติดตามในหน้า Tracked ได้'}
          </p>
          
          {!loading && !error && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                ทั้งหมด {viewMode === 'Tracked' ? totalTracked : projects.length} โปรเจกต์
              </span>
              {filteredAndSortedProjects.length !== (viewMode === 'Tracked' ? totalTracked : projects.length) && (
                <span className="text-xs text-zinc-500 font-medium">
                  แสดงผลจากการกรอง {filteredAndSortedProjects.length} โปรเจกต์
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Bar (Filters & Search) */}
        {!loading && !error && projects.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <div className="relative group flex-grow sm:flex-grow-0">
              <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -tranzinc-y-1/2 group-focus-within:text-orange-400 transition-colors" />
              <input 
                type="text" 
                placeholder="ค้นหาโปรเจกต์..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#0c0c0e] hover:bg-[#0c0c0e] border border-white/5 hover:border-white/20 rounded-xl pl-11 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all w-full sm:w-[220px]"
              />
            </div>

            <CustomDropdown icon={Filter} value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
            <CustomDropdown icon={ArrowDownUp} value={sortBy} options={sortOptions} onChange={setSortBy} />
          </div>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[200px] bg-white/5 animate-pulse rounded-2xl border border-white/5" />
          ))}
        </div>
      )}

      {error && (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
          เกิดข้อผิดพลาดในการโหลดโปรเจกต์: {error}
        </div>
      )}

      {!loading && !error && filteredAndSortedProjects.length === 0 && (
        <div className="p-16 text-center bg-[#111113] border border-white/5 rounded-3xl mt-8">
          <FolderGit2 className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">ไม่พบโปรเจกต์</h3>
          <p className="text-zinc-500">
            {viewMode === 'Tracked' && totalTracked === 0 
              ? 'คุณยังไม่ได้กดติดตามโปรเจกต์ไหนเลย ลองสลับไปหน้า "All Github" แล้วกดติดดาวดูนะคะ!' 
              : 'ลองปรับเปลี่ยนคำค้นหา หรือรูปแบบการกรองดูอีกครั้งนะคะ'}
          </p>
        </div>
      )}

      {!loading && !error && filteredAndSortedProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
          {filteredAndSortedProjects.map((project) => {
            const isTracked = project.topics?.includes('wjex-active');

            return (
              <Link
                key={project.id}
                href={`/projects/${project.name}`}
                className="group relative flex flex-col justify-between p-6 bg-[#111113] border border-white/5 rounded-3xl hover:bg-zinc-800/60 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-tranzinc-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                      {project.name}
                    </h3>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button 
                        onClick={(e) => toggleTrack(e, project.name, isTracked)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isTracked 
                            ? 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20' 
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                        title={isTracked ? "Untrack Project" : "Track Project"}
                      >
                        <Star className={`w-4 h-4 transition-colors ${
                          isTracked ? 'text-amber-400 fill-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`} />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-8 line-clamp-2 min-h-[40px] leading-relaxed pr-8">
                    {project.description || 'ไม่มีคำอธิบายสำหรับโปรเจกต์นี้'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-400 flex items-center gap-1.5 bg-zinc-950/30 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                      {project.closed_issues} / {project.total_issues} Issues
                    </span>
                    <span className="text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-md">{project.progress_percent}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-[#0c0c0e] rounded-full h-2.5 overflow-hidden border border-white/5 shadow-inner">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out relative bg-gradient-to-r from-orange-600 to-orange-400"
                      style={{ width: `${project.progress_percent}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    {project.status !== 'Active' ? (
                      <span className={`text-[11px] px-3 py-1.5 rounded-full font-bold tracking-wide uppercase ${
                        project.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        project.status === 'Archived' ? 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {project.status}
                      </span>
                    ) : (
                      <div />
                    )}
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1.5 font-medium ml-auto">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(project.updated_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
