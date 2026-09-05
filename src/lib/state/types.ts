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

export type JavaIntegerValue =
  | JavaByteValue
  | JavaCharValue
  | JavaShortValue
  | JavaIntValue
  | JavaLongValue

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

export interface TypedLiteralAstNode<T extends JavaValue> {
  kind: 'literal'
  value: T
}

export interface TypedUnaryPlusMinusNode<_ extends JavaNumericPrimitiveValue> {
  kind: 'unary'
  op: '+' | '-'
  operand: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedNegateNode<T extends JavaBooleanValue> {
  kind: 'unary'
  op: '!'
  operand: TypedNode<T>
}

export interface TypedComplementNode<T extends JavaIntegerValue> {
  kind: 'unary'
  op: '~'
  operand: TypedNode<T>
}

export interface TypedNumericCastNode<T extends JavaNumericPrimitiveValue> {
  kind: 'cast'
  type: T['type']
  operand: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedBooleanCastNode<T extends JavaBooleanValue> {
  kind: 'cast'
  type: 'boolean'
  operand: TypedNode<T>
}

export interface TypedNumericArithNode<_ extends JavaNumericPrimitiveValue> {
  kind: 'binary'
  op: '+' | '-' | '*' | '/' | '%'
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedStringConcatNode<_ extends JavaStringValue> {
  kind: 'binary'
  op: 'concat'
  left: TypedNode<JavaValue>
  right: TypedNode<JavaValue>
}

export interface TypedOrAndNode<T extends JavaBooleanValue> {
  kind: 'binary'
  op: '&&' | '||'
  left: TypedNode<T>
  right: TypedNode<T>
}

export interface TypedNumericEqualsNode<_ extends JavaNumericPrimitiveValue> {
  kind: 'binary'
  op: '==n'
  left: TypedNode<JavaNumericPrimitiveValue>
  right: TypedNode<JavaNumericPrimitiveValue>
}

export interface TypedBooleanEqualsNode<T extends JavaBooleanValue> {
  kind: 'binary'
  op: '==b'
  left: TypedNode<T>
  right: TypedNode<T>
}

export type TypedNode<T extends JavaValue> =
  | TypedLiteralAstNode<T>
  | (T extends JavaNumericPrimitiveValue
      ?
          | TypedUnaryPlusMinusNode<T>
          | TypedNumericCastNode<T>
          | TypedNumericArithNode<T>
          | TypedNumericEqualsNode<T>
      : never)
  | (T extends JavaBooleanValue
      ?
          | TypedNegateNode<T>
          | TypedBooleanCastNode<T>
          | TypedOrAndNode<T>
          | TypedBooleanEqualsNode<T>
      : never)
  | (T extends JavaIntegerValue ? TypedComplementNode<T> : never)
  | (T extends JavaStringValue ? TypedStringConcatNode<T> : never)
