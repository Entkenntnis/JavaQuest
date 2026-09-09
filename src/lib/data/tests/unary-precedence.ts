import type { TestSuiteEntry } from '../../state/types'

export const unaryPrecedence: TestSuiteEntry[] = [
  // ==================== UNARY PRECEDENCE & AMBIGUITY ====================
  // Prefix unary operators (-, +, !, ~) must bind tighter than every binary operator
  // and, when chained, nest left-to-right: `-~1` is -(~1), `~-1` is ~(-1). The grammar
  // models + / - and ! / ~ as two separate unary precedence tiers, so these cases probe
  // whether chained mixed unary operators and unary-vs-binary groupings match Java.
  // Expectations below are the real-Java (cross-check) results; entries that fail in the
  // in-app evaluator document a precedence ambiguity in the current grammar.
  // ------------------------- unary precedence: chained +/- -------------------------
  {
    code: `- - -1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `- +1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `+ -1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `+ +1`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- unary precedence: chained ~ with +/- -------------------------
  {
    code: `-~1`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `~-1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `+~1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `~+1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `~~-1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-~-1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `- -~1`,
    output: { type: 'int', value: -2 },
  },
  // ------------------------- unary precedence: vs binary operators -------------------------
  {
    code: `-~1+2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `~-1+2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `-~1*2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `~+1*2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `2*-1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `2*-1+3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-1 << 2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `~0 << 1`,
    output: { type: 'int', value: -2 },
  },
  // ------------------------- unary precedence: vs bitwise operators -------------------------
  {
    code: `~1 & 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `~1 | 3`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `~1 ^ 3`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `-1 & 1`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- unary precedence: vs equality & logical operators -------------------------
  {
    code: `-1 == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `~0 == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 == 0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!true == false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!false != true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!true && false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!false || true`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- unary precedence: type errors (unary must bind before binary) -------------------------
  {
    code: `!1 == 0`,
    isError: true,
  },
  {
    code: `-true == false`,
    isError: true,
  },
  {
    code: `!~1`,
    isError: true,
  },
  {
    code: `~!true`,
    isError: true,
  },
  // ------------------------- unary precedence: vs casts -------------------------
  {
    code: `-(byte)200`,
    output: { type: 'int', value: 56 },
  },
  {
    code: `(byte)-200`,
    output: { type: 'byte', value: 56 },
  },
  {
    code: `~(byte)200`,
    output: { type: 'int', value: 55 },
  },
  {
    code: `-(short)200`,
    output: { type: 'int', value: -200 },
  },
  {
    code: `-(byte)200 > 0`,
    output: { type: 'boolean', value: true },
  },
]
