import type { QuestData } from '../../state/types'
import { charEnv, doubleEnv, intEnv, longEnv } from './helpers'

export const chapter01Quests: { [key: number]: QuestData } = {
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
      params: ['zahl'],
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
      data: [-2147483648, -1000, -100, -5, -1, 0, 1, 5, 100, 1000],
      params: ['zahl'],
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
    title: 'Level Up',
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
      data: [-1000, -1, 0, 60, 119, 120, 121, 200, 1000, 2147483647],
      params: ['xp'],
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
      params: ['code'],
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
      data: [-5, -1, 0, 5, 17, 18, 19, 100, 1000, 2147483647],
      params: ['alter'],
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
      params: ['a', 'b'],
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
  8: {
    id: 8,
    title: 'Kompass',
    code: `
class Kompass {
    // richtung ist ein Großbuchstabe
    // wie 'N', 'O', 'S', 'W'
    void istNorden(char richtung) {
        if (___placeholder___) {
            System.out.println("Hier geht es lang!");
        } else {
            System.out.println("Drehe dich weiter..."); 
        }
    }
}
    `.trim(),
    checker: {
      reference: "richtung == 'N'",
      data: [78, 79, 83, 87, 110, 48],
      params: ['richtung'],
      driver(el, oracle) {
        if (oracle(charEnv(['richtung', el]))) {
          return 'Hier geht es lang!'
        } else {
          return 'Drehe dich weiter...'
        }
      },
    },
  },
  9: {
    id: 9,
    title: 'Guthaben',
    code: `
class Guthaben {
    // benötigte Credits dürfen Guthaben nicht überschreiten
    void reichtEs(int benötigt, int guthaben) {
        if (___placeholder___) {
            System.out.println("Auftrag freigegeben!");
            return;
        }
        throw new GuthabenException();
    }
}
    `.trim(),
    checker: {
      reference: 'guthaben >= benötigt',
      data: [
        [10, 20],
        [20, 20],
        [20, 10],
        [0, 0],
        [-5, -5],
        [-5, 5],
        [5, -5],
        [100, -100],
      ],
      params: ['benötigt', 'guthaben'],
      driver(el, oracle) {
        const [benötigt, guthaben] = el
        if (oracle(intEnv(['benötigt', benötigt], ['guthaben', guthaben]))) {
          return 'Auftrag freigegeben!'
        }
        return '<GuthabenException>'
      },
    },
  },
  10: {
    id: 10,
    title: 'Billionär',
    code: `
class Billionär {
    void bistDuReich(long vermögen) {
        if (___placeholder___) {
            System.out.print("Billionär. ");
            System.out.println("Unsympathisch..."); 
        }
    }
}
    `.trim(),
    checker: {
      reference: 'vermögen >= 1_000_000_000_000L',
      data: [
        -1_000_000_000_000n,
        0n,
        1n,
        2_000_000_000n,
        999_999_999_999n,
        1_000_000_000_000n,
        1_000_000_000_001n,
        2_000_000_000_000n,
        9_000_000_000_000n,
        100_000_000_000_000n,
      ],
      params: ['vermögen'],
      driver(el, oracle) {
        if (oracle(longEnv(['vermögen', el]))) {
          return 'Billionär. Unsympathisch...'
        }
        return '<keine Ausgabe>'
      },
    },
  },
  11: {
    id: 11,
    title: 'Vier Gewinnt',
    code: `
class VierGewinnt {
    // Du bestehst bis 4.0
    void vierGewinnt(double note) {
        boolean bestanden = ___placeholder___;
        if (bestanden) {
            System.out.println("Bestanden!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'note <= 4.0',
      data: [1.0, 1.3, 2.0, 2.7, 3.0, 3.7, 4.0, 4.05, 4.3, 5.0, 6.0],
      params: ['note'],
      driver(el, oracle) {
        if (oracle(doubleEnv(['note', el]))) {
          return 'Bestanden!'
        }
        return '<keine Ausgabe>'
      },
    },
  },
  7: {
    id: 7,
    title: 'Gleichstand',
    code: `
class Gleichstand {
    // Bei gleichem Punktestand geht das Spiel weiter
    void istGleichstand(int punkteHeim, int punkteAuswärts) {
        if (___placeholder___) {
            System.out.println("WEITERSPIELEN!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'punkteHeim == punkteAuswärts',
      data: [
        [0, 0],
        [1, 1],
        [2, 3],
        [3, 2],
        [5, 5],
        [10, 0],
        [-1, -1],
        [-1, 1],
      ],
      params: ['punkteHeim', 'punkteAuswärts'],
      driver(el, oracle) {
        const [punkteHeim, punkteAuswärts] = el
        if (
          oracle(
            intEnv(
              ['punkteHeim', punkteHeim],
              ['punkteAuswärts', punkteAuswärts],
            ),
          )
        ) {
          return 'WEITERSPIELEN!'
        }
        return '<keine Ausgabe>'
      },
    },
  },
}
