import type { JavaEnvironment, QuestData } from '../state/types'

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
      data: [0, 41, 42, 43, 60, 66, 67, 68, 76, 24, 100, -100, -1000, 10000],
      driver(el, oracle) {
        if (el == 67) {
          return 'Geh in die Ecke.'
        }
        const env: JavaEnvironment = {
          local: { zahl: { type: 'int', value: el } },
          heap: {},
        }
        const value = oracle(env)
        if (typeof value === 'string') return value
        if (value) {
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
            System.exit();
        }
        System.out.println("Zugang gewährt");
    }
}
    `.trim(),
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
  },
}
