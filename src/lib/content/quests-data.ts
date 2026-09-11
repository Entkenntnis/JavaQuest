import type { JavaEnvironment, QuestData } from '../state/types'

function intEnv(...entries: [string, number][]): JavaEnvironment {
  const env: JavaEnvironment = {
    local: {},
    heap: {},
  }
  for (const [name, value] of entries) {
    env.local[name] = { type: 'int', value }
  }
  return env
}

export const questsData: { [key: number]: QuestData } = {
  1: {
    id: 1,
    title: 'Willkommen',
    code: `
class Willkommen {
    void meineLieblingszahlIst(int zahl) {
        if (zahl == 67) {
            System.out.println("Geh in die Ecke.");
        } else if (___placeholder___) {
            System.out.println("42 ist eine coole Zahl!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'zahl == 42',
      data: [-1000, 0, 41, 42, 43, 66, 67, 68, 100],
      driver(el, oracle) {
        if (el == 67) {
          return 'Geh in die Ecke.'
        }
        if (oracle(intEnv(['zahl', el]))) {
          return '42 ist eine coole Zahl!'
        }
        return '<keine Ausgabe>'
      },
    },
  },
  2: {
    id: 2,
    title: 'Vorzeichen',
    code: `
class Vorzeichen {
    String vorzeichen(int zahl) {     
        if (zahl > 0) {
            return "positiv";
        } else if (___placeholder___) {
            return "negativ";
        } else {
            return "zero";
        }
    }
}
    `.trim(),
    checker: {
      reference: 'zahl < 0',
      data: [-1000, -100, -5, -1, 0, 1, 5, 100, 1000],
      driver(el, oracle) {
        if (el > 0) {
          return 'positiv'
        }
        if (oracle(intEnv(['zahl', el]))) {
          return 'negativ'
        }
        return 'zero'
      },
    },
  },
  3: {
    id: 3,
    title: 'LevelUp',
    code: `
class LevelUp {
    // Aufstieg bei 120 oder mehr XP
    void kannAufsteigen(int xp) {
        if (___placeholder___) {
            System.out.println("LevelUp möglich!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'xp >= 120',
      data: [-1000, -1, 0, 60, 119, 120, 121, 200, 1000],
      driver(el, oracle) {
        if (oracle(intEnv(['xp', el]))) {
          return 'LevelUp möglich!'
        }
        return '<keine Ausgabe>'
      },
    },
  },
  4: {
    id: 4,
    title: 'Passwort',
    code: `
class Passwort {
    // Der korrekte Code lautet 2026
    void testePasswort(int code) {
        if (___placeholder___) {
            System.out.println("Falsches Passwort");
            System.exit(1);
        }
        System.out.println("Zugang gewährt");
    }
}
    `.trim(),
    checker: {
      reference: 'code != 2026',
      data: [-1000, -1, 0, 1, 100, 2025, 2026, 2027, 100000],
      driver(el, oracle) {
        if (oracle(intEnv(['code', el]))) {
          return 'Falsches Passwort'
        } else {
          return 'Zugang gewährt'
        }
      },
    },
  },
  5: {
    id: 5,
    title: 'Altersfreigabe',
    code: `
class Altersfreigabe {
    void prüfeAlter(int alter) {
        if (___placeholder___) {
            System.out.println("Volljährig");
        } else {
            System.out.println("Minderjährig");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'alter >= 18',
      data: [-5, -1, 0, 5, 17, 18, 19, 100, 1000],
      driver(el, oracle) {
        if (oracle(intEnv(['alter', el]))) {
          return 'Volljährig'
        } else {
          return 'Minderjährig'
        }
      },
    },
  },
  6: {
    id: 6,
    title: 'Zahlenvergleich',
    code: `
class Zahlenvergleich {
    void größer(int a, int b) {
        if (a > b) {
            System.out.println("a ist größer");
        } else if (___placeholder___) {
            System.out.println("b ist größer"); 
        } else {
            System.out.println("gleich");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'b > a',
      data: [
        [0, 0],
        [1, 2],
        [2, 1],
        [-1, 1],
        [1, -1],
        [5, 5],
        [100, 2],
        [2, 100],
        [-100, -200],
      ],
      driver(el, oracle) {
        const [a, b] = el
        if (a > b) {
          return 'a ist größer'
        } else if (oracle(intEnv(['a', a], ['b', b]))) {
          return 'b ist größer'
        } else {
          return 'gleich'
        }
      },
    },
  },
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
      driver(el, oracle) {
        if (oracle(intEnv(['messwert', el]))) {
          return 'Optimal'
        } else {
          return 'Hm ...'
        }
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
        if (      ___placeholder___      ) {
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
      driver(el, oracle) {
        const [a, b, c] = el
        if (oracle(intEnv(['a', a], ['b', b], ['c', c]))) {
          return 'Hurra! Rechtwinklig!'
        }
        return '<keine Ausgabe>'
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
        if ( ___placeholder___) {
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
      driver(el, oracle) {
        if (oracle(intEnv(['tag', el]))) {
          return 'Wochenende!'
        } else {
          return 'Leider kein Wochenende!'
        }
      },
    },
  },
}
