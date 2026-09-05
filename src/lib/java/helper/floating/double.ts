// A faithful TypeScript port of jdk.internal.math.DoubleToDecimal (OpenJDK),
// which implements Double.toString. It replicates the exact Schubfach-based
// algorithm, including 64-bit arithmetic semantics.
//
// See the reference file DoubleToDecimal.java in this directory.

import {
  flog10pow2,
  flog10threeQuartersPow2,
  flog2pow10,
  g0,
  g1,
  pow10,
} from './mathUtils.ts'
import { asLong, MASK_63, multiplyHigh, shlLong, ushrLong } from './longMath.ts'
import { MASK_28, Out, yOf } from './toDecimal.ts'

const P = 53
const W = 11
const Q_MIN = (-1 << (W - 1)) - P + 3
const C_MIN = 1n << 52n
const H = 17
const C_TINY = 3n
const BQ_MASK = (1 << W) - 1
const T_MASK = (1n << 52n) - 1n

const C_HM = 193_428_131_138_340_668n
const C_H = 1_441_151_881n
const K_SP10 = 1844674407370955168n // 115_292_150_460_684_698L << 4

const ONE_HUNDRED_MILLION = 100_000_000n

const buffer = new ArrayBuffer(8)
const f64 = new Float64Array(buffer)
const u64 = new BigUint64Array(buffer)

// Replicates DoubleToDecimal.toDecimal for the special cases as well as the
// finite path, mirroring the pair (size, type) split used by toString().
function render(bits: bigint): string {
  const t = bits & T_MASK
  const bq = Number(bits >> 52n) & BQ_MASK
  if (bq < BQ_MASK) {
    const neg = (bits & (1n << 63n)) !== 0n
    if (bq !== 0) {
      /* normal value. Here mq = -q */
      const mq = -Q_MIN + 1 - bq
      const c = C_MIN | t
      const w = new Out()
      /* The fast path discussed in section 8.3 of [1] */
      if (0 < mq && mq < P) {
        const f = c >> BigInt(mq)
        if (f << BigInt(mq) === c) {
          toChars(w, f, 0)
          return withSign(w, neg)
        }
      }
      toDecimal(w, -mq, c, 0)
      return withSign(w, neg)
    }
    if (t !== 0n) {
      /* subnormal value */
      const w = new Out()
      if (t < C_TINY) {
        toDecimal(w, Q_MIN, 10n * t, -1)
      } else {
        toDecimal(w, Q_MIN, t, 0)
      }
      return withSign(w, neg)
    }
    return neg ? '-0.0' : '0.0'
  }
  if (t !== 0n) {
    return 'NaN'
  }
  return (bits & (1n << 63n)) !== 0n ? '-Infinity' : 'Infinity'
}

function withSign(w: Out, neg: boolean): string {
  const s = w.toString()
  return neg ? '-' + s : s
}

/**
 * Returns a string representation of the {@code double} argument, with the
 * exact same semantics as {@code Double.toString}.
 */
export function printDouble(v: number): string {
  f64[0] = v
  return render(u64[0])
}

// Replicates DoubleToDecimal.toDecimal for a finite value given as c * 2^q,
// writing digits into w.
function toDecimal(w: Out, q: number, c: bigint, dk: number): void {
  const out = Number(c & 1n)
  const cb = c << 2n
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
  const h = q + flog2pow10(-k) + 2

  const g1v = g1(-k)
  const g0v = g0(-k)

  const vb = rop(g1v, g0v, shlLong(cb, h))
  const vbl = rop(g1v, g0v, shlLong(cbl, h))
  const vbr = rop(g1v, g0v, shlLong(cbr, h))

  const s = vb >> 2n
  if (s >= 100n) {
    const sp10 = 10n * multiplyHigh(s, K_SP10)
    const tp10 = sp10 + 10n
    const upin = vbl + BigInt(out) <= sp10 << 2n
    const wpin = (tp10 << 2n) + BigInt(out) <= vbr
    if (upin !== wpin) {
      toChars(w, upin ? sp10 : tp10, k)
      return
    }
  }

  const t = s + 1n
  const uin = vbl + BigInt(out) <= s << 2n
  const win = (t << 2n) + BigInt(out) <= vbr
  if (uin !== win) {
    toChars(w, uin ? s : t, k + dk)
    return
  }
  const cmp = vb - ((s + t) << 1n)
  const away = cmp > 0n || (cmp === 0n && (s & 1n) !== 0n)
  toChars(w, away ? t : s, k + dk)
}

// Computes rop(cp g 2^(-127)), where g = g1 2^63 + g0. See section 9.9 of [1].
function rop(g1v: bigint, g0v: bigint, cp: bigint): bigint {
  const x1 = multiplyHigh(g0v, cp)
  const y0 = asLong(g1v * cp)
  const y1 = multiplyHigh(g1v, cp)
  const z = asLong(ushrLong(y0, 1) + x1)
  const vbp = asLong(y1 + ushrLong(z, 63))
  return asLong(vbp | ushrLong((z & MASK_63) + MASK_63, 63))
}

function bitLength(x: bigint): number {
  return x.toString(2).length
}

// Formats the decimal f 10^e.
function toChars(w: Out, f: bigint, e: number): void {
  let len = flog10pow2(bitLength(f))
  if (f >= pow10(len)) {
    len += 1
  }

  /*
   * Transform f and e to ensure
   *     10^(H-1) <= f < 10^H
   */
  f *= pow10(H - len)
  e += len

  const hm = ushrLong(multiplyHigh(f, C_HM), 20)
  const l = Number(f - ONE_HUNDRED_MILLION * hm)
  const h = Number(ushrLong(hm * C_H, 57))
  const m = Number(hm - ONE_HUNDRED_MILLION * BigInt(h))

  if (0 < e && e <= 7) {
    toChars1(w, h, m, l, e)
  } else if (-3 < e && e <= 0) {
    toChars2(w, h, m, l, e)
  } else {
    toChars3(w, h, m, l, e)
  }
}

// 0 < e <= 7: plain format without leading zeroes.
function toChars1(w: Out, h: number, m: number, l: number, e: number): void {
  w.putDigit(h)
  let yy = yOf(m)
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
  lowDigits(w, l)
}

// -3 < e <= 0: plain format with leading zeroes.
function toChars2(w: Out, h: number, m: number, l: number, e: number): void {
  w.putDigit(0)
  w.putChar(46)
  for (; e < 0; ++e) {
    w.putDigit(0)
  }
  w.putDigit(h)
  w.put8Digits(m)
  lowDigits(w, l)
}

// -3 >= e | e > 7: computerized scientific notation.
function toChars3(w: Out, h: number, m: number, l: number, e: number): void {
  w.putDigit(h)
  w.putChar(46)
  w.put8Digits(m)
  lowDigits(w, l)
  exponent(w, e - 1)
}

function lowDigits(w: Out, l: number): void {
  if (l !== 0) {
    w.put8Digits(l)
  }
  w.removeTrailingZeros()
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
  let d: number
  if (e >= 100) {
    d = (e * 1311) >>> 17
    w.putDigit(d)
    e -= 100 * d
  }
  d = (e * 103) >>> 10
  w.putDigit(d)
  w.putDigit(e - 10 * d)
}
