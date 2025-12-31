/*
============================================================
LOGIBRA - NON-COMMERCIAL ABSOLUTE LOCK (NC-AL v1.0)

THIS WORK IS NOT ARTIFICIAL INTELLIGENCE.

THIS WORK:
- IS NOT AI
- IS NOT MACHINE LEARNING
- IS NOT TRAINABLE
- IS NOT DATA-DRIVEN
- IS NOT OPTIMIZATION
- IS NOT INFERENCE
- IS NOT DESIGNED FOR AI SYSTEMS

ABSOLUTE PROHIBITIONS:
- NO COMMERCIAL USE
- NO PROFIT OF ANY KIND
- NO INSTITUTIONAL PROFIT
- NO PATENTS
- NO LICENSING
- NO AI TRAINING
- NO AI DATASETS
- NO AI DERIVATIVES
- NO AI-ADJACENT USE

ANY USE FOR AI PURPOSES OR PROFIT
IMMEDIATELY VOIDS ALL RIGHTS.

LICENSE: Logibra NC-AL v1.0
SEE: LICENSE.NC-AL
============================================================
*/

import React, { useState, useRef, TouchEvent } from 'react';

interface DocumentationViewerProps {
  onClose: () => void;
  mode: 'logibra' | 'python' | 'haskell';
  initialPage?: number;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({ onClose, mode, initialPage = 0 }) => {
  const [page, setPage] = useState(initialPage);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Swipe Handlers
  const onTouchStart = (e: TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && page < pages.length - 1) {
      handleNext();
    }
    if (isRightSwipe && page > 0) {
      handlePrev();
    }
  };

  const pages = [
    {
      title: "System Overview",
      content: (
        <div className="space-y-4">
          <p className="text-lg"><strong>Logibra</strong> is an invariant resolution engine. It terminates ambiguity through structural cancellation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
              <strong className="text-white block mb-1">Unit (*)</strong>
              <span className="text-slate-400 text-sm">A pre-intent potential. Not a number, but a coherent seed.</span>
            </div>
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
              <strong className="text-white block mb-1">Anchor (@)</strong>
              <span className="text-slate-400 text-sm">Phase-locked reference. Immutable.</span>
            </div>
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
              <strong className="text-white block mb-1">Flow (-&gt;)</strong>
              <span className="text-slate-400 text-sm">Projects a unit into a specific quadrant.</span>
            </div>
            <div className="bg-slate-800 p-3 rounded border border-slate-700">
              <strong className="text-white block mb-1">Resolution (**)</strong>
              <span className="text-yellow-400 text-sm">Terminal state. Absorbs all signals.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Quadrants & Polarity",
      content: (
        <div className="space-y-6">
          <p>Directions are defined physically by <strong>Slope</strong> and <strong>Sign</strong>.</p>
          <div className="grid grid-cols-2 gap-4 text-center text-sm font-mono">
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex flex-col items-center">
              <div className="text-cyan-400 font-bold text-2xl mb-1">/+</div>
              <div className="text-white font-bold">Up-Right (Q1)</div>
              <div className="text-slate-500 text-xs mt-1">Slope: / | Phase: 0</div>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex flex-col items-center">
              <div className="text-cyan-400 font-bold text-2xl mb-1">\-</div>
              <div className="text-white font-bold">Up-Left (Q2)</div>
              <div className="text-slate-500 text-xs mt-1">Slope: \ | Phase: π</div>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex flex-col items-center">
              <div className="text-cyan-400 font-bold text-2xl mb-1">/-</div>
              <div className="text-white font-bold">Down-Left (Q3)</div>
              <div className="text-slate-500 text-xs mt-1">Slope: / | Phase: π</div>
            </div>
            <div className="bg-slate-800 p-4 rounded border border-slate-700 flex flex-col items-center">
              <div className="text-cyan-400 font-bold text-2xl mb-1"> \+ </div>
              <div className="text-white font-bold">Down-Right (Q4)</div>
              <div className="text-slate-500 text-xs mt-1">Slope: \ | Phase: 0</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Resolution Rule",
      content: (
        <div className="space-y-6">
          <p>The system only halts (resolves to <code className="text-yellow-400">**</code>) upon <strong>Total Inversion</strong>.</p>
          
          <div className="bg-slate-800/50 p-6 rounded border-l-4 border-yellow-500">
            <h4 className="font-bold text-yellow-400 text-lg mb-2">Condition for **</h4>
            <p className="mb-4">Must have Opposite <strong>Slope</strong> AND Opposite <strong>Sign</strong>.</p>
            <div className="font-mono text-sm space-y-2">
              <div className="flex justify-between border-b border-slate-700 pb-2">
                <span>/+ (Slope / Phase 0)</span>
                <span className="text-red-400">CANCELS</span>
                <span>\- (Slope \ Phase π)</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>\+ (Slope \ Phase 0)</span>
                <span className="text-red-400">CANCELS</span>
                <span>/- (Slope / Phase π)</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 italic">
            Note: Side-by-side quadrants (e.g., /+ and /-) do not cancel because they share the same slope, resulting in constructive interference or modulation, not a null.
          </p>
        </div>
      )
    },
    {
      title: "Optical Substrate",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Logibra is a <strong>phase-dominant optical system</strong>, not amplitude computing. It uses coherent monochromatic light in a planar lattice.</p>
          
          <ul className="space-y-4 mt-4">
            <li className="bg-slate-800 p-3 rounded border border-slate-700">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-emerald-400 font-mono font-bold text-lg">*</span>
                <span className="text-white font-bold">Coherent Seed</span>
              </div>
              <p className="text-slate-400 text-sm font-mono">ψ₀ = A e^(iε)</p>
              <p className="text-slate-500 text-xs mt-1">A latent wavelet. Fixed amplitude, pre-intent phase.</p>
            </li>
            
            <li className="bg-slate-800 p-3 rounded border border-slate-700">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-emerald-400 font-mono font-bold text-lg">@</span>
                <span className="text-white font-bold">Phase-Locked Reference (Φx)</span>
              </div>
              <p className="text-slate-400 text-sm font-mono">ψ_Φ = A e^(iΦx)</p>
              <p className="text-slate-500 text-xs mt-1">Optical Phase-Locked Loop (OPLL) or stabilized cavity. Cannot be altered by interference.</p>
            </li>

            <li className="bg-slate-800 p-3 rounded border border-slate-700">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-emerald-400 font-mono font-bold text-lg">'</span>
                <span className="text-white font-bold">Phase Rotation Plate</span>
              </div>
              <p className="text-slate-400 text-sm font-mono">' ≡ e^(iθ)</p>
              <p className="text-slate-500 text-xs mt-1">A waveplate providing fixed phase retardation.</p>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: "Optical Logic & Resolution",
      content: (
        <div className="space-y-5">
           <div>
             <h4 className="text-emerald-400 font-bold mb-2">Flow (-&gt;)</h4>
             <p className="text-slate-300 text-sm">
               <strong>Beam Splitting + Direction Encoding.</strong> Implemented via a 50/50 beam splitter followed by a spatial light modulator (SLM).
             </p>
           </div>
           
           <div>
             <h4 className="text-emerald-400 font-bold mb-2">Relation (&)</h4>
             <p className="text-slate-300 text-sm">
               <strong>Interference Junction.</strong> A beam combiner where path lengths are matched within coherence length.
             </p>
           </div>

           <div className="bg-slate-900 border border-yellow-900/50 p-4 rounded">
             <h4 className="text-yellow-400 font-bold mb-2">Resolution (**) as Dark Fringe</h4>
             <p className="text-slate-300 text-sm mb-2">
               When Total Inversion occurs, we get destructive interference:
             </p>
             <p className="text-center font-mono text-white my-2">ψ + (-ψ) = 0</p>
             <p className="text-slate-400 text-xs">
               This produces a stable <strong>dark fringe</strong> (zero intensity). The phase becomes undefined. Physically realized by a resonant null cavity. Once formed, no signal propagates; it is a terminal state.
             </p>
           </div>
        </div>
      )
    },
    {
      title: "Integrated Photonics (PIC)",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">Direct mapping to Silicon Photonics or SiN platform. Single wavelength, single transverse mode.</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded px-3">
              <span className="font-mono text-emerald-400">* Unit</span>
              <span className="text-white text-sm">Waveguide Segment</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded px-3">
              <span className="font-mono text-emerald-400">@ Anchor</span>
              <span className="text-white text-sm">Reference Loop</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded px-3">
              <span className="font-mono text-emerald-400">' Prime</span>
              <span className="text-white text-sm">Phase Shifter</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded px-3">
              <span className="font-mono text-emerald-400">-&gt; Flow</span>
              <span className="text-white text-sm">1×2 MMI Coupler</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-2 rounded px-3">
              <span className="font-mono text-emerald-400">& Rel</span>
              <span className="text-white text-sm">2×2 MMI Coupler</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-2">
             <strong>Constraint Solver:</strong> This forms a passive, deterministic photonic constraint solver. No clocks, no global synchronization.
          </p>
        </div>
      )
    },
    {
      title: "PIC Architecture",
      content: (
        <div className="space-y-5">
           <div>
             <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Polarity Encoding</h4>
             <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-cyan-400 block">Slope /</span>
                  <span className="text-slate-400">Upper Waveguide</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-cyan-400 block">Slope \</span>
                  <span className="text-slate-400">Lower Waveguide</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-cyan-400 block">Sign +</span>
                  <span className="text-slate-400">Phase 0</span>
                </div>
                <div className="bg-slate-800 p-2 rounded">
                  <span className="text-cyan-400 block">Sign -</span>
                  <span className="text-slate-400">Phase π</span>
                </div>
             </div>
           </div>

           <div>
             <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Dark-Port Capture</h4>
             <p className="text-slate-300 text-sm">
               Resolution occurs iff inputs enter opposite paths with relative phase π. This produces destructive interference at both output ports of a balanced MMI, creating a "Dark-Port Sink".
             </p>
           </div>
        </div>
      )
    }
  ];

  const handleNext = () => setPage(p => Math.min(p + 1, pages.length - 1));
  const handlePrev = () => setPage(p => Math.max(p - 1, 0));

  // Determine accent color based on mode
  const accentColor = mode === 'python' ? 'text-blue-400' : mode === 'haskell' ? 'text-purple-400' : 'text-emerald-400';
  const btnClass = `px-4 py-2 rounded font-bold transition-colors ${
      mode === 'python' ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40' : 
      mode === 'haskell' ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40' : 
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
  }`;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] sm:h-[500px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-950/50">
          <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${accentColor} flex items-center space-x-2`}>
            <span>DOCUMENTATION</span>
            <span className="text-slate-600 text-sm font-normal">/ {page + 1} of {pages.length}</span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 transition-colors">✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-2 inline-block">{pages[page].title}</h3>
          <div className="text-slate-300 leading-relaxed text-base sm:text-lg animate-in slide-in-from-right-4 duration-300">
            {pages[page].content}
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/80">
          <button 
            onClick={handlePrev} 
            disabled={page === 0}
            className={`text-slate-400 font-mono hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors`}
          >
            ← PREV
          </button>
          
          <div className="flex space-x-2">
            {pages.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors duration-300 ${idx === page ? (mode === 'python' ? 'bg-blue-500' : mode === 'haskell' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-slate-700'}`}
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
