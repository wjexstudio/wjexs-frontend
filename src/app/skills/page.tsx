'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  cluster_name: string;
  position: { x: number; y: number };
  usage_count: number;
  stars: number;
}

interface Cluster {
  name: string;
  count: number;
  center: [number, number];
}

const CLUSTER_COLORS: Record<string, string> = {
  'Core Logic': 'bg-blue-500',
  'Memory': 'bg-emerald-500',
  'Communication': 'bg-purple-500',
  'Other': 'bg-brand-orange'
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const fetchSkills = () => {
    setError(null);
    fetch('http://localhost:8090/api/v1/dashboard/skills')
      .then(res => {
        if (!res.ok) throw new Error('API Failed');
        return res.json();
      })
      .then(data => {
        setSkills(data.skills);
        setClusters(data.clusters);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSkills();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Skills Vector Space</h1>
          <p className="text-sm text-zinc-400 mt-1">AI agent capabilities mapped in 2D space</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchSkills(); }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-red-500/20 bg-red-500/5 rounded-2xl p-8">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-zinc-100">API Error</h3>
          <p className="text-zinc-400 mb-6">{error}</p>
          <button onClick={fetchSkills} className="px-6 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors">
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 bg-[#111113] rounded-2xl">
          <div className="text-zinc-500 flex flex-col items-center gap-4">
            <RefreshCw size={32} className="animate-spin text-brand-orange" />
            <p>Loading Vector Space...</p>
          </div>
        </div>
      ) : skills.length === 0 ? (
        <div className="flex-1 flex items-center justify-center border border-white/5 bg-[#111113] rounded-2xl">
          <div className="text-zinc-500 text-center">
            <Info size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No Skills Data Available</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-6 min-h-[500px]">
          {/* Scatter Plot Area */}
          <div className="flex-1 relative border border-white/5 bg-[#111113] rounded-2xl overflow-hidden group">
            {/* Grid lines background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-5 pointer-events-none" />
            
            {skills.map((skill) => {
              // Normalize position (assuming 0-100 coordinates from backend)
              const left = Math.max(5, Math.min(95, skill.position.x));
              const top = Math.max(5, Math.min(95, skill.position.y));
              const colorClass = CLUSTER_COLORS[skill.cluster_name] || CLUSTER_COLORS['Other'];
              const size = 16 + (skill.stars * 4); // Map 1-5 stars to sizes

              return (
                <div
                  key={skill.id}
                  className={`absolute rounded-full cursor-pointer transition-all hover:scale-125 ${colorClass} shadow-lg shadow-black/50`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: 'translate(-50%, -50%)',
                    opacity: hoveredSkill ? (hoveredSkill.id === skill.id ? 1 : 0.3) : 0.8
                  }}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
              );
            })}
          </div>

          {/* Side Panel */}
          <div className="w-80 flex flex-col gap-6">
            <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
              <h3 className="font-medium text-zinc-100 mb-4 text-sm uppercase tracking-wider">Skill Details</h3>
              {hoveredSkill ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Name</div>
                    <div className="font-medium text-white">{hoveredSkill.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Cluster</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${CLUSTER_COLORS[hoveredSkill.cluster_name] || CLUSTER_COLORS['Other']}`} />
                      <span className="text-sm text-zinc-300">{hoveredSkill.cluster_name}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Usage Count</div>
                      <div className="text-lg font-mono text-zinc-300">{hoveredSkill.usage_count}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Impact</div>
                      <div className="text-lg font-mono text-brand-orange">{"★".repeat(hoveredSkill.stars)}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-zinc-500 text-sm h-40 flex items-center justify-center text-center">
                  Hover over a node in the vector space to view details
                </div>
              )}
            </div>

            <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 flex-1">
              <h3 className="font-medium text-zinc-100 mb-4 text-sm uppercase tracking-wider">Clusters</h3>
              <div className="space-y-3">
                {clusters.map(cluster => (
                  <div key={cluster.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${CLUSTER_COLORS[cluster.name] || CLUSTER_COLORS['Other']}`} />
                      <span className="text-sm text-zinc-300">{cluster.name}</span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{cluster.count} nodes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
