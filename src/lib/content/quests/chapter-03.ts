import type { QuestData } from '../../state/types'
import { intEnv } from './helpers'

export const chapter03Quests: { [key: number]: QuestData } = {
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
}
