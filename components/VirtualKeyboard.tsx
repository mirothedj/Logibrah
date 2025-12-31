import React from 'react';

interface VirtualKeyboardProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onExecute: () => void;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onInput, onClear, onBackspace, onExecute }) => {
  const primaryKeys = ['*', '->', '&', '(', ')', '@', "'"];
  const polarityKeys = ['/+', '\\+', '/-', '\\-'];
  
  const btnClass = "h-10 sm:h-12 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm sm:text-base font-mono font-semibold transition-colors border-b-2 border-slate-950 active:border-b-0 active:translate-y-[2px]";
  const polClass = "h-10 sm:h-12 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-sm sm:text-base font-mono font-bold transition-colors border-b-2 border-slate-950 active:border-b-0 active:translate-y-[2px]";

  return (
    <div className="grid grid-cols-1 gap-2 bg-slate-900 p-2 sm:p-4 rounded-xl border border-slate-700 select-none">
      
      {/* Top Row: Core Symbols */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {primaryKeys.map(k => (
          <button key={k} onClick={() => onInput(k)} className={btnClass}>
            {k}
          </button>
        ))}
      </div>

      {/* Middle Row: Polarity */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 px-8 sm:px-12">
        {polarityKeys.map(k => (
          <button key={k} onClick={() => onInput(k)} className={polClass}>
            {k}
          </button>
        ))}
      </div>

      {/* Bottom Row: Actions */}
      <div className="grid grid-cols-4 gap-2 mt-2">
         <button onClick={onClear} className="bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded border border-red-900/50 font-mono text-xs uppercase tracking-wider">
           Clear
         </button>
         <button onClick={onBackspace} className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded font-mono text-sm">
           ⌫
         </button>
         <button onClick={() => onInput('**')} className="bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 rounded font-bold font-mono">
           **
         </button>
         <button onClick={onExecute} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-[0_0_15px_rgba(16,185,129,0.4)] border-b-4 border-emerald-800 active:border-b-0 active:translate-y-[4px]">
           RESOLVE
         </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;