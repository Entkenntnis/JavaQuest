import type { QuestData } from '../../state/types'

export const chapter04Quests: { [key: number]: QuestData } = {
  100: {
    id: 100,
    title: 'Hauptstadt',
    code: `
class Hauptstadt
    void vonDeutschlandIst(String stadt) {
        if (___placeholder___) {
            System.out.println("richtig!");
        } else {
            System.out.println("falsch...");
        }
    }
}

    `.trim(),
    checker: {
      reference: '',
      data: [],
      params: ['stadt'],
      driver() {
        return 'x'
      },
    },
  },
}
