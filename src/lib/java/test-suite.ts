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
import { strings } from './tests/strings.ts'
import { stringObjectModel } from './tests/string-object-model.ts'
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
  ...strings,
  ...stringObjectModel,
  ...regressionAndErrors,
]
