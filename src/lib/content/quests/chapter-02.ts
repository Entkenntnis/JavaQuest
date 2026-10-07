import type { QuestData } from '../../state/types'
import { intEnv } from './helpers'

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
}
