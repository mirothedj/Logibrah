# Logibra Execution Engine (v1.0)

## Overview
A stateless, logic-circuit execution engine based on quadrant-dominant geometric algebra.
Core constant: Φx (Phi-sub-x).
Resolution state: `**` (Double Asterisk).

## Keyboard Grammar (ASCII)
- Unit:       `*`
- Resolution: `**`
- Relation:   `&`
- Flow:       `->`
- Polarity:   `/+`, `\+` (Advancing) | `/-`, `\-` (Receding)
- Modifiers:  `@` (Anchor), `'` (Prime), `,` (Pause)
- Grouping:   `()`

## Quadrant Logic (Reduction Rules)
Resolution (`**`) only occurs upon **Total Inversion**:
1. `* -> /+` cancels `* -> \-` (Up-Right vs Down-Left)
2. `* -> \+` cancels `* -> /-` (Down-Right vs Up-Left)
All other combinations remain unresolved.

## Usage
Run `python logibra.py` for the reference implementation.
Run `python logibra_test.py` for the certification suite.
