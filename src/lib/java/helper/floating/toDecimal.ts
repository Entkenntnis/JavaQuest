// Port of the character-emitting machinery of jdk.internal.math.ToDecimal.
//
// The JDK class writes characters into a byte[] with an encoding abstraction
// (LATIN1 / UTF16). Here the output is accumulated as char codes in an array,
// which behaves the same way for the purpose of the algorithm (including the
// backwards index moves performed by removeTrailingZeroes).

import { multiplyHigh } from './longMath.ts'

export const MASK_28 = (1 << 28) - 1

const C_SPLIT = 193_428_131_138_340_668n

// ToDecimal.y(a): algorithm 1 in [3] (Bouvier & Zimmermann), b = 10, k = 8,
// n = 28. Computes floor((a + 1) 2^n / b^k) - 1.
export function yOf(a: number): number {
  return Number(multiplyHigh((BigInt(a) + 1n) << 28n, C_SPLIT) >> 20n) - 1
}

export class Out {
  private readonly codes: number[] = []

  putChar(c: number): void {
    this.codes.push(c)
  }

  putDigit(d: number): void {
    this.codes.push(48 + d)
  }

  put8Digits(m: number): void {
    let yy = yOf(m)
    for (let i = 0; i < 8; ++i) {
      const t = 10 * yy
      this.codes.push(48 + (t >>> 28))
      yy = t & MASK_28
    }
  }

  removeTrailingZeros(): void {
    while (this.codes.length > 0 && this.codes[this.codes.length - 1] === 48) {
      this.codes.pop()
    }
    if (this.codes.length > 0 && this.codes[this.codes.length - 1] === 46) {
      this.codes.push(48)
    }
  }

  toString(): string {
    return String.fromCharCode(...this.codes)
  }
}
