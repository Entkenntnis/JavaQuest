import type { QuestData } from '../../state/types'
import { intEnv, mergeEnv, rawStringsEnv, stringEnv } from './helpers'

const MAX_ITER = 1000

export const chapter05Quests: { [key: number]: QuestData } = {
  37: {
    id: 37,
    title: 'Gleichheit',
    code: `
class Gleichheit {
    // Vergleiche zwei Strings auf ihren Inhalt.
    void sindSieGleich(String a, String b) {
        if (___placeholder___) {
            System.out.println("Sie sind gleich.");
        } else {
            System.out.println("Strings sind ungleich.");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'a.equals(b)',
      data: [
        ['Hallo', 'Hallo'],
        ['Hallo', 'hallo'],
        ['Java', 'Java'],
        ['Java', 'JavaScript'],
        ['', ''],
        ['', 'x'],
        ['a', 'a'],
        ['a', 'b'],
        ['abc', 'abd'],
        ['Welt', 'Welt'],
        ['Test', 'test'],
        ['xyz', 'xyz'],
        ['Straße', 'Straße'],
        ['Straße', 'strasse'],
        ['😀', '😀'],
        ['😀', '😁'],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        if (oracle(rawStringsEnv(['a', a], ['b', b]))) {
          return 'Sie sind gleich.'
        }
        return 'Strings sind ungleich.'
      },
    },
  },

  38: {
    id: 38,
    title: 'Sein oder Nichtsein',
    code: `
class SeinOderNichtSein {
    void prüfeExistenz(String str) {
        if (___placeholder___) {
            System.out.println("String ist nicht leer");
        }
    }
}
    `.trim(),
    checker: {
      reference: '!str.isEmpty()',
      data: ['', 'a', ' ', 'Hallo', '\n', '  ', 'x', '0', 'Hallo Welt'],
      params: ['str'],
      driver(el, oracle) {
        if (oracle(stringEnv(['str', el]))) {
          return 'String ist nicht leer'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  39: {
    id: 39,
    title: 'Passwortsicherheit 1',
    code: `
class Passwortsicherheit1 {
    // Mindestens 8 Zeichen
    void prüfeLänge(String pw) {
        if (___placeholder___) {
            throw new InsecurePasswortException(); 
        }
    }
}
    `.trim(),
    checker: {
      reference: 'pw.length() < 8',
      data: [
        '',
        'a',
        'kurz',
        'passwort',
        'kurzesPasswort',
        'genau8Ze',
        'genau8Zei',
        'noch viel länger',
        '!!!!!!!!',
        '1234567',
        '12345678',
        'Sicher!123456',
        'qwerty',
        '😀😀😀😀',
      ],
      params: ['pw'],
      driver(el, oracle) {
        if (oracle(stringEnv(['pw', el]))) {
          return '<InsecurePasswortException>'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  40: {
    id: 40,
    title: 'Passwortsicherheit 2',
    code: `
class Passwortsicherheit2 {
    // Mindestens 12 Zeichen und das Zeichen '!'
    void prüfeLänge(String pw) {
        if (___placeholder___) {
            throw new InsecurePasswortException(); 
        }
    }
}
    `.trim(),
    checker: {
      reference: 'pw.length() < 12 || !pw.contains("!")',
      data: [
        '',
        'a',
        'kurz',
        'a!',
        'kurz!',
        '12345!',
        'kurzesPasswort',
        'kurzesPasswort!',
        'genau12Zeich',
        'genau12Zeichen',
        'genau12Zeich!',
        'genau12Zeiche!',
        'sicher!123456',
        'sicher123456!',
        'sicher1234567',
        'KeinSonderzeichen',
        '!'.repeat(12),
        'aaaaaaaaaaa!',
        'aaaaaaaaaaaa',
      ],
      params: ['pw'],
      driver(el, oracle) {
        if (oracle(stringEnv(['pw', el]))) {
          return '<InsecurePasswortException>'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  41: {
    id: 41,
    title: 'Dateiendung',
    code: `
class Dateiendung {
    // Endung wie ".java", ".JPG", ".exe"
    // Ignoriere Groß-/Kleinschreibung
    boolean istJavaDatei(String endung) {  
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'endung.equalsIgnoreCase(".java")',
      data: [
        '.java',
        '.JAVA',
        '.Java',
        '.jAvA',
        '.class',
        '.jar',
        '.js',
        '.exe',
        '.JPG',
        '.jav',
        '.java ',
        'java',
        '',
      ],
      params: ['endung'],
      driver(el, oracle) {
        if (oracle(stringEnv(['endung', el]))) {
          return 'true'
        }
        return 'false'
      },
    },
  },

  42: {
    id: 42,
    title: 'Links auffüllen',
    code: `
class LeftPad {
    // Fülle Text von links auf bis Länge erreicht
    String linksAuffüllen(String text, int länge) {
        String ergebnis = text;
        while (___placeholder___) {
            ergebnis = "_" + ergebnis;
        }
        return ergebnis;
    }
}
    `.trim(),
    checker: {
      reference: 'ergebnis.length() < länge',
      data: [
        ['42', 5],
        ['7', 3],
        ['', 4],
        ['12345', 3],
        ['abc', 3],
        ['abc', 6],
        ['0', 1],
        ['', 0],
        ['a', 10],
        ['Hallo', 2],
        ['😀', 4],
      ],
      params: ['text', 'länge'],
      driver(el, oracle) {
        const [text, länge] = el
        let ergebnis = text
        let schritte = 0
        while (
          oracle(
            mergeEnv(
              stringEnv(['text', text], ['ergebnis', ergebnis]),
              intEnv(['länge', länge]),
            ),
          )
        ) {
          ergebnis = '_' + ergebnis
          if (++schritte > MAX_ITER) return '<Endlosschleife>'
        }
        return ergebnis
      },
    },
  },

  43: {
    id: 43,
    title: 'E-Mail-Check',
    code: `
class EmailCheck {
    // Eine E-Mail enthält "@" und "."
    void siehtNachEmailAus(String text) {
        if (___placeholder___) {
            System.out.println("Könnt ne Mail sein");
        } else {
            System.out.println("nope");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'text.contains("@") && text.contains(".")',
      data: [
        'a@b.de',
        'test@example.com',
        'name@domain',
        'a.b',
        '@.',
        'nur-text',
        'at@',
        '.punkt',
        '@',
        '.',
        '',
        'email@sub.domain.org',
        'keine email',
        '😀@😀.😀',
      ],
      params: ['text'],
      driver(el, oracle) {
        if (oracle(stringEnv(['text', el]))) {
          return 'Könnt ne Mail sein'
        }
        return 'nope'
      },
    },
  },

  44: {
    id: 44,
    title: 'Suchbegriff',
    code: `
class Suchbegriff {
    // Der Begriff ist im Text enthalten
    // Der Begriff darf nicht leer sein
    void kommtVor(String text, String begriff) {
        if (___placeholder___) {
            System.out.println("Gefunden!");
        } else {
            System.out.println("Fehlanzeige");
        }
    }
}
    `.trim(),
    checker: {
      reference: '!begriff.isEmpty() && text.contains(begriff)',
      data: [
        ['Hallo Welt', 'Welt'],
        ['Hallo Welt', 'welt'],
        ['Hallo Welt', 'W'],
        ['Hallo Welt', ''],
        ['Hallo Welt', 'Hallo Welt'],
        ['', ''],
        ['', 'a'],
        ['abc', 'abc'],
        ['abc', 'abcd'],
        ['abc', 'bc'],
        ['JavaQuest', 'Java'],
        ['Programmieren', 'gramm'],
        ['😀😁', '😁'],
        ['😀😁', '😂'],
      ],
      params: ['text', 'begriff'],
      driver(el, oracle) {
        const [text, begriff] = el
        if (oracle(stringEnv(['text', text], ['begriff', begriff]))) {
          return 'Gefunden!'
        }
        return 'Fehlanzeige'
      },
    },
  },

  45: {
    id: 45,
    title: 'Längenvergleich',
    code: `
class Längenvergleich {
    void vergleiche(String a, String b) {
        if (___placeholder___) {
            System.out.println("A ist länger als B");
        } else {
            System.out.println("A nicht länger als B");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'a.length() > b.length()',
      data: [
        ['abc', 'ab'],
        ['ab', 'abc'],
        ['abc', 'abc'],
        ['', ''],
        ['a', ''],
        ['', 'a'],
        ['Hallo', 'Hallo Welt'],
        ['Hallo Welt', 'Hallo'],
        ['Java', 'C'],
        ['C', 'Java'],
        ['Straße', 'Strasse'],
        ['😀', 'ab'],
        ['😀', 'a'],
        ['ä', 'ae'],
        ['aa', 'ä'],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        if (oracle(stringEnv(['a', a], ['b', b]))) {
          return 'A ist länger als B'
        }
        return 'A nicht länger als B'
      },
    },
  },

  // Platziere als erste Aufgabe des Kapitels
  46: {
    id: 46,
    title: 'Hauptstadt',
    code: `
class Hauptstadt {
    void vonDeutschlandIst(String antwort) {
        if (___placeholder___) {
            System.out.println("RICHTIG!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'antwort.equals("Berlin")',
      data: [
        'Berlin',
        'berlin',
        'BERLIN',
        'Berlin ',
        ' Berlin',
        'Berlinz',
        'Berli',
        'Bonn',
        'Hamburg',
        'München',
        '',
      ],
      params: ['antwort'],
      driver(el, oracle) {
        if (oracle(rawStringsEnv(['antwort', el]))) {
          return 'RICHTIG!'
        }
        return '<keine Ausgabe>'
      },
    },
  },
}
