import type { TestSuiteEntry } from '../../state/types'

export const boxedLocals: TestSuiteEntry[] = [
  // ==================== BOXED ENV LOCALS (wrapper references) ====================
  // An `env.local` entry with `boxed: true` is rendered by the cross-check harness as a
  // *wrapper* declaration (`Integer a = 1000;`, `Character c = (char) 1000;`, ...). That
  // makes the local a genuine reference to a wrapper object, so every rule about wrapper
  // identity, the valueOf() caches, unboxing and incomparable wrapper types can be pinned
  // directly against real Java -- unlike the ternary trick, a variable can be read twice
  // and still denote the *same* object. These entries deliberately mix cached and
  // non-cached values, every wrapper type, and both operand orders.
  // For values the JVM caches, `boxed` carries the interpreter's generated heap name
  // (`box_cache_<type>_<value>`) so the local shares that cache entry; non-cached values
  // keep `boxed: true` and are identified by the variable itself.
  // ------------------------- re-reading one wrapper local: stable identity -------------------------
  // One wrapper local denotes one object, so two reads compare identical for every wrapper
  // type -- the cache is irrelevant here, even for values it does not hold.
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'short', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  // The negation form is the same identity question, inverted.
  {
    code: `a != a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- two wrapper locals: the valueOf() caches -------------------------
  // Integer/Short/Long share the -128..127 instances, Character the 0..127 ones, Byte the
  // whole range, Boolean two singletons, Float/Double none. Equal *cached* values in two
  // distinct variables are therefore the same object (== true); equal out-of-cache values
  // are distinct objects (== false).
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: 'box_cache_int_0' },
        b: { type: 'int', value: 0, boxed: 'box_cache_int_0' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 127, boxed: 'box_cache_int_127' },
        b: { type: 'int', value: 127, boxed: 'box_cache_int_127' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: -128, boxed: 'box_cache_int_-128' },
        b: { type: 'int', value: -128, boxed: 'box_cache_int_-128' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 128, boxed: true },
        b: { type: 'int', value: 128, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: -129, boxed: true },
        b: { type: 'int', value: -129, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'int', value: 101, boxed: 'box_cache_int_101' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a != b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
      },
      heap: {},
    },
  },
  {
    code: `a != b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  // Short reuses the Integer cache.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'short', value: 100, boxed: 'box_cache_short_100' },
        b: { type: 'short', value: 100, boxed: 'box_cache_short_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'short', value: 1000, boxed: true },
        b: { type: 'short', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'short', value: 128, boxed: true },
        b: { type: 'short', value: 128, boxed: true },
      },
      heap: {},
    },
  },
  // Byte caches its entire range, so *any* equal Byte values share an object.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' },
        b: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'byte', value: -100, boxed: 'box_cache_byte_-100' },
        b: { type: 'byte', value: -100, boxed: 'box_cache_byte_-100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' },
        b: { type: 'byte', value: -100, boxed: 'box_cache_byte_-100' },
      },
      heap: {},
    },
  },
  // Long cache -128..127.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'long', value: '100', boxed: 'box_cache_long_100' },
        b: { type: 'long', value: '100', boxed: 'box_cache_long_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'long', value: '1000', boxed: true },
        b: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'long', value: '128', boxed: true },
        b: { type: 'long', value: '128', boxed: true },
      },
      heap: {},
    },
  },
  // Character cache 0..127.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 100, boxed: 'box_cache_char_100' },
        b: { type: 'char', value: 100, boxed: 'box_cache_char_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 127, boxed: 'box_cache_char_127' },
        b: { type: 'char', value: 127, boxed: 'box_cache_char_127' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'char', value: 128, boxed: true },
        b: { type: 'char', value: 128, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'char', value: 200, boxed: true },
        b: { type: 'char', value: 200, boxed: true },
      },
      heap: {},
    },
  },
  // Boolean has exactly two singletons.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
        b: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' },
        b: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
        b: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' },
      },
      heap: {},
    },
  },
  // Float/Double are never cached: equal values are always distinct objects.
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'double', value: 1.5, boxed: true },
        b: { type: 'double', value: 1.5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'float', value: 1.5, boxed: true },
        b: { type: 'float', value: 1.5, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- wrapper local vs freshly boxed constant -------------------------
  // The ternary trick mints a wrapper through valueOf() at the moment it is evaluated, so
  // identity against a local follows the same cache: equal cached values share, equal
  // out-of-cache values do not.
  {
    code: `a == (true ? 100 : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `a == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? 100 : null) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `(true ? 1000 : null) == a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a != (true ? 1000 : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a != (true ? 100 : null)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  // A ternary whose other arm is a String is an Object-typed lub, but the numeric arm is
  // still boxed with valueOf() -- so the cached case is identical to the local.
  {
    code: `a == (true ? 100 : "x")`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `a == (true ? 1000 : "x")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // A wrapper local chosen by a conditional keeps its identity.
  {
    code: `(true ? a : "x") == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : null) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? a : null) == a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : false) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? 1000 : false) == a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- wrapper local vs primitive: unboxing -------------------------
  // One wrapper and one primitive operand make == a *numeric* equality: the wrapper is
  // unboxed, then binary numeric promotion applies across any width.
  {
    code: `a == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `a == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 1000L`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 1000.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a != 1000`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == p`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        p: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `a < 200`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  // Arithmetic and unary operators unbox the wrapper before promoting.
  {
    code: `a + b`,
    output: { type: 'int', value: 1005 },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `a - 1`,
    output: { type: 'int', value: 999 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `-a`,
    output: { type: 'int', value: -1000 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a * b`,
    output: { type: 'int', value: 3000 },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 3, boxed: 'box_cache_int_3' },
      },
      heap: {},
    },
  },
  // ------------------------- wrapper local vs null: reference comparison -------------------------
  // A wrapper compared with null (or a null-typed local) is never unboxed.
  {
    code: `a == null`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `a != null`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: 'box_cache_int_100' } },
      heap: {},
    },
  },
  {
    code: `a == n`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        n: { type: 'null', value: null },
      },
      heap: {},
    },
  },
  {
    code: `a != n`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        n: { type: 'null', value: null },
      },
      heap: {},
    },
  },
  // ------------------------- incomparable wrapper types: compile errors -------------------------
  // == / != between two different wrapper classes is a javac error ("incomparable types"),
  // because neither final class can be cast to the other -- regardless of the cached values.
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'short', value: 100, boxed: 'box_cache_short_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'long', value: '100', boxed: 'box_cache_long_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'double', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'float', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'char', value: 100, boxed: 'box_cache_char_100' },
        b: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'short', value: 100, boxed: 'box_cache_short_100' },
        b: { type: 'byte', value: 100, boxed: 'box_cache_byte_100' },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
        b: { type: 'int', value: 1, boxed: 'box_cache_int_1' },
      },
      heap: {},
    },
  },
  {
    code: `a != b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        b: { type: 'short', value: 100, boxed: 'box_cache_short_100' },
      },
      heap: {},
    },
  },
  // A wrapper vs an unrelated reference class (String) is the same incomparable-types error.
  {
    code: `a == s`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: 'box_cache_int_100' },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  // ------------------------- wrapper locals through conditionals -------------------------
  // When both arms are the same wrapper type the conditional is that wrapper type, and the
  // chosen arm keeps its identity; comparing it with the arm's own variable is true.
  {
    code: `(true ? a : b) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(false ? a : b) == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(false ? a : b) == a`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  // The conditional over two Integer locals is Integer-typed, so == against an int literal
  // unboxes and compares numerically.
  {
    code: `(b ? n : m) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        n: { type: 'int', value: 1000, boxed: true },
        m: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(b ? n : m) == 5`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        n: { type: 'int', value: 1000, boxed: true },
        m: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(b ? n : m) == 5`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        n: { type: 'int', value: 1000, boxed: true },
        m: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `(b ? n : m) == 1000`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        n: { type: 'int', value: 1000, boxed: true },
        m: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  // ------------------------- boxed Boolean in boolean contexts -------------------------
  // A Boolean wrapper is unboxed wherever a primitive boolean is required: the condition of
  // a ?:, the operands of !/&&/||, and equality against a boolean literal.
  {
    code: `a ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' } },
      heap: {},
    },
  },
  {
    code: `a ? 1 : 2`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' } },
      heap: {},
    },
  },
  {
    code: `!a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' } },
      heap: {},
    },
  },
  {
    code: `a && b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
        b: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' },
      },
      heap: {},
    },
  },
  {
    code: `a || b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false, boxed: 'box_cache_boolean_false' },
        b: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' },
      },
      heap: {},
    },
  },
  {
    code: `a == true`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' } },
      heap: {},
    },
  },
  {
    code: `a == false`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: 'box_cache_boolean_true' } },
      heap: {},
    },
  },
  // ------------------------- wrapper identity inside larger expressions -------------------------
  // The identity result of a comparison is itself an ordinary boolean, so it composes.
  {
    code: `a == a ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(a == a) == (b == b)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
  {
    code: `a == a && b == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: 'box_cache_int_5' },
      },
      heap: {},
    },
  },
]
