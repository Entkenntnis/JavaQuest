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
}

interface Quest {
  id: number
}

export interface CoreRef {
  state: CoreState
}

type Page = 'quest' | 'overview' | 'test'

export interface QuestData {
  id: number
  title: string
  code: string
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
  value: BigInt
}

export interface JavaStringValue {
  type: 'string'
  value: string
}

export interface JavaNullValue {
  type: 'null'
}

export type JavaNumericPrimitiveValue =
  | JavaByteValue
  | JavaCharValue
  | JavaShortValue
  | JavaIntValue
  | JavaLongValue
  | JavaFloatValue
  | JavaDoubleValue

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

export type AstNode = LiteralAstNode
