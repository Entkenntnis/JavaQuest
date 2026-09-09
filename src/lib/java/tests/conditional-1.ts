import type { TestSuiteEntry } from '../../state/types'

export const conditional1: TestSuiteEntry[] = [
  // ==================== CONDITIONAL (ternary ? :) ====================
  // JLS 15.25: cond ? thenExpr : elseExpr. The condition must be boolean; the result type
  // is the least upper type of the two arms (binary numeric promotion for numeric arms,
  // reference/null rules for String arms) and the operator is right-associative with the
  // lowest precedence of any expression operator. Only the selected arm is evaluated.
  // Expectations match real Java via the cross-check; the interpreter is implemented
  // incrementally against this suite (several cases below are still work in progress).
  // ------------------------- conditional: basics -------------------------
  {
    code: `true ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 10 : 20`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `false ? 10 : 20`,
    output: { type: 'int', value: 20 },
  },
  {
    code: `true ? true : false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? true : false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ? "a" : "b"`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `false ? "a" : "b"`,
    output: { type: '__str', value: 'b' },
  },
  {
    code: `1 < 2 ? "yes" : "no"`,
    output: { type: '__str', value: 'yes' },
  },
  {
    code: `1 > 2 ? "yes" : "no"`,
    output: { type: '__str', value: 'no' },
  },
  {
    code: `!true ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `'a' < 'b' ? 100 : 200`,
    output: { type: 'int', value: 100 },
  },
  {
    code: `2 == 2 ? 5L : 6L`,
    output: { type: 'long', value: '5' },
  },
  // ------------------------- conditional: only the selected arm is evaluated -------------------------
  {
    code: `true ? 1 : 1/0`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? 1/0 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 1/0 : 2`,
    error: 'runtime',
  },
  {
    code: `false ? 1 : 1/0`,
    error: 'runtime',
  },
  {
    code: `true ? true : (1/0 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? (1/0 == 1) : true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ? 1L : 1L/0L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `false ? 7 % 0 : 3`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- conditional: numeric result type & promotion -------------------------
  {
    code: `true ? 1 : 2L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `false ? 1 : 2L`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `true ? 1L : 2`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `true ? 'a' : 'b'`,
    output: { type: 'char', value: 97 },
  },
  {
    code: `false ? 'a' : 'b'`,
    output: { type: 'char', value: 98 },
  },
  {
    code: `true ? 'a' : 1`,
    output: { type: 'char', value: 97 },
  },
  {
    code: `false ? 'a' : 1`,
    output: { type: 'char', value: 1 },
  },
  {
    code: `false ? 1L : 'a'`,
    output: { type: 'long', value: '97' },
  },
  {
    code: `true ? (byte)1 : (byte)2`,
    output: { type: 'byte', value: 1 },
  },
  {
    code: `true ? (short)1 : (short)2`,
    output: { type: 'short', value: 1 },
  },
  {
    code: `false ? (short)1 : (short)2`,
    output: { type: 'short', value: 2 },
  },
  {
    code: `true ? (byte)1 : 2`,
    output: { type: 'byte', value: 1 },
  },
  {
    code: `true ? (short)1 : (byte)2`,
    output: { type: 'short', value: 1 },
  },
  {
    code: `false ? (short)1 : (byte)2`,
    output: { type: 'short', value: 2 },
  },
  {
    code: `true ? (byte)200 : (byte)1`,
    output: { type: 'byte', value: -56 },
  },
  {
    code: `true ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `false ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `true ? 1.5f : 1`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `true ? 1L : 1.5f`,
    output: { type: 'float', value: 1 },
  },
  {
    code: `false ? 1L : 1.5f`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `true ? 1 : 2.5`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `false ? 1 : 2.5`,
    output: { type: 'double', value: 2.5 },
  },
  {
    code: `true ? 0xffffffff : 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `false ? 'x' : 'y'`,
    output: { type: 'char', value: 121 },
  },
  {
    code: `true ? (char)65535 : 0`,
    output: { type: 'char', value: 65535 },
  },
  // ------------------------- conditional: reference & null arms -------------------------
  {
    code: `true ? "a" : null`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `(true ? "a" : null) == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? "a" : null) == null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? null : "b") == null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? null : "b") == "b"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? "a" : null) != null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 < 2 ? "a" + "b" : "c"`,
    output: { type: '__str', value: 'ab' },
  },
  {
    code: `(1 < 2 ? "a" : "b") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" + (true ? 1 : 2)`,
    output: { type: '__str', value: '1' },
  },
  {
    code: `"n=" + (false ? 1 : 2)`,
    output: { type: '__str', value: 'n=2' },
  },
  // ------------------------- conditional: associativity (right) -------------------------
  {
    code: `false ? 1 : true ? 2 : 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 1 : true ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true ? 1 : 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? true ? 1 : 2 : 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `1 < 2 ? 1 : 2 < 3 ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 > 2 ? 1 : 2 > 3 ? 2 : 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `true ? 1 : false ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- conditional: precedence with other operators -------------------------
  {
    code: `true && false ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true || false ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false || true ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 + (true ? 2 : 3)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `2 * (false ? 3 : 4)`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `(true ? 2 : 3) + 1`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `true ? 1 << 3 : 0`,
    output: { type: 'int', value: 8 },
  },
  // ------------------------- conditional: nested & complex conditions -------------------------
  {
    code: `true ? (false ? 1 : 2) : 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `false ? 1 : (true ? 2 : 3)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(1 < 2) == true ? 'x' : 'y'`,
    output: { type: 'char', value: 120 },
  },
  {
    code: `!(false) ? 10 : 20`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `true ? true ? false ? 1 : 2 : 3 : 4`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `false ? 1 : true ? false ? 2 : 3 : 4`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `('a' < 'b') && (1 <= 1) ? 7 : 8`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `false ? 1L : 2.5`,
    output: { type: 'double', value: 2.5 },
  },
  // ------------------------- conditional: constant condition skips typing of the unselected arm -------------------------
  // When the condition is a compile-time constant, javac only considers the selected arm,
  // so the other arm may be of an incompatible type (or even null) without an error.
  {
    code: `true ? 1 : "x"`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? "x" : 1`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? 1 : null`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true : 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? 1 : true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ? 1 : false`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true : null`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- conditional: runtime condition without a common arm type -------------------------
  // Even in a `var` (inferred assignment) context javac boxes the primitive arm and picks
  // a common reference type, so mixed primitive/reference arms still compile and yield the
  // selected arm's value. Real rejection only happens in a typed context (e.g. an int or
  // boolean target), which this print-only harness cannot produce. Each case is asserted
  // on the branch that does not evaluate to null.
  {
    code: `b ? 1 : "x"`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" : 1`,
    output: { type: '__str', value: 'x' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : null`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? null : 1`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? true : 1`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : true`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? true : null`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime condition, numeric result type & promotion -------------------------
  // With both arms being runtime variables the usual binary numeric promotion applies
  // (no compile-time narrowing of constant arms).
  {
    code: `b ? c : x`,
    output: { type: 'int', value: 97 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        c: { type: 'char', value: 97 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : x`,
    output: { type: 'int', value: 200 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        c: { type: 'char', value: 97 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 200 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 5 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : by`,
    output: { type: 'short', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        by: { type: 'byte', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : by`,
    output: { type: 'short', value: 5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        sh: { type: 'short', value: 7 },
        by: { type: 'byte', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : l`,
    output: { type: 'long', value: '97' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        c: { type: 'char', value: 97 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : l`,
    output: { type: 'long', value: '1000' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        c: { type: 'char', value: 97 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : f`,
    output: { type: 'float', value: 3 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 3 },
        f: { type: 'float', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : f`,
    output: { type: 'float', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 3 },
        f: { type: 'float', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : l`,
    output: { type: 'long', value: '7' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? 1L : 'a'`,
    output: { type: 'long', value: '97' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 2L`,
    output: { type: 'long', value: '1' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 2L`,
    output: { type: 'long', value: '2' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? "a" : null`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime condition only evaluates the selected arm -------------------------
  // With a runtime (variable) condition nothing is constant-folded away, so laziness has
  // to come from the evaluator itself: a division by zero in the unselected arm must not
  // fire, while one in the selected arm still raises an ArithmeticException.
  {
    code: `b ? 1 : 1/0`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 1/0`,
    error: 'runtime',
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1/0 : 2`,
    error: 'runtime',
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1/0 : 2`,
    output: { type: 'int', value: 2 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1L : 1L/0L`,
    error: 'runtime',
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? "a" : "x" + (1/0)`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" + (1/0) : "a"`,
    error: 'runtime',
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" + (1/0) : "a"`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // ------------------------- conditional: constant int arm is narrowed to byte/short/char (JLS 15.25.2) -------------------------
  // If one operand is byte/short/char and the other is a constant expression of type int
  // whose value is representable in that primitive type, the conditional has that type;
  // a non-representable constant forces binary numeric promotion instead (int result).
  // With a runtime condition the value of either arm must be converted to the result type.
  {
    code: `b ? 'z' : 90`,
    output: { type: 'char', value: 122 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'z' : 90`,
    output: { type: 'char', value: 90 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 90 : 'z'`,
    output: { type: 'char', value: 90 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65535`,
    output: { type: 'char', value: 65535 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65536`,
    output: { type: 'int', value: 97 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65536`,
    output: { type: 'int', value: 65536 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : -1`,
    output: { type: 'int', value: -1 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 1 + 1`,
    output: { type: 'char', value: 2 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 127`,
    output: { type: 'byte', value: 127 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 128`,
    output: { type: 'int', value: 7 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 128`,
    output: { type: 'int', value: 128 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (short)300 : 32767`,
    output: { type: 'short', value: 32767 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (short)1 : 32768`,
    output: { type: 'int', value: 32768 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
]
