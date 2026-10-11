import type {
  ClassMetaData,
  JavaEnvironment,
  QuestData,
} from '../../state/types'

const beitragskontoMeta: ClassMetaData = {
  name: 'Beitragskonto',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'offeneBeiträge', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [],
}

function beitragskontoEnv(offeneBeiträge: number): JavaEnvironment {
  return {
    local: {},
    heap: {
      self: {
        class: 'Beitragskonto',
        isInstance: true,
        fields: { offeneBeiträge: { type: 'int', value: offeneBeiträge } },
      },
    },
    contextMeta: { Beitragskonto: beitragskontoMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

export const chapter07Quests: { [key: number]: QuestData } = {
  54: {
    id: 54,
    title: 'Beitragskonto',
    code: `
class Beitragskonto {
    int offeneBeiträge; // in Cent

    // true, wenn noch Beiträge offen sind
    boolean nochBeiträgeOffen() {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'this.offeneBeiträge > 0',
      data: [1, 100, 5000, 42, 0, -1, 2147483647, -2147483648],
      params: ['this.offeneBeiträge'],
      driver(el, oracle) {
        return oracle(beitragskontoEnv(el)) ? 'true' : 'false'
      },
    },
  },
}
