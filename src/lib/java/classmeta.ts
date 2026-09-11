import type {
  ClassMetaData,
  JavaEnvironment,
  JavaReferenceValue,
  JavaValue,
  JavaWrapperObject,
} from '../state/types'

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
        handler: (owner, args, env) => {
          throw 'TODO HANDLER Object.equals'
        },
      },
      {
        name: 'hashCode',
        sig: {
          params: [],
          ret: { kind: 'primitive', prim: 'int' },
        },
        handler: (owner, args, env) => {
          throw 'TODO HANDLER Object.hashCode'
        },
      },
      {
        name: 'toString',
        sig: {
          params: [],
          ret: { kind: 'class', name: 'java.lang.String' },
        },
        handler: (owner, args, env) => {
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
    ],
  },
  'java.lang.Byte': {
    name: 'java.lang.Byte',
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
        handler: buildEqualsHandler('java.lang.Byte'),
      },
    ],
  },
  'java.lang.Short': {
    name: 'java.lang.Short',
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
        handler: buildEqualsHandler('java.lang.Short'),
      },
    ],
  },
  'java.lang.Character': {
    name: 'java.lang.Character',
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
        handler: buildEqualsHandler('java.lang.Character'),
      },
    ],
  },
  'java.lang.Integer': {
    name: 'java.lang.Integer',
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
        handler: buildEqualsHandler('java.lang.Integer'),
      },
    ],
  },
  'java.lang.Long': {
    name: 'java.lang.Long',
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
        handler: buildEqualsHandler('java.lang.Long'),
      },
    ],
  },
  'java.lang.Float': {
    name: 'java.lang.Float',
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
        handler: buildEqualsHandler('java.lang.Float'),
      },
    ],
  },
  'java.lang.Double': {
    name: 'java.lang.Double',
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
        handler: buildEqualsHandler('java.lang.Double'),
      },
    ],
  },
  'java.lang.Boolean': {
    name: 'java.lang.Boolean',
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
        handler: buildEqualsHandler('java.lang.Integer'),
      },
    ],
  },
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
    if ('boxed' in other && typeof other.boxed === 'string') {
      other = { type: 'reference', ref: other.boxed }
    }
    if (other.type != 'reference') {
      return { type: 'boolean', value: false }
    }
    const obj = env.heap[other.ref]
    if (obj.class != className) {
      return { type: 'boolean', value: false }
    }
    return { type: 'boolean', value: obj.value.value === own.value.value }
  }
}
