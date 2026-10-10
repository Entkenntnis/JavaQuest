import type { QuestData } from '../../state/types'
import {
  charEnv,
  doubleEnv,
  intEnv,
  readCharLocal,
  readDoubleLocal,
  readIntLocal,
} from './helpers'

const MAX_ITER = 1000

export const chapter03Quests: { [key: number]: QuestData } = {
  21: {
    id: 21,
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
        while (true) {
          const env = intEnv(['i', i])
          const weiter = oracle(env)
          i = readIntLocal(env, 'i', i)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push(i + '. ')
          i = (i - 1) | 0
        }
        output.push('Los!')
        return output.join('')
      },
    },
  },

  22: {
    id: 22,
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
        while (true) {
          const env = intEnv(['i', i])
          const weiter = oracle(env)
          i = readIntLocal(env, 'i', i)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push('Ho ')
          i = (i + 1) | 0
        }
        return output.join('')
      },
    },
  },

  23: {
    id: 23,
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
        while (true) {
          const env = intEnv(['count', count])
          const weiter = oracle(env)
          count = readIntLocal(env, 'count', count)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push('A')
          count = (count + 1) | 0
        }
        output.push('!')
        return output.join('')
      },
    },
  },

  24: {
    id: 24,
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
        while (true) {
          const env = charEnv(['c', c])
          const weiter = oracle(env)
          c = readCharLocal(env, 'c', c)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push(String.fromCharCode(c))
          c = (c + 1) & 0xffff
        }
        return output.join('')
      },
    },
  },

  25: {
    id: 25,
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
        while (true) {
          const env = intEnv(['n', n])
          const weiter = oracle(env)
          n = readIntLocal(env, 'n', n)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push(n + ' ')
          n = n % 2 === 0 ? n / 2 : 3 * n + 1
        }
        output.push('1.')
        return output.join('')
      },
    },
  },

  26: {
    id: 26,
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
        while (true) {
          const env = doubleEnv(['preis', preis])
          const weiter = oracle(env)
          preis = readDoubleLocal(env, 'preis', preis)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          preis *= 1.03
          jahre++
        }
        output.push(jahre + ' Jahre')
        return output.join('')
      },
    },
  },

  27: {
    id: 27,
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
        while (true) {
          const env = doubleEnv(['mehl', mehl], ['butter', butter])
          const weiter = oracle(env)
          mehl = readDoubleLocal(env, 'mehl', mehl)
          butter = readDoubleLocal(env, 'butter', butter)
          if (!weiter) break
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
          output.push('Teig! ')
          mehl -= 0.8
          butter -= 0.4
        }
        return output.join('')
      },
    },
  },
}
