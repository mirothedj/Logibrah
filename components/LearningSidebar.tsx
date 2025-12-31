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

import React, { useState } from 'react';
import { AppMode } from '../types';

interface LearningSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
}

const LearningSidebar: React.FC<LearningSidebarProps> = ({ isOpen, onClose, mode }) => {
  const [activeSection, setActiveSection] = useState<number | null>(0);

  const toggleSection = (idx: number) => {
    setActiveSection(activeSection === idx ? null : idx);
  };

  const sections = [
    {
      title: "1. Core Primitives",
      content: (
        <div className="space-y-3 text-sm text-slate-400">
          <p><strong className="text-white">Unit (*)</strong>: A coherent seed or wavelet. Represents potential without vector.</p>
          <p><strong className="text-white">Flow (-&gt;)</strong>: A projective operator sending a Unit into a Quadrant.</p>
          <p><strong className="text-white">Relation (&)</strong>: An interference junction combining two signals.</p>
          <p><strong className="text-yellow-400">Resolution (**)</strong>: The terminal null state (Dark Fringe).</p>
        </div>
      )
    },
    {
      title: "2. The Quadrants",
      content: (
        <div className="space-y-3 text-sm text-slate-400">
          <p><strong className="text-cyan-400">/+ (Q1)</strong>: Up-Right. Slope /, Phase 0.</p>
          <p><strong className="text-cyan-400">\- (Q2)</strong>: Up-Left. Slope \, Phase π.</p>
          <p><strong className="text-cyan-400">/- (Q3)</strong>: Down-Left. Slope /, Phase π.</p>
          <p><strong className="text-cyan-400">\+ (Q4)</strong>: Down-Right. Slope \, Phase 0.</p>
        </div>
      )
    },
    {
      title: "3. Resolution Rule",
      content: (
        <div className="space-y-3 text-sm text-slate-400">
          <p>Resolution (**) occurs via <strong>Total Inversion</strong>.</p>
          <p>Requires opposite slope AND opposite sign (phase shift of π).</p>
          <div className="bg-slate-900 p-2 rounded border border-slate-700 font-mono text-xs">
            <div className="flex justify-between">
              <span>/+</span> <span className="text-red-500">cancels</span> <span>\-</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>\+</span> <span className="text-red-500">cancels</span> <span>/-</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. Physical Substrate",
      content: (
        <div className="space-y-3 text-sm text-slate-400">
          <p>Logibra maps to <strong>Silicon Photonics</strong> (PIC).</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Signals are monochromatic light.</li>
            <li>Logic is passive interference.</li>
            <li>No clocks, no heat (ideal).</li>
          </ul>
        </div>
      )
    },
    {
      title: "5. Engineering Transfer",
      content: (
        <div className="space-y-3 text-sm text-slate-400">
          <p>
             <strong>System Protocol</strong>: This UI is a verified visualization of the restored Training Manuals (<span className="font-mono text-xs bg-slate-800 px-1 rounded">logibra.py</span> and <span className="font-mono text-xs bg-slate-800 px-1 rounded">Logibra.hs</span>).
          </p>
          <p>
            <strong>For Future Engineers</strong>: Access the immutable reference logic by toggling the <strong className="text-white border border-slate-600 px-1 rounded text-xs">&lt;/&gt; CODE</strong> button in the console header. 
          </p>
          <div className="bg-slate-900/50 p-2 border-l-2 border-yellow-500 text-xs italic opacity-90">
             "We do not approximate. We terminate ambiguity."
          </div>
          <p className="text-xs mt-2">
            <strong>Maintenance</strong>: Do not modify the <span className="text-emerald-400">logibra-engine.ts</span> core without re-certifying against the Python test suite.
          </p>
        </div>
      )
    }
  ];

  const getThemeColors = () => {
     if (mode === 'python') return 'text-blue-500 border-blue-500';
     if (mode === 'haskell') return 'text-purple-500 border-purple-500';
     return 'text-emerald-500 border-emerald-500';
  }

  const themeColors = getThemeColors();

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#02040a] border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${themeColors.split(' ')[0]}`}>
            <span className="text-2xl">❖</span>
            <span>LEARNING</span>
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1 rounded hover:bg-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-80px)] space-y-3">
          {sections.map((section, idx) => (
            <div key={idx} className={`border border-slate-800/60 rounded-lg bg-slate-900/20 overflow-hidden transition-all duration-300 ${activeSection === idx ? 'bg-slate-900/40 border-slate-700' : ''}`}>
              <button 
                onClick={() => toggleSection(idx)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 transition-colors focus:outline-none"
              >
                <span className={`font-bold text-sm ${activeSection === idx ? 'text-white' : 'text-slate-400'}`}>
                  {section.title}
                </span>
                <span className={`transform transition-transform duration-300 text-slate-500 ${activeSection === idx ? 'rotate-180 text-white' : ''}`}>
                   ▼
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSection === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-4 pt-0 border-t border-slate-800/50">
                  {section.content}
                </div>
              </div>
            </div>
          ))}

          {/* Tips Box */}
          <div className={`mt-8 p-4 rounded border bg-opacity-10 bg-slate-500 ${themeColors}`}>
             <h4 className="font-bold text-sm mb-2 opacity-90">Quick Tips</h4>
             <ul className="text-xs space-y-2 opacity-75 list-disc pl-4">
               <li>Use <strong>Flow</strong> to direct units.</li>
               <li>Use <strong>Relation</strong> to combine paths.</li>
               <li><strong>**</strong> only appears when paths destructively interfere.</li>
             </ul>
          </div>
        </div>

      </div>
    </>
  );
};

export default LearningSidebar;