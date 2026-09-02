import { describe, expect, it } from "vitest"

import { parseRouteId } from "@/lib/route-id"

describe("parseRouteId", () => {
  it("accepte uniquement un entier positif sûr", () => {
    expect(parseRouteId("42")).toBe(42)
  })

  it.each(["abc", "0", "-1", "1.5", " 1", "9007199254740992"])(
    "rejette l'identifiant invalide %s avant Prisma",
    (value) => {
      expect(parseRouteId(value)).toBeNull()
    }
  )
})
