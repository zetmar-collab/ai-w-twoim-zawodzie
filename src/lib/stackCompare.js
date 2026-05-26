function toolKey(tool) {
  return (tool.name || '').trim().toLowerCase()
}

export function compareStacks(stackA, stackB) {
  const a = Array.isArray(stackA) ? stackA : []
  const b = Array.isArray(stackB) ? stackB : []

  const namesB = new Set(b.map(toolKey))
  const namesA = new Set(a.map(toolKey))

  const onlyInA = a.filter((tool) => !namesB.has(toolKey(tool)))
  const onlyInB = b.filter((tool) => !namesA.has(toolKey(tool)))
  const inBoth = a.filter((tool) => namesB.has(toolKey(tool)))

  return {
    onlyInA,
    onlyInB,
    inBoth,
    countA: a.length,
    countB: b.length,
  }
}
