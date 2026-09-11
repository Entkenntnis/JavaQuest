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
      },
      {
        name: 'hashCode',
        sig: {
          params: [],
          ret: { kind: 'primitive', prim: 'int' },
        },
      },
      {
        name: 'toString',
        sig: {
          params: [],
          ret: { kind: 'class', name: 'java.lang.String' },
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
    methods: [],
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
