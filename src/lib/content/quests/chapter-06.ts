import type { JavaIntValue, QuestData } from '../../state/types'
import { intArrayEnv, intEnv, mergeEnv, stringArrayEnv } from './helpers'

const MAX_ITER = 1000

export const chapter06Quests: { [key: number]: QuestData } = {
  47: {
    id: 47,
    title: 'Summe',
    code: `
class Summe {
    int berechneSumme(int[] arr) {
        int ergebnis = 0;
        for (int i = 0; ___placeholder___; i++) {
            ergebnis += arr[i];
        }
        return ergebnis;
    }
}
    `.trim(),
    checker: {
      reference: 'i < arr.length',
      data: [
        [[1, 2, 3]],
        [[10, 20, 30]],
        [[42]],
        [[0]],
        [[]],
        [[-1, -2, -3]],
        [[5, 5, 5, 5]],
        [[100, -100]],
        [[1, 2, 3, 4, 5]],
        [[-2147483648]],
        [[2147483647]],
      ],
      params: ['arr'],
      driver(el, oracle) {
        const [arr] = el
        const env = mergeEnv(intArrayEnv('arr', arr), intEnv(['i', 0]))
        let ergebnis = 0
        let schritte = 0
        while (true) {
          const weiter = oracle(env)
          if (!weiter) break
          const arrRef = env.local['arr']
          if (arrRef.type != 'reference') {
            return '<NullPointerException>'
          }
          const arrObj = env.heap[arrRef.ref]
          if (!('isArray' in arrObj) || !arrObj.isArray) {
            return '<NullPointerException>'
          }
          const i = (env.local['i'] as JavaIntValue).value
          if (i < 0 || i >= arrObj.elements.length) {
            return '<ArrayIndexOutOfBoundsException>'
          }
          const element = arrObj.elements[i]
          ergebnis = (ergebnis + Number((element as JavaIntValue).value)) | 0
          env.local['i'] = { type: 'int', value: (i + 1) | 0 }
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        return String(ergebnis)
      },
    },
  },

  48: {
    id: 48,
    title: 'Grenzen',
    code: `
class Grenzen {
    // Stell sicher, dass arr[index] keinen Fehler wirft
    boolean indexInnerhalbGrenzen(int[] arr, int index) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'index >= 0 && index < arr.length',
      data: [
        [[1, 2, 3], 0],
        [[1, 2, 3], 1],
        [[1, 2, 3], 2],
        [[1, 2, 3], 3],
        [[1, 2, 3], -1],
        [[42], 0],
        [[42], 1],
        [[42], -42],
        [[], 0],
        [[], -1],
        [[1, 2, 3, 4, 5], 4],
        [[1, 2, 3, 4, 5], 5],
        [[-1, -2, -3], 0],
        [[2147483647], 0],
        [[-2147483648], 0],
      ],
      params: ['arr', 'index'],
      driver(el, oracle) {
        const [arr, index] = el
        const env = mergeEnv(intArrayEnv('arr', arr), intEnv(['index', index]))
        if (oracle(env)) return 'true'
        return 'false'
      },
    },
  },

  49: {
    id: 49,
    title: 'Finde Index',
    code: `
class FindeIndex {
    // Gib den Index des ersten Vorkommens zurück 
    // sonst -1
    int indexOf(int[] arr, int wert) {
        for (int i = 0; i < arr.length; i++) {
            if (___placeholder___) {
                return i;
            }
        }
        return -1;
    }
}
    `.trim(),
    checker: {
      reference: 'arr[i] == wert',
      data: [
        [[1, 2, 3], 2],
        [[1, 2, 3], 1],
        [[1, 2, 3], 3],
        [[1, 2, 3], 4],
        [[1, 2, 3], -1],
        [[7, 7, 7], 7],
        [[5, 1, 2, 1], 1],
        [[42], 42],
        [[42], -42],
        [[], 0],
        [[1, 2, 3, 4, 5], 5],
        [[1, 2, 3, 4, 5], 6],
        [[-3, -2, -1], -2],
        [[-3, -2, -1], 0],
        [[2147483647, 0], 2147483647],
        [[-2147483648, 0], -2147483648],
      ],
      params: ['arr', 'wert'],
      driver(el, oracle) {
        const [arr, wert] = el
        for (let i = 0; i < arr.length; i++) {
          const env = mergeEnv(
            intArrayEnv('arr', arr),
            intEnv(['i', i], ['wert', wert]),
          )
          if (oracle(env)) return String(i)
        }
        return '-1'
      },
    },
  },

  50: {
    id: 50,
    title: 'Alles positiv',
    code: `
class AllesPositiv {
    boolean alleZahlenPositiv(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            if (___placeholder___) {
                return false;
            }
        }
        return true;
    }
}
    `.trim(),
    checker: {
      reference: 'arr[i] <= 0',
      data: [
        [[1, 2, 3]],
        [[1, 2, 0]],
        [[0, 1, 2]],
        [[-1, -2, -3]],
        [[1, -1, 2]],
        [[]],
        [[5]],
        [[0]],
        [[-5]],
        [[2147483647]],
        [[-2147483648]],
        [[7, 8, 9, 10]],
        [[10, -1, 10]],
        [[1, 1, 1, -1]],
      ],
      params: ['arr'],
      driver(el, oracle) {
        const [arr] = el
        for (let i = 0; i < arr.length; i++) {
          const env = mergeEnv(intArrayEnv('arr', arr), intEnv(['i', i]))
          if (oracle(env)) return 'false'
        }
        return 'true'
      },
    },
  },

  51: {
    id: 51,
    title: 'Sortiert',
    code: `
class Sortiert {
    boolean istAufsteigendSortiert(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (___placeholder___) {
                return false;
            }
        }
        return true;
    }
}
    `.trim(),
    checker: {
      reference: 'arr[i] > arr[i + 1]',
      data: [
        [[1, 2, 3]],
        [[1, 2, 3, 4, 5]],
        [[3, 2, 1]],
        [[1, 3, 2]],
        [[2, 1, 3]],
        [[1, 1, 2]],
        [[1, 2, 2, 3]],
        [[2, 1]],
        [[1, 2]],
        [[1]],
        [[]],
        [[-5, -3, -1]],
        [[-1, -3, -5]],
        [[10, 20, 30, 5]],
        [[2147483646, 2147483647]],
        [[2147483647, 2147483646]],
        [[-2147483648, -2147483647]],
      ],
      params: ['arr'],
      driver(el, oracle) {
        const [arr] = el
        for (let i = 0; i < arr.length - 1; i++) {
          const env = mergeEnv(intArrayEnv('arr', arr), intEnv(['i', i]))
          if (oracle(env)) return 'false'
        }
        return 'true'
      },
    },
  },

  52: {
    id: 52,
    title: 'Echo',
    code: `
class Echo {
    public static void main(String[] args) {
        // Prüfe die Anzahl der Kommandozeilenargumente
        if (___placeholder___) {
            System.out.println("Erwarte genau 1 Argument.");
            System.exit(1);
        }
        System.out.println("Echo: " + args[0]);
    }
}
    `.trim(),
    checker: {
      reference: 'args.length != 1',
      data: [
        [['Hallo']],
        [['x']],
        [['']],
        [['Hallo Welt']],
        [['😀']],
        [['42']],
        [[]],
        [['a', 'b']],
        [['Hallo', 'Welt']],
        [['a', 'b', 'c']],
        [['', '']],
      ],
      params: ['args'],
      driver(el, oracle) {
        const [args] = el
        const env = stringArrayEnv('args', args)
        if (oracle(env)) return 'Erwarte genau 1 Argument.'
        if (args.length == 0) return '<ArrayIndexOutOfBoundsException>'
        return 'Echo: ' + args[0]
      },
    },
  },

  53: {
    id: 53,
    title: 'Klon',
    code: `
class Klon {
    // a und b enthalten den gleichen Inhalt
    boolean istKlon(int[] a, int[] b) {
        if (a.length != b.length) {
            return false;
        }
        for (int i = 0; i < a.length; i++) {
            if (___placeholder___) {
                return false;
            }
        }
        return true;
    }
}
    `.trim(),
    checker: {
      reference: 'a[i] != b[i]',
      data: [
        [
          [1, 2, 3],
          [1, 2, 3],
        ],
        [
          [1, 2, 3],
          [3, 2, 1],
        ],
        [
          [1, 2, 3],
          [1, 2, 4],
        ],
        [
          [1, 2, 3, 4],
          [1, 2, 3, 4],
        ],
        [
          [1, 2, 3, 4],
          [1, 2, 3, 0],
        ],
        [
          [1, 2, 1],
          [1, 2, 1],
        ],
        [[5], [5]],
        [[5], [6]],
        [[], []],
        [[1, 2], [1]],
        [[1], [1, 2]],
        [[0], [0]],
        [
          [1, 2],
          [2, 1],
        ],
        [
          [-1, -2, -3],
          [-1, -2, -3],
        ],
        [
          [-1, -2, -3],
          [1, 2, 3],
        ],
        [
          [2147483647, -2147483648],
          [2147483647, -2147483648],
        ],
        [
          [2147483647, -2147483648],
          [-2147483648, 2147483647],
        ],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        if (a.length != b.length) return 'false'
        for (let i = 0; i < a.length; i++) {
          const env = mergeEnv(
            intArrayEnv('a', a),
            intArrayEnv('b', b),
            intEnv(['i', i]),
          )
          if (oracle(env)) return 'false'
        }
        return 'true'
      },
    },
  },

  54: {
    id: 54,
    title: 'Spiegelbild',
    code: `
class Spiegelbild {
    // a und b sind zueinander gespiegelt
    boolean istSpiegelbild(int[] a, int[] b) {
        if (a.length != b.length) {
            return false;
        }
        for (int i = 0; i < a.length; i++) {
            if (___placeholder___) {
                return false;
            }
        }
        return true;
    }
}
    `.trim(),
    checker: {
      reference: 'a[i] != b[b.length - 1 - i]',
      data: [
        [
          [1, 2, 3],
          [3, 2, 1],
        ],
        [
          [1, 2, 3],
          [1, 2, 3],
        ],
        [
          [1, 2, 3, 4],
          [4, 3, 2, 1],
        ],
        [
          [1, 2, 3, 4],
          [4, 3, 2, 0],
        ],
        [
          [1, 2, 1],
          [1, 2, 1],
        ],
        [[5], [5]],
        [[5], [6]],
        [[], []],
        [[1, 2], [1]],
        [[1], [1, 2]],
        [[0], [0]],
        [
          [1, 2],
          [2, 1],
        ],
        [
          [-1, -2, -3],
          [-3, -2, -1],
        ],
        [
          [-1, -2, -3],
          [3, 2, 1],
        ],
        [
          [2147483647, -2147483648],
          [-2147483648, 2147483647],
        ],
        [
          [2147483647, -2147483648],
          [2147483647, -2147483648],
        ],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        if (a.length != b.length) return 'false'
        for (let i = 0; i < a.length; i++) {
          const env = mergeEnv(
            intArrayEnv('a', a),
            intArrayEnv('b', b),
            intEnv(['i', i]),
          )
          if (oracle(env)) return 'false'
        }
        return 'true'
      },
    },
  },
}
