import type { ReactNode } from 'react'

export interface CoreState {
  page: Page
  ui: Ui
  quest: Quest
}

interface Ui {
  testInput: string
  testEnv: string
  testCst?: CstNode
  testError?: string
  testAst?: AstNode
  testOutput?: JavaValue
  testOutputEnv?: string
  testOnlyFail: boolean

  questInput: string
  questOutput: string
}

interface Quest {
  id: number
}

export interface CoreRef {
  state: CoreState
}

type Page = 'quest' | 'overview' | 'test' | 'suite'

export interface QuestData {
  id: number
  title: string
  code: string
  checker: QuestChecker<any>
}

export interface QuestChecker<T> {
  data: T[]
  reference: string
  driver: (el: T, oracle: (env: JavaEnvironment) => boolean) => string
}

export interface ChapterData {
  title: string
  quests: number[]
  description: () => ReactNode
}

export interface TestHarnessDerefStringValue {
  type: '__str'
  value: string
}

// Every error carries the phase in which real Java rejects the code:
//   'compile' -- javac rejects it (bad syntax, incompatible types, ...);
//   'runtime' -- it compiles but the JVM throws (NPE, ClassCastException, ...).
// The interpreter must fail in the same phase to match an entry.
export type TestErrorPhase = 'compile' | 'runtime'

export interface TestHarnessError {
  phase: TestErrorPhase
  message: string
  internal?: true
}

export interface TestSuiteEntry {
  code: string
  error?: TestErrorPhase
  output?:
    | JavaBooleanValue
    | JavaNumericPrimitiveValue
    | JavaNullValue
    | TestHarnessDerefStringValue
  env?: JavaEnvironment
}

export interface SuiteResult {
  error?: TestHarnessError
  value?:
    | JavaBooleanValue
    | JavaNumericPrimitiveValue
    | TestHarnessDerefStringValue
}

// --------------------- Java System -------------------------

export interface JavaBooleanValue {
  type: 'boolean'
  value: boolean
  boxed?: boolean | string
}

export interface JavaByteValue {
  type: 'byte'
  value: number // (-128..127)
  boxed?: boolean | string
}

export interface JavaShortValue {
  type: 'short'
  value: number // (-32768..32767)
  boxed?: boolean | string
}

export interface JavaCharValue {
  type: 'char'
  value: number // Unicode 16-bit code point (0..65535)
  boxed?: boolean | string
}

export interface JavaIntValue {
  type: 'int'
  value: number
  boxed?: boolean | string
}

export interface JavaFloatValue {
  type: 'float'
  value: number
  boxed?: boolean | string
}

export interface JavaDoubleValue {
  type: 'double'
  value: number
  boxed?: boolean | string
}

export interface JavaLongValue {
  type: 'long'
  value: string // from bigint
  boxed?: boolean | string
}

export interface JavaReferenceValue {
  type: 'reference'
  ref: string // <-- pointing to an entry on the heap
}

export interface JavaNullValue {
  type: 'null'
  value: null
}

export type JavaNumericPrimitiveValue =
  | JavaByteValue
  | JavaCharValue
  | JavaShortValue
  | JavaIntValue
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue

// byte and short do not exist as Java literals, they only arise through casts
export type JavaAllowedLiteralValue =
  | JavaCharValue
  | JavaIntValue
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue
  | JavaBooleanValue
  | JavaNullValue

export type JavaIntegerValue =
  | JavaByteValue
  | JavaCharValue
  | JavaShortValue
  | JavaIntValue
  | JavaLongValue

export type JavaSmallIntegerValue =
  | JavaByteValue
  | JavaCharValue
  | JavaShortValue
  | JavaIntValue

export type JavaBigIntegerValue = JavaIntValue | JavaLongValue

export type JavaLongFloatDoubleValue =
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue

export type JavaValue =
  | JavaBooleanValue
  | JavaNumericPrimitiveValue
  | JavaReferenceValue
  | JavaNullValue

export type Prim = (JavaNumericPrimitiveValue | JavaBooleanValue)['type']

export interface CstNode {
  name: string
  from: number
  to: number
  text: string
  isError: boolean
  children: CstNode[]
}

export interface LiteralAstNode {
  kind: 'literal'
  value: JavaNumericPrimitiveValue | JavaBooleanValue | JavaNullValue
}

export interface LiteralStringAstNode {
  kind: 'string-literal'
  value: string
}

export interface UnaryExpressionAstNode {
  kind: 'unary'
  op: '+' | '-' | '!' | '~'
  operand: AstNode
}

export interface BinaryExpressionAstNode {
  kind: 'binary'
  op:
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '||'
    | '&&'
    | '=='
    | '<<'
    | '>>'
    | '>>>'
    | '|'
    | '&'
    | '^'
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
  left: AstNode
  right: AstNode
}

export type PrimitiveTypeName =
  | 'byte'
  | 'short'
  | 'char'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'

export interface CastExpressionAstNode {
  kind: 'cast'
  type: PrimitiveTypeName
  operand: AstNode
}

export interface IdentifierAstNode {
  kind: 'identifier'
  name: string
}

export interface ConditionalOperatorAstNode {
  kind: 'ternary'
  condition: AstNode
  left: AstNode
  right: AstNode
}

export interface MethodInvocationAstNode {
  kind: 'invoke'
  owner: AstNode
  name: string
  args: AstNode[]
}

export type AstNode =
  | LiteralAstNode
  | LiteralStringAstNode
  | UnaryExpressionAstNode
  | CastExpressionAstNode
  | BinaryExpressionAstNode
  | IdentifierAstNode
  | ConditionalOperatorAstNode
  | MethodInvocationAstNode

// ----------------------------

// So, what is the idea here?
// Ich möchte die gesamten Typ-Informationen, die ich im Ast aufgebaut habe, jetzt ganz explizit typisieren
// Geht das? Ich meine, wahrscheinlich mit TypedNode<type>
// Also, der Type Parameter gibt den AUSGABE-WERT der Node an

// Jeder Node muss einen Wert produzieren, dieser Wert ist der Typ-Parameter
// Ich möchte den Typ wissen, um die Children zu spezifizieren
// Optional kann ich auch die Struktur näher festlegen.
// Ah, die Deambiguiation

// Das ist die Schaltzentrale, abhängig von T sind unterschiedliche Sub-Nodes verfügbar
export type TypedNode<T extends JavaValue> =
  | TypedIdentifierNode
  | TypedConditionalOperatorNode
  | TypedMethodInvocationNode
  | (T extends JavaAllowedLiteralValue ? TypedLiteralNode<T> : never)
  | (T extends JavaNumericPrimitiveValue
      ? TypedNumericCastNode<T> | TypedConditionalOperatorNumericCastNode
      : never)
  | (T extends JavaLongFloatDoubleValue ? TypedUnaryPlusMinusNodeB<T> : never)
  | (T extends JavaReferenceValue
      ? TypedLiteralStringNode | TypedStringConcatNodeL | TypedStringConcatNodeR
      : never)
  | (T extends JavaNumericPrimitiveValue | JavaBooleanValue
      ? TypedUnboxCastNode
      : never)
  | (T extends JavaIntValue
      ? TypedUnaryPlusMinusNodeS | TypedComplementNodeS | TypedNumericArithNodeS
      : never)
  | (T extends JavaLongValue ? TypedComplementNodeL : never)
  | (T extends JavaBooleanValue
      ?
          | TypedNegateNode
          | TypedBooleanCastNode
          | TypedOrAndNode
          | TypedNumericEqualsNode
          | TypedBooleanEqualsNode
          | TypedReferenceEqualsNode
          | TypedBoxedReferenceEqualsNode
          | TypedBooleanLogicalNode
          | TypedRelationalCompareNode
      : never)
  | (T extends JavaLongValue
      ? TypedNumericArithNodeBLL | TypedNumericArithNodeBLR
      : never)
  | (T extends JavaFloatValue
      ? TypedNumericArithNodeBFL | TypedNumericArithNodeBFR
      : never)
  | (T extends JavaDoubleValue
      ? TypedNumericArithNodeBDL | TypedNumericArithNodeBDR
      : never)
  | (T extends JavaBigIntegerValue ? TypedBitwiseNode : never)

// ---- LITERAL -----
export interface TypedLiteralNode<T extends JavaAllowedLiteralValue> {
  kind: 'literal'
  value: T // <-- this is an important contract to avoid bypassing the expectation with literals
}

// The job of this node is to INTERN its value
// Can be done in the constant folding pass?
// It's a bit more dynamic than I would like it to be, but should keep the "observable" equivalence
export interface TypedLiteralStringNode {
  kind: 'string-literal'
  value: string
}

// ---- UNARY ----
export interface TypedUnaryPlusMinusNodeS {
  kind: 'unary'
  op: '+' | '-'
  operand: TypedNode<JavaSmallIntegerValue>
}

export interface TypedUnaryPlusMinusNodeB<T extends JavaLongFloatDoubleValue> {
  kind: 'unary'
  op: '+' | '-'
  operand: TypedNode<T>
}

export interface TypedNegateNode {
  kind: 'unary'
  op: '!'
  operand: TypedNode<JavaBooleanValue>
}

export interface TypedComplementNodeS {
  kind: 'unary'
  op: '~'
  operand: TypedNode<JavaSmallIntegerValue>
}

export interface TypedComplementNodeL {
  kind: 'unary'
  op: '~'
  operand: TypedNode<JavaLongValue>
}

// ----- CAST -----
export interface TypedNumericCastNode<T extends JavaNumericPrimitiveValue> {
  kind: 'cast'
  type: T['type']
  operand: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedBooleanCastNode {
  kind: 'cast'
  type: 'boolean'
  operand: TypedNode<JavaBooleanValue>
}

export interface TypedUnboxCastNode {
  kind: 'cast'
  type: Prim
  isUnboxing: true
  operand: TypedNode<JavaReferenceValue | JavaNullValue>
}

// ----- BINARY OPS
export interface TypedNumericArithNodeS {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaSmallIntegerValue>
  right: TypedNode<JavaSmallIntegerValue>
}

export interface TypedNumericArithNodeBLL {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaLongValue>
  right: TypedNode<JavaSmallIntegerValue | JavaLongValue>
}

export interface TypedNumericArithNodeBLR {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaSmallIntegerValue | JavaLongValue>
  right: TypedNode<JavaLongValue>
}

export interface TypedNumericArithNodeBFL {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaFloatValue>
  right: TypedNode<JavaIntegerValue | JavaFloatValue>
}

export interface TypedNumericArithNodeBFR {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaIntegerValue | JavaFloatValue>
  right: TypedNode<JavaFloatValue>
}

export interface TypedNumericArithNodeBDL {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaDoubleValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedNumericArithNodeBDR {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaDoubleValue>
}

export interface TypedBitwiseNode {
  kind: 'binary'
  op: '<<' | '>>' | '>>>' | '|' | '&' | '^'
  left: TypedNode<JavaIntegerValue>
  right: TypedNode<JavaIntegerValue>
}

export interface TypedBooleanLogicalNode {
  kind: 'binary'
  op: '|b' | '&b' | '^b'
  left: TypedNode<JavaBooleanValue>
  right: TypedNode<JavaBooleanValue>
}

export interface TypedStringConcatNodeL {
  kind: 'binary'
  op: 'concat'
  left: TypedNode<JavaReferenceValue>
  right: TypedNode<JavaValue>
}

export interface TypedStringConcatNodeR {
  kind: 'binary'
  op: 'concat'
  left: TypedNode<JavaValue>
  right: TypedNode<JavaReferenceValue>
}

export interface TypedOrAndNode {
  kind: 'binary'
  op: '&&' | '||'
  left: TypedNode<JavaBooleanValue>
  right: TypedNode<JavaBooleanValue>
}

export interface TypedNumericEqualsNode {
  kind: 'binary'
  op: '==n'
  negate: boolean
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedBooleanEqualsNode {
  kind: 'binary'
  op: '==b'
  negate: boolean
  left: TypedNode<JavaBooleanValue>
  right: TypedNode<JavaBooleanValue>
}

export interface TypedReferenceEqualsNode {
  kind: 'binary'
  op: '==r'
  negate: boolean
  left: TypedNode<JavaReferenceValue | JavaNullValue>
  right: TypedNode<JavaReferenceValue | JavaNullValue>
}

export interface TypedBoxedReferenceEqualsNode {
  kind: 'binary'
  op: '==box'
  negate: boolean
  left: TypedNode<JavaValue>
  right: TypedNode<JavaValue>
}

export interface TypedRelationalCompareNode {
  kind: 'binary'
  op: '<' | '>' | '>=' | '<='
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedIdentifierNode {
  kind: 'identifier'
  name: string
}

export interface TypedConditionalOperatorNode {
  kind: 'ternary'
  condition: TypedNode<JavaBooleanValue>
  left: TypedNode<JavaValue>
  right: TypedNode<JavaValue>
  boxResult?: true
  objectify?: true
}

export interface TypedConditionalOperatorNumericCastNode {
  kind: 'ternary'
  condition: TypedNode<JavaBooleanValue>
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
  boxResult?: true
  objectify?: true
  castTo?: 'byte' | 'short' | 'char' | 'int' | 'long' | 'float' | 'double'
}

export interface TypedMethodInvocationNode {
  kind: 'invoke'
  owner: TypedNode<JavaValue>
  args: TypedNode<JavaValue>[]
  handler: (
    owern: JavaReferenceValue,
    args: JavaValue[],
    env: JavaEnvironment,
  ) => JavaValue
}

export type TypecheckResult =
  | [type: 'boolean', node: TypedNode<JavaBooleanValue>, { boxed?: true }?]
  | [type: 'byte', node: TypedNode<JavaByteValue>, { boxed?: true }?]
  | [type: 'short', node: TypedNode<JavaShortValue>, { boxed?: true }?]
  | [type: 'char', node: TypedNode<JavaCharValue>, { boxed?: true }?]
  | [type: 'int', node: TypedNode<JavaIntValue>, { boxed?: true }?]
  | [type: 'long', node: TypedNode<JavaLongValue>, { boxed?: true }?]
  | [type: 'float', node: TypedNode<JavaFloatValue>, { boxed?: true }?]
  | [type: 'double', node: TypedNode<JavaDoubleValue>, { boxed?: true }?]
  | [
      type: 'reference',
      node: TypedNode<JavaReferenceValue>,
      ClassType | ArrayType,
    ]
  | [type: 'null', node: TypedNode<JavaNullValue>]

export type TypeData = TypecheckResult[2]

// ------- Environment Stuff -------

export interface JavaEnvironment {
  local: Record<string, JavaValue>
  heap: Record<string, JavaHeapObject>
}

export type JavaHeapObject =
  | JavaStringHeapObject
  | JavaObject
  | JavaWrapperObject

export interface JavaStringHeapObject {
  class: 'java.lang.String'
  value: string
  isInterned?: boolean
}

export interface JavaWrapperObject {
  class:
    | 'java.lang.Byte'
    | 'java.lang.Short'
    | 'java.lang.Character'
    | 'java.lang.Integer'
    | 'java.lang.Long'
    | 'java.lang.Float'
    | 'java.lang.Double'
    | 'java.lang.Boolean'
  value: JavaNumericPrimitiveValue | JavaBooleanValue
  isWrapper: true
}

export interface JavaObject {
  class: 'java.lang.Object'
}

export interface PrimitiveType {
  kind: 'primitive'
  prim: Prim
}

export interface ClassType {
  kind: 'class'
  name: string
}

export interface VoidType {
  kind: 'void'
}

export interface ArrayType {
  kind: 'array'
  elem: Type
}

export type Type = PrimitiveType | ClassType | ArrayType

export interface ClassMetaData {
  name: string
  superClass: string | null
  interfaces: string[]

  fields: FieldMetaData[]
  methods: MethodMetaData[]
}

export interface FieldMetaData {
  name: string
  type: Type
}

export interface MethodMetaData {
  name: string
  sig: MethodSig
  handler: (
    owern: JavaReferenceValue,
    args: JavaValue[],
    env: JavaEnvironment,
  ) => JavaValue
}

export interface MethodSig {
  params: Type[]
  ret: Type | VoidType
}
