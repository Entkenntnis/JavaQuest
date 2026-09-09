import type { TestSuiteEntry } from '../../state/types'

export const strings: TestSuiteEntry[] = [
  // ==================== STRING CONCATENATION & CONVERSION ====================
  // ------------------------- string concatenation: basics & ordering -------------------------
  {
    code: `"" + ""`,
    output: { type: '__str', value: '' },
  },
  {
    code: `"ab" + "cd"`,
    output: { type: '__str', value: 'abcd' },
  },
  {
    code: `"x" + 1`,
    output: { type: '__str', value: 'x1' },
  },
  {
    code: `1 + "x"`,
    output: { type: '__str', value: '1x' },
  },
  {
    code: `"x" + 1 + 2`,
    output: { type: '__str', value: 'x12' },
  },
  {
    code: `1 + 2 + "x"`,
    output: { type: '__str', value: '3x' },
  },
  {
    code: `"x" + (1 + 2)`,
    output: { type: '__str', value: 'x3' },
  },
  {
    code: `2 * 3 + "x"`,
    output: { type: '__str', value: '6x' },
  },
  // ------------------------- string concatenation: int / long / byte -------------------------
  {
    code: `"" + 42`,
    output: { type: '__str', value: '42' },
  },
  {
    code: `"" + -2147483648`,
    output: { type: '__str', value: '-2147483648' },
  },
  {
    code: `"" + 9223372036854775807L`,
    output: { type: '__str', value: '9223372036854775807' },
  },
  {
    code: `"" + (-9223372036854775808L)`,
    output: { type: '__str', value: '-9223372036854775808' },
  },
  {
    code: `"" + (byte)200`,
    output: { type: '__str', value: '-56' },
  },
  // ------------------------- string concatenation: char -------------------------
  {
    code: `"" + 'a'`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `"" + (char)65`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `"c=" + 'x'`,
    output: { type: '__str', value: 'c=x' },
  },
  {
    code: `"" + 'a' + 1`,
    output: { type: '__str', value: 'a1' },
  },
  {
    code: `"" + ('a' + 1)`,
    output: { type: '__str', value: '98' },
  },
  {
    code: `'x' + ""`,
    output: { type: '__str', value: 'x' },
  },
  // ------------------------- string concatenation: boolean & null -------------------------
  {
    code: `"" + true`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + false`,
    output: { type: '__str', value: 'false' },
  },
  {
    code: `true + ""`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + null`,
    output: { type: '__str', value: 'null' },
  },
  {
    code: `null + ""`,
    output: { type: '__str', value: 'null' },
  },
  // ------------------------- string concatenation: Infinity / NaN -------------------------
  {
    code: `"" + (1.0 / 0.0)`,
    output: { type: '__str', value: 'Infinity' },
  },
  {
    code: `"" + (-1.0 / 0.0)`,
    output: { type: '__str', value: '-Infinity' },
  },
  {
    code: `"" + (0.0 / 0.0)`,
    output: { type: '__str', value: 'NaN' },
  },
  {
    code: `"" + (1.0f / 0.0f)`,
    output: { type: '__str', value: 'Infinity' },
  },
  {
    code: `"" + (1e308 * 10)`,
    output: { type: '__str', value: 'Infinity' },
  },
  // ------------------------- string concatenation: float & double that Java prints plainly -------------------------
  {
    code: `"" + 0.5`,
    output: { type: '__str', value: '0.5' },
  },
  {
    code: `"" + 2.5`,
    output: { type: '__str', value: '2.5' },
  },
  {
    code: `"" + 0.1`,
    output: { type: '__str', value: '0.1' },
  },
  // ------------------------- string concatenation: float & double formatting (expected values = Java reference) -------------------------
  {
    code: `"" + 100.0`,
    output: { type: '__str', value: '100.0' },
  },
  {
    code: `"" + 2f`,
    output: { type: '__str', value: '2.0' },
  },
  {
    code: `"" + 0.1f`,
    output: { type: '__str', value: '0.1' },
  },
  {
    code: `"" + (1f / 3f)`,
    output: { type: '__str', value: '0.33333334' },
  },
  {
    code: `"" + -0.0`,
    output: { type: '__str', value: '-0.0' },
  },
  // ------------------------- string conversion: double sizes (expected values = Java reference) -------------------------
  {
    code: `"" + 1e6`,
    output: { type: '__str', value: '1000000.0' },
  },
  {
    code: `"" + 1e7`,
    output: { type: '__str', value: '1.0E7' },
  },
  {
    code: `"" + 12345678.0`,
    output: { type: '__str', value: '1.2345678E7' },
  },
  {
    code: `"" + 1.7976931348623157e308`,
    output: { type: '__str', value: '1.7976931348623157E308' },
  },
  {
    code: `"" + 4.9e-324`,
    output: { type: '__str', value: '4.9E-324' },
  },
  {
    code: `"" + 0.001`,
    output: { type: '__str', value: '0.001' },
  },
  {
    code: `"" + 0.0001`,
    output: { type: '__str', value: '1.0E-4' },
  },
  {
    code: `"" + (1.0 / 3.0)`,
    output: { type: '__str', value: '0.3333333333333333' },
  },
  {
    code: `"" + (0.1 + 0.2)`,
    output: { type: '__str', value: '0.30000000000000004' },
  },
  {
    code: `"" + -1e7`,
    output: { type: '__str', value: '-1.0E7' },
  },
  // ------------------------- string conversion: float sizes (expected values = Java reference) -------------------------
  {
    code: `"" + 3.4028235e38f`,
    output: { type: '__str', value: '3.4028235E38' },
  },
  {
    code: `"" + 1e-45f`,
    output: { type: '__str', value: '1.4E-45' },
  },
  {
    code: `"" + 16777216f`,
    output: { type: '__str', value: '1.6777216E7' },
  },
  {
    code: `"" + 1e20f`,
    output: { type: '__str', value: '1.0E20' },
  },
  {
    code: `"" + 0.5f`,
    output: { type: '__str', value: '0.5' },
  },
  // ------------------------- string conversion: double & float edge cases (expected values = Java reference) -------------------------
  {
    code: `"" + 1e15`,
    output: { type: '__str', value: '1.0E15' },
  },
  {
    code: `"" + 1e21`,
    output: { type: '__str', value: '1.0E21' },
  },
  {
    code: `"" + 2.2250738585072014e-308`,
    output: { type: '__str', value: '2.2250738585072014E-308' },
  },
  {
    code: `"" + 5e-324`,
    output: { type: '__str', value: '4.9E-324' },
  },
  {
    code: `"" + 1.5e-5`,
    output: { type: '__str', value: '1.5E-5' },
  },
  {
    code: `"" + -0.0001`,
    output: { type: '__str', value: '-1.0E-4' },
  },
  {
    code: `"" + 9.999999e6`,
    output: { type: '__str', value: '9999999.0' },
  },
  {
    code: `"" + 0.9999999999999999`,
    output: { type: '__str', value: '0.9999999999999999' },
  },
  {
    code: `"" + 123.456`,
    output: { type: '__str', value: '123.456' },
  },
  {
    code: `"" + -123.456`,
    output: { type: '__str', value: '-123.456' },
  },
  {
    code: `"" + 3.1415927f`,
    output: { type: '__str', value: '3.1415927' },
  },
  {
    code: `"" + 1.17549435e-38f`,
    output: { type: '__str', value: '1.1754944E-38' },
  },
  {
    code: `"" + 100.0f`,
    output: { type: '__str', value: '100.0' },
  },
  {
    code: `"" + 16777215f`,
    output: { type: '__str', value: '1.6777215E7' },
  },
  {
    code: `"" + -1.5e10f`,
    output: { type: '__str', value: '-1.5E10' },
  },
  // ------------------------- string used with non-'+' operators (expected: Java compile error) -------------------------
  {
    code: `"a" + "b" * 2`,
    error: 'compile',
  },
  {
    code: `"x" - 1`,
    error: 'compile',
  },
  {
    code: `1 / "x"`,
    error: 'compile',
  },
  // ==================== IDENTIFIERS - EXPRESSIONS ====================
  // ------------------------- identifiers: int arithmetic -------------------------
  {
    code: `a + a`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a + b`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a / b`,
    output: { type: 'int', value: -1 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a % b`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `-a`,
    output: { type: 'int', value: -5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- identifiers: long interactions -------------------------
  {
    code: `xl + a`,
    output: { type: 'long', value: '128' },
    env: {
      local: {
        xl: { type: 'long', value: '123' },
        a: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `-xl`,
    output: { type: 'long', value: '-123' },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `~xl`,
    output: { type: 'long', value: '-124' },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `mx + 1L`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: {
      local: { mx: { type: 'long', value: '9223372036854775807' } },
      heap: {},
    },
  },
  // ------------------------- identifiers: float & double -------------------------
  {
    code: `a + d`,
    output: { type: 'double', value: 8.5 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        d: { type: 'double', value: 3.5 },
      },
      heap: {},
    },
  },
  {
    code: `d - a`,
    output: { type: 'double', value: -1.5 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        d: { type: 'double', value: 3.5 },
      },
      heap: {},
    },
  },
  {
    code: `fd + a`,
    output: { type: 'float', value: 6.5 },
    env: {
      local: {
        fd: { type: 'float', value: 1.5 },
        a: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  // ------------------------- identifiers: char / byte / short promote to int -------------------------
  {
    code: `ch + a`,
    output: { type: 'int', value: 70 },
    env: {
      local: { ch: { type: 'char', value: 65 }, a: { type: 'int', value: 5 } },
      heap: {},
    },
  },
  {
    code: `ch2 - ch`,
    output: { type: 'int', value: 33 },
    env: {
      local: {
        ch2: { type: 'char', value: 98 },
        ch: { type: 'char', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `by + by`,
    output: { type: 'int', value: 200 },
    env: { local: { by: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `~ch`,
    output: { type: 'int', value: -66 },
    env: { local: { ch: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `-by`,
    output: { type: 'int', value: -100 },
    env: { local: { by: { type: 'byte', value: 100 } }, heap: {} },
  },
  // ------------------------- identifiers: string concatenation -------------------------
  {
    code: `str + a`,
    output: { type: '__str', value: 'JavaQuest5' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        a: { type: 'int', value: 5 },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + xl`,
    output: { type: '__str', value: 'JavaQuest123' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        xl: { type: 'long', value: '123' },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + ch`,
    output: { type: '__str', value: 'JavaQuestA' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        ch: { type: 'char', value: 65 },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + flag`,
    output: { type: '__str', value: 'JavaQuesttrue' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        flag: { type: 'boolean', value: true },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `a + str`,
    output: { type: '__str', value: '5JavaQuest' },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        str: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  // ------------------------- identifiers: logical operators & equality -------------------------
  {
    code: `!flag`,
    output: { type: 'boolean', value: false },
    env: { local: { flag: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `flag && flag2`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        flag: { type: 'boolean', value: true },
        flag2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `flag || flag2`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        flag: { type: 'boolean', value: true },
        flag2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `a == xl`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        xl: { type: 'long', value: '123' },
      },
      heap: {},
    },
  },
  {
    code: `a == 123L`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `xl == 123L`,
    output: { type: 'boolean', value: true },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  // ------------------------- identifiers: casts -------------------------
  {
    code: `(byte)a`,
    output: { type: 'byte', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(int)xl`,
    output: { type: 'int', value: 123 },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `(long)a`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(double)a`,
    output: { type: 'double', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(char)zz`,
    output: { type: 'char', value: 58368 },
    env: { local: { zz: { type: 'long', value: '10000000000' } }, heap: {} },
  },
  // ------------------------- identifiers: precedence & parentheses -------------------------
  {
    code: `(a + b) * 2`,
    output: { type: 'int', value: 4 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a - b - a`,
    output: { type: 'int', value: 3 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
]
