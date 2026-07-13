"use client";

import { useEffect, useState } from 'react';
import { Plus, Edit2, CheckCircle2, Circle, Send } from 'lucide-react';

interface Issue {
  number: number;
  title: string;
  body: string;
  state: string;
  html_url: string;
  created_at: string;
}

export default function ProjectIssuesView({ 
  repoName,
  onQuestCreated
}: { 
  repoName: string;
  onQuestCreated: () => void;
}) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  const [formData, setFormData] = useState({ title: '', body: '', state: 'open' });
  const [saving, setSaving] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${repoName}/issues`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, [repoName]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${repoName}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, body: formData.body })
      });
      if (res.ok) {
        await fetchIssues();
        setView('list');
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleUpdate = async () => {
    if (!selectedIssue) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${repoName}/issues/${selectedIssue.number}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, body: formData.body, state: formData.state })
      });
      if (res.ok) {
        await fetchIssues();
        setView('list');
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const sendToQuests = async (issue: Issue) => {
    try {
      await fetch(`http://localhost:8080/api/v1/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: repoName,
          title: `[Issue #${issue.number}] ${issue.title}`,
          mode: 'do_later'
        })
      });
      onQuestCreated();
      alert('ส่งเข้าคิว Quests เรียบร้อยแล้ว!');
    } catch (err) {
      console.error(err);
      alert('Failed to send to quests');
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0c0c0e] flex flex-col animate-in fade-in duration-200">
        
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">
          {view === 'list' ? `Issues` : view === 'create' ? 'Create New Issue' : `Edit Issue #${selectedIssue?.number}`}
        </h2>
        <div>
          {view === 'list' && (
            <button 
              onClick={() => {
                setFormData({ title: '', body: '', state: 'open' });
                setView('create');
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New Issue
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-6">
        {view === 'list' ? (
          loading ? (
            <div className="flex justify-center items-center h-full text-zinc-500">Loading issues...</div>
          ) : issues.length === 0 ? (
            <div className="flex justify-center items-center h-full text-zinc-500">No issues found.</div>
          ) : (
            <div className="space-y-3">
              {issues.map(issue => (
                <div key={issue.number} className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-2 group hover:border-orange-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {issue.state === 'open' ? (
                          <Circle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-[15px]">{issue.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                          <span>#{issue.number}</span>
                          <span>opened on {new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="relative group/btn">
                        <button 
                          onClick={() => sendToQuests(issue)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-medium transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" /> Do this
                        </button>
                        
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded opacity-0 group-hover/btn:opacity-100 pointer-events-none shadow-xl border border-white/10 whitespace-nowrap z-50 transition-opacity">
                          Send to Quests
                        </div>
                      </div>
                      
                      <div className="relative group/edit">
                        <button 
                          onClick={() => {
                          setSelectedIssue(issue);
                          setFormData({ title: issue.title, body: issue.body || '', state: issue.state });
                          setView('edit');
                        }}
                          className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded opacity-0 group-hover/edit:opacity-100 pointer-events-none shadow-xl border border-white/10 whitespace-nowrap z-50 transition-opacity">
                          Edit Issue
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto h-full flex flex-col">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
                placeholder="Issue title"
              />
            </div>
            <div className="flex-grow flex flex-col">
              <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
              <textarea 
                value={formData.body}
                onChange={e => setFormData({ ...formData, body: e.target.value })}
                className="w-full flex-grow bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 resize-none font-mono text-sm"
                placeholder="Describe the issue..."
              />
            </div>
            {view === 'edit' && (
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">State</label>
                <select 
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-[#0c0c0e] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500/50"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => setView('list')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={view === 'create' ? handleCreate : handleUpdate}
                disabled={saving || !formData.title.trim()}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white transition-colors"
              >
                {saving ? 'Saving...' : view === 'create' ? 'Create Issue' : 'Update Issue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
