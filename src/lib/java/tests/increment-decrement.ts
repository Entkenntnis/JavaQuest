import type { TestSuiteEntry } from '../../state/types'

// ==================== PREFIX / POSTFIX INCREMENT & DECREMENT ++ -- ====================
// The result type of `a++`/`a--`/`++a`/`--a` is the type of the variable. Postfix yields the
// value before the store, prefix the value after. Because the env local persists during a
// single evaluation, `a++ + a` observes both the returned value and the stored one, which
// pins evaluation order and side-effect timing. Overflows wrap (int/long) or are narrowed
// through the variable's type (byte/short/char), and a boxed variable re-boxes on the store.
export const incrementDecrement: TestSuiteEntry[] = [
  // ------------------------- int: bare forms -------------------------
  {
    code: `a++`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'int', value: 4 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- int: prefix vs postfix in one expression -------------------------
  {
    code: `a++ + a`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `++a + a`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + a++`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `++a + ++a`,
    output: { type: 'int', value: 13 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + ++a`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `++a + a++`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `--a + a`,
    output: { type: 'int', value: 8 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a-- + a--`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `--a + --a`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a-- - --a`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a + a++`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a-- + a++`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- int: interaction with operators & precedence -------------------------
  {
    code: `-a++`,
    output: { type: 'int', value: -5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `- -a++`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `~a++`,
    output: { type: 'int', value: -6 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `2 * a++ + a`,
    output: { type: 'int', value: 16 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a * a++`,
    output: { type: 'int', value: 25 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ * a`,
    output: { type: 'int', value: 30 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ * a++`,
    output: { type: 'int', value: 30 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `-a++ + a`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `++a - a++`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + 1`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `1 + a++`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ == 5`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ > 5 ? 10 : 20`,
    output: { type: 'int', value: 20 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `+a++`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- int: assignment interaction / evaluation order -------------------------
  {
    code: `a = a++`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(a = a++) + a`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a = ++a`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(a = ++a) + a`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a = a++ + a`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a = a++ + ++a`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a += a++`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a += ++a`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + a++ + a++`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `++a + ++a + ++a`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  // ------------------------- int: overflow -------------------------
  {
    code: `a++`,
    output: { type: 'int', value: 2147483647 },
    env: { local: { a: { type: 'int', value: 2147483647 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: 2147483647 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: -2147483648 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: 2147483647 } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'int', value: 2147483647 },
    env: { local: { a: { type: 'int', value: -2147483648 } }, heap: {} },
  },
  // ------------------------- long -------------------------
  {
    code: `a++`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'long', value: '6' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'long', value: '9' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'long', value: '-1' },
    env: { local: { a: { type: 'long', value: '9223372036854775807' } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: { local: { a: { type: 'long', value: '9223372036854775807' } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'long', value: '9223372036854775807' },
    env: { local: { a: { type: 'long', value: '9223372036854775807' } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'long', value: '-1' },
    env: { local: { a: { type: 'long', value: '-9223372036854775808' } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'long', value: '9223372036854775807' },
    env: { local: { a: { type: 'long', value: '-9223372036854775808' } }, heap: {} },
  },
  // ------------------------- byte -------------------------
  {
    code: `a++`,
    output: { type: 'byte', value: 5 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'byte', value: 127 } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: 127 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: 127 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'byte', value: -128 } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: -128 } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: -128 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `-a++`,
    output: { type: 'int', value: -5 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  // ------------------------- short -------------------------
  {
    code: `a++`,
    output: { type: 'short', value: 5 },
    env: { local: { a: { type: 'short', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'short', value: 32767 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'short', value: -32768 },
    env: { local: { a: { type: 'short', value: 32767 } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'short', value: 32767 },
    env: { local: { a: { type: 'short', value: 32767 } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'short', value: 32767 },
    env: { local: { a: { type: 'short', value: -32768 } }, heap: {} },
  },
  // ------------------------- char -------------------------
  {
    code: `a++`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 131 },
    env: { local: { a: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 65535 },
    env: { local: { a: { type: 'char', value: 65535 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'char', value: 0 },
    env: { local: { a: { type: 'char', value: 65535 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'int', value: 65535 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'char', value: 0 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `--a`,
    output: { type: 'char', value: 65535 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  // ------------------------- float / double -------------------------
  {
    code: `a++`,
    output: { type: 'float', value: 1.5 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'float', value: 4 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'float', value: 2.5 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `a++ + a++`,
    output: { type: 'float', value: 2 },
    env: { local: { a: { type: 'float', value: 0.5 } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'double', value: 1.5 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a-- + a`,
    output: { type: 'double', value: 2 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `++a + a`,
    output: { type: 'double', value: 5 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  // ------------------------- wrapper locals -------------------------
  {
    code: `a++`,
    output: { type: 'int', value: 100 },
    env: { local: { a: { type: 'int', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 2001 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `++a + a`,
    output: { type: 'int', value: 2002 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a++)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (++a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (a++)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (++a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'long', value: '100' },
    env: { local: { a: { type: 'long', value: '100', boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'long', value: '201' },
    env: { local: { a: { type: 'long', value: '100', boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: 2147483647, boxed: true } }, heap: {} },
  },
  // ------------------------- invalid targets / operands -------------------------
  {
    code: `5++`,
    error: 'compile',
  },
  {
    code: `++5`,
    error: 'compile',
  },
  {
    code: `(a + 1)++`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `++(a + 1)`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a++++`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a++`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a--`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `++a`,
    error: 'compile',
    env: {
      local: { a: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `a++`,
    error: 'compile',
    env: { local: { a: { type: 'null', value: null } }, heap: {} },
  },
  {
    code: `-true++`,
    error: 'compile',
  },
]
