import type {
  ClassMetaData,
  JavaDoubleValue,
  JavaEnvironment,
  JavaFloatValue,
  JavaNumericPrimitiveValue,
  JavaReferenceValue,
  JavaValue,
  JavaWrapperObject,
  MethodMetaData,
} from '../state/types'
import { equalsIgnoreCase } from './helper/equals-ignore-case'
import { freshHeapRef } from './helper/heap'
import { javaValueToString } from './helper/print'

export const classMetaData: Record<string, ClassMetaData> = {
  'java.lang.Object': {
    name: 'java.lang.Object',
    superClass: null,
    interfaces: [],
    fields: [],
    methods: [
      {
        name: 'equals',
        sig: {
          params: [{ kind: 'class', name: 'java.lang.Object' }],
          ret: { kind: 'primitive', prim: 'boolean' },
        },
        handler: (_owner, _args, _env) => {
          throw 'TODO HANDLER Object.equals'
        },
      },
      {
        name: 'toString',
        sig: {
          params: [],
          ret: { kind: 'class', name: 'java.lang.String' },
        },
        handler: (_owner, _args, _env) => {
          throw 'TODO HANDLER Object.toString'
        },
      },
    ],
  },
  'java.lang.String': {
    name: 'java.lang.String',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [
      {
        name: 'equals',
        sig: {
          params: [{ kind: 'class', name: 'java.lang.Object' }],
          ret: { kind: 'primitive', prim: 'boolean' },
        },
        handler: (owner, args, env) => {
          const own = env.heap[owner.ref]
          const other = args[0]
          if (other.type != 'reference') {
            return { type: 'boolean', value: false }
          }
          const obj = env.heap[other.ref]
          if (
            obj.class != 'java.lang.String' ||
            own.class != 'java.lang.String'
          ) {
            return { type: 'boolean', value: false }
          }
          return { type: 'boolean', value: obj.value == own.value }
        },
      },
      {
        name: 'toString',
        sig: {
          params: [],
          ret: { kind: 'class', name: 'java.lang.String' },
        },
        handler: (owner, _args, _env) => {
          return owner
        },
      },
      {
        name: 'length',
        sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
        handler(owner, _args, env) {
          const obj = env.heap[owner.ref]
          if (obj.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          return { type: 'int', value: obj.value.length }
        },
      },
      {
        name: 'isEmpty',
        sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
        handler(owner, _args, env) {
          const obj = env.heap[owner.ref]
          if (obj.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          return { type: 'boolean', value: obj.value.length === 0 }
        },
      },
      {
        name: 'contains',
        sig: {
          params: [{ kind: 'class', name: 'java.lang.String' }],
          ret: { kind: 'primitive', prim: 'boolean' },
        },
        handler(owner, args, env) {
          const own = env.heap[owner.ref]
          if (own.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          const other = args[0]
          if (other.type != 'reference') {
            throw new Error('java.lang.NullPointerException')
          }
          const obj = env.heap[other.ref]
          if (obj.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          return { type: 'boolean', value: own.value.includes(obj.value) }
        },
      },
      {
        name: 'equalsIgnoreCase',
        sig: {
          params: [{ kind: 'class', name: 'java.lang.String' }],
          ret: { kind: 'primitive', prim: 'boolean' },
        },
        handler(owner, args, env) {
          const own = env.heap[owner.ref]
          if (own.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          const other = args[0]
          if (other.type != 'reference') {
            throw new Error('java.lang.NullPointerException')
          }
          const obj = env.heap[other.ref]
          if (obj.class != 'java.lang.String') {
            throw 'Interner Systemfehler: ungültiger String-Aufruf'
          }
          return {
            type: 'boolean',
            value: equalsIgnoreCase(own.value, obj.value),
          }
        },
      },
    ],
  },
  'java.lang.Byte': buildWrapper('java.lang.Byte'),
  'java.lang.Short': buildWrapper('java.lang.Short'),
  'java.lang.Character': buildWrapper('java.lang.Character'),
  'java.lang.Integer': buildWrapper('java.lang.Integer'),
  'java.lang.Long': buildWrapper('java.lang.Long'),
  'java.lang.Float': buildWrapper('java.lang.Float'),
  'java.lang.Double': buildWrapper('java.lang.Double'),
  'java.lang.Boolean': buildWrapper('java.lang.Boolean'),
  'java.lang.Math': {
    name: 'java.lang.Math',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [
      absMethod('int', (v) => {
        const n = BigInt(v.value)
        return {
          type: 'int',
          value: Number(BigInt.asIntN(32, n < 0n ? -n : n)),
        }
      }),
      absMethod('long', (v) => {
        const n = BigInt(v.value)
        return {
          type: 'long',
          value: BigInt.asIntN(64, n < 0n ? -n : n).toString(),
        }
      }),
      absMethod('float', (v) => ({
        type: 'float',
        value: Math.abs((v as JavaFloatValue).value),
      })),
      absMethod('double', (v) => ({
        type: 'double',
        value: Math.abs((v as JavaDoubleValue).value),
      })),
      {
        name: 'sqrt',
        isStatic: true,
        sig: {
          params: [{ kind: 'primitive', prim: 'double' }],
          ret: { kind: 'primitive', prim: 'double' },
        },
        handler: (_owner, args) => ({
          type: 'double',
          value: Math.sqrt((args[0] as JavaDoubleValue).value),
        }),
      },
      {
        name: 'pow',
        isStatic: true,
        sig: {
          params: [
            { kind: 'primitive', prim: 'double' },
            { kind: 'primitive', prim: 'double' },
          ],
          ret: { kind: 'primitive', prim: 'double' },
        },
        handler: (_owner, args) => ({
          type: 'double',
          value: Math.pow(
            (args[0] as JavaDoubleValue).value,
            (args[1] as JavaDoubleValue).value,
          ),
        }),
      },
    ],
  },
}

function buildWrapper(className: JavaWrapperObject['class']): ClassMetaData {
  return {
    name: className,
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [
      {
        name: 'equals',
        sig: {
          params: [{ kind: 'class', name: 'java.lang.Object' }],
          ret: { kind: 'primitive', prim: 'boolean' },
        },
        handler: buildEqualsHandler(className),
      },
      buildToStringHandler(className),
    ],
  }
}

function buildEqualsHandler(className: JavaWrapperObject['class']) {
  return (
    owner: JavaReferenceValue,
    args: JavaValue[],
    env: JavaEnvironment,
  ): JavaValue => {
    const own = env.heap[owner.ref]
    if (own.class != className)
      throw 'Interner Systemfehler: unerwartete Wrapper-Klasse'
    let other = args[0]
    if (other.type != 'reference') {
      return { type: 'boolean', value: false }
    }
    const obj = env.heap[other.ref]
    if (obj.class != className) {
      return { type: 'boolean', value: false }
    }
    return {
      type: 'boolean',
      value: Object.is(obj.value.value, own.value.value),
    }
  }
}

function buildToStringHandler(
  className: JavaWrapperObject['class'],
): MethodMetaData {
  return {
    name: 'toString',
    sig: {
      params: [],
      ret: { kind: 'class', name: 'java.lang.String' },
    },
    handler: (owner, _args, env) => {
      const ref = freshHeapRef(env)
      const obj = env.heap[owner.ref]
      if (obj.class == className) {
        env.heap[ref] = {
          class: 'java.lang.String',
          value: javaValueToString(obj.value, env),
        }
        return { type: 'reference', ref }
      }
      throw 'Interner Systemfehler: ungültiger toString-Empfänger'
    },
  }
}

function absMethod(
  prim: 'int' | 'long' | 'float' | 'double',
  abs: (v: JavaNumericPrimitiveValue) => JavaNumericPrimitiveValue,
): MethodMetaData {
  return {
    name: 'abs',
    isStatic: true,
    sig: {
      params: [{ kind: 'primitive', prim }],
      ret: { kind: 'primitive', prim },
    },
    handler(_owner, args) {
      return abs(args[0] as JavaNumericPrimitiveValue)
    },
  }
}
