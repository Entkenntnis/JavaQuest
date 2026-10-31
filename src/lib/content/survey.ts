export interface SurveyQuestion {
  id: string
  text: string
}

export const CORE_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q1',
    text: 'Ich kann einen booleschen Ausdruck aufstellen, der eine in natürlicher Sprache beschriebene Bedingung repräsentiert.',
  },
  {
    id: 'q2',
    text: 'Ich fühle mich verwirrt, wenn boolesche Ausdrücke kompliziert werden.',
  },
  {
    id: 'q3',
    text: 'Ich kann boolesche Ausdrücke auswerten, die mir in einem Programm begegnen.',
  },
  {
    id: 'q4',
    text: 'Ich habe Zweifel, ob ich boolesche Ausdrücke korrekt aufstellen kann.',
  },
  {
    id: 'q5',
    text: 'Ich kann Fehler in booleschen Ausdrücken identifizieren und beheben.',
  },
  {
    id: 'q6',
    text: 'Ich mache mir Sorgen, wenn ich Fehler in booleschen Ausdrücken finden und beheben muss.',
  },
  {
    id: 'q7',
    text: 'Ich kann ein korrekt funktionierendes Programm schreiben, auch wenn ich bereits Stunden mit der Fehlerbehebung verbracht habe und gerade einen neuen Fehler entdeckt habe.',
  },
  {
    id: 'q8',
    text: 'Ich fühle mich verwirrt, wenn die Programmzeilen kompliziert werden.',
  },
  {
    id: 'q9',
    text: 'Ich kann die Ausführung eines Programms korrekt nachvollziehen, auch wenn meine früheren Versuche, ähnliche Programme nachzuvollziehen, nicht erfolgreich waren.',
  },
  {
    id: 'q10',
    text: 'Es macht mir Angst, dass es im Programmierunterricht zu viele Themen zu lernen gibt.',
  },
  {
    id: 'q11',
    text: 'Ich kann die Ausführung eines Programms nachvollziehen.',
  },
  {
    id: 'q12',
    text: 'Ich habe Zweifel, ob ich beim Programmieren die für die Lösung notwendigen Schritte (den Algorithmus) richtig erstellen kann.',
  },
]

export const SCALE_5 = [1, 2, 3, 4, 5] as const
export const SCALE_7 = [1, 2, 3, 4, 5, 6, 7] as const
export const SURVEY_VERSION = 1
