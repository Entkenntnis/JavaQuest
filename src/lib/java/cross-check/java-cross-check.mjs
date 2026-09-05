import { execFile, spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir, cpus } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const pexec = promisify(execFile)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Optional positional argument filters entries by substring of the code.
const filter = process.argv[2]

const { testSuite } = await import(
  join(__dirname, '../../data/test-suite.ts') + `?t=${Date.now()}`
)

const entries = testSuite
  .map((entry, index) => ({ entry, index }))
  .filter(({ entry }) => !filter || entry.code.includes(filter))

if (entries.length == 0) {
  console.error(`no test cases match filter: ${JSON.stringify(filter)}`)
  process.exit(2)
}

const dir = mkdtempSync(join(tmpdir(), 'java-cross-check-'))

// Compile the persistent Java harness once (single javac launch).
const harnessJava = join(__dirname, 'Harness.java')
try {
  await pexec('javac', ['-encoding', 'UTF-8', '-d', dir, harnessJava], {
    timeout: 60000,
  })
} catch (e) {
  if (e.code == 'ENOENT') throw new Error('javac not found on PATH')
  rmSync(dir, { recursive: true, force: true })
  throw new Error(
    `failed to compile harness: ${summary(String(e.stderr || e))}`,
  )
}

const results = new Array(entries.length)
let done = 0

// Requests to the harness are framed: int32 length + utf8 expression bytes.
function writeRequest(stdin, code) {
  const body = Buffer.from(code, 'utf8')
  const header = Buffer.alloc(4)
  header.writeInt32BE(body.length, 0)
  return new Promise((resolve, reject) => {
    stdin.write(Buffer.concat([header, body]), (err) =>
      err ? reject(err) : resolve(),
    )
  })
}

function frameReader(stream) {
  let buffer = Buffer.alloc(0)
  let ended = false
  const pending = []
  stream.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk])
    pump()
  })
  stream.on('end', () => {
    ended = true
    for (const p of pending.splice(0)) {
      p.reject(new Error('java harness closed stdout unexpectedly'))
    }
  })
  stream.on('error', (err) => {
    ended = true
    for (const p of pending.splice(0)) {
      p.reject(err)
    }
  })
  function pump() {
    while (pending.length > 0 && buffer.length >= pending[0].size) {
      const p = pending.shift()
      p.resolve(buffer.subarray(0, p.size))
      buffer = buffer.subarray(p.size)
    }
  }
  function read(size) {
    if (ended) return Promise.reject(new Error('java harness stdout closed'))
    return new Promise((resolve, reject) => {
      pending.push({ size, resolve, reject })
      pump()
    })
  }
  return { read }
}

async function readResult(reader) {
  const status = (await reader.read(1))[0]
  if (status == 1) {
    const size = (await reader.read(4)).readInt32BE(0)
    const raw = (await reader.read(size)).toString('utf8')
    try {
      return { value: JSON.parse(raw) }
    } catch {
      return { error: { kind: 'badprint', msg: raw } }
    }
  }
  const kind = (await reader.read(1))[0] == 99 ? 'compile' : 'runtime'
  const size = (await reader.read(4)).readInt32BE(0)
  const msg = (await reader.read(size)).toString('utf8')
  return { error: { kind, msg } }
}

async function processChunk(child, reader, start, end) {
  const failRest = (i, msg) => {
    for (let k = i; k < end; k++) {
      if (!results[k]) results[k] = { error: { kind: 'runtime', msg } }
    }
  }
  for (let i = start; i < end; i++) {
    try {
      await writeRequest(child.stdin, entries[i].entry.code)
    } catch (e) {
      failRest(i, `worker io: ${e.message}`)
      return
    }
    try {
      results[i] = await readResult(reader)
    } catch (e) {
      failRest(i, `worker io: ${e.message}`)
      return
    }
    done += 1
    if (done % 25 == 0) process.stderr.write(`${done}/${entries.length}\n`)
  }
}

const requested = Number(process.env.JAVA_CROSS_CHECK_WORKERS || 0)
const workerCount =
  requested > 0
    ? Math.max(1, Math.min(requested, entries.length))
    : Math.max(1, Math.min(8, cpus().length, entries.length))
const chunkSize = Math.ceil(entries.length / workerCount)

const children = []
const workerPromises = []
for (let w = 0; w < workerCount; w++) {
  const start = w * chunkSize
  const end = Math.min(entries.length, start + chunkSize)
  if (start >= end) continue
  const child = spawn('java', ['-cp', dir, 'Harness'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  })
  children.push(child)
  child.stderr.on('data', () => {})
  const reader = frameReader(child.stdout)
  workerPromises.push(processChunk(child, reader, start, end))
}

await Promise.all(workerPromises)
for (const child of children) {
  child.stdin.end()
}
await Promise.all(
  children.map((child) =>
    child.exitCode != null
      ? Promise.resolve()
      : new Promise((resolve) => child.once('exit', resolve)),
  ),
)
rmSync(dir, { recursive: true, force: true })

function summary(text) {
  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .slice(0, 2)
    .join(' | ')
}

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
    detail = `expected ${JSON.stringify(entry.output)}, but Java ${actual.error.kind} error: ${actual.error.msg}`
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
