const positiveIntegerPattern = /^[1-9]\d*$/

export function parseRouteId(value: string): number | null {
  if (!positiveIntegerPattern.test(value)) {
    return null
  }

  const id = Number(value)

  return Number.isSafeInteger(id) ? id : null
}
