import React, { useState } from 'react';

interface DocumentationViewerProps {
  onClose: () => void;
  mode: 'logibra' | 'python' | 'haskell';
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ onClose, mode }) => {
  const [page, setPage] = useState(0);

  const pages = [
    {
      title: "Core Concepts",
      content: (
        <div className="space-y-4">
          <p><strong>Logibra</strong> is an invariant resolution engine. It does not calculate numbers; it resolves structural intents to eliminate ambiguity.</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong className="text-white">Unit (*)</strong>: A pre-intent potential. Not a number, but a seed.</li>
            <li><strong className="text-white">Flow (-&gt;)</strong>: Directs a unit into a quadrant.</li>
            <li><strong className="text-white">Relation (&)</strong>: Combines two flows to check for cancellation.</li>
            <li><strong className="text-white">Resolution (**)</strong>: The terminal state. Reached only upon total inversion.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Quadrants & Polarity",
      content: (
        <div className="space-y-4">
          <p>Directions are defined by <strong>Slope</strong> and <strong>Sign</strong>.</p>
          <div className="grid grid-cols-2 gap-4 text-center text-sm font-mono mt-4">
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <div className="text-cyan-400 font-bold">/+</div>
              <div className="text-slate-500">Up-Right (Q1)</div>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <div className="text-cyan-400 font-bold">\-</div>
              <div className="text-slate-500">Up-Left (Q2)</div>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <div className="text-cyan-400 font-bold">/-</div>
              <div className="text-slate-500">Down-Left (Q3)</div>
            </div>
            <div className="bg-slate-800 p-2 rounded border border-slate-700">
              <div className="text-cyan-400 font-bold">\+</div>
              <div className="text-slate-500">Down-Right (Q4)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Resolution Rule",
      content: (
        <div className="space-y-4">
          <p>The system only halts (resolves to <code className="text-yellow-400">**</code>) when exact opposites meet.</p>
          <div className="bg-slate-800/50 p-4 rounded border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-400 mb-2">Total Inversion</p>
            <p>Must have opposite <strong>Slope</strong> AND opposite <strong>Sign</strong>.</p>
            <ul className="mt-2 text-sm space-y-1 font-mono">
              <li>/+ cancels \-</li>
              <li>\+ cancels /-</li>
            </ul>
          </div>
          <p className="text-sm italic text-slate-400">Side-by-side quadrants (e.g., /+ and /-) do NOT cancel. They coexist.</p>
        </div>
      )
    },
    {
      title: "Optical Analog",
      content: (
        <div className="space-y-4">
          <p>Logibra maps directly to physical optics.</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
            <li><strong className="text-emerald-400">*</strong> : Coherent monochromatic light seed.</li>
            <li><strong className="text-emerald-400">@</strong> : Phase-locked reference cavity.</li>
            <li><strong className="text-emerald-400">-&gt;</strong> : Beam splitting and direction encoding.</li>
            <li><strong className="text-emerald-400">&</strong> : Interferometric junction.</li>
            <li><strong className="text-yellow-400">**</strong> : A dark fringe (destructive interference) that absorbs signal.</li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => setPage(p => Math.min(p + 1, pages.length - 1));
  const handlePrev = () => setPage(p => Math.max(p - 1, 0));

  // Determine accent color based on mode
  const accentColor = mode === 'python' ? 'text-blue-400' : mode === 'haskell' ? 'text-purple-400' : 'text-emerald-400';
  const btnClass = `px-4 py-2 rounded font-bold transition-colors ${
      mode === 'python' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 
      mode === 'haskell' ? 'bg-purple-600 hover:bg-purple-500 text-white' : 
      'bg-emerald-600 hover:bg-emerald-500 text-white'
  }`;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className={`text-2xl font-bold tracking-tight ${accentColor}`}>
            Documentation <span className="text-slate-500 text-base font-normal">/ {page + 1} of {pages.length}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">{pages[page].title}</h3>
          <div className="text-slate-300 leading-relaxed text-lg">
            {pages[page].content}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/50">
          <button 
            onClick={handlePrev} 
            disabled={page === 0}
            className={`text-slate-400 font-mono hover:text-white disabled:opacity-30 disabled:hover:text-slate-400`}
          >
            ← PREV
          </button>
          
          <div className="flex space-x-2">
            {pages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2 h-2 rounded-full transition-colors ${idx === page ? (mode === 'python' ? 'bg-blue-500' : mode === 'haskell' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-slate-700'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext} 
            disabled={page === pages.length - 1}
            className={btnClass}
          >
            {page === pages.length - 1 ? 'FINISH' : 'NEXT →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;
