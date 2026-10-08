import type { QuestData } from '../../state/types'
import { intEnv } from './helpers'

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
}
