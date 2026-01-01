import sys
import re

# --- 1. Data Structures (AST) ---

class Node:
    pass

class Unit(Node):
    def __init__(self, modifiers):
        self.modifiers = modifiers  # List of modifiers
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
        self.polarity = polarity  # String: /+, \+, /-, \-

    def __repr__(self):
        return f"{self.unit} -> {self.polarity}"

class Relation(Node):
    def __init__(self, left, right):
        self.left = left
        self.right = right

    def __repr__(self):
        return f"({self.left} & {self.right})"

class Resolution(Node):
    def __repr__(self):
        return "**"

# --- 2. Reduction Logic (The Engine) ---

def are_inverses(pol_a, pol_b):
    """
    Quadrant-Dominant Logic:
    Total Inversion requires Opposite Slope AND Opposite Sign.
    Pairs: (/+ vs \-) and (\+ vs /-)
    """
    pairs = [
        ('/+', '\-'), ('\-', '/+'),
        ('\+', '/-'), ('/-', '\+')
    ]
    return (pol_a, pol_b) in pairs

def reduce(node):
    """
    Recursive reduction engine.
    Returns: The simplified AST.
    """
    # Base cases
    if isinstance(node, (Unit, Resolution)):
        return node

    # Reduce Flow (verify unit is resolved)
    if isinstance(node, Flow):
        reduced_unit = reduce(node.unit)
        # If the unit disappeared or became Resolution (impossible in valid grammar but safe to check)
        if isinstance(reduced_unit, Resolution):
            return Resolution()
        return Flow(reduced_unit, node.polarity)

    # Reduce Relation (The Core Logic)
    if isinstance(node, Relation):
        left = reduce(node.left)
        right = reduce(node.right)

        # Rule: ** absorbs everything (Equality is terminal)
        if isinstance(left, Resolution) or isinstance(right, Resolution):
            return Resolution()

        # Rule: Cancellation (Total Inversion)
        # Structure must be: Flow(U1, P1) & Flow(U2, P2)
        if isinstance(left, Flow) and isinstance(right, Flow):
            # 1. Units must be identical (including modifiers)
            if left.unit == right.unit:
                # 2. Polarities must be total inverses
                if are_inverses(left.polarity, right.polarity):
                    return Resolution()

        # If no reduction occurred, return the relation
        return Relation(left, right)

    return node

# --- 3. Parser (Recursive Descent) ---

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def peek(self):
        return self.tokens[self.pos] if self.pos < len(self.tokens) else None

    def consume(self, expected=None):
        token = self.peek()
        if expected and token != expected:
            raise ValueError(f"Expected {expected}, got {token}")
        self.pos += 1
        return token

    def parse_expression(self):
        # Check for standalone Resolution "**"
        if self.peek() == '**':
            self.consume()
            return Resolution()

        left = self.parse_term()
        while self.peek() == '&':
            self.consume('&')
            right = self.parse_term()
            left = Relation(left, right)
        return left

    def parse_term(self):
        if self.peek() == '(':
            self.consume('(')
            expr = self.parse_expression()
            self.consume(')')
            return expr

        # Must be an Atom
        unit = self.parse_atom()

        # Check for Flow
        if self.peek() == '->':
            self.consume('->')
            pol = self.consume()
            if pol not in ['/+', '\+', '/-', '\-']:
                 raise ValueError(f"Invalid polarity: {pol}")
            return Flow(unit, pol)

        return unit

    def parse_atom(self):
        self.consume('*')
        modifiers = []
        while self.peek() in ['@', "'", ',']:
            mod = self.consume()
            if mod != ',': # Ignore commas
                modifiers.append(mod)
        return Unit(modifiers)

def tokenize(text):
    # Order matters: ** before *, complex polarity before simple symbols
    token_pattern = r"(\*\*|->|/\+|\\+|/-|\\-|&|\(|\)|\*|@|'|,)"
    tokens = [t for t in re.split(token_pattern, text.replace(" ", "")) if t]
    return tokens

# --- 4. Main Driver ---

def run_logibra(text):
    try:
        tokens = tokenize(text)
        parser = Parser(tokens)
        ast = parser.parse_expression()
        result = reduce(ast)
        print(f"Input:  {text}")
        print(f"Parsed: {ast}")
        print(f"Result: {result}")
        print("-" * 20)
        return result
    except Exception as e:
        print(f"Error parsing '{text}': {e}")
        return None

if __name__ == "__main__":
    # Standard Examples
    print("--- Logibra Standard Execution ---\n")
    run_logibra("(* -> /+) & (* -> \-)")
    run_logibra("*@ -> \+")
    run_logibra("(* -> /+) & (* -> /+)")
