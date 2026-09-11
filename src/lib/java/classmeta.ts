import type { ClassMetaData } from '../state/types'

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
          const other = args[0]
          if (other.type != 'reference' || owner.type != 'reference') {
            return { type: 'boolean', value: false }
          }
          const obj = env.heap[other.ref]
          const own = env.heap[owner.ref]
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
    methods: [],
  },
  'java.lang.Short': {
    name: 'java.lang.Short',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Character': {
    name: 'java.lang.Character',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
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
        handler: (owner, args, env) => {
          throw 'TODO HANDLER Integer.equals'
        },
      },
    ],
  },
  'java.lang.Long': {
    name: 'java.lang.Long',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Float': {
    name: 'java.lang.Float',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Double': {
    name: 'java.lang.Double',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Boolean': {
    name: 'java.lang.Boolean',
    superClass: 'java.lang.Object',
    interfaces: [],
    fields: [],
    methods: [],
  },
}
