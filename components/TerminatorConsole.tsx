import React from 'react';
import { ExecutionResult } from '../types';
import { stringifyAST } from '../logibra-engine';

interface TerminatorConsoleProps {
  history: ExecutionResult[];
}

const TerminatorConsole: React.FC<TerminatorConsoleProps> = ({ history }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg border border-slate-800 overflow-hidden font-mono shadow-inner">
      <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
        <span className="text-xs text-emerald-500 font-bold tracking-widest uppercase">Invariant Log</span>
        <span className="text-[10px] text-slate-500">v1.0.0</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {history.length === 0 && (
          <div className="text-slate-600 text-sm text-center mt-10 italic">
            Waiting for structural intent...
          </div>
        )}
        
        {history.map((entry, idx) => (
          <div key={idx} className="flex flex-col space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-start space-x-2">
              <span className="text-slate-500 text-xs mt-1">IN &gt;</span>
              <span className="text-slate-300 whitespace-pre-wrap break-all">{entry.input}</span>
            </div>
            
            {entry.error ? (
               <div className="flex items-start space-x-2 pl-6">
                 <span className="text-red-500 text-xs">ERR:</span>
                 <span className="text-red-400 text-sm">{entry.error}</span>
               </div>
            ) : (
                <div className="flex items-start space-x-2 pl-6">
                  <span className="text-emerald-600 text-xs mt-1">OUT:</span>
                  <span className={`text-lg font-bold ${stringifyAST(entry.reduced) === '**' ? 'text-yellow-400 glow' : 'text-emerald-400'}`}>
                    {stringifyAST(entry.reduced)}
                  </span>
                </div>
            )}
            <div className="w-full h-[1px] bg-slate-800/50 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerminatorConsole;