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
import { mathAbs } from './tests/math-abs.ts'
import { mathAbsValues } from './tests/math-abs-values.ts'
import { mathAbsContext } from './tests/math-abs-context.ts'
import { mathSymbol } from './tests/math-symbol.ts'
import { mathSqrtPow } from './tests/math-sqrt-pow.ts'
import { equalsSubtle } from './tests/equals-subtle.ts'
import { toStringCases } from './tests/to-string.ts'
import { stringMethods } from './tests/string-methods.ts'
import { regressionAndErrors } from './tests/regression-and-errors.ts'
import { assignmentBasic } from './tests/assignment-basic.ts'
import { compoundAssignment } from './tests/compound-assignment.ts'
import { bitwiseShiftAssignment } from './tests/bitwise-shift-assignment.ts'
import { incrementDecrement } from './tests/increment-decrement.ts'
import { assignmentBoxed } from './tests/assignment-boxed.ts'
import { assignmentEdgeCases } from './tests/assignment-edge-cases.ts'
import { arrays } from './tests/arrays.ts'
import { arraysIndex } from './tests/array-index.ts'
import { arrayAssignment } from './tests/array-assignment.ts'
import { arrayIdentity } from './tests/array-identity.ts'

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
  ...mathAbs,
  ...mathAbsValues,
  ...mathAbsContext,
  ...mathSymbol,
  ...mathSqrtPow,
  ...equalsSubtle,
  ...toStringCases,
  ...stringMethods,
  ...regressionAndErrors,
  ...assignmentBasic,
  ...compoundAssignment,
  ...bitwiseShiftAssignment,
  ...incrementDecrement,
  ...assignmentBoxed,
  ...assignmentEdgeCases,
  ...arrays,
  ...arraysIndex,
  ...arrayAssignment,
  ...arrayIdentity,
]
