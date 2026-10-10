import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayEnvWithLocals,
  stringArray,
  stringObject,
} from './array-fixtures.ts'

// ==================== REFERENCE ARRAYS (String[]) ====================
// The interpreter already treats array elements as arbitrary `JavaValue`s, so a String[]
// whose elements point at String heap objects works end to end: reads, `.length`, method
// calls on elements, element writes, `==`/`!=` and null. These entries pin that down and
// additionally exercise the cross-check env renderer, which has to materialise the
// element objects and keep shared references identical so `==` matches real Java.
//
// Arrays themselves are not comparable outputs, so every result is a primitive or a
// dereferenced String (`__str`). Each entry only carries the heap it uses.

// `arr` = { "Hallo", "Welt", "!" } with three distinct, interned Strings.
const basic = arrayEnv({
  s0: stringObject('Hallo'),
  s1: stringObject('Welt'),
  s2: stringObject('!'),
  arr: stringArray(['s0', 's1', 's2']),
})

// `arr` = { hallo, hallo, "Welt" } where the first two elements are the same object, and
// `same` aliases that object as a plain local.
const sharedElement = arrayEnv({
  hallo: stringObject('Hallo'),
  welt: stringObject('Welt'),
  arr: stringArray(['hallo', 'hallo', 'welt']),
  same: { aliasOf: 'hallo' },
})

// `a` and `b` alias the same array; `c` is a distinct array with equal content. The
// elements are freshly allocated (not interned) so that `a[0] == c[0]` is genuinely
// false in both the interpreter and real Java.
const alias = arrayEnv({
  a0: stringObject('Hallo', false),
  a1: stringObject('Welt', false),
  c0: stringObject('Hallo', false),
  c1: stringObject('Welt', false),
  a: stringArray(['a0', 'a1']),
  b: { aliasOf: 'a' },
  c: stringArray(['c0', 'c1']),
})

// `arr` = { interned "Hallo", fresh "Hallo" }: equal content, different identity.
const internedVsFresh = arrayEnv({
  hi: stringObject('Hallo', true),
  hf: stringObject('Hallo', false),
  arr: stringArray(['hi', 'hf']),
})

// `arr` = { "Hallo", null }.
const nullElement = arrayEnv({
  s0: stringObject('Hallo'),
  arr: stringArray(['s0', null]),
})

// `arr` itself is null (no static array type in the env, so only `== null` is meaningful).
const nullArray = arrayEnvWithLocals(
  {},
  { arr: { type: 'null', value: null } },
)

// `arr` = {} (empty array).
const emptyArray = arrayEnv({ arr: stringArray([]) })

// `arr` = { "Hallo", "Welt" } plus an extra String local `other` = "!" to write into it.
const assignment = arrayEnv({
  s0: stringObject('Hallo'),
  s1: stringObject('Welt'),
  other: stringObject('!'),
  arr: stringArray(['s0', 's1']),
})

export const arraysRef: TestSuiteEntry[] = [
  // ------------------------- length and shape -------------------------
  { code: `arr.length`, output: { type: 'int', value: 3 }, env: basic },
  { code: `arr.length == 3`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr.length > 0`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr.length != 0`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr.length * 2`, output: { type: 'int', value: 6 }, env: basic },
  { code: `arr.length - 1`, output: { type: 'int', value: 2 }, env: basic },
  { code: `arr != null`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr == null`, output: { type: 'boolean', value: false }, env: basic },

  // ------------------------- element reads -------------------------
  { code: `arr[0]`, output: { type: '__str', value: 'Hallo' }, env: basic },
  { code: `arr[1]`, output: { type: '__str', value: 'Welt' }, env: basic },
  { code: `arr[2]`, output: { type: '__str', value: '!' }, env: basic },
  { code: `arr[arr.length - 1]`, output: { type: '__str', value: '!' }, env: basic },
  { code: `arr[0].toString()`, output: { type: '__str', value: 'Hallo' }, env: basic },
  { code: `"" + arr[0]`, output: { type: '__str', value: 'Hallo' }, env: basic },
  { code: `arr[0] + arr[1]`, output: { type: '__str', value: 'HalloWelt' }, env: basic },
  { code: `arr[0] + "!"`, output: { type: '__str', value: 'Hallo!' }, env: basic },

  // ------------------------- element method calls -------------------------
  { code: `arr[0].length()`, output: { type: 'int', value: 5 }, env: basic },
  { code: `arr[1].length()`, output: { type: 'int', value: 4 }, env: basic },
  { code: `arr[2].length()`, output: { type: 'int', value: 1 }, env: basic },
  { code: `arr[0].isEmpty()`, output: { type: 'boolean', value: false }, env: basic },
  { code: `arr[0].equals("Hallo")`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr[0].equals("hallo")`, output: { type: 'boolean', value: false }, env: basic },
  {
    code: `arr[0].equalsIgnoreCase("HALLO")`,
    output: { type: 'boolean', value: true },
    env: basic,
  },
  { code: `arr[0].contains("all")`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr[0].contains("xyz")`, output: { type: 'boolean', value: false }, env: basic },
  { code: `arr[0].equals(arr[1])`, output: { type: 'boolean', value: false }, env: basic },

  // ------------------------- element identity (distinct objects) -------------------------
  { code: `arr[0] == arr[1]`, output: { type: 'boolean', value: false }, env: basic },
  { code: `arr[0] != arr[1]`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr[0] == arr[0]`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr[0] == null`, output: { type: 'boolean', value: false }, env: basic },
  { code: `arr[0] != null`, output: { type: 'boolean', value: true }, env: basic },
  { code: `arr[0] == "Hallo"`, output: { type: 'boolean', value: true }, env: basic },

  // ------------------------- shared element identity -------------------------
  { code: `arr[0] == arr[1]`, output: { type: 'boolean', value: true }, env: sharedElement },
  { code: `arr[0] != arr[1]`, output: { type: 'boolean', value: false }, env: sharedElement },
  { code: `arr[1] == arr[2]`, output: { type: 'boolean', value: false }, env: sharedElement },
  { code: `arr[0].equals(arr[1])`, output: { type: 'boolean', value: true }, env: sharedElement },
  { code: `arr[0] == same`, output: { type: 'boolean', value: true }, env: sharedElement },
  { code: `same == arr[0]`, output: { type: 'boolean', value: true }, env: sharedElement },
  { code: `same == arr[2]`, output: { type: 'boolean', value: false }, env: sharedElement },
  { code: `same.equals(arr[0])`, output: { type: 'boolean', value: true }, env: sharedElement },

  // ------------------------- array alias vs distinct array -------------------------
  { code: `a == b`, output: { type: 'boolean', value: true }, env: alias },
  { code: `a != b`, output: { type: 'boolean', value: false }, env: alias },
  { code: `a[0] == b[0]`, output: { type: 'boolean', value: true }, env: alias },
  { code: `a == c`, output: { type: 'boolean', value: false }, env: alias },
  { code: `a != c`, output: { type: 'boolean', value: true }, env: alias },
  { code: `a.length == c.length`, output: { type: 'boolean', value: true }, env: alias },
  { code: `a[0] == c[0]`, output: { type: 'boolean', value: false }, env: alias },
  { code: `a[0].equals(c[0])`, output: { type: 'boolean', value: true }, env: alias },

  // ------------------------- interned vs freshly allocated -------------------------
  { code: `arr[0] == arr[1]`, output: { type: 'boolean', value: false }, env: internedVsFresh },
  { code: `arr[0] != arr[1]`, output: { type: 'boolean', value: true }, env: internedVsFresh },
  { code: `arr[0].equals(arr[1])`, output: { type: 'boolean', value: true }, env: internedVsFresh },
  { code: `arr[0] == "Hallo"`, output: { type: 'boolean', value: true }, env: internedVsFresh },
  { code: `arr[1] == "Hallo"`, output: { type: 'boolean', value: false }, env: internedVsFresh },
  {
    code: `arr[0].length() == arr[1].length()`,
    output: { type: 'boolean', value: true },
    env: internedVsFresh,
  },

  // ------------------------- null elements -------------------------
  { code: `arr[1] == null`, output: { type: 'boolean', value: true }, env: nullElement },
  { code: `arr[1] != null`, output: { type: 'boolean', value: false }, env: nullElement },
  { code: `arr[0] == null`, output: { type: 'boolean', value: false }, env: nullElement },
  { code: `arr[0].equals(arr[1])`, output: { type: 'boolean', value: false }, env: nullElement },
  { code: `arr[1].length()`, error: 'runtime', env: nullElement },
  { code: `arr[1].isEmpty()`, error: 'runtime', env: nullElement },
  { code: `arr[1].equals("x")`, error: 'runtime', env: nullElement },

  // ------------------------- null array -------------------------
  { code: `arr == null`, output: { type: 'boolean', value: true }, env: nullArray },
  { code: `arr != null`, output: { type: 'boolean', value: false }, env: nullArray },
  { code: `arr == arr`, output: { type: 'boolean', value: true }, env: nullArray },

  // ------------------------- empty array -------------------------
  { code: `arr.length`, output: { type: 'int', value: 0 }, env: emptyArray },
  { code: `arr.length == 0`, output: { type: 'boolean', value: true }, env: emptyArray },
  { code: `arr != null`, output: { type: 'boolean', value: true }, env: emptyArray },
  { code: `arr[0]`, error: 'runtime', env: emptyArray },

  // ------------------------- element writes -------------------------
  { code: `(arr[0] = other) == other`, output: { type: 'boolean', value: true }, env: assignment },
  { code: `(arr[1] = arr[0]) == arr[0]`, output: { type: 'boolean', value: true }, env: assignment },
  { code: `(arr[0] = other).length()`, output: { type: 'int', value: 1 }, env: assignment },
  {
    code: `(arr[0] = other).equals(other)`,
    output: { type: 'boolean', value: true },
    env: assignment,
  },
  { code: `(arr[0] = arr[1]) + arr[1]`, output: { type: '__str', value: 'WeltWelt' }, env: assignment },
]
