import { execFile } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const pexec = promisify(execFile)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Optional positional argument filters entries by substring of the code.
const filter = process.argv[2]

const { testSuite } = await import(
  join(__dirname, '../data/test-suite.ts') + `?t=${Date.now()}`
)

const entries = testSuite
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => !filter || entry.code.includes(filter))

if (entries.length == 0) {
  console.error(`no test cases match filter: ${JSON.stringify(filter)}`)
  process.exit(2)
}

function wrapper(name, code) {
  return `public class ${name} {
  static String esc(String s){ StringBuilder b=new StringBuilder(); for(char c:s.toCharArray()){ if(c=='\\\\'||c=='"') b.append('\\\\').append(c); else if(c<32) b.append(String.format("\\\\u%04x",(int)c)); else b.append(c);} return b.toString(); }
  static void out(Object v){
    if(v==null){ System.out.println("{\\"type\\":\\"null\\"}"); return; }
    if(v instanceof Boolean) System.out.println("{\\"type\\":\\"boolean\\",\\"value\\":"+v+"}");
    else if(v instanceof Byte) System.out.println("{\\"type\\":\\"byte\\",\\"value\\":"+((Byte)v).intValue()+"}");
    else if(v instanceof Short) System.out.println("{\\"type\\":\\"short\\",\\"value\\":"+((Short)v).intValue()+"}");
    else if(v instanceof Integer) System.out.println("{\\"type\\":\\"int\\",\\"value\\":"+v+"}");
    else if(v instanceof Long) System.out.println("{\\"type\\":\\"long\\",\\"value\\":\\""+v+"\\"}");
    else if(v instanceof Character) System.out.println("{\\"type\\":\\"char\\",\\"value\\":"+(int)((Character)v).charValue()+"}");
    else if(v instanceof Float){ float f=(Float)v;
      if(Float.isNaN(f)) System.out.println("{\\"type\\":\\"float\\",\\"special\\":\\"NaN\\"}");
      else if(Float.isInfinite(f)) System.out.println(f>0?"{\\"type\\":\\"float\\",\\"special\\":\\"Infinity\\"}":"{\\"type\\":\\"float\\",\\"special\\":\\"-Infinity\\"}");
      else System.out.println("{\\"type\\":\\"float\\",\\"value\\":"+Double.toString((double)f)+"}"); }
    else if(v instanceof Double){ double d=(Double)v;
      if(Double.isNaN(d)) System.out.println("{\\"type\\":\\"double\\",\\"special\\":\\"NaN\\"}");
      else if(Double.isInfinite(d)) System.out.println(d>0?"{\\"type\\":\\"double\\",\\"special\\":\\"Infinity\\"}":"{\\"type\\":\\"double\\",\\"special\\":\\"-Infinity\\"}");
      else System.out.println("{\\"type\\":\\"double\\",\\"value\\":"+Double.toString(d)+"}"); }
    else if(v instanceof String) System.out.println("{\\"type\\":\\"string\\",\\"value\\":\\""+esc((String)v)+"\\"}");
    else System.out.println("{\\"type\\":\\"other\\"}");
  }
  public static void main(String[] a){ out(${code}); }
}`
}

async function runOne(dir, name, code) {
  const javaFile = join(dir, `${name}.java`)
  writeFileSync(javaFile, wrapper(name, code))
  try {
    await pexec('javac', ['-encoding', 'UTF-8', '-d', dir, javaFile], {
      timeout: 30000,
    })
  } catch (e) {
    if (e.code == 'ENOENT') throw new Error('javac not found on PATH')
    return { error: true, kind: 'compile', msg: summary(e.stderr) }
  }
  try {
    const { stdout } = await pexec('java', ['-cp', dir, name], {
      timeout: 30000,
    })
    try {
      return { value: JSON.parse(stdout.trim()) }
    } catch {
      return { error: true, kind: 'badprint', msg: stdout.trim() }
    }
  } catch (e) {
    if (e.code == 'ENOENT') throw new Error('java not found on PATH')
    return { error: true, kind: 'runtime', msg: summary(e.stderr) }
  }
}

function summary(text) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .slice(0, 2)
    .join(' | ')
}

const dir = mkdtempSync(join(tmpdir(), 'java-cross-check-'))
const results = new Array(entries.length)

let next = 0
let done = 0
async function worker() {
  while (next < entries.length) {
    const slot = next++
    const { entry, index } = entries[slot]
    results[slot] = await runOne(dir, `T_${index}`, entry.code)
    done += 1
    if (done % 25 == 0) process.stderr.write(`${done}/${entries.length}\n`)
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
rmSync(dir, { recursive: true, force: true })

function isMatch(entry, actual) {
  if (actual.error) return entry.isError == true
  if (entry.isError) return false
  return (
    actual.value !== undefined &&
    actual.value.special === undefined &&
    JSON.stringify(actual.value) === JSON.stringify(entry.output)
  )
}

let valueMatch = 0
let errorMatch = 0
const mismatches = []
for (let i = 0; i < entries.length; i++) {
  const { entry } = entries[i]
  const actual = results[i]
  if (isMatch(entry, actual)) {
    if (entry.isError) errorMatch += 1
    else valueMatch += 1
    continue
  }
  let detail
  if (entry.isError && !actual.error) {
    detail = `expected error, but Java evaluates to ${JSON.stringify(actual.value)}`
  } else if (!entry.isError && actual.error) {
    detail = `expected ${JSON.stringify(entry.output)}, but Java ${actual.kind} error: ${actual.msg}`
  } else {
    detail = `expected ${JSON.stringify(entry.output)}, got ${JSON.stringify(actual.value)}`
  }
  mismatches.push({ entry, actual, detail })
}

console.log(`checked ${entries.length} test cases against java`)
console.log(`  values match:      ${valueMatch}`)
console.log(`  errors match:      ${errorMatch}`)
console.log(`  mismatches:        ${mismatches.length}`)
for (const m of mismatches) {
  console.log(`\n[!] ${JSON.stringify(m.entry.code)}`)
  console.log(`    ${m.detail}`)
}
process.exit(mismatches.length == 0 ? 0 : 1)
