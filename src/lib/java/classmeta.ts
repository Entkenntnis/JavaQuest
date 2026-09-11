import type { ClassMetaData } from '../state/types'

export const classMetaData: Record<string, ClassMetaData> = {
  'java.lang.String': {
    name: 'java.lang.String',
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
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Short': {
    name: 'java.lang.Short',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Character': {
    name: 'java.lang.Character',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Integer': {
    name: 'java.lang.Integer',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Long': {
    name: 'java.lang.Long',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Float': {
    name: 'java.lang.Float',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Double': {
    name: 'java.lang.Double',
    interfaces: [],
    fields: [],
    methods: [],
  },
  'java.lang.Boolean': {
    name: 'java.lang.Boolean',
    interfaces: [],
    fields: [],
    methods: [],
  },
}
