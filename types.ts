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

export type Polarity = '/+' | '\\+' | '/-' | '\\-';

export interface UnitNode {
  type: 'Unit';
  modifiers: string[];
  anchored: boolean;
  primeCount: number;
}

export interface FlowNode {
  type: 'Flow';
  unit: UnitNode | ResolutionNode;
  polarity: Polarity;
}

export interface RelationNode {
  type: 'Relation';
  left: ASTNode;
  right: ASTNode;
}

export interface ResolutionNode {
  type: 'Resolution';
}

export type ASTNode = UnitNode | FlowNode | RelationNode | ResolutionNode;

export interface ParseResult {
  ast: ASTNode | null;
  error?: string;
}

export interface ExecutionResult {
  input: string;
  ast: ASTNode | null;
  reduced: ASTNode | null;
  error?: string;
  timestamp: number;
}

export type AppMode = 'logibra' | 'python' | 'haskell';
