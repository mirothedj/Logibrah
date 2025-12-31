import React from 'react';
import { AppMode } from '../types';

interface VirtualKeyboardProps {
  onInput: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onExecute: () => void;
  mode: AppMode;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onInput, onClear, onBackspace, onExecute, mode }) => {
  
  // Theme configs
  const getStyles = () => {
    switch(mode) {
      case 'python':
        return {
          btn: "bg-slate-800 hover:bg-slate-700 text-blue-200 border-b-2 border-slate-950",
          pol: "bg-slate-800 hover:bg-slate-700 text-yellow-400 border-b-2 border-slate-950",
          action: "bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800",
          res: "text-yellow-400 border-yellow-700/50"
        };
      case 'haskell':
        return {
          btn: "bg-slate-800 hover:bg-slate-700 text-purple-200 border-b-2 border-slate-950",
          pol: "bg-slate-800 hover:bg-slate-700 text-pink-400 border-b-2 border-slate-950",
          action: "bg-purple-600 hover:bg-purple-500 text-white border-b-4 border-purple-800",
          res: "text-pink-400 border-pink-700/50"
        };
      default: // logibra
        return {
          btn: "bg-slate-800 hover:bg-slate-700 text-slate-200 border-b-2 border-slate-950",
          pol: "bg-slate-800 hover:bg-slate-700 text-cyan-400 border-b-2 border-slate-950",
          action: "bg-emerald-600 hover:bg-emerald-500 text-white border-b-4 border-emerald-800",
          res: "text-yellow-500 border-yellow-700/50"
        };
    }
  };

  const styles = getStyles();
  const commonClass = "h-10 sm:h-12 rounded text-sm sm:text-base font-mono font-semibold transition-colors active:border-b-0 active:translate-y-[2px] flex flex-col justify-center items-center leading-none";

  // Key Definitions with Mode-Specific Labels
  const keys = [
    { id: '*', label: mode === 'logibra' ? '*' : 'Unit', sub: mode !== 'logibra' ? '*' : null },
    { id: '->', label: mode === 'logibra' ? '->' : 'Flow', sub: mode !== 'logibra' ? '->' : null },
    { id: '&', label: mode === 'logibra' ? '&' : 'Rel', sub: mode !== 'logibra' ? '&' : null },
    { id: '(', label: '(' },
    { id: ')', label: ')' },
    { id: '@', label: mode === 'logibra' ? '@' : 'Anch', sub: mode !== 'logibra' ? '@' : null },
    { id: "'", label: "'" },
  ];

  const polarities = [
    { id: '/+', label: '/+' },
    { id: '\\+', label: '\\+' },
    { id: '/-', label: '/-' },
    { id: '\\-', label: '\\-' },
  ];

  return (
    <div className={`grid grid-cols-1 gap-2 bg-slate-900 p-2 sm:p-4 rounded-xl border border-slate-700 select-none shadow-xl transition-colors duration-500 ${mode === 'python' ? 'border-blue-900/50' : mode === 'haskell' ? 'border-purple-900/50' : ''}`}>
      
      {/* Top Row: Core Symbols */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {keys.map(k => (
          <button key={k.id} onClick={() => onInput(k.id)} className={`${commonClass} ${styles.btn}`}>
            <span>{k.label}</span>
            {k.sub && <span className="text-[10px] opacity-50 mt-[1px]">{k.sub}</span>}
          </button>
        ))}
      </div>

      {/* Middle Row: Polarity */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 px-8 sm:px-12">
        {polarities.map(k => (
          <button key={k.id} onClick={() => onInput(k.id)} className={`${commonClass} ${styles.pol}`}>
            {k.label}
          </button>
        ))}
      </div>

      {/* Bottom Row: Actions */}
      <div className="grid grid-cols-4 gap-2 mt-2">
         <button onClick={onClear} className="bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded border border-red-900/50 font-mono text-xs uppercase tracking-wider transition-colors">
           Clear
         </button>
         <button onClick={onBackspace} className="bg-slate-800 hover:bg-slate-700 text-slate-400 rounded font-mono text-sm transition-colors">
           ⌫
         </button>
         <button onClick={() => onInput('**')} className={`${commonClass} bg-yellow-900/20 hover:bg-yellow-900/40 border ${styles.res} font-bold`}>
           {mode === 'logibra' ? '**' : 'Res'}
         </button>
         <button onClick={onExecute} className={`${commonClass} ${styles.action} shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
           RESOLVE
         </button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
