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
import { ASTNode } from '../types';
import { toPythonCode, toHaskellCode } from '../logibra-engine';

interface CodeTranslatorProps {
  ast: ASTNode | null;
  onClose: () => void;
}

const CodeTranslator: React.FC<CodeTranslatorProps> = ({ ast, onClose }) => {
  const [activeTab, setActiveTab] = useState<'py-live' | 'hs-live' | 'py-ref' | 'hs-ref' | 'ai-ref'>('py-live');

  const pythonRef = `class Node: pass
class Unit(Node):
    def __init__(self, modifiers):
        self.modifiers = modifiers
        self.anchored = '@' in modifiers
        self.prime_count = modifiers.count("'")
    def __repr__(self):
        mods = ("@" if self.anchored else "") + ("'" * self.prime_count)
        return f"*{mods}"
    def __eq__(self, other):
        return (isinstance(other, Unit) and 
                self.anchored == other.anchored and 
                self.prime_count == other.prime_count)

class Flow(Node):
    def __init__(self, unit, polarity):
        self.unit = unit
        self.polarity = polarity
    def __repr__(self): return f"{self.unit} -> {self.polarity}"

class Relation(Node):
    def __init__(self, left, right):
        self.left = left
        self.right = right
    def __repr__(self): return f"({self.left} & {self.right})"

class Resolution(Node):
    def __repr__(self): return "**"

def are_inverses(pol_a, pol_b):
    pairs = [('/+', '\\-'), ('\\-', '/+'), ('\\+', '/-'), ('/-', '\\+')]
    return (pol_a, pol_b) in pairs

def reduce(node):
    if isinstance(node, (Unit, Resolution)): return node
    if isinstance(node, Flow):
        reduced_unit = reduce(node.unit)
        if isinstance(reduced_unit, Resolution): return Resolution()
        return Flow(reduced_unit, node.polarity)
    if isinstance(node, Relation):
        left = reduce(node.left)
        right = reduce(node.right)
        if isinstance(left, Resolution) or isinstance(right, Resolution):
            return Resolution()
        if isinstance(left, Flow) and isinstance(right, Flow):
            if left.unit == right.unit and are_inverses(left.polarity, right.polarity):
                return Resolution()
        return Relation(left, right)
    return node`;

  const haskellRef = `module Logibra where

data Modifier = Anchor | Prime deriving (Show, Eq)
data Polarity = P_UpRight | P_DownRight | P_DownLeft | P_UpLeft deriving (Show, Eq)
data Expr = Unit [Modifier] | Flow Expr Polarity | Relation Expr Expr | Resolution deriving (Eq)

instance Show Expr where
    show (Unit mods) = "*" ++ concatMap showMod mods
      where showMod Anchor = "@"; showMod Prime = "'"
    show (Flow e p) = show e ++ " -> " ++ showPol p
      where showPol P_UpRight = "/+"; showPol P_DownRight = "\\+"
            showPol P_DownLeft = "/-"; showPol P_UpLeft = "\\-"
    show (Relation a b) = "(" ++ show a ++ " & " ++ show b ++ ")"
    show Resolution = "**"

areInverses :: Polarity -> Polarity -> Bool
areInverses P_UpRight P_UpLeft = True
areInverses P_UpLeft P_UpRight = True
areInverses P_DownRight P_DownLeft = True
areInverses P_DownLeft P_DownRight = True
areInverses _ _ = False

reduce :: Expr -> Expr
reduce Resolution = Resolution
reduce (Unit m) = Unit m
reduce (Flow e p) = case reduce e of
    Resolution -> Resolution
    re -> Flow re p
reduce (Relation a b) = case (reduce a, reduce b) of
    (Resolution, _) -> Resolution
    (_, Resolution) -> Resolution
    (Flow u1 p1, Flow u2 p2) ->
        if u1 == u2 && areInverses p1 p2 then Resolution else Relation (reduce a) (reduce b)
    (ra, rb) -> Relation ra rb`;

  const aiRef = `import os
import google.generativeai as genai

# NOTE: The API key is securely handled by the environment.
# In production, this value is never hardcoded.
# The "**" represents the environmental variable placeholder.
API_KEY = os.getenv("API_KEY", "**")

genai.configure(api_key=API_KEY)

def translate_intent(natural_language_input):
    model = genai.GenerativeModel('gemini-2.5-flash-latest')
    
    prompt = f"""
    Translate the following Natural Language to Logibra Syntax.
    Rules:
    - Unit: *
    - Flow: ->
    - Relation: &
    - Polarity: /+, \\+, /-, \\-
    
    Input: {natural_language_input}
    """
    
    response = model.generate_content(prompt)
    return response.text

# Example Usage
# result = translate_intent("Cancel an anchored unit against a receding flow")
# print(result)
`;

  return (
    <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md p-4 sm:p-8 overflow-hidden flex flex-col z-20 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span className="text-emerald-500">◆</span>
          <span>Translator & Reference</span>
        </h2>
        <button 
          onClick={onClose} 
          className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded transition-colors"
        >
          ✕ CLOSE
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-2 border-b border-slate-700">
        {[
          { id: 'py-live', label: 'Live Python AST' },
          { id: 'hs-live', label: 'Live Haskell AST' },
          { id: 'py-ref', label: 'Ref: logibra.py' },
          { id: 'hs-ref', label: 'Ref: Logibra.hs' },
          { id: 'ai-ref', label: 'Ref: AI Bridge' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-mono whitespace-nowrap rounded-t-lg transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto bg-[#0d1117] rounded-lg border border-slate-700 p-4 shadow-inner relative">
        <pre className="font-mono text-sm leading-relaxed">
          <code className="language-python text-slate-300">
            {activeTab === 'py-live' && (ast ? toPythonCode(ast) : '# No input parsed yet')}
            {activeTab === 'hs-live' && (ast ? toHaskellCode(ast) : '-- No input parsed yet')}
            {activeTab === 'py-ref' && pythonRef}
            {activeTab === 'hs-ref' && haskellRef}
            {activeTab === 'ai-ref' && aiRef}
          </code>
        </pre>
        <div className="absolute top-2 right-2 px-2 py-1 bg-slate-800 rounded text-xs text-slate-500 font-mono">
           {activeTab.includes('py') ? 'Python 3.10+' : 'Haskell GHC 9+'}
        </div>
      </div>
    </div>
  );
};

export default CodeTranslator;
