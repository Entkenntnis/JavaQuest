import type { TestSuiteEntry } from '../state/types.ts'
import { literals } from './tests/literals.ts'
import { identifiersAndCasts } from './tests/identifiers-and-casts.ts'
import { binaryArithmetic } from './tests/binary-arithmetic.ts'
import { shiftOperators } from './tests/shift-operators.ts'
import { bitwiseOperators } from './tests/bitwise-operators.ts'
import { equalityAndLogical } from './tests/equality-and-logical.ts'
import { relational } from './tests/relational.ts'
import { unaryPrecedence } from './tests/unary-precedence.ts'
import { conditional1 } from './tests/conditional-1.ts'
import { conditional2 } from './tests/conditional-2.ts'
import { boxedComparisons } from './tests/boxed-comparisons.ts'
import { boxedUnboxing } from './tests/boxed-unboxing.ts'
import { boxedLocals } from './tests/boxed-locals.ts'
import { boxedOperators } from './tests/boxed-operators.ts'
import { boxedCasts } from './tests/boxed-casts.ts'
import { boxedStrings } from './tests/boxed-strings.ts'
import { boxedConditionals } from './tests/boxed-conditionals.ts'
import { boxedBoxing } from './tests/boxed-boxing.ts'
import { strings } from './tests/strings.ts'
import { stringObjectModel } from './tests/string-object-model.ts'
import { methodInvocation } from './tests/method-invocation.ts'
import { regressionAndErrors } from './tests/regression-and-errors.ts'

export const testSuite: TestSuiteEntry[] = [
  ...literals,
  ...identifiersAndCasts,
  ...binaryArithmetic,
  ...shiftOperators,
  ...bitwiseOperators,
  ...equalityAndLogical,
  ...relational,
  ...unaryPrecedence,
  ...conditional1,
  ...conditional2,
  ...boxedComparisons,
  ...boxedUnboxing,
  ...boxedLocals,
  ...boxedOperators,
  ...boxedCasts,
  ...boxedStrings,
  ...boxedConditionals,
  ...boxedBoxing,
  ...strings,
  ...stringObjectModel,
  ...methodInvocation,
  ...regressionAndErrors,
]
