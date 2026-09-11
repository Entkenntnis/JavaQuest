import type {
  ClassMetaData,
  JavaEnvironment,
  JavaReferenceValue,
  JavaValue,
  JavaWrapperObject,
  MethodMetaData,
} from '../state/types'
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
    if (own.class != className) throw 'internal error'
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
      throw 'bad: ' + JSON.stringify(owner) + JSON.stringify(obj)
    },
  }
}
