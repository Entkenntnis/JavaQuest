import type { QuestData } from '../../state/types'
import { intEnv } from './helpers'

export const chapter04Quests: { [key: number]: QuestData } = {
  30: {
    id: 30,
    title: 'Gerade oder ungerade',
    code: `
class GeradeOderUngerade {
    // Eine gerade Zahl lässt sich 
    // ohne Rest durch 2 teilen
    void prüfe(int zahl) {
        if (___placeholder___) {
            System.out.println("Gerade!");
        } else {
            System.out.println("Ungerade.");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'zahl % 2 == 0',
      data: [
        -2147483648, -1000, -43, -2, -1, 0, 1, 2, 42, 43, 1000, 2147483647,
      ],
      params: ['zahl'],
      driver(el, oracle) {
        if (oracle(intEnv(['zahl', el]))) {
          return 'Gerade!'
        }
        return 'Ungerade.'
      },
    },
  },

  33: {
    id: 33,
    title: 'Teilbarkeit',
    code: `
class Teilbarkeit {
    // Prüfe, ob zahl ohne Rest durch teiler teilbar ist
    void istTeilbar(int zahl, int teiler) {
        if (___placeholder___) {
            System.out.println("Teilbar!");
        } else {
            System.out.println("Nicht teilbar.");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'zahl % teiler == 0',
      data: [
        [10, 2],
        [10, 5],
        [10, 1],
        [0, 7],
        [12, 3],
        [-12, 3],
        [12, -3],
        [-12, -3],
        [100, 10],
        [2147483647, 1],
        [-2147483648, 2],
        [10, 3],
        [10, 4],
        [7, 2],
        [-12, 5],
        [12, 5],
        [1, 2],
        [-2147483648, 3],
      ],
      params: ['zahl', 'teiler'],
      driver(el, oracle) {
        const [zahl, teiler] = el
        if (oracle(intEnv(['zahl', zahl], ['teiler', teiler]))) {
          return 'Teilbar!'
        }
        return 'Nicht teilbar.'
      },
    },
  },

  8: {
    id: 8,
    title: 'Pythagoras',
    code: `
class Pythagoras {
    // Nutze den Satz des Pythagoras.
    // c ist die längste Seite.
    void prüfeRechtwinklig(int a, int b, int c) {
        if (___placeholder___) {
            System.out.println("Hurra! Rechtwinklig!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'a * a + b * b == c * c',
      data: [
        [3, 4, 5],
        [4, 3, 5],
        [6, 8, 10],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
        [9, 12, 15],
        [20, 21, 29],
        [1, 1, 1],
        [3, 4, 6],
        [5, 5, 5],
        [2, 3, 4],
        [1, 2, 3],
        [10, 10, 15],
      ],
      params: ['a', 'b', 'c'],
      driver(el, oracle) {
        const [a, b, c] = el
        if (oracle(intEnv(['a', a], ['b', b], ['c', c]))) {
          return 'Hurra! Rechtwinklig!'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  31: {
    id: 31,
    title: 'Nachbarn',
    code: `
class Nachbarn {
    // Der Abstand muss genau 1 sein
    void sindNebeneinander(int a, int b) {
        if (___placeholder___) {
            System.out.println("Nachbarn!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'Math.abs(a - b) == 1',
      data: [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 2],
        [2, 4],
        [-1, -2],
        [-2, -1],
        [-5, 5],
        [5, -5],
        [10, 11],
        [10, 12],
        [3, 3],
        [-2147483648, 2147483647],
        [2147483647, -2147483648],
        [2147483647, 2147483647],
        [-2147483648, -2147483648],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        if (oracle(intEnv(['a', a], ['b', b]))) {
          return 'Nachbarn!'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  32: {
    id: 32,
    title: 'Potenz',
    code: `
class Potenz {
    // Prüfe, ob basis^exp gleich wert ist
    boolean stimmt(int basis, int exp, int wert) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'Math.pow(basis, exp) == wert',
      data: [
        [2, 0, 1],
        [2, 1, 2],
        [2, 2, 4],
        [2, 3, 8],
        [2, 4, 16],
        [2, 5, 32],
        [2, 10, 1024],
        [3, 0, 1],
        [3, 1, 3],
        [3, 2, 9],
        [3, 3, 27],
        [3, 4, 81],
        [3, 5, 243],
        [5, 3, 125],
        [10, 4, 10000],
        [-2, 3, -8],
        [-2, 4, 16],
        [0, 0, 1],
        [0, 5, 0],
        [1, 100, 1],
        [2, 3, 9],
        [2, 4, 15],
        [3, 3, 26],
        [5, 2, 24],
        [0, 5, 1],
        [2, -1, 0],
        [2, 0, 0],
        [-2, 3, 8],
        [1, 100, 2],
      ],
      params: ['basis', 'exp', 'wert'],
      driver(el, oracle) {
        const [basis, exp, wert] = el
        if (oracle(intEnv(['basis', basis], ['exp', exp], ['wert', wert]))) {
          return 'true'
        }
        return 'false'
      },
    },
  },

  34: {
    id: 34,
    title: 'Diskriminante',
    code: `
class Diskriminante {
    // Prüfe, ob ax² + bx + c = 0 zwei Lösungen hat 
    // Nutze D = b² - 4ac (muss positiv sein)
    boolean hatZweiLösungen(int a, int b, int c) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'b * b - 4 * a * c > 0',
      data: [
        [1, 0, -1],
        [1, -5, 6],
        [1, 1, -2],
        [2, -7, 3],
        [1, -1, -6],
        [2, 3, -2],
        [-1, 0, 4],
        [1, -10, 24],
        [1, -2, 1],
        [1, 0, 1],
        [1, 2, 3],
        [1, -6, 9],
        [3, 4, 5],
        [1, 2, 1],
        [5, -2, 1],
        [1, -10, 25],
      ],
      params: ['a', 'b', 'c'],
      driver(el, oracle) {
        const [a, b, c] = el
        if (oracle(intEnv(['a', a], ['b', b], ['c', c]))) {
          return 'true'
        }
        return 'false'
      },
    },
  },

  35: {
    id: 35,
    title: 'Skalarprodukt',
    code: `
class Skalarprodukt {
    // Prüfe, ob v und w orthogonal sind
    // (Skalarprodukt muss null sein)
    boolean sindOrthogonal(int vx, int vy, int wx, int wy) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'vx * wx + vy * wy == 0',
      data: [
        [1, 0, 0, 1],
        [1, 0, 0, -1],
        [0, 1, 1, 0],
        [3, 0, 0, 5],
        [1, 2, -2, 1],
        [2, 3, -3, 2],
        [1, -1, 1, 1],
        [-4, 1, 1, 4],
        [5, 5, -1, 1],
        [0, 0, 7, 9],
        [1, 0, 1, 0],
        [1, 1, 1, 1],
        [2, 3, 1, 1],
        [3, 4, 4, 3],
        [1, 2, 2, 1],
        [2, -3, -2, 1],
        [0, 1, 0, 1],
        [6, 8, 1, 0],
      ],
      params: ['vx', 'vy', 'wx', 'wy'],
      driver(el, oracle) {
        const [vx, vy, wx, wy] = el
        if (oracle(intEnv(['vx', vx], ['vy', vy], ['wx', wx], ['wy', wy]))) {
          return 'true'
        }
        return 'false'
      },
    },
  },

  36: {
    id: 36,
    title: 'Nullstelle',
    code: `
class Nullstelle {
    // Prüfe, ob x für ax² + bx + c eine Nullstelle ist 
    boolean istNullstelle(int a, int b, int c, int x) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'a * x * x + b * x + c == 0',
      data: [
        [1, 0, -1, 1],
        [1, 0, -1, -1],
        [1, -5, 6, 2],
        [1, -5, 6, 3],
        [1, 1, -2, 1],
        [1, 1, -2, -2],
        [2, -7, 3, 3],
        [2, 3, -2, -2],
        [1, -10, 24, 4],
        [1, -10, 24, 6],
        [1, 2, 1, -1],
        [-1, 0, 4, 2],
        [-1, 0, 4, -2],
        [1, 0, 0, 0],
        [1, 0, -1, 0],
        [1, 0, -1, 2],
        [1, -5, 6, 0],
        [1, -5, 6, 1],
        [1, 1, -2, 0],
        [1, 1, -2, 2],
        [2, -7, 3, 2],
        [2, -7, 3, 4],
        [1, -10, 24, 5],
        [1, 2, 1, 0],
        [1, 2, 1, -2],
        [1, 0, 0, 5],
        [1, 0, 0, -3],
        [1, 0, 1, 1],
        [1, 0, 1, 0],
      ],
      params: ['a', 'b', 'c', 'x'],
      driver(el, oracle) {
        const [a, b, c, x] = el
        if (oracle(intEnv(['a', a], ['b', b], ['c', c], ['x', x]))) {
          return 'true'
        }
        return 'false'
      },
    },
  },
}
