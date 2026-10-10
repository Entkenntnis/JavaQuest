import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FaIcon } from '../../components/helper/FaIcon'
import type { ChapterData } from '../state/types'
// Kontext: CS1 Lernumgebung für boolesche Ausdrücke
export const chaptersData: ChapterData[] = [
  {
    title: 'Deine ersten Vergleiche',
    quests: [1, 2, 3, 4, 5, 6, 15, 10, 11, 12, 13],
    description: () => (
      <>
        <p>
          Ein boolescher Ausdruck ist entweder wahr oder falsch. Einen solchen
          Wahrheitswert erhältst du z.&#8239;B., wenn du zwei Zahlen
          vergleichst. Bedingte Kontrollstrukturen nutzen diese Information, um
          zu entscheiden, welche Anweisungen ausgeführt werden.
        </p>
        <p>
          Die wichtigsten Vergleichsoperatoren in Java sind <code>==</code>
          &nbsp;(Gleichheit), <code>!=</code>&nbsp;(Ungleichheit), sowie{' '}
          <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> und{' '}
          <code>&gt;=</code> für kleiner/größer(-gleich).
        </p>
        <p>
          Probiere die ersten Aufgaben aus! Erschließe aus dem Code, welcher
          boolesche Ausdruck die <code>if</code>-Bedingung sinnvoll ergänzt.
        </p>
      </>
    ),
  },
  {
    title: 'Logik, yeah!',
    quests: [7, 9, 16, 17, 18, 19, 20, 21, 22],
    description: () => (
      <>
        <p>
          Mit logischen Operatoren kannst du zwei Ausdrücke zu einem größeren
          Ausdruck verbinden. Bei <code>&amp;&amp;</code> (UND) müssen beide
          Seiten wahr sein, damit der Gesamtausdruck wahr wird. Bei{' '}
          <code>||</code> (ODER) reicht es, wenn mindestens einer der Ausdrücke
          wahr ist.
        </p>
        <p>
          Mit <code>true</code> und <code>false</code> kannst du Wahrheitswerte
          direkt angeben. Ein einzelner Ausdruck lässt sich mit dem Operator{' '}
          <code>!</code> (NICHT) umkehren. Nutze Klammern, um die Reihenfolge
          der Auswertung festzulegen und Missverständnisse zu klären.
        </p>
        <p>
          Für ExpertInnen: Es gibt auch einen Operator <code>^</code> (XOR) für
          Entweder-Oder.
        </p>
      </>
    ),
  },
  {
    title: 'Unter Kontrolle',
    quests: [23, 24, 25, 26, 27, 28, 29],
    description: () => (
      <>
        <p>
          Nicht nur in <code>if</code>-Anweisungen verwenden boolesche
          Ausdrücke: Auch <code>for</code>- und <code>while</code>-Schleifen
          werden über eine Bedingung gesteuert.
        </p>
        <p>
          Dabei wird die Bedingung bei jedem Durchlauf der Schleife geprüft.
          Solange sie wahr ist, wird der Schleifenrumpf wiederholt; sobald sie
          falsch ist, wird die Schleife verlassen.
        </p>
      </>
    ),
  },
  {
    title: 'Keine Angst vor Mathe 🙈',
    quests: [33, 30, 8, 31, 32, 34, 35, 36], // TODO: mehr Aufgaben, vermeide problematische Gleitkomma-Vergleiche
    description: () => (
      <>
        <p>
          In booleschen Ausdrücken kannst du rechnen: <code>+</code>,{' '}
          <code>-</code>, <code>*</code>, <code>/</code> stehen zur Verfügung,
          außerdem kannst du mit dem Modulo-Operator <code>%</code> den Rest
          einer Division ermitteln.
        </p>
        <p>
          Es gibt noch mehr: Die Java-Bibliothek enthält weitere nützliche
          Funktionen wie <code>Math.sqrt(x)</code> (Quadratwurzel),{' '}
          <code>Math.abs(x)</code> (Betrag) oder <code>Math.pow(b, e)</code>{' '}
          (Potenz).
        </p>
      </>
    ),
  },
  {
    title: 'Zeichenketten (String)',
    quests: [37, 38, 39, 40, 41, 42, 43],
    description: () => (
      <>
        <p>
          Zeichenketten („Texte“) werden in Java als <code>String</code>{' '}
          gespeichert. Diese haben eine Besonderheit: Weil sie Objekte sind,
          brauchst zum Vergleich zweier Zeichenketten die Methode{' '}
          <code>str.equals(other)</code>.
        </p>
        <p>
          Außerdem gibt es weitere{' '}
          <a
            href="https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/lang/String.html"
            target="_blank"
          >
            hilfreiche Methoden{' '}
            <FaIcon
              icon={faExternalLinkAlt}
              className="text-xs text-gray-500"
            />
          </a>
          , wie <code>isEmpty()</code>, <code>length()</code>,{' '}
          <code>contains(str)</code> oder <code>equalsIgnoreCase(other)</code>.
        </p>
      </>
    ),
  },
  {
    title: 'Felder (Arrays)',
    quests: [],
    description: () => (
      <>
        <p>
          Im wesentlichen also Zugriff über Index <code>arr[i]</code> und die
          Abfrage der Länge mit <code>arr.length</code>. Ansonsten weiß ich gar
          nicht, was es da viel zu erzählen gibt. Arrays können von
          verschiedenen Typen sein. Die Erzeugung von Arrays liegt nicht in
          meinem Zuständigkeitsbereich.
        </p>
      </>
    ),
  },
  {
    title: 'OOP-ala',
    quests: [],
    description: () => (
      <>
        <p>
          Der wesentliche erste Punkt ist Umgang mit <code>null</code>, also
          prüfen, ob null ist, das passiert häufiger. Daneben interessant könnte
          der Zugriff auf lokale Variablen mit <code>this</code> sein. Auch der
          Hinweis, dass natürlich innerhalb boolescher Ausdrücke auf alle
          Methoden/Attribute der umliegenden Klasse zugegriffen werden kann.
        </p>
      </>
    ),
  },
  {
    title: 'Character, Epsilon und Co.',
    quests: [],
    description: () => (
      <>
        <p>
          Die Klasse Character bietet einige nützliche Funktionen, wie{' '}
          <code>isDigit</code> oder so. Außerdem muss man für double-Vergleiche
          das Muster <code>Math.abs(a-b) &lt;= eps</code> verwenden. Vielleicht
          gibt es noch was nützliches? Arrays.equals könnte ich noch reinnehmen.
        </p>
      </>
    ),
  },
  {
    title: 'Nicht-binäre Operatoren',
    quests: [],
    description: () => (
      <>
        <p>
          Ternärer Operator <code>? :</code> für integriertes if-else. Außerdem
          Inkrement/Dekrement um inline Daten zu verändern. Mit Hinweis, dass
          man da aufpassen muss, dass man sich nicht ins Knie schießt.
        </p>
      </>
    ),
  },
  {
    title: 'Finale mit Vertiefungen',
    quests: [],
    description: () => (
      <>
        <p>
          Kleiner Gruß, das man viel Spaß haben soll mit den vertiefenden
          Aufgaben.
        </p>
      </>
    ),
  },
]
