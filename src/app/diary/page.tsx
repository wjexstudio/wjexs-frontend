"use client";

import React, { useEffect, useState } from 'react';

interface DocumentData {
  id: string;
  title: string;
  document_text: string;
  updated_at: string;
}

export default function DiaryReviewPage() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [activeDoc, setActiveDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [highlightedText, setHighlightedText] = useState('');
  const [comment, setComment] = useState('');
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/dashboard/diary-reviews')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && res.data) {
          setDocuments(res.data);
          if (res.data.length > 0) setActiveDoc(res.data[0]);
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setHighlightedText(selection.toString().trim());
    }
  };

  const pushToQuests = async () => {
    if (!highlightedText) {
      alert('Please highlight some text first.');
      return;
    }
    
    setIsPushing(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/dashboard/diary-reviews/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: activeDoc?.id,
          text: highlightedText,
          comment: comment
        })
      });
      
      if (!res.ok) throw new Error('Export failed');
      
      setHighlightedText('');
      setComment('');
      alert('Successfully pushed to Quests as a GitHub Issue!');
    } catch (err) {
      alert('Failed to push: ' + (err as Error).message);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">Diary Review</h1>
          <p className="text-sm text-zinc-400 mt-1">Review session logs, highlight text, and push to Quests (GitHub Issues).</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-0 flex-1">
        {/* Document List (Left) */}
        <div className="w-full lg:w-64 flex flex-col min-h-0 bg-[#09090b] rounded-2xl sketchy-border border border-white/5 overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/5 bg-[#0a0a0c]">
            <h2 className="text-zinc-300 font-medium">Session Logs</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {loading ? (
               <div className="p-2 text-zinc-500 animate-pulse text-sm">Loading...</div>
            ) : error ? (
               <div className="p-2 text-red-400 text-sm">{error}</div>
            ) : documents.length === 0 ? (
               <div className="p-2 text-zinc-500 text-sm">No logs found.</div>
            ) : documents.map(doc => (
               <button 
                 key={doc.id}
                 onClick={() => setActiveDoc(doc)}
                 className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${activeDoc?.id === doc.id ? 'bg-brand-orange/20 text-brand-orange border border-brand-orange/30 sketchy-border' : 'text-zinc-400 hover:bg-white/5'}`}
               >
                 <div className="truncate font-medium">{doc.title}</div>
                 <div className="text-xs opacity-60 mt-1">{new Date(doc.updated_at).toLocaleDateString()}</div>
               </button>
            ))}
          </div>
        </div>

        {/* Document Viewer (Center) */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#09090b] rounded-2xl sketchy-border border border-white/5 p-6 overflow-hidden">
           <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" onMouseUp={handleSelection}>
             {activeDoc ? (
               <pre className="text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed">
                 {activeDoc.document_text}
               </pre>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                 <i className="bx bx-book-open text-4xl mb-4 opacity-50"></i>
                 <p>Select a log to view and highlight.</p>
               </div>
             )}
           </div>
        </div>

        {/* Review/Comment Panel (Right) */}
        <div className="w-full lg:w-[400px] flex flex-col min-h-0 bg-[#050505] rounded-2xl sketchy-border border border-white/5 p-6 overflow-hidden flex-shrink-0">
           <h2 className="text-xl font-medium text-white mb-6">Review Action</h2>
           
           <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-400">Highlighted Text (Select text on the left)</label>
                <div className={`p-4 rounded-xl border sketchy-border text-sm min-h-[100px] ${highlightedText ? 'border-brand-orange/50 bg-brand-orange/10 text-zinc-200' : 'border-white/10 bg-white/5 text-zinc-500'}`}>
                  {highlightedText || 'No text highlighted yet...'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-400">Add Comment / Note</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Why is this important? What needs to be done?"
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-brand-orange sketchy-border transition-colors resize-none placeholder-zinc-600"
                />
              </div>
           </div>

           <div className="mt-6 pt-6 border-t border-white/5">
             <button 
                onClick={pushToQuests}
                disabled={!highlightedText || isPushing}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${!highlightedText || isPushing ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-brand-orange text-white hover:bg-brand-orange/90 active:scale-95 sketchy-border shadow-[0_0_20px_rgba(255,107,0,0.2)]'}`}
             >
                {isPushing ? (
                  <>
                    <i className="bx bx-loader-alt animate-spin text-lg"></i>
                    Pushing...
                  </>
                ) : (
                  <>
                    <i className="bx bx-rocket text-lg"></i>
                    Push to Quests
                  </>
                )}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
