// A faithful TypeScript port of jdk.internal.math.FloatToDecimal (OpenJDK),
// which implements Float.toString. It replicates the exact Schubfach-based
// algorithm over 32-bit float bits.
//
// See the reference file FloatToDecimal.java in this directory.

import {
  flog10pow2,
  flog10threeQuartersPow2,
  flog2pow10,
  g1,
  pow10,
} from './mathUtils.ts'
import {
  asInt,
  asLong,
  MASK_32,
  multiplyHigh,
  shlLong,
  ushrLong,
} from './longMath.ts'
import { MASK_28, Out, yOf } from './toDecimal.ts'

const P = 24
const W = 8
const Q_MIN = (-1 << (W - 1)) - P + 3
const C_MIN = 1 << (P - 1)
const H = 9
const C_TINY = 8
const BQ_MASK = (1 << W) - 1
const T_MASK = (1 << (P - 1)) - 1

const C_H = 1_441_151_881n
const C_SP10 = 1_717_986_919n

const ONE_HUNDRED_MILLION = 100_000_000

const buffer = new ArrayBuffer(4)
const f32 = new Float32Array(buffer)
const u32 = new Uint32Array(buffer)

const i32 = (x: number): number => x | 0

function render(bits: number): string {
  const t = bits & T_MASK
  const bq = (bits >>> (P - 1)) & BQ_MASK
  if (bq < BQ_MASK) {
    const neg = (bits & 0x80000000) !== 0
    if (bq !== 0) {
      /* normal value. Here mq = -q */
      const mq = -Q_MIN + 1 - bq
      const c = C_MIN | t
      const w = new Out()
      /* The fast path discussed in section 8.3 of [1] */
      if (0 < mq && mq < P) {
        const f = c >> mq
        if (f << mq === c) {
          toChars(w, f, 0)
          return withSign(w, neg)
        }
      }
      toDecimal(w, -mq, c, 0)
      return withSign(w, neg)
    }
    if (t !== 0) {
      /* subnormal value */
      const w = new Out()
      if (t < C_TINY) {
        toDecimal(w, Q_MIN, 10 * t, -1)
      } else {
        toDecimal(w, Q_MIN, t, 0)
      }
      return withSign(w, neg)
    }
    return neg ? '-0.0' : '0.0'
  }
  if (t !== 0) {
    return 'NaN'
  }
  return (bits & 0x80000000) !== 0 ? '-Infinity' : 'Infinity'
}

function withSign(w: Out, neg: boolean): string {
  const s = w.toString()
  return neg ? '-' + s : s
}

/**
 * Returns a string representation of the {@code float} argument, with the same
 * semantics as {@code Float.toString}. The argument is first rounded to a
 * 32-bit float (as Java would, since its value range only has float
 * precision).
 */
export function printFloat(v: number): string {
  f32[0] = Math.fround(v)
  return render(u32[0])
}

// Replicates FloatToDecimal.toDecimal for a finite value c * 2^q.
function toDecimal(w: Out, q: number, c: number, dk: number): void {
  const out = c & 0x1
  const cb = BigInt(c) << 2n
  const cbr = cb + 2n
  let cbl: bigint
  let k: number
  if (c !== C_MIN || q === Q_MIN) {
    /* regular spacing */
    cbl = cb - 2n
    k = flog10pow2(q)
  } else {
    /* irregular spacing */
    cbl = cb - 1n
    k = flog10threeQuartersPow2(q)
  }
  const h = q + flog2pow10(-k) + 33

  const g = g1(-k) + 1n

  const vb = rop(g, shlLong(cb, h))
  const vbl = rop(g, shlLong(cbl, h))
  const vbr = rop(g, shlLong(cbr, h))

  const s = vb >> 2
  if (s >= 100) {
    const sp10 = 10 * asInt(ushrLong(BigInt(s) * C_SP10, 34))
    const tp10 = sp10 + 10
    const upin = i32(vbl + out) <= sp10 << 2
    const wpin = i32((tp10 << 2) + out) <= vbr
    if (upin !== wpin) {
      toChars(w, upin ? sp10 : tp10, k)
      return
    }
  }

  const t = s + 1
  const uin = i32(vbl + out) <= s << 2
  const win = i32((t << 2) + out) <= vbr
  if (uin !== win) {
    toChars(w, uin ? s : t, k + dk)
    return
  }
  const cmp = i32(vb - ((s + t) << 1))
  const away = cmp > 0 || (cmp === 0 && (s & 0x1) !== 0)
  toChars(w, away ? t : s, k + dk)
}

// Computes rop(cp g 2^(-95)). See the appendix of [1].
function rop(g: bigint, cp: bigint): number {
  const x1 = multiplyHigh(g, cp)
  const vbp = ushrLong(x1, 31)
  const t = ushrLong(asLong((x1 & MASK_32) + MASK_32), 32)
  return asInt(vbp | t)
}

function bitLength(x: number): number {
  return 32 - Math.clz32(x)
}

// Formats the decimal f 10^e.
function toChars(w: Out, f: number, e: number): void {
  let len = flog10pow2(bitLength(f))
  if (f >= Number(pow10(len))) {
    len += 1
  }

  /*
   * Transform f and e to ensure
   *     10^(H-1) <= f < 10^H
   */
  f = i32(f * Number(pow10(H - len)))
  e += len

  const h = Number(ushrLong(BigInt(f) * C_H, 57))
  const l = f - ONE_HUNDRED_MILLION * h

  if (0 < e && e <= 7) {
    toChars1(w, h, l, e)
  } else if (-3 < e && e <= 0) {
    toChars2(w, h, l, e)
  } else {
    toChars3(w, h, l, e)
  }
}

// 0 < e <= 7: plain format without leading zeroes.
function toChars1(w: Out, h: number, l: number, e: number): void {
  w.putDigit(h)
  let yy = yOf(l)
  let t: number
  let i = 1
  for (; i < e; ++i) {
    t = 10 * yy
    w.putDigit(t >>> 28)
    yy = t & MASK_28
  }
  w.putChar(46)
  for (; i <= 8; ++i) {
    t = 10 * yy
    w.putDigit(t >>> 28)
    yy = t & MASK_28
  }
  w.removeTrailingZeros()
}

// -3 < e <= 0: plain format with leading zeroes.
function toChars2(w: Out, h: number, l: number, e: number): void {
  w.putDigit(0)
  w.putChar(46)
  for (; e < 0; ++e) {
    w.putDigit(0)
  }
  w.putDigit(h)
  w.put8Digits(l)
  w.removeTrailingZeros()
}

// -3 >= e | e > 7: computerized scientific notation.
function toChars3(w: Out, h: number, l: number, e: number): void {
  w.putDigit(h)
  w.putChar(46)
  w.put8Digits(l)
  w.removeTrailingZeros()
  exponent(w, e - 1)
}

function exponent(w: Out, e: number): void {
  w.putChar(69)
  if (e < 0) {
    w.putChar(45)
    e = -e
  }
  if (e < 10) {
    w.putDigit(e)
    return
  }
  const d = (e * 103) >>> 10
  w.putDigit(d)
  w.putDigit(e - 10 * d)
}
