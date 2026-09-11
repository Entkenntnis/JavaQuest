import type {
  JavaValue,
  JavaWrapperObject,
  MethodMetaData,
  Prim,
  Type,
  TypeData,
} from '../../state/types'
import { classMetaData } from '../classmeta'

export function isIdentityOrWideningCast(
  from: JavaValue['type'],
  to: Prim,
): boolean {
  if (from == 'boolean' && to == 'boolean') {
    return true
  }
  if (from == 'byte' && to != 'boolean' && to != 'char') return true

  if (from == 'short' && to != 'boolean' && to != 'char' && to != 'byte')
    return true

  if (from == 'char' && to != 'boolean' && to != 'short' && to != 'byte')
    return true

  if (
    from == 'int' &&
    (to == 'int' || to == 'long' || to == 'float' || to == 'double')
  )
    return true

  if (from == 'long' && (to == 'long' || to == 'float' || to == 'double'))
    return true

  if (from == 'float' && (to == 'float' || to == 'double')) return true

  if (from == 'double' && to == 'double') return true

  // re
  return false
}

export const typeToWrapper: Record<Prim, JavaWrapperObject['class']> = {
  byte: 'java.lang.Byte',
  short: 'java.lang.Short',
  char: 'java.lang.Character',
  int: 'java.lang.Integer',
  long: 'java.lang.Long',
  float: 'java.lang.Float',
  double: 'java.lang.Double',
  boolean: 'java.lang.Boolean',
}

const wrapperToPrim: Record<string, Prim> = {
  'java.lang.Byte': 'byte',
  'java.lang.Short': 'short',
  'java.lang.Character': 'char',
  'java.lang.Integer': 'int',
  'java.lang.Long': 'long',
  'java.lang.Float': 'float',
  'java.lang.Double': 'double',
  'java.lang.Boolean': 'boolean',
}

export function typeDataEquals(a: TypeData, b: TypeData) {
  if (!a || !b) return a == b
  const aHasKind = 'kind' in a
  const bHasKind = 'kind' in b
  if (aHasKind != bHasKind) return false
  // boxed are the same
  if (!aHasKind || !bHasKind) return true
  return typeEquals(a, b)
}

export function typeEquals(a: Type, b: Type): boolean {
  if (a.kind == 'primitive' && b.kind == 'primitive') {
    return a.prim == b.prim
  }
  if (a.kind == 'class' && b.kind == 'class') {
    return a.name == b.name
  }
  if (a.kind == 'array' && b.kind == 'array') {
    return typeEquals(a.elem, b.elem)
  }
  return false
}

function classChain(className: string): string[] {
  const chain: string[] = []
  const seen = new Set<string>()
  let current: string | null = className
  while (current) {
    if (seen.has(current)) {
      throw `Interner Systemfehler: Zyklische Vererbung bei Klasse "${current}"`
    }
    seen.add(current)
    if (!classMetaData[current]) {
      throw `Interner Systemfehler: Klasse "${current}" nicht gefunden`
    }
    chain.push(current)
    current = classMetaData[current].superClass
  }
  return chain
}

export function isSubtype(sub: string, sup: string): boolean {
  if (sub == sup) return true
  const seen = new Set<string>()
  const stack = [sub]
  while (stack.length > 0) {
    const name = stack.pop()
    if (!name || seen.has(name)) continue
    seen.add(name)
    const meta = classMetaData[name]
    if (!meta) throw `Interner Systemfehler: Klasse "${name}" nicht gefunden`
    if (meta.superClass) {
      if (meta.superClass == sup) return true
      stack.push(meta.superClass)
    }
    for (const iface of meta.interfaces) {
      if (iface == sup) return true
      stack.push(iface)
    }
  }
  return false
}

export function isAssignable(target: Type, source: Type): boolean {
  if (typeEquals(target, source)) return true

  if (target.kind == 'array' && source.kind == 'array') {
    return isAssignable(target.elem, source.elem)
  }

  if (target.kind == 'class') {
    if (source.kind == 'class') {
      return isSubtype(source.name, target.name)
    }
    if (source.kind == 'primitive') {
      return isSubtype(typeToWrapper[source.prim], target.name)
    }
  }

  if (target.kind == 'primitive') {
    if (source.kind == 'primitive') {
      return isIdentityOrWideningCast(source.prim, target.prim)
    }
    if (source.kind == 'class') {
      const unboxed = wrapperToPrim[source.name]
      return (
        unboxed != undefined && isIdentityOrWideningCast(unboxed, target.prim)
      )
    }
    return false
  }

  return false
}

export function findMethod(
  className: string,
  name: string,
  argTypes: Type[],
): MethodMetaData | undefined {
  const candidates: MethodMetaData[] = []
  for (const current of classChain(className)) {
    const meta = classMetaData[current]
    if (!meta) throw `Interner Systemfehler: Klasse "${current}" nicht gefunden`
    for (const method of meta.methods) {
      if (method.name != name) continue
      if (method.sig.params.length != argTypes.length) continue
      candidates.push(method)
    }
  }

  for (const method of candidates) {
    if (method.sig.params.every((p, i) => typeEquals(p, argTypes[i]))) {
      return method
    }
  }

  for (const method of candidates) {
    if (method.sig.params.every((p, i) => isAssignable(p, argTypes[i]))) {
      return method
    }
  }

  return undefined
}

// Whether any method with this name exists in the class hierarchy, regardless of
// its parameter list. Used to tell "unknown method" apart from "no applicable
// overload" for javac-style error messages.
export function hasMethodNamed(className: string, name: string): boolean {
  for (const current of classChain(className)) {
    const meta = classMetaData[current]
    if (!meta) throw `Interner Systemfehler: Klasse "${current}" nicht gefunden`
    for (const method of meta.methods) {
      if (method.name == name) return true
    }
  }
  return false
}
