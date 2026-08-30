import type { QuestData } from '../state/types'

export const questsData: { [key: number]: QuestData } = {
  1: {
    id: 1,
    title: 'Triff eine Entscheidung!',
    code: 'class Program {\n  public static void main(String[] args) {\n    System.out.println(___placeholder___);\n  }\n}',
  },
  2: {
    id: 2,
    title: 'Ich-weiß-nicht',
    code: 'public class Program { ___placeholder___ }',
  },
}
