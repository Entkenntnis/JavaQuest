import type { QuestData } from '../../state/types'
import { env, intEnv } from './helpers'

export const chapter02Quests: { [key: number]: QuestData } = {
  7: {
    id: 7,
    title: 'Luftfeuchtigkeit',
    code: `
class Luftfeuchtigkeit {
    // Optimale Werte liegen zwischen 35 und 65   
    // (in Prozent, Grenzen inklusive)
    void prüfeFeuchtigkeit(int messwert) {
        if (___placeholder___) {
            System.out.println("Optimal");
        } else {
            System.out.println("Hm ...");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'messwert >= 35 && messwert <= 65',
      data: [-1000, -1, 0, 34, 35, 36, 50, 64, 65, 66, 100, 1000],
      params: ['messwert'],
      driver(el, oracle) {
        if (oracle(intEnv(['messwert', el]))) {
          return 'Optimal'
        } else {
          return 'Hm ...'
        }
      },
    },
  },
  9: {
    id: 9,
    title: 'Wochenende',
    code: `
class Wochenende {
    // tag ist 1 (Mo) bis 7 (So)
    void hochDieHände(byte tag) {
        if (___placeholder___) {
            System.out.println("Wochenende!");
        } else {
            System.out.println("Leider kein Wochenende!");
        }
    } 
}
    `.trim(),
    checker: {
      reference: 'tag == 6 || tag == 7',
      data: [1, 2, 3, 4, 5, 6, 7],
      params: ['tag'],
      driver(el, oracle) {
        if (oracle(intEnv(['tag', el]))) {
          return 'Wochenende!'
        } else {
          return 'Leider kein Wochenende!'
        }
      },
    },
  },
  16: {
    id: 16,
    title: 'Spielfeld',
    code: `
class Spielfeld {
    // Das Feld ist 8x8
    // Gültige Koordinaten sind 0 bis 7
    void istImFeld(int x, int y) {
        if (___placeholder___) {
            throw new OutOfFieldException(); 
        }
    }
}
    `.trim(),
    checker: {
      reference: '!(x >= 0 && x < 8 && y >= 0 && y < 8)',
      data: [
        [0, 0],
        [0, 7],
        [7, 0],
        [7, 7],
        [3, 4],
        [4, 3],
        [-1, 0],
        [0, -1],
        [-1, -1],
        [8, 0],
        [0, 8],
        [8, 8],
        [7, 8],
        [8, 7],
        [-1, 7],
        [7, -1],
        [-2147483648, 3],
        [2147483647, 3],
        [3, -2147483648],
        [3, 2147483647],
        [2147483647, -2147483648],
        [-2147483648, 2147483647],
      ],
      params: ['x', 'y'],
      driver(el, oracle) {
        const [x, y] = el
        if (oracle(intEnv(['x', x], ['y', y]))) {
          return '<OutOfFieldException>'
        } else {
          return '<keine Ausgabe>'
        }
      },
    },
  },
  17: {
    id: 17,
    title: 'Achterbahn',
    code: `
class Achterbahn {
    // Mindestens 12 Jahre und mindestens 140 cm groß
    void darfOlympiaLoopingFahren(int alter, int größe) {
        if (___placeholder___) {
            System.out.println("Viel Spaß!");
        } else {
            System.out.println("Leider nicht möglich.");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'alter >= 12 && größe >= 140',
      data: [
        [11, 139],
        [12, 140],
        [11, 140],
        [12, 139],
        [13, 141],
        [10, 150],
        [15, 120],
        [5, 100],
        [100, 200],
        [-1, 200],
        [200, -1],
        [-2147483648, -2147483648],
        [2147483647, 2147483647],
        [11, 2147483647],
        [2147483647, 139],
        [-2147483648, 2147483647],
      ],
      params: ['alter', 'größe'],
      driver(el, oracle) {
        const [alter, größe] = el
        if (oracle(intEnv(['alter', alter], ['größe', größe]))) {
          return 'Viel Spaß!'
        } else {
          return 'Leider nicht möglich.'
        }
      },
    },
  },
  18: {
    id: 18,
    title: 'Geheimnis',
    code: `
class Geheimnis {
    void istHierWasVersteckt() {
        if (___placeholder___) {
            // Diese Zeile nie ausführen.
            System.out.println("Das sieht niemand.");
        }
        System.out.println("Fertig.");
    }
}
    `.trim(),
    checker: {
      reference: 'false',
      data: [0],
      params: [],
      driver(_el, oracle) {
        if (oracle(env())) {
          return 'Das sieht niemand. Fertig.'
        } else {
          return 'Fertig.'
        }
      },
    },
  },
}
