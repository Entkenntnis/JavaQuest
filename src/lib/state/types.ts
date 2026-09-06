export interface CoreState {
  page: Page
  ui: Ui
  quest: Quest
}

interface Ui {
  testInput: string
  testCst?: CstNode
  testError?: string
  testAst?: AstNode
  testOutput?: JavaValue
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
}

export interface TestSuiteEntry {
  code: string
  isError?: boolean
  output?: JavaValue
}

// --------------------- Java System -------------------------

export interface JavaBooleanValue {
  type: 'boolean'
  value: boolean
}

export interface JavaByteValue {
  type: 'byte'
  value: number // (-128..127)
}

export interface JavaShortValue {
  type: 'short'
  value: number // (-32768..32767)
}

export interface JavaCharValue {
  type: 'char'
  value: number // Unicode 16-bit code point (0..65535)
}

export interface JavaIntValue {
  type: 'int'
  value: number
}

export interface JavaFloatValue {
  type: 'float'
  value: number
}

export interface JavaDoubleValue {
  type: 'double'
  value: number
}

export interface JavaLongValue {
  type: 'long'
  value: string // from bigint
}

export interface JavaStringValue {
  type: 'string'
  value: string
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

export type JavaAllowedLiteralValue =
  | JavaCharValue
  | JavaIntValue
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue
  | JavaBooleanValue
  | JavaStringValue
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

export type JavaLongFloatDoubleValue =
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue

export type JavaValue =
  | JavaNumericPrimitiveValue
  | JavaStringValue
  | JavaNullValue
  | JavaBooleanValue

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
  value:
    | JavaNumericPrimitiveValue
    | JavaBooleanValue
    | JavaStringValue
    | JavaNullValue
}

export interface UnaryExpressionAstNode {
  kind: 'unary'
  op: '+' | '-' | '!' | '~'
  operand: AstNode
}

export interface BinaryExpressionAstNode {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%' | '||' | '&&' | '=='
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

export type AstNode =
  | LiteralAstNode
  | UnaryExpressionAstNode
  | CastExpressionAstNode
  | BinaryExpressionAstNode

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
  | (T extends JavaAllowedLiteralValue ? TypedLiteralAstNode<T> : never)
  | (T extends JavaNumericPrimitiveValue ? TypedNumericCastNode<T> : never)
  | (T extends JavaLongFloatDoubleValue ? TypedUnaryPlusMinusNodeB<T> : never)
  | (T extends JavaStringValue
      ? TypedStringConcatNodeL | TypedStringConcatNodeR
      : never)
  | (T extends JavaIntValue
      ? TypedUnaryPlusMinusNodeS | TypedComplementNodeS | TypedNumericArithNodeS
      : never)
  | (T extends JavaLongValue ? TypedComplementNodeB : never)
  | (T extends JavaBooleanValue
      ?
          | TypedNegateNode
          | TypedBooleanCastNode
          | TypedOrAndNode
          | TypedNumericEqualsNode
          | TypedBooleanEqualsNode
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

// ---- LITERAL -----
export interface TypedLiteralAstNode<T extends JavaAllowedLiteralValue> {
  kind: 'literal'
  value: T // <-- this is an important contract to avoid bypassing the expectation with literals
  // technically, there are no short and byte literals, but the TypedAST is allowing it
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

export interface TypedComplementNodeB {
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

export interface TypedStringConcatNodeL {
  kind: 'binary'
  op: 'concat'
  left: TypedNode<JavaStringValue>
  right: TypedNode<JavaValue>
}

export interface TypedStringConcatNodeR {
  kind: 'binary'
  op: 'concat'
  left: TypedNode<JavaValue>
  right: TypedNode<JavaStringValue>
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
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedBooleanEqualsNode {
  kind: 'binary'
  op: '==b'
  left: TypedNode<JavaBooleanValue>
  right: TypedNode<JavaBooleanValue>
}

export type TypecheckResult =
  | [type: 'boolean', node: TypedNode<JavaBooleanValue>]
  | [type: 'byte', node: TypedNode<JavaByteValue>]
  | [type: 'short', node: TypedNode<JavaShortValue>]
  | [type: 'char', node: TypedNode<JavaCharValue>]
  | [type: 'int', node: TypedNode<JavaIntValue>]
  | [type: 'long', node: TypedNode<JavaLongValue>]
  | [type: 'float', node: TypedNode<JavaFloatValue>]
  | [type: 'double', node: TypedNode<JavaDoubleValue>]
  | [type: 'string', node: TypedNode<JavaStringValue>]
  | [type: 'null', node: TypedNode<JavaNullValue>]
