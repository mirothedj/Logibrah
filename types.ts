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
