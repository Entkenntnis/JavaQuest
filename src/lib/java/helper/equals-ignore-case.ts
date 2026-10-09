export function equalsIgnoreCase(a: string, b: string): boolean {
  if (a.length != b.length) return false
  for (let i = 0; i < a.length; i++) {
    const c1 = a.charCodeAt(i)
    const c2 = b.charCodeAt(i)
    if (c1 === c2) continue
    const u1 = javaCharUpper(c1)
    const u2 = javaCharUpper(c2)
    if (u1 == u2) continue
    if (javaCharLower(u1) === javaCharLower(u2)) continue
    return false
  }
  return true
}

export function javaCharUpper(c: number): number {
  const s = String.fromCharCode(c).toUpperCase()
  return s.length === 1 ? s.charCodeAt(0) : c
}

export function javaCharLower(c: number): number {
  return String.fromCharCode(c).toLowerCase().charCodeAt(0)
}
