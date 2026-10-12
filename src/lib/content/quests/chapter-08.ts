import type {
  ClassMetaData,
  JavaEnvironment,
  JavaValue,
  QuestData,
} from '../../state/types'
import { boolEnv, doubleEnv, intEnv, mergeEnv } from './helpers'

const EPSILON = 1e-9
const TOLERANZ = 0.001

const streckeMeta: ClassMetaData = {
  name: 'Strecke',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'länge', type: { kind: 'primitive', prim: 'double' } },
    { name: 'TOLERANZ', type: { kind: 'primitive', prim: 'double' } },
  ],
  methods: [
    {
      name: 'gleichLang',
      sig: {
        params: [{ kind: 'class', name: 'Strecke' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `TOLERANZ` liegt als (statisches) Attribut an der Instanz, damit der
// Platzhalter den Klassennamen direkt auflösen kann. `s` ist die verglichene
// zweite Strecke.
function streckeEnv(länge: number, andereLänge: number): JavaEnvironment {
  return {
    local: { s: { type: 'reference', ref: 's' } },
    heap: {
      self: {
        class: 'Strecke',
        isInstance: true,
        fields: {
          länge: { type: 'double', value: länge },
          TOLERANZ: { type: 'double', value: TOLERANZ },
        },
      },
      s: {
        class: 'Strecke',
        isInstance: true,
        fields: {
          länge: { type: 'double', value: andereLänge },
          TOLERANZ: { type: 'double', value: TOLERANZ },
        },
      },
    },
    contextMeta: { Strecke: streckeMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const terminMeta: ClassMetaData = {
  name: 'Termin',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'start', type: { kind: 'primitive', prim: 'long' } },
    { name: 'ende', type: { kind: 'primitive', prim: 'long' } },
  ],
  methods: [
    {
      name: 'überschneidet',
      sig: {
        params: [{ kind: 'class', name: 'Termin' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// Zwei Termine: `self` (this.start/this.ende) und der Parameter `t`. Die
// Zeitstempel sind long, damit auch weit auseinanderliegende Werte passen.
function terminEnv(
  aStart: number,
  aEnde: number,
  bStart: number,
  bEnde: number,
): JavaEnvironment {
  return {
    local: { t: { type: 'reference', ref: 't' } },
    heap: {
      self: {
        class: 'Termin',
        isInstance: true,
        fields: {
          start: { type: 'long', value: aStart.toString() },
          ende: { type: 'long', value: aEnde.toString() },
        },
      },
      t: {
        class: 'Termin',
        isInstance: true,
        fields: {
          start: { type: 'long', value: bStart.toString() },
          ende: { type: 'long', value: bEnde.toString() },
        },
      },
    },
    contextMeta: { Termin: terminMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

const MAX_ITER = 1000

const binaereSucheMeta: ClassMetaData = {
  name: 'BinäreSuche',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    {
      name: 'werte',
      type: { kind: 'array', elem: { kind: 'primitive', prim: 'int' } },
    },
  ],
  methods: [
    {
      name: 'suche',
      sig: {
        params: [
          { kind: 'primitive', prim: 'int' },
          { kind: 'primitive', prim: 'int' },
          { kind: 'primitive', prim: 'int' },
        ],
        ret: { kind: 'primitive', prim: 'int' },
      },
      handler() {
        throw 'Rekursion nicht verfügbar.'
      },
    },
  ],
}

// `werte` ist das Array-Attribut der Instanz; lo/hi/mid/ziel sind Locals. Der
// Driver entrollt die Rekursion selbst und nutzt den Platzhalter als Richtungs-
// entscheidung (rechts weitersuchen vs. links).
function binaereSucheEnv(
  werte: number[],
  lo: number,
  hi: number,
  mid: number,
  ziel: number,
): JavaEnvironment {
  const elements: JavaValue[] = werte.map((value) => ({ type: 'int', value }))
  return {
    local: {
      lo: { type: 'int', value: lo },
      hi: { type: 'int', value: hi },
      mid: { type: 'int', value: mid },
      ziel: { type: 'int', value: ziel },
    },
    heap: {
      self: {
        class: 'BinäreSuche',
        isInstance: true,
        fields: { werte: { type: 'reference', ref: 'werte' } },
      },
      werte: {
        class: 'int[]',
        isArray: true,
        elements,
        type: { kind: 'primitive', prim: 'int' },
      },
    },
    contextMeta: { BinäreSuche: binaereSucheMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}

export const chapter08Quests: { [key: number]: QuestData } = {
  63: {
    id: 63,
    title: 'Gleitkomma-Vergleich',
    code: `
class GleitkommaVergleich {
    static final double EPSILON = 1e-9;

    // 0.1 + 0.2 ist NICHT gleich 0.3
    // Wegen der Gleitkomma-Darstellung ergibt die Summe
    // 0.30000000000000004 und 0.30000000000000004 != 0.3.
    // Vergleiche double-Werte deshalb mit einer Toleranz:
    // zwei Werte sind "gleich", wenn ihr Abstand < EPSILON ist.
    // Abstand = Betrag der Differenz
    boolean fastGleich(double a, double b) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'Math.abs(a - b) < EPSILON',
      data: [
        [0.1 + 0.2, 0.3],
        [0.30000000000000004, 0.3],
        [0.1, 0.1],
        [1.0, 1.0],
        [0.0, 0.0],
        [-0.5, -0.5],
        [1.0, 1.0000000001],
        [1e-10, 0.0],
        [1e-9, 0.0],
        [1.0, 1.000000002],
        [0.0, 1.0],
        [-1.0, 1.0],
        [Math.sqrt(2) * Math.sqrt(2), 2.0],
      ],
      params: ['a', 'b'],
      driver(el, oracle) {
        const [a, b] = el
        return oracle(doubleEnv(['a', a], ['b', b], ['EPSILON', EPSILON]))
          ? 'true'
          : 'false'
      },
    },
  },

  64: {
    id: 64,
    title: 'Strecke',
    code: `
class Strecke {
    static final double TOLERANZ = 0.001; // 1 mm  

    double länge;

    // Abweichung BIS zur Toleranz erlaubt
    boolean gleichLang(Strecke s) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'Math.abs(länge - s.länge) <= TOLERANZ',
      data: [
        [1.0, 1.0],
        [1.0, 1.0005],
        [1.0, 1.001],
        [0.0, 0.001],
        [1.0, 0.999],
        [1.0, 1.0011],
        [0.0, 0.0],
        [2.0, 2.0],
        [0.0, 1.0],
        [1.0, 0.9995],
        [5.0, 5.0009],
        [5.0, 5.002],
        [0.5, 0.501],
        [0.1 + 0.2, 0.3],
      ],
      params: ['länge', 's.länge'],
      driver(el, oracle) {
        const [länge, andereLänge] = el
        return oracle(streckeEnv(länge, andereLänge)) ? 'true' : 'false'
      },
    },
  },

  65: {
    id: 65,
    title: 'Wahrheitstabelle',
    code: `
class Wahrheitstabelle {
    // Finde einen booleschen Ausdruck, der genau zur
    // folgenden Wahrheitstabelle passt (F = false, T = true):
    //
    //   a | b | c || Ergebnis
    //  ---+---+---++----------
    //   F | F | F || F
    //   F | F | T || F
    //   F | T | F || T
    //   F | T | T || F
    //   T | F | F || T
    //   T | F | T || F
    //   T | T | F || T
    //   T | T | T || F
    //
    // Tipp: In welchen Zeilen steht ein T? Was haben
    // genau diese Zeilen gemeinsam?
    boolean allesLogisch(boolean a, boolean b, boolean c) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: '!c && (a || b)',
      data: [
        [false, false, false],
        [false, false, true],
        [false, true, false],
        [false, true, true],
        [true, false, false],
        [true, false, true],
        [true, true, false],
        [true, true, true],
      ],
      params: ['a', 'b', 'c'],
      driver(el, oracle) {
        const [a, b, c] = el
        return oracle(boolEnv(['a', a], ['b', b], ['c', c])) ? 'true' : 'false'
      },
    },
  },

  66: {
    id: 66,
    title: 'Game of Life',
    code: `
class GameOfLife {
    // Regel: Eine lebende Zelle überlebt mit 2 oder 3 Nachbarn,
    // eine tote Zelle wird mit genau 3 Nachbarn lebendig.
    boolean lebtWeiter(boolean lebt, int n) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'n == 3 || (lebt && n == 2)',
      data: [
        [true, 0],
        [true, 1],
        [true, 2],
        [true, 3],
        [true, 4],
        [true, 5],
        [true, 6],
        [true, 7],
        [true, 8],
        [false, 0],
        [false, 1],
        [false, 2],
        [false, 3],
        [false, 4],
        [false, 5],
        [false, 6],
        [false, 7],
        [false, 8],
      ],
      params: ['lebt', 'n'],
      driver(el, oracle) {
        const [lebt, n] = el
        return oracle(mergeEnv(boolEnv(['lebt', lebt]), intEnv(['n', n])))
          ? 'true'
          : 'false'
      },
    },
  },

  67: {
    id: 67,
    title: 'Terminüberschneidung',
    code: `
class Termin {
    // Zeitstempel
    long start;
    long ende;

    // true, wenn sich dieser Termin mit t überschneidet.
    // Aneinandergrenzende Termine (ende = start) sind kein Konflikt.
    boolean überschneidet(Termin t) {
        return ___placeholder___;
    }
}
    `.trim(),
    checker: {
      reference: 'start < t.ende && t.start < ende',
      data: [
        [600, 660, 630, 690],
        [600, 660, 660, 720],
        [600, 660, 540, 600],
        [600, 660, 700, 760],
        [600, 660, 500, 560],
        [600, 660, 540, 720],
        [600, 720, 630, 660],
        [600, 660, 600, 660],
        [600, 660, 610, 620],
        [600, 660, 550, 605],
        [600, 660, 655, 700],
        [0, 1440, 0, 1440],
        [0, 1440, 1440, 2880],
        [2147483640, 2147483650, 2147483645, 2147483655],
      ],
      params: ['start', 'ende', 't.start', 't.ende'],
      driver(el, oracle) {
        const [aStart, aEnde, bStart, bEnde] = el
        return oracle(terminEnv(aStart, aEnde, bStart, bEnde))
          ? 'true'
          : 'false'
      },
    },
  },

  68: {
    id: 68,
    title: 'Binäre Suche',
    code: `
class BinäreSuche {
    int[] werte;

    // Rekursive binäre Suche in werte[lo..hi].
    // Liefert den Index von ziel oder -1.
    int suche(int lo, int hi, int ziel) {
        if (lo > hi) {
            return -1;
        }
        int mid = (lo + hi) / 2;
        if (ziel == werte[mid]) {
            return mid;
        }
        if (___placeholder___) {
            return suche(mid + 1, hi, ziel);
        } else {
            return suche(lo, mid - 1, ziel);
        }
    }
}
    `.trim(),
    checker: {
      reference: 'werte[mid] < ziel',
      data: [
        [[1, 3, 5, 7, 9, 11], 1],
        [[1, 3, 5, 7, 9, 11], 7],
        [[1, 3, 5, 7, 9, 11], 11],
        [[1, 3, 5, 7, 9, 11], 6],
        [[1, 3, 5, 7, 9, 11], 0],
        [[1, 3, 5, 7, 9, 11], 99],
        [[42], 42],
        [[42], 7],
        [[], 5],
        [[2, 4], 2],
        [[2, 4], 4],
        [[1, 2, 3, 4, 5, 6, 7, 8], 8],
      ],
      params: ['werte', 'ziel'],
      driver(el, oracle) {
        const [werte, ziel] = el
        let lo = 0
        let hi = werte.length - 1
        let schritte = 0
        while (true) {
          if (lo > hi) {
            return '-1'
          }
          if (++schritte > MAX_ITER) {
            return '<StackOverflowError>'
          }
          const mid = Math.floor((lo + hi) / 2)
          if (werte[mid] === ziel) {
            return String(mid)
          }
          if (oracle(binaereSucheEnv(werte, lo, hi, mid, ziel))) {
            lo = mid + 1
          } else {
            hi = mid - 1
          }
        }
      },
    },
  },
}
