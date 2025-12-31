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
import { parseAndReduce, stringifyAST } from './logibra-engine';
import { ExecutionResult, AppMode } from './types';
import TerminatorConsole from './components/TerminatorConsole';
import QuadrantScope from './components/QuadrantScope';
import VirtualKeyboard from './components/VirtualKeyboard';
import CodeTranslator from './components/CodeTranslator';
import LearningSidebar from './components/LearningSidebar';

const App = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ExecutionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ExecutionResult | null>(null);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [showCode, setShowCode] = useState(false);
  const [mode, setMode] = useState<AppMode>('logibra');

  // Theme Config
  const getTheme = () => {
    switch (mode) {
      case 'python':
        return {
          title: 'text-blue-500',
          glow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]',
          inputBorder: 'focus:border-blue-500 focus:ring-blue-900',
          inputText: 'text-blue-400',
          btnActive: 'bg-blue-900/80 border-blue-500 text-white'
        };
      case 'haskell':
        return {
          title: 'text-purple-500',
          glow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]',
          inputBorder: 'focus:border-purple-500 focus:ring-purple-900',
          inputText: 'text-purple-400',
          btnActive: 'bg-purple-900/80 border-purple-500 text-white'
        };
      default:
        return {
          title: 'text-emerald-500',
          glow: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]',
          inputBorder: 'focus:border-emerald-500 focus:ring-emerald-900',
          inputText: 'text-emerald-400',
          btnActive: 'bg-emerald-900/80 border-emerald-500 text-white'
        };
    }
  };

  const theme = getTheme();

  const execute = () => {
    if (!input.trim()) return;
    
    const result = parseAndReduce(input);
    const executionEntry: ExecutionResult = {
      input,
      ast: result.ast,
      reduced: result.reduced,
      error: result.error,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, executionEntry]);
    setCurrentResult(executionEntry);
    setInput('');
  };

  // Keyboard handlers
  const handleInput = (char: string) => setInput(prev => prev + char);
  const handleBackspace = () => setInput(prev => prev.slice(0, -1));
  const handleClear = () => {
    setInput('');
    setCurrentResult(null);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 relative transition-colors duration-500 ${mode === 'python' ? 'bg-[#050914]' : mode === 'haskell' ? 'bg-[#0a0514]' : 'bg-[#050505]'}`}>
      
      {/* Code Translator Overlay */}
      {showCode && (
        <CodeTranslator 
          ast={currentResult?.ast || null} 
          onClose={() => setShowCode(false)} 
        />
      )}

      {/* Learning Sidebar */}
      <LearningSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        mode={mode}
      />

      {/* Top Right Learning Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-col items-end">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border shadow-2xl transition-all hover:scale-105 font-bold tracking-wide text-xs sm:text-sm group ${
            isSidebarOpen 
              ? theme.btnActive 
              : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''} ${mode === 'python' ? 'text-yellow-400' : mode === 'haskell' ? 'text-purple-300' : 'text-yellow-400'}`}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <span>LEARNING</span>
        </button>
      </div>

      {/* Header with Mode Switcher */}
      <header className="mb-8 text-center space-y-4 w-full flex flex-col items-center mt-8 sm:mt-0">
        <div>
          <h1 className={`text-4xl sm:text-5xl font-bold tracking-tighter transition-colors duration-500 ${theme.title} ${theme.glow}`}>
            LOGIBRA
          </h1>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
            Invariant Resolver Engine
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex space-x-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 backdrop-blur-sm shadow-xl">
          {(['logibra', 'python', 'haskell'] as AppMode[]).map((m) => (
             <button
               key={m}
               onClick={() => setMode(m)}
               className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                 mode === m 
                   ? (m === 'python' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' : m === 'haskell' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-105' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-105') 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
               }`}
             >
               {m}
             </button>
          ))}
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Visuals & Input (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
           {/* Visualizer */}
           <div className="flex justify-center">
             <QuadrantScope 
                ast={currentResult?.ast || null} 
                reduced={currentResult?.reduced || null} 
             />
           </div>

           {/* Input Area */}
           <div className="flex flex-col space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter structural intent..."
                  className={`w-full bg-slate-950 font-mono p-4 pr-12 rounded border border-slate-700 focus:outline-none focus:ring-1 shadow-inner transition-colors duration-300 ${theme.inputBorder} ${theme.inputText}`}
                />
              </div>
              
              <VirtualKeyboard 
                onInput={handleInput} 
                onClear={handleClear} 
                onBackspace={handleBackspace} 
                onExecute={execute}
                mode={mode}
              />
           </div>
        </div>

        {/* Right Col: Console & Docs (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col h-[600px] lg:h-auto">
          <div className="flex-1 min-h-0 relative">
             <TerminatorConsole history={history} />
             
             {/* Controls Container (Code Only) */}
             <div className="absolute top-2 right-2 flex space-x-2">
               {/* Code Toggle */}
               <button 
                 onClick={() => setShowCode(true)}
                 className={`text-slate-500 transition-colors font-mono text-xs border border-slate-700 px-2 py-1 rounded hover:border-opacity-50 ${mode === 'python' ? 'hover:text-blue-400 hover:border-blue-500' : mode === 'haskell' ? 'hover:text-purple-400 hover:border-purple-500' : 'hover:text-emerald-400 hover:border-emerald-500'}`}
               >
                 &lt;/&gt; CODE
               </button>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;
