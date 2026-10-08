import type { QuestData } from '../../state/types'
import { charEnv, doubleEnv, intEnv } from './helpers'

const MAX_ITER = 1000

export const chapter03Quests: { [key: number]: QuestData } = {
  23: {
    id: 23,
    title: 'Auf die Plätze',
    code: `
class AufDiePlätze {
    // Zähle von 5 bis 1 runter
    void fertig() {
        for (int i = 5; ___placeholder___; i--) {  
            System.out.print(i + ". ");
        }
        System.out.println("Los!");
    }
}
    `.trim(),
    checker: {
      reference: 'i >= 1',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let i = 5
        let schritte = 0
        while (oracle(intEnv(['i', i]))) {
          output.push(i + '. ')
          i--
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        output.push('Los!')
        return output.join('')
      },
    },
  },

  24: {
    id: 24,
    title: 'Ho Ho Ho',
    code: `
class Weihnachtsmann {
    // Sage dreimal "Ho"
    void klopfKlopf() {
        for (int i = 0; ___placeholder___; i++) {  
            System.out.print("Ho ");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'i < 3',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let i = 0
        let schritte = 0
        while (oracle(intEnv(['i', i]))) {
          output.push('Ho ')
          i++
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        return output.join('')
      },
    },
  },

  25: {
    id: 25,
    title: 'Der Schrei',
    code: `
class DerSchrei {
    // Gib 42 mal "A" aus
    void aaaaaa() {
        int count = 0;
        while (___placeholder___) {
            System.out.print('A');
            count += 1;
        }
        System.out.println('!');
    }
}
    `.trim(),
    checker: {
      reference: 'count < 42',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let count = 0
        let schritte = 0
        while (oracle(intEnv(['count', count]))) {
          output.push('A')
          count += 1
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        output.push('!')
        return output.join('')
      },
    },
  },

  26: {
    id: 26,
    title: 'Alphabet',
    code: `
class Alphabet {
    // Gib das Alphabet von 'a' bis 'z' aus 
    void unserAlphabet() {
        char c = 'a';
        while (___placeholder___) {
            System.out.print(c);
            c += 1;
        }
    }
}
    `.trim(),
    checker: {
      reference: "c <= 'z'",
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let c = 'a'.charCodeAt(0)
        let schritte = 0
        while (oracle(charEnv(['c', c]))) {
          output.push(String.fromCharCode(c))
          c += 1
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        return output.join('')
      },
    },
  },

  27: {
    id: 27,
    title: 'Collatz',
    code: `
class Collatz {
    // Die Collatz-Zahlenfolge endet bei der 1  
    void zahlenfolge() {
        int n = 7;
        while (___placeholder___) {
            System.out.print(n + " "); 
            if (n % 2 == 0) {
                n = n / 2;
            } else {
                n = 3 * n + 1;
            }
        }
        System.out.println("1.");
    }
}
    `.trim(),
    checker: {
      reference: 'n != 1',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let n = 7
        let schritte = 0
        while (oracle(intEnv(['n', n]))) {
          output.push(n + ' ')
          n = n % 2 === 0 ? n / 2 : 3 * n + 1
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        output.push('1.')
        return output.join('')
      },
    },
  },

  28: {
    id: 28,
    title: 'Inflation',
    code: `
class Inflation {
    // Wie viele Jahre bis zur Verdopplung?
    void berechneJahre() {
        double preis = 500;
        int jahre = 0;
        while (___placeholder___) {
            preis *= 1.03; // 3 % Inflation
            jahre++;
        }
        System.out.println(jahre + " Jahre"); 
    }
}
    `.trim(),
    checker: {
      reference: 'preis < 1000',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let preis = 500
        let jahre = 0
        let schritte = 0
        while (oracle(doubleEnv(['preis', preis]))) {
          preis *= 1.03
          jahre++
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        output.push(jahre + ' Jahre')
        return output.join('')
      },
    },
  },

  29: {
    id: 29,
    title: 'Weihnachtsbäckerei',
    code: `
class Weihnachtsbäckerei {
    // Backe, solange Mehl und Butter reichen
    void leckerei() {
        double mehl = 7.0;
        double butter = 3.0;
        while (___placeholder___) {
            System.out.print("Teig! ");
            mehl -= 0.8;
            butter -= 0.4;
        }
    }
}
    `.trim(),
    checker: {
      reference: 'mehl >= 0.8 && butter >= 0.4',
      data: [null],
      params: [],
      driver(_el, oracle) {
        const output: string[] = []
        let mehl = 7.0
        let butter = 3.0
        let schritte = 0
        while (oracle(doubleEnv(['mehl', mehl], ['butter', butter]))) {
          output.push('Teig! ')
          mehl -= 0.8
          butter -= 0.4
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        return output.join('')
      },
    },
  },
}
