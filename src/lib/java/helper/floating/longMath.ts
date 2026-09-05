// Emulation of Java 64-bit (long) arithmetic helpers using BigInt.
//
// JavaScript numbers cannot represent all 64-bit integers exactly, so every
// operation that mirrors a Java `long` computation is performed with BigInt
// and reduced to the signed 64-bit range where Java would wrap around.

export const MASK_63 = (1n << 63n) - 1n
export const MASK_32 = (1n << 32n) - 1n

export function asLong(x: bigint): bigint {
  return BigInt.asIntN(64, x)
}

export function asInt(x: bigint): number {
  return Number(BigInt.asIntN(32, x))
}

// High 64 bits of the signed 128-bit product a * b (java.lang.Math.multiplyHigh).
export function multiplyHigh(a: bigint, b: bigint): bigint {
  return (a * b) >> 64n
}

// Java long left shift: `x << n` (shift count masked to 6 bits, result wrapped).
export function shlLong(x: bigint, n: number): bigint {
  return asLong(x << BigInt(n & 63))
}

// Java long logical right shift: `x >>> n`.
export function ushrLong(x: bigint, n: number): bigint {
  return BigInt.asUintN(64, x) >> BigInt(n & 63)
}
