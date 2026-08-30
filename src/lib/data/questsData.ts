import type { QuestData } from '../state/types'

export const questsData: { [key: number]: QuestData } = {
  1: {
    id: 1,
    title: 'Willkommen',
    code: `
public class Willkommen {

    public void dasIstMeineLieblingszahl(int zahl) {
        if (zahl == 67) {
            System.out.println("Geh in die Ecke und schäm dich.");
        }
        if (___placeholder___) {
            System.out.println("Cool, das ist die Antwort auf das Leben!");
            // Die Antwort ist das Ergebnis von 6 + 4 * 9
        }
    }
}
    `.trim(),
  },
  2: {
    id: 2,
    title: 'Ich-weiß-nicht',
    code: 'public class Program { ___placeholder___ }',
  },
}
