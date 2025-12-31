import { ASTNode, UnitNode, FlowNode, RelationNode, ResolutionNode, Polarity } from './types';

// --- 1. Constants & Helpers ---

const PAIRS: [Polarity, Polarity][] = [
  ['/+', '\\-'],
  ['\\-', '/+'],
  ['\\+', '/-'],
  ['/-', '\\+'],
];

function areInverses(p1: Polarity, p2: Polarity): boolean {
  return PAIRS.some(pair => pair[0] === p1 && pair[1] === p2);
}

function areUnitsEqual(u1: UnitNode, u2: UnitNode): boolean {
  return u1.anchored === u2.anchored && u1.primeCount === u2.primeCount;
}

// --- 2. AST Factory ---

const createUnit = (modifiers: string[]): UnitNode => ({
  type: 'Unit',
  modifiers,
  anchored: modifiers.includes('@'),
  primeCount: modifiers.filter(m => m === "'").length,
});

const createFlow = (unit: UnitNode | ResolutionNode, polarity: Polarity): FlowNode => ({
  type: 'Flow',
  unit,
  polarity,
});

const createRelation = (left: ASTNode, right: ASTNode): RelationNode => ({
  type: 'Relation',
  left,
  right,
});

const createResolution = (): ResolutionNode => ({
  type: 'Resolution',
});

// --- 3. Reduction Logic ---

export function reduce(node: ASTNode): ASTNode {
  // Base cases
  if (node.type === 'Unit' || node.type === 'Resolution') {
    return node;
  }

  // Reduce Flow
  if (node.type === 'Flow') {
    const reducedUnit = reduce(node.unit);
    // If unit became Resolution (conceptually impossible in valid grammar but safe logic)
    if (reducedUnit.type === 'Resolution') {
      return createResolution();
    }
    return createFlow(reducedUnit as UnitNode, node.polarity);
  }

  // Reduce Relation
  if (node.type === 'Relation') {
    const left = reduce(node.left);
    const right = reduce(node.right);

    // Rule: ** absorbs everything
    if (left.type === 'Resolution' || right.type === 'Resolution') {
      return createResolution();
    }

    // Rule: Cancellation (Total Inversion)
    if (left.type === 'Flow' && right.type === 'Flow') {
      const u1 = left.unit as UnitNode; // Safe cast per flow logic
      const u2 = right.unit as UnitNode;
      
      if (areUnitsEqual(u1, u2) && areInverses(left.polarity, right.polarity)) {
        return createResolution();
      }
    }

    // Default: Return updated relation
    return createRelation(left, right);
  }

  return node;
}

// --- 4. Parser & Tokenizer ---

export function tokenize(text: string): string[] {
    // Regex matches: ** OR -> OR /+ OR \+ OR /- OR \- OR & OR ( OR ) OR * OR @ OR ' OR ,
    // We escape backslashes for JS regex
    const pattern = /(\*\*|->|\/\+|\\\+| \/-|\\-|&|\(|\)|\*|@|'|,)/g;
    const tokens = text.replace(/\s+/g, '').split(pattern).filter(t => t && t.trim().length > 0);
    return tokens;
}

class Parser {
  tokens: string[];
  pos: number;

  constructor(tokens: string[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek(): string | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  consume(expected?: string): string {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of input");
    if (expected && token !== expected) {
      throw new Error(`Expected '${expected}', got '${token}'`);
    }
    this.pos++;
    return token;
  }

  parseExpression(): ASTNode {
    // Check for standalone **
    if (this.peek() === '**') {
      this.consume();
      return createResolution();
    }

    let left = this.parseTerm();
    
    while (this.peek() === '&') {
      this.consume('&');
      const right = this.parseTerm();
      left = createRelation(left, right);
    }
    return left;
  }

  parseTerm(): ASTNode {
    if (this.peek() === '(') {
      this.consume('(');
      const expr = this.parseExpression();
      this.consume(')');
      return expr;
    }

    const unit = this.parseAtom();

    if (this.peek() === '->') {
      this.consume('->');
      const pol = this.consume();
      if (!['/+', '\\+', '/-', '\\-'].includes(pol)) {
        throw new Error(`Invalid polarity: ${pol}`);
      }
      return createFlow(unit, pol as Polarity);
    }

    return unit;
  }

  parseAtom(): UnitNode {
    this.consume('*');
    const modifiers: string[] = [];
    while (['@', "'", ','].includes(this.peek() || '')) {
      const mod = this.consume();
      if (mod !== ',') modifiers.push(mod);
    }
    return createUnit(modifiers);
  }
}

export function parseAndReduce(text: string): { ast: ASTNode | null, reduced: ASTNode | null, error?: string } {
  try {
    const tokens = tokenize(text);
    if (tokens.length === 0) return { ast: null, reduced: null };
    
    const parser = new Parser(tokens);
    const ast = parser.parseExpression();
    const reduced = reduce(ast);
    return { ast, reduced };
  } catch (e: any) {
    return { ast: null, reduced: null, error: e.message };
  }
}

// --- 5. Stringify AST ---

export function stringifyAST(node: ASTNode | null): string {
  if (!node) return '';
  
  if (node.type === 'Resolution') return '**';
  
  if (node.type === 'Unit') {
    const mods = (node.anchored ? '@' : '') + "'".repeat(node.primeCount);
    return `*${mods}`;
  }

  if (node.type === 'Flow') {
    return `${stringifyAST(node.unit)} -> ${node.polarity}`;
  }

  if (node.type === 'Relation') {
    return `(${stringifyAST(node.left)} & ${stringifyAST(node.right)})`;
  }
  
  return '';
}

// --- 6. Code Translation ---

export function toPythonCode(node: ASTNode | null): string {
  if (!node) return 'None';
  
  if (node.type === 'Resolution') return 'Resolution()';
  
  if (node.type === 'Unit') {
    // Use double quotes for modifiers to safely handle single quote (prime) modifier
    const mods = node.modifiers.map(m => `"${m}"`).join(', ');
    return `Unit([${mods}])`;
  }

  if (node.type === 'Flow') {
    return `Flow(${toPythonCode(node.unit)}, '${node.polarity}')`;
  }

  if (node.type === 'Relation') {
    const left = toPythonCode(node.left);
    const right = toPythonCode(node.right);
    return `Relation(\n    ${left.replace(/\n/g, '\n    ')},\n    ${right.replace(/\n/g, '\n    ')}\n)`;
  }
  
  return 'None';
}

export function toHaskellCode(node: ASTNode | null): string {
  if (!node) return 'Nothing';
  
  if (node.type === 'Resolution') return 'Resolution';
  
  if (node.type === 'Unit') {
    if (node.modifiers.length === 0) return 'Unit []';
    const mods = node.modifiers.map(m => m === '@' ? 'Anchor' : 'Prime').join(', ');
    return `Unit [${mods}]`;
  }

  if (node.type === 'Flow') {
    const polMap: Record<string, string> = { 
      '/+': 'P_UpRight', 
      '\\+': 'P_DownRight', 
      '/-': 'P_DownLeft', 
      '\\-': 'P_UpLeft' 
    };
    return `Flow (${toHaskellCode(node.unit)}) ${polMap[node.polarity]}`;
  }

  if (node.type === 'Relation') {
    return `Relation (${toHaskellCode(node.left)}) (${toHaskellCode(node.right)})`;
  }
  
  return 'Nothing';
}
