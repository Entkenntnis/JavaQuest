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
}
