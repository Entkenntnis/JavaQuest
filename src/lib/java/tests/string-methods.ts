import type { TestSuiteEntry } from '../../state/types'

// ==================== CHAPTER 5: STRING METHODS ====================
// Source of truth for the String chapter: length(), isEmpty(), contains(String)
// and equalsIgnoreCase(String). equals(Object) is already covered by
// method-invocation.ts and is only touched here where chapter 5 contrasts
// content equality against identity.
//
// The interpreter does not implement the four non-equals methods yet, so this
// file is currently red in the Suite UI while remaining the source of truth for
// Java semantics. It is validated by the real-JDK harness (`npm run cross-check`).
export const stringMethods: TestSuiteEntry[] = [
  // ------------------------- length(): basics -------------------------
  {
    code: `"".length()`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `"a".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"abc".length()`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `"JavaQuest".length()`,
    output: { type: 'int', value: 9 },
  },
  {
    code: `"Hallo Welt".length()`,
    output: { type: 'int', value: 10 },
  },
  // Whitespace characters count as characters.
  {
    code: `" ".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"\\n".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"  ".length()`,
    output: { type: 'int', value: 2 },
  },
  // Java's length() counts UTF-16 code units, so a non-BMP code point counts twice.
  {
    code: `"ä".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"Straße".length()`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `"😀".length()`,
    output: { type: 'int', value: 2 },
  },
  // ------------------------- length(): composition -------------------------
  {
    code: `"a".length() + 1`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `"abc".length() * 2`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `"abc".length() == 3`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".length() != 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".length() + ""`,
    output: { type: '__str', value: '3' },
  },
  {
    code: `"abc".length() > "ab".length()`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- length(): heap receivers -------------------------
  {
    code: `s.length()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abcdef' } },
    },
    output: { type: 'int', value: 6 },
  },
  {
    code: `s.length()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: '', isInterned: true },
      },
    },
    output: { type: 'int', value: 0 },
  },
  // ------------------------- isEmpty(): basics -------------------------
  {
    code: `"".isEmpty()`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a".isEmpty()`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `" ".isEmpty()`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"\\n".isEmpty()`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".isEmpty()`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- isEmpty(): composition -------------------------
  {
    code: `!"".isEmpty()`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!"abc".isEmpty()`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"".isEmpty() && "".isEmpty()`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- isEmpty(): heap receivers -------------------------
  {
    code: `s.isEmpty()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: '' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.isEmpty()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'x', isInterned: true },
      },
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- contains(String): basics -------------------------
  {
    code: `"abc".contains("b")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("bc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("abc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("d")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".contains("abcd")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".contains("")`,
    output: { type: 'boolean', value: true },
  },
  // contains is case-sensitive.
  {
    code: `"abc".contains("A")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"Hallo Welt".contains("Welt")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Hallo Welt".contains("welt")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"Banane".contains("nan")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"".contains("")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"".contains("a")`,
    output: { type: 'boolean', value: false },
  },
  // A multi-character needle must appear contiguously.
  {
    code: `"abcabc".contains("ca")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abcabc".contains("ac")`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- contains(String): heap operands -------------------------
  {
    code: `s.contains(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'Hello World' },
        heap1: { class: 'java.lang.String', value: 'World' },
      },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.contains(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'Hello World' },
        heap1: { class: 'java.lang.String', value: 'world' },
      },
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `s.contains("lo W")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'Hello World' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Hello".contains(s)`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'ell' } },
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equalsIgnoreCase(String): basics -------------------------
  {
    code: `"abc".equalsIgnoreCase("abc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".equalsIgnoreCase("ABC")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"ABC".equalsIgnoreCase("abc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Berlin".equalsIgnoreCase("berlin")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"berlin".equalsIgnoreCase("Berlin")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"AbC".equalsIgnoreCase("aBc")`,
    output: { type: 'boolean', value: true },
  },
  // Different content is not equal.
  {
    code: `"abc".equalsIgnoreCase("abd")`,
    output: { type: 'boolean', value: false },
  },
  // Different lengths are never equal.
  {
    code: `"abc".equalsIgnoreCase("abcd")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equalsIgnoreCase("ab")`,
    output: { type: 'boolean', value: false },
  },
  // A trailing space is significant.
  {
    code: `"abc".equalsIgnoreCase("ABC ")`,
    output: { type: 'boolean', value: false },
  },
  // Empty strings.
  {
    code: `"".equalsIgnoreCase("")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"".equalsIgnoreCase("a")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a".equalsIgnoreCase("")`,
    output: { type: 'boolean', value: false },
  },
  // Unlike equals, the comparison is case-insensitive.
  {
    code: `"Hallo".equalsIgnoreCase("hALLO")`,
    output: { type: 'boolean', value: true },
  },
  // Non-ASCII letters with the same case mapping.
  {
    code: `"ä".equalsIgnoreCase("Ä")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Straße".equalsIgnoreCase("straße")`,
    output: { type: 'boolean', value: true },
  },
  // "ß" has no single-character uppercase form, so it never equals "SS".
  {
    code: `"ß".equalsIgnoreCase("SS")`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- equalsIgnoreCase(String): null argument -------------------------
  // Java returns false (it never throws) for a null argument.
  {
    code: `"abc".equalsIgnoreCase(null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"".equalsIgnoreCase(null)`,
    output: { type: 'boolean', value: false },
  },
  // A `(cond ? null : "abc")` arm is String-typed, so it passes overload resolution and reaches
  // the method body: selecting the null arm returns false, selecting the non-null arm compares.
  {
    code: `"abc".equalsIgnoreCase(true ? null : "abc")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equalsIgnoreCase(false ? null : "abc")`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equalsIgnoreCase(String): heap operands -------------------------
  {
    code: `s.equalsIgnoreCase(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'Hallo' },
        heap1: { class: 'java.lang.String', value: 'hALLO' },
      },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.equalsIgnoreCase(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'Hallo' },
        heap1: { class: 'java.lang.String', value: 'Halle' },
      },
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `"BERLIN".equalsIgnoreCase(s)`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'berlin' } },
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- content equality vs identity (chapter 5 contrast) -------------------------
  // equals compares content; == compares object identity. A fresh (non-interned)
  // heap String with the same text is equal but not identical.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s == "abc"`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'abc', isInterned: true },
      },
    },
    output: { type: 'boolean', value: true },
  },
  // equals is case-sensitive, equalsIgnoreCase is not.
  {
    code: `"abc".equals("ABC")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equalsIgnoreCase("ABC")`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- combining the methods -------------------------
  {
    code: `"abc".length() > 0 && !"abc".isEmpty()`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Berlin".contains("lin") && "Berlin".equalsIgnoreCase("BERLIN")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Berlin".length() == "BERLIN".length()`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- error phases: wrong arity (javac) -------------------------
  {
    code: `"abc".length(1)`,
    error: 'compile',
  },
  {
    code: `"abc".isEmpty(1)`,
    error: 'compile',
  },
  {
    code: `"abc".contains()`,
    error: 'compile',
  },
  {
    code: `"abc".contains("a", "b")`,
    error: 'compile',
  },
  {
    code: `"abc".equalsIgnoreCase()`,
    error: 'compile',
  },
  {
    code: `"abc".equalsIgnoreCase("a", "b")`,
    error: 'compile',
  },
  // ------------------------- error phases: wrong argument type (javac) -------------------------
  {
    code: `"abc".contains(1)`,
    error: 'compile',
  },
  {
    code: `"abc".equalsIgnoreCase(1)`,
    error: 'compile',
  },
  {
    code: `"abc".equalsIgnoreCase(true)`,
    error: 'compile',
  },
  // ------------------------- error phases: unknown method (javac) -------------------------
  {
    code: `"abc".foo()`,
    error: 'compile',
  },

  // ==================== ADDITIONAL EDGE CASES ====================
  // ------------------------- length(): escape sequences -------------------------
  {
    code: `"\\t".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"\\r".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"\\b".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"\\f".length()`,
    output: { type: 'int', value: 1 },
  },
  // Java source "\\" is a single backslash character.
  {
    code: `"\\\\".length()`,
    output: { type: 'int', value: 1 },
  },
  // Java source "\"" is a single double-quote character.
  {
    code: `"\\\"".length()`,
    output: { type: 'int', value: 1 },
  },
  // Java source "\'" is a single single-quote character.
  {
    code: `"\\'".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"\\t\\n\\r".length()`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- length()/isEmpty(): combining marks -------------------------
  // "e" followed by U+0301 (combining acute) is *two* UTF-16 code units, even though
  // it renders as one grapheme. length() counts code units, not graphemes.
  {
    code: `s.length()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'e\u0301' } },
    },
    output: { type: 'int', value: 2 },
  },
  {
    code: `s.isEmpty()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'e\u0301' } },
    },
    output: { type: 'boolean', value: false },
  },
  // The precomposed form is a single code unit and is a *different* String.
  {
    code: `"é".length()`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"é".equals("e\u0301")`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- length(): numeric promotion of the int result -------------------------
  {
    code: `"abc".length() + 1L`,
    output: { type: 'long', value: '4' },
  },
  {
    code: `"abc".length() + 1.0f`,
    output: { type: 'float', value: 4 },
  },
  {
    code: `"abc".length() + 1.5`,
    output: { type: 'double', value: 4.5 },
  },
  {
    code: `"abc".length() + 'a'`,
    output: { type: 'int', value: 100 },
  },
  {
    code: `(long) "abc".length()`,
    output: { type: 'long', value: '3' },
  },
  {
    code: `(byte) "abc".length()`,
    output: { type: 'byte', value: 3 },
  },
  {
    code: `"abc".length() == 3L`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- length()/isEmpty(): composed expressions -------------------------
  {
    code: `("a" + "b").length()`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(s + "b").length()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
    output: { type: 'int', value: 2 },
  },
  {
    code: `"".isEmpty() ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `"a".isEmpty() ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `"" + "".isEmpty()`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + "abc".isEmpty()`,
    output: { type: '__str', value: 'false' },
  },
  {
    code: `"abc".isEmpty() == ("abc".length() == 0)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- contains(): positions, overlaps, whitespace, escapes -------------------------
  {
    code: `"aaaa".contains("aa")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"aaaa".contains("aaa")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("a")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains("c")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".contains(" ")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a b".contains(" ")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a\\tb".contains("\\t")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a\\tb".contains("\\n")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"line1\\nline2".contains("\\n")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"line1\\nline2".length()`,
    output: { type: 'int', value: 11 },
  },
  // ------------------------- contains(): non-BMP (surrogate pairs) -------------------------
  {
    code: `"a😀b".contains("😀")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a😀b".contains("😀b")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a😀b".length()`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `"😀".length() == 2`,
    output: { type: 'boolean', value: true },
  },
  // The concatenation result is a normal String receiver.
  {
    code: `("Hello " + "World").contains("o W")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" + "abc".contains("a")`,
    output: { type: '__str', value: 'true' },
  },
  // ------------------------- contains(): null argument -------------------------
  // Java compiles contains(null) and throws a NullPointerException at runtime.
  {
    code: `"abc".contains(null)`,
    error: 'runtime',
  },
  // A `(cond ? null : "abc")` arm is String-typed, so it reaches the method body too; a selected
  // null arm NPEs, while a selected non-null arm searches it normally.
  {
    code: `"abc".contains(true ? null : "abc")`,
    error: 'runtime',
  },
  {
    code: `"abc".contains(false ? null : "abc")`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equalsIgnoreCase(): self / identity -------------------------
  {
    code: `s.equalsIgnoreCase(s)`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'Berlin' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".equalsIgnoreCase("abc") && "abc".equals("abc")`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equalsIgnoreCase(): Java's per-char case folding -------------------------
  // These pin cases where a naive toLowerCase() comparison would differ from Java's
  // String.equalsIgnoreCase (regionMatches(true, ...)): Java tries an exact code-unit
  // match, then Character.toUpperCase, then Character.toLowerCase, per character.
  // Dotless i (U+0131) and I (U+0130) fold onto ASCII i / I.
  {
    code: `"ı".equalsIgnoreCase("i")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"ı".equalsIgnoreCase("I")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"İ".equalsIgnoreCase("i")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"İ".equalsIgnoreCase("I")`,
    output: { type: 'boolean', value: true },
  },
  // Micro sign (U+00B5) and Greek small mu (U+03BC) share the uppercase Mu.
  {
    code: `"µ".equalsIgnoreCase("μ")`,
    output: { type: 'boolean', value: true },
  },
  // Kelvin sign (U+212A) folds to ASCII k.
  {
    code: `"\u212A".equalsIgnoreCase("k")`,
    output: { type: 'boolean', value: true },
  },
  // Latin sharp s (U+00DF) and capital sharp s (U+1E9E) fold onto each other.
  {
    code: `"ß".equalsIgnoreCase("ẞ")`,
    output: { type: 'boolean', value: true },
  },
  // Latin Å (U+00C5) and Angstrom sign (U+212B) are visually identical and fold together.
  {
    code: `"\u00C5".equalsIgnoreCase("\u212B")`,
    output: { type: 'boolean', value: true },
  },
  // Latin long s (U+017F) folds to ASCII s.
  {
    code: `"ſ".equalsIgnoreCase("s")`,
    output: { type: 'boolean', value: true },
  },
  // equals stays code-unit exact for exactly those pairs.
  {
    code: `"ı".equals("I")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"İ".equals("i")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"µ".equals("μ")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"\u212A".equals("k")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"ß".equals("ẞ")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"ſ".equals("s")`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- equalsIgnoreCase(): digits, punctuation, whitespace, non-BMP -------------------------
  {
    code: `"Ab1!".equalsIgnoreCase("aB1!")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Ab1!".equalsIgnoreCase("aB1?")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `" A ".equalsIgnoreCase(" a ")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"😀".equalsIgnoreCase("😀")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"😀".equalsIgnoreCase("😁")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("a" + "b").equalsIgnoreCase("AB")`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- combining the chapter-5 methods -------------------------
  {
    code: `s.length() > 0 && s.contains("er") && s.equalsIgnoreCase("BERLIN")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'Berlin' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `!"abc".isEmpty() && "abc".length() == 3 && "abc".contains("b")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"Berlin".length() == "bern".length() + 2`,
    output: { type: 'boolean', value: true },
  },
]
