"use client";

import { useEffect, useState, use } from 'react';
import { ArrowLeft, Save, FileText, Send, Bot, CheckCircle2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import QuestsList from '@/components/QuestsList';
import ProjectIssuesView from '@/components/ProjectIssuesView';

interface PageProps {
  params: Promise<{ repoName: string }>;
}

export default function ProjectDetail({ params }: PageProps) {
  const { repoName } = use(params);
  
  const [activeTab, setActiveTab] = useState<'README.md' | 'AGENTS.md' | 'Issues'>('README.md');
  const [fileContent, setFileContent] = useState('');
  const [fileSha, setFileSha] = useState<string | null>(null);
  const [loadingFile, setLoadingFile] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [questInput, setQuestInput] = useState('');
  const [questSent, setQuestSent] = useState(false);
  const [triggerRefresh, setTriggerRefresh] = useState(0);

  // Fetch File Content
  useEffect(() => {
    if (activeTab === 'Issues') return;
    setLoadingFile(true);
    fetch(`http://localhost:8080/api/v1/projects/${repoName}/files/${activeTab}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch file');
        return res.json();
      })
      .then(data => {
        setFileContent(data.content || '');
        setFileSha(data.sha);
        setLoadingFile(false);
      })
      .catch(err => {
        console.error(err);
        setFileContent('ยังไม่มีไฟล์นี้ในโปรเจกต์ หรือเกิดข้อผิดพลาดในการโหลด');
        setLoadingFile(false);
      });
  }, [repoName, activeTab]);

  // Save File Content
  const handleSaveFile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${repoName}/files/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: fileContent,
          sha: fileSha,
          message: `Update ${activeTab} via WJEX OS Dashboard`
        })
      });
      if (!res.ok) throw new Error('Failed to save file');
      const data = await res.json();
      setFileSha(data.data.content.sha); // update sha to allow subsequent saves
      alert('บันทึกการแก้ไขลง GitHub เรียบร้อยแล้ว!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  };

  // Send Quest
  const handleSendQuest = async () => {
    if (!questInput.trim()) return;
    try {
      await fetch(`http://localhost:8080/api/v1/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: repoName,
          title: questInput.trim(),
          mode: 'do_later'
        })
      });
      setQuestSent(true);
      setTriggerRefresh(prev => prev + 1);
      setTimeout(() => {
        setQuestInput('');
        setQuestSent(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to create quest');
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-[calc(100vh-2rem)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Link href="/projects" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            {repoName}
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            รายละเอียดโปรเจกต์ โค้ด และการสั่งงาน Agent
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0 pb-8">
        
        {/* Left Column: File Editor */}
        <div className="lg:col-span-2 flex flex-col bg-[#111113] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
          {/* Tabs */}
          <div className="flex items-center justify-between bg-[#0c0c0e] px-4 border-b border-white/5">
            <div className="flex overflow-x-auto hide-scrollbar">
              {['README.md', 'AGENTS.md', 'Issues'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab 
                      ? 'border-orange-500 text-orange-400 bg-white/5' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveFile}
                disabled={saving || loadingFile}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all"
              >
                <Save className="w-4 h-4" />
                {saving ? 'กำลังบันทึก...' : 'Commit'}
              </button>
            </div>
          </div>
          
          {/* Editor Area */}
          <div className="flex-grow relative bg-[#0c0c0e]">
            {activeTab === 'Issues' ? (
              <ProjectIssuesView 
                repoName={repoName} 
                onQuestCreated={() => setTriggerRefresh(prev => prev + 1)} 
              />
            ) : loadingFile ? (
              <div className="absolute inset-0 flex flex-col gap-3 items-center justify-center text-zinc-500">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                กำลังดึงข้อมูลจาก GitHub...
              </div>
            ) : (
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent text-zinc-300 p-6 resize-none focus:outline-none font-mono text-[13px] leading-relaxed"
                placeholder={activeTab === 'AGENTS.md' ? "เขียนกฎการทำงานของ Agents ที่นี่..." : "รายละเอียดโปรเจกต์..."}
              />
            )}
          </div>
        </div>

        {/* Right Column: Quests / Agent Command Center */}
        <div className="flex flex-col bg-[#111113] border border-white/5 rounded-3xl overflow-hidden shadow-lg">
          <div className="bg-[#0c0c0e] px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Agent Command</h3>
              <p className="text-xs text-zinc-400">สั่งงาน Agent แบบระบุโปรเจกต์</p>
            </div>
          </div>
          
          <div className="flex-grow p-6 flex flex-col justify-end gap-4 relative bg-zinc-950/20">
            
            {/* Quests List */}
            <QuestsList projectId={repoName} triggerRefresh={triggerRefresh} />

            {/* Input Box */}
            <div className="relative group">
              <textarea
                value={questInput}
                onChange={(e) => setQuestInput(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-white/5 rounded-2xl p-4 pr-14 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 resize-none h-[120px]"
                placeholder="เช่น: Yod ฝากเข้าไปแก้ AGENTS.md เพิ่มกฏให้ Lewis..."
              />
              <button
                onClick={handleSendQuest}
                className={`absolute right-3 bottom-3 p-2.5 rounded-xl transition-all flex items-center justify-center ${
                  questSent 
                    ? 'bg-emerald-500 text-white' 
                    : questInput.trim() ? 'bg-orange-500 hover:bg-orange-400 text-white' : 'bg-white/5 text-zinc-500 cursor-not-allowed'
                }`}
                disabled={!questInput.trim()}
              >
                {questSent ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
