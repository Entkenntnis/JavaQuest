import type {
  ClassMetaData,
  JavaEnvironment,
  JavaHeapObject,
  JavaValue,
  QuestData,
} from '../../state/types'

const MAX_ITER = 1000

const beitragskontoMeta: ClassMetaData = {
  name: 'Beitragskonto',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'offeneBeiträge', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [
    {
      name: 'nochBeiträgeOffen',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

function beitragskontoEnv(offeneBeiträge: number): JavaEnvironment {
  return {
    local: {},
    heap: {
      self: {
        class: 'Beitragskonto',
        isInstance: true,
        fields: { offeneBeiträge: { type: 'int', value: offeneBeiträge } },
      },
    },
    contextMeta: { Beitragskonto: beitragskontoMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const knotenMeta: ClassMetaData = {
  name: 'Knoten',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [{ name: 'nächster', type: { kind: 'class', name: 'Knoten' } }],
  methods: [
    {
      name: 'länge',
      sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// Baut die Kette k0 -> k1 -> ... -> k{n-1} -> null und liefert den Heap zurück.
function knotenKette(n: number): JavaEnvironment['heap'] {
  const heap: JavaEnvironment['heap'] = {}
  for (let i = n - 1; i >= 0; i--) {
    heap[`k${i}`] = {
      class: 'Knoten',
      isInstance: true,
      fields: {
        nächster:
          i == n - 1
            ? { type: 'null', value: null }
            : { type: 'reference', ref: `k${i + 1}` },
      },
    }
  }
  return heap
}

const TEMPERATUR_MIN = 16
const TEMPERATUR_MAX = 28

const thermostatMeta: ClassMetaData = {
  name: 'Thermostat',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'temperatur', type: { kind: 'primitive', prim: 'int' } },
    { name: 'MIN', type: { kind: 'primitive', prim: 'int' } },
    { name: 'MAX', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [
    {
      name: 'setTemperatur',
      sig: {
        params: [{ kind: 'primitive', prim: 'int' }],
        ret: { kind: 'void' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// Umgebung für einen Setter-Aufruf: `self` trägt den aktuellen Zustand sowie die
// Klassengrenzen, `wert` ist der übergebene Parameter.
function thermostatEnv(temperatur: number, wert: number): JavaEnvironment {
  return {
    local: { wert: { type: 'int', value: wert } },
    heap: {
      self: {
        class: 'Thermostat',
        isInstance: true,
        fields: {
          temperatur: { type: 'int', value: temperatur },
          MIN: { type: 'int', value: TEMPERATUR_MIN },
          MAX: { type: 'int', value: TEMPERATUR_MAX },
        },
      },
    },
    contextMeta: { Thermostat: thermostatMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const punktMeta: ClassMetaData = {
  name: 'Punkt',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'x', type: { kind: 'primitive', prim: 'int' } },
    { name: 'y', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [
    {
      name: 'sindGleich',
      sig: {
        params: [{ kind: 'class', name: 'Punkt' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// Umgebung für zwei Punkte: `self` ist der Empfänger, `p` der Parameter.
function punktEnv(
  x: number,
  y: number,
  px: number,
  py: number,
): JavaEnvironment {
  return {
    local: { p: { type: 'reference', ref: 'p' } },
    heap: {
      self: {
        class: 'Punkt',
        isInstance: true,
        fields: { x: { type: 'int', value: x }, y: { type: 'int', value: y } },
      },
      p: {
        class: 'Punkt',
        isInstance: true,
        fields: {
          x: { type: 'int', value: px },
          y: { type: 'int', value: py },
        },
      },
    },
    contextMeta: { Punkt: punktMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const lebewesenMeta: ClassMetaData = {
  name: 'Lebewesen',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [],
  methods: [],
}

const capybaraMeta: ClassMetaData = {
  name: 'Capybara',
  superClass: 'Lebewesen',
  interfaces: [],
  fields: [],
  methods: [],
}

const axolotlMeta: ClassMetaData = {
  name: 'Axolotl',
  superClass: 'Lebewesen',
  interfaces: [],
  fields: [],
  methods: [],
}

const zooMeta: ClassMetaData = {
  name: 'Zoo',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [{ name: 'wesen', type: { kind: 'class', name: 'Lebewesen' } }],
  methods: [
    {
      name: 'istCapybara',
      sig: {
        params: [{ kind: 'class', name: 'Lebewesen' }],
        ret: { kind: 'void' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `wesen` ist als Feld modelliert (deklarierter Typ `Lebewesen`), damit der
// Typechecker `instanceof` unabhängig vom konkreten Objekt zulässt. Der String
// 'null' bedeutet, dass kein Lebewesen übergeben wurde.
function zooEnv(wesen: string): JavaEnvironment {
  const heap: JavaEnvironment['heap'] = {
    self: {
      class: 'Zoo',
      isInstance: true,
      fields: {
        wesen:
          wesen == 'null'
            ? { type: 'null', value: null }
            : { type: 'reference', ref: 'wesen' },
      },
    },
  }
  if (wesen != 'null') {
    heap.wesen = { class: wesen, isInstance: true, fields: {} }
  }
  return {
    local: {},
    heap,
    contextMeta: {
      Lebewesen: lebewesenMeta,
      Capybara: capybaraMeta,
      Axolotl: axolotlMeta,
      Zoo: zooMeta,
    },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const katzeMeta: ClassMetaData = {
  name: 'Katze',
  superClass: 'Lebewesen',
  interfaces: [],
  fields: [],
  methods: [],
}

const hundMeta: ClassMetaData = {
  name: 'Hund',
  superClass: 'Lebewesen',
  interfaces: [],
  fields: [],
  methods: [],
}

const tierheimMeta: ClassMetaData = {
  name: 'Tierheim',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    {
      name: 'tiere',
      type: { kind: 'array', elem: { kind: 'class', name: 'Lebewesen' } },
    },
  ],
  methods: [
    {
      name: 'hatAxolotl',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `tiere` ist eine Liste von Klassennamen ('Capybara', ...); 'null' = null-Element.
function tierheimEnv(tiere: string[]): JavaEnvironment {
  const heap: JavaEnvironment['heap'] = {
    self: {
      class: 'Tierheim',
      isInstance: true,
      fields: { tiere: { type: 'reference', ref: 'tiere' } },
    },
  }
  const elements: JavaValue[] = tiere.map((name, i) => {
    if (name == 'null') {
      return { type: 'null', value: null }
    }
    const ref = `tier${i}`
    heap[ref] = { class: name, isInstance: true, fields: {} }
    return { type: 'reference', ref }
  })
  heap.tiere = {
    class: 'Lebewesen[]',
    isArray: true,
    elements,
    type: { kind: 'class', name: 'Lebewesen' },
  }
  return {
    local: {},
    heap,
    contextMeta: {
      Lebewesen: lebewesenMeta,
      Capybara: capybaraMeta,
      Axolotl: axolotlMeta,
      Katze: katzeMeta,
      Hund: hundMeta,
      Tierheim: tierheimMeta,
    },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const passwortmanagerMeta: ClassMetaData = {
  name: 'Passwortmanager',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'passwort', type: { kind: 'class', name: 'java.lang.String' } },
  ],
  methods: [
    {
      name: 'setzeNeuesPasswort',
      sig: {
        params: [{ kind: 'class', name: 'java.lang.String' }],
        ret: { kind: 'void' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `passwort` (Parameter) ist das neue, `this.passwort` das alte Passwort. Die
// beiden Strings sind bewusst getrennte Objekte, damit `==` gegen `equals` auffällt.
function passwortmanagerEnv(alt: string, neu: string): JavaEnvironment {
  return {
    local: { passwort: { type: 'reference', ref: 'neu' } },
    heap: {
      self: {
        class: 'Passwortmanager',
        isInstance: true,
        fields: { passwort: { type: 'reference', ref: 'alt' } },
      },
      alt: { class: 'java.lang.String', stringValue: alt },
      neu: { class: 'java.lang.String', stringValue: neu },
    },
    contextMeta: { Passwortmanager: passwortmanagerMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

// Die Attribute sind absichtlich NICHT im Meta deklariert: Dadurch meldet der
// Typechecker bei `b.ausgeliehen` "Feld nicht gefunden" und der Ausdruck muss
// die Methoden nutzen. Die Werte liegen trotzdem im Heap, damit die Handler sie
// lesen können.
const buchMeta: ClassMetaData = {
  name: 'Buch',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [],
  methods: [
    {
      name: 'istAusgeliehen',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler(owner, _args, env) {
        const self = env.heap[owner.ref]
        if (!('isInstance' in self)) throw 'Interner Systemfehler'
        return self.fields.ausgeliehen
      },
    },
    {
      name: 'istVorgemerkt',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler(owner, _args, env) {
        const self = env.heap[owner.ref]
        if (!('isInstance' in self)) throw 'Interner Systemfehler'
        return self.fields.vorgemerkt
      },
    },
  ],
}

const bibliothekMeta: ClassMetaData = {
  name: 'Bibliothek',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [],
  methods: [
    {
      name: 'kannAusleihen',
      sig: {
        params: [{ kind: 'class', name: 'Buch' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `b` ist der Parameter; die beiden Methoden lesen ihre Werte aus den Feldern.
function bibliothekEnv(
  ausgeliehen: boolean,
  vorgemerkt: boolean,
): JavaEnvironment {
  return {
    local: { b: { type: 'reference', ref: 'buch' } },
    heap: {
      self: { class: 'Bibliothek', isInstance: true, fields: {} },
      buch: {
        class: 'Buch',
        isInstance: true,
        fields: {
          ausgeliehen: { type: 'boolean', value: ausgeliehen },
          vorgemerkt: { type: 'boolean', value: vorgemerkt },
        },
      },
    },
    contextMeta: { Buch: buchMeta, Bibliothek: bibliothekMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

export const chapter07Quests: { [key: number]: QuestData } = {
  54: {
    id: 54,
    title: 'Beitragskonto',
    code: `
class Beitragskonto {
    int offeneBeiträge; // in Cent

    // true, wenn noch Beiträge offen sind
    boolean nochBeiträgeOffen() {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'this.offeneBeiträge > 0',
      data: [1, 100, 5000, 42, 0, -1, 2147483647, -2147483648],
      params: ['this.offeneBeiträge'],
      driver(el, oracle) {
        return oracle(beitragskontoEnv(el)) ? 'true' : 'false'
      },
    },
  },

  55: {
    id: 55,
    title: 'Verkettete Liste (rekursiv)',
    code: `
// Knoten einer verketteten Liste
class Knoten {

    Knoten nächster;

    // Bestimme die Länge rekursiv  
    int länge() {
        if (___placeholder___) {
            return 1;
        }
        return 1 + nächster.länge();
    }
}
    `.trim(),
    checker: {
      reference: 'nächster == null',
      data: [1, 2, 3, 4, 5, 8, 13, 21, 50],
      params: ['Anzahl Knoten'],
      driver(el, oracle) {
        const n: number = el
        const heap = knotenKette(n)
        // Simuliert länge() und nutzt dabei den Ausdruck als Abbruchbedingung.
        let aktuell = 'k0'
        let länge = 0
        while (true) {
          if (länge > MAX_ITER) {
            return '<Endlosschleife>'
          }
          const env: JavaEnvironment = {
            local: {},
            heap,
            contextMeta: { Knoten: knotenMeta },
            contextInstance: { type: 'reference', ref: aktuell },
          }
          if (oracle(env)) {
            return String(länge + 1)
          }
          const knoten = heap[aktuell]
          if (!('isInstance' in knoten)) {
            return '<NullPointerException>'
          }
          const nächster = knoten.fields.nächster
          if (nächster.type != 'reference') {
            return '<NullPointerException>'
          }
          aktuell = nächster.ref
          länge++
        }
      },
    },
  },

  56: {
    id: 56,
    title: 'Verkettete Liste (iterativ)',
    code: `
// Knoten einer verketteten Liste
class Knoten {

    Knoten nächster;

    // Bestimme die Länge iterativ
    int länge() {
        int anzahl = 0;
        Knoten aktuell = this;
        while (___placeholder___) {
            anzahl++;
            aktuell = aktuell.nächster;
        }
        return anzahl;
    }
}
    `.trim(),
    checker: {
      reference: 'aktuell != null',
      data: [1, 2, 3, 4, 5, 8, 13, 21, 50],
      params: ['Anzahl Knoten'],
      driver(el, oracle) {
        const n: number = el
        const heap = knotenKette(n)
        // Simuliert die while-Schleife; der Ausdruck ist die Schleifenbedingung.
        let aktuell: string | null = 'k0'
        let anzahl = 0
        let schritte = 0
        while (true) {
          if (++schritte > MAX_ITER) {
            return '<Endlosschleife>'
          }
          const env: JavaEnvironment = {
            local: {
              anzahl: { type: 'int', value: anzahl },
              aktuell:
                aktuell == null
                  ? { type: 'null', value: null }
                  : { type: 'reference', ref: aktuell },
            },
            heap,
            contextMeta: { Knoten: knotenMeta },
            contextInstance: { type: 'reference', ref: 'k0' },
          }
          if (!oracle(env)) break
          anzahl++
          if (aktuell == null) {
            return '<NullPointerException>'
          }
          const knoten: JavaHeapObject = heap[aktuell]
          if (!('isInstance' in knoten)) {
            return '<NullPointerException>'
          }
          const nächster: JavaValue = knoten.fields.nächster
          aktuell = nächster.type == 'reference' ? nächster.ref : null
        }
        return String(anzahl)
      },
    },
  },

  57: {
    id: 57,
    title: 'Thermostat',
    code: `
class Thermostat {
    private int temperatur;
    static final int MIN = 16;
    static final int MAX = 28;

    // Setzt die Temperatur, sofern der Wert
    // im Bereich [MIN, MAX] liegt.
    void setTemperatur(int wert) {
        if (___placeholder___) {
            temperatur = wert;
        }
    }
}
    `.trim(),
    checker: {
      reference: 'wert >= MIN && wert <= MAX',
      data: [
        [20, 25],
        [20, 10],
        [20, 30],
        [20, 16],
        [20, 28],
        [20, 15],
        [20, 29],
        [10, 50],
        [30, 16],
        [-5, 28],
        [2147483647, 20],
        [-2147483648, 20],
      ],
      params: ['temperatur', 'wert'],
      driver(el, oracle) {
        const [temperatur, wert] = el
        // Simuliert den Setter-Rumpf: Bei erfüllter Bedingung wird der Wert übernommen.
        // Ausgegeben wird der resultierende Zustand, damit die Wirkung zählt.
        if (oracle(thermostatEnv(temperatur, wert))) {
          return String(wert)
        }
        return String(temperatur)
      },
    },
  },

  58: {
    id: 58,
    title: 'Punkt',
    code: `
class Punkt {
    int x;
    int y;

    // true, wenn beide Punkte dieselben Koordinaten haben
    boolean sindGleich(Punkt p) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'x == p.x && y == p.y',
      data: [
        [1, 2, 1, 2],
        [1, 2, 3, 4],
        [0, 0, 0, 0],
        [-1, -1, -1, -1],
        [5, 5, 5, 6],
        [5, 5, 6, 5],
        [2147483647, -2147483648, 2147483647, -2147483648],
        [1, 2, 1, 3],
        [3, 2, 1, 2],
      ],
      params: ['x', 'y', 'p.x', 'p.y'],
      driver(el, oracle) {
        const [x, y, px, py] = el
        return oracle(punktEnv(x, y, px, py)) ? 'true' : 'false'
      },
    },
  },

  59: {
    id: 59,
    title: 'Zoo',
    code: `
class Lebewesen { }

class Capybara extends Lebewesen { }
class Axolotl extends Lebewesen { }

class Zoo {
    void istCapybara(Lebewesen wesen) {
        if (___placeholder___) {
            System.out.println("Es ist ein Capybara!");
        }
    }
}
    `.trim(),
    checker: {
      reference: 'wesen instanceof Capybara',
      data: ['Capybara', 'Axolotl', 'Lebewesen', 'null'],
      params: ['wesen'],
      driver(el, oracle) {
        // Simuliert den Rumpf: Nur beim Treffer wird etwas ausgegeben.
        if (oracle(zooEnv(el))) {
          return 'Es ist ein Capybara!'
        }
        return '<keine Ausgabe>'
      },
    },
  },

  60: {
    id: 60,
    title: 'Tierheim',
    code: `
class Lebewesen { }

class Capybara extends Lebewesen { }
class Axolotl extends Lebewesen { }
class Katze extends Lebewesen { }
class Hund extends Lebewesen { }

class Tierheim {
    Lebewesen[] tiere;

    boolean hatAxolotl() {
        for (int i = 0; i < tiere.length; i++) {
            if (___placeholder___) {
                return true;
            }
        }
        return false;
    }
}
    `.trim(),
    checker: {
      reference: 'tiere[i] instanceof Axolotl',
      data: [
        [['Axolotl']],
        [['Hund']],
        [['Hund', 'Katze', 'Axolotl']],
        [['Capybara', 'Katze']],
        [[]],
        [['Lebewesen']],
        [['Hund', 'null', 'Axolotl']],
        [['null', 'Hund']],
        [['Capybara']],
        [['Hund', 'Katze', 'Capybara', 'Hund']],
      ],
      params: ['tiere'],
      driver(el, oracle) {
        const [tiere] = el
        const env = tierheimEnv(tiere)
        for (let i = 0; i < tiere.length; i++) {
          env.local.i = { type: 'int', value: i }
          if (oracle(env)) {
            return 'true'
          }
        }
        return 'false'
      },
    },
  },

  61: {
    id: 61,
    title: 'Passwortmanager',
    code: `
class Passwortmanager {

    String passwort;

    // Das neue Passwort muss sich vom alten unterscheiden
    void setzeNeuesPasswort(String passwort) {
        if (___placeholder___) {
            throw new SecurityException();
        }
        // ...
    }
}
    `.trim(),
    checker: {
      reference: 'passwort.equals(this.passwort)',
      data: [
        ['geheim', 'geheim'],
        ['geheim', 'neu123'],
        ['abc', 'abc'],
        ['abc', 'abd'],
        ['a', 'A'],
        ['passwort', 'passwort'],
        ['sommer2026', 'winter2026'],
        ['12345678', '123456789'],
      ],
      params: ['altes Passwort', 'neues Passwort'],
      driver(el, oracle) {
        const [alt, neu] = el
        // Simuliert den Rumpf: Bei erfüllter Bedingung fliegt die Exception,
        // sonst wird das neue Passwort übernommen (Ausgabe = neuer Zustand).
        if (oracle(passwortmanagerEnv(alt, neu))) {
          return '<SecurityException>'
        }
        return neu
      },
    },
  },

  62: {
    id: 62,
    title: 'Bibliothek',
    code: `
class Buch {
    private boolean ausgeliehen;
    private boolean vorgemerkt;

    boolean istAusgeliehen() {
        return ausgeliehen;
    }

    boolean istVorgemerkt() {
        return vorgemerkt;
    }
}

class Bibliothek {
    // Ausleihen ist nur möglich, wenn das Buch weder
    // ausgeliehen noch vorgemerkt ist
    boolean kannAusleihen(Buch b) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: '!b.istAusgeliehen() && !b.istVorgemerkt()',
      data: [
        [true, false],
        [true, true],
        [false, false],
        [false, true],
      ],
      params: ['ausgeliehen', 'vorgemerkt'],
      driver(el, oracle) {
        const [ausgeliehen, vorgemerkt] = el
        return oracle(bibliothekEnv(ausgeliehen, vorgemerkt)) ? 'true' : 'false'
      },
    },
  },
}
