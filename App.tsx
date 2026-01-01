import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { parseAndReduce, stringifyAST } from './logibra-engine';
import { ExecutionResult } from './types';
import TerminatorConsole from './components/TerminatorConsole';
import QuadrantScope from './components/QuadrantScope';
import VirtualKeyboard from './components/VirtualKeyboard';

const App = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ExecutionResult[]>([]);
  const [currentResult, setCurrentResult] = useState<ExecutionResult | null>(null);
  const [nlLoading, setNlLoading] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  // Intent Translator using Gemini
  const handleNaturalLanguage = async () => {
    if (!input.trim() || !process.env.API_KEY) return;
    
    setNlLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash-latest';
      
      const prompt = `
        You are an expert in the "Logibra" logic system. 
        Translate the user's natural language intent into valid Logibra syntax string.
        
        Grammar:
        - Unit: *
        - Flow: ->
        - Relation: &
        - Polarities: /+ (Up-Right), \\+ (Down-Right), /- (Down-Left), \\- (Up-Left)
        - Anchor: @ (e.g., *@)
        - Prime: ' (e.g., *')
        - Grouping: ()
        
        Rules:
        - "Advancing" usually means Right (either /+ or \\+)
        - "Receding" usually means Left (either /- or \\-)
        - "Opposing" means finding the inverse.
        
        Example: "Cancel an anchored unit against a receding flow" -> (*@ -> /+) & (*@ -> \\-) (One possible interpretation of cancellation)
        Example: "Two advancing units" -> (* -> /+) & (* -> \\+)

        Only return the syntax string. No markdown, no explanation.
        User Input: "${input}"
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const translated = response.text?.trim() || '';
      if (translated) {
        setInput(translated);
      }
    } catch (e) {
      console.error("Translation failed", e);
      alert("Failed to translate intent. Check API Key.");
    } finally {
      setNlLoading(false);
    }
  };

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
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6">
      
      {/* Header */}
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
          LOGIBRA
        </h1>
        <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
          Invariant Resolution Engine
        </p>
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
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      execute();
                    }
                  }}
                  rows={3}
                  placeholder="Enter structural intent..."
                  className="w-full bg-slate-950 text-emerald-400 font-mono p-4 pr-12 rounded border border-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-900 shadow-inner resize-y"
                />
                <div className="absolute right-2 top-2">
                   {process.env.API_KEY && (
                     <button 
                       onClick={handleNaturalLanguage}
                       disabled={nlLoading}
                       className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                       title="Translate Natural Language to Logibra"
                     >
                       {nlLoading ? 'Thinking...' : 'AI Input'}
                     </button>
                   )}
                </div>
              </div>
              
              <VirtualKeyboard 
                onInput={handleInput} 
                onClear={handleClear} 
                onBackspace={handleBackspace} 
                onExecute={execute}
              />
           </div>
        </div>

        {/* Right Col: Console & Docs (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col h-[600px] lg:h-auto">
          <div className="flex-1 min-h-0 relative">
             <TerminatorConsole history={history} />
             
             {/* Info Toggle */}
             <button 
               onClick={() => setShowDocs(!showDocs)}
               className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
               </svg>
             </button>

             {/* Documentation Overlay */}
             {showDocs && (
               <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm p-6 overflow-y-auto border border-slate-700 rounded-lg z-10">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold text-white">System Reference</h3>
                   <button onClick={() => setShowDocs(false)} className="text-slate-400 hover:text-white">✕</button>
                 </div>
                 <div className="space-y-4 text-sm text-slate-300 font-mono">
                   <section>
                     <h4 className="text-emerald-500 font-bold mb-1">Polarities & Quadrants</h4>
                     <ul className="list-disc pl-4 space-y-1">
                       <li><code className="text-cyan-400">/+</code> Up-Right (Q1)</li>
                       <li><code className="text-cyan-400">\+</code> Down-Right (Q4)</li>
                       <li><code className="text-cyan-400">/-</code> Down-Left (Q3)</li>
                       <li><code className="text-cyan-400">\-</code> Up-Left (Q2)</li>
                     </ul>
                   </section>
                   <section>
                     <h4 className="text-emerald-500 font-bold mb-1">Resolution Logic</h4>
                     <p className="mb-2">Resolution <code className="text-yellow-400">**</code> occurs only upon Total Inversion:</p>
                     <ul className="list-disc pl-4 space-y-1">
                       <li><code className="text-cyan-400">/+</code> cancels <code className="text-cyan-400">\-</code> (Opposite Slope & Sign)</li>
                       <li><code className="text-cyan-400">\+</code> cancels <code className="text-cyan-400">/-</code></li>
                     </ul>
                   </section>
                   <section>
                     <h4 className="text-emerald-500 font-bold mb-1">Examples</h4>
                     <p>Conflict: <code className="block bg-slate-800 p-1 rounded my-1">(* -> /+) & (* -> \-)</code> resolves to <code className="text-yellow-400">**</code></p>
                     <p>No Conflict: <code className="block bg-slate-800 p-1 rounded my-1">(* -> /+) & (* -> /-)</code> remains unresolved</p>
                   </section>
                 </div>
               </div>
             )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;