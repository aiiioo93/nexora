import { describe, expect, it } from "vitest"

import {
  clientSchema,
  deliverySchema,
  driverSchema,
  vehicleSchema,
} from "@/lib/validations"

describe("clientSchema", () => {
  const validClient = {
    name: "Sophie Martin",
    email: "sophie@example.com",
  }

  it("accepte un nom et un email valides", () => {
    expect(clientSchema.safeParse(validClient).success).toBe(true)
  })

  it("rejette un email invalide", () => {
    expect(
      clientSchema.safeParse({
        ...validClient,
        email: "adresse-invalide",
      }).success
    ).toBe(false)
  })
})

describe("driverSchema", () => {
  const validDriver = {
    firstName: "Mamadou",
    lastName: "Diallo",
    email: "mamadou@example.com",
    licenseNumber: "NX-PER-001",
    status: "AVAILABLE",
  }

  it("accepte un prénom, un nom, un email et un permis valides", () => {
    expect(driverSchema.safeParse(validDriver).success).toBe(true)
  })

  it("rejette un prénom ou un nom trop court", () => {
    expect(
      driverSchema.safeParse({ ...validDriver, firstName: "M" }).success
    ).toBe(false)
    expect(
      driverSchema.safeParse({ ...validDriver, lastName: "D" }).success
    ).toBe(false)
  })

  it("rejette un email invalide", () => {
    expect(
      driverSchema.safeParse({ ...validDriver, email: "invalide" }).success
    ).toBe(false)
  })

  it("rejette un numéro de permis trop court", () => {
    expect(
      driverSchema.safeParse({ ...validDriver, licenseNumber: "NX" }).success
    ).toBe(false)
  })

  it("n'accepte que les statuts chauffeur autorisés", () => {
    expect(
      driverSchema.safeParse({ ...validDriver, status: "MAINTENANCE" }).success
    ).toBe(false)
  })
})

describe("vehicleSchema", () => {
  const validVehicle = {
    registration: "NX-101-AA",
    brand: "Renault",
    model: "Master",
    year: 2024,
    mileage: 0,
    status: "AVAILABLE",
  }

  it("accepte une année valide", () => {
    expect(vehicleSchema.safeParse(validVehicle).success).toBe(true)
  })

  it("rejette une année hors limites", () => {
    expect(
      vehicleSchema.safeParse({ ...validVehicle, year: 1899 }).success
    ).toBe(false)
  })

  it("exige un kilométrage positif ou nul", () => {
    expect(
      vehicleSchema.safeParse({ ...validVehicle, mileage: -1 }).success
    ).toBe(false)
  })

  it("n'accepte que les statuts véhicule autorisés", () => {
    expect(
      vehicleSchema.safeParse({ ...validVehicle, status: "OFF_DUTY" }).success
    ).toBe(false)
  })
})

describe("deliverySchema", () => {
  const validDelivery = {
    clientId: 1,
    driverId: 2,
    vehicleId: 3,
    scheduledAt: "2026-09-01T10:30:00.000Z",
    origin: "Paris",
    destination: "Nantes",
  }

  it("accepte des relations, une date et un trajet valides", () => {
    expect(deliverySchema.safeParse(validDelivery).success).toBe(true)
  })

  it.each(["clientId", "driverId", "vehicleId"] as const)(
    "exige que %s soit un entier positif",
    (field) => {
      expect(
        deliverySchema.safeParse({ ...validDelivery, [field]: 0 }).success
      ).toBe(false)
    }
  )

  it("rejette une date invalide", () => {
    expect(
      deliverySchema.safeParse({
        ...validDelivery,
        scheduledAt: "date-invalide",
      }).success
    ).toBe(false)
  })

  it("exige une origine et une destination", () => {
    expect(
      deliverySchema.safeParse({ ...validDelivery, origin: "" }).success
    ).toBe(false)
    expect(
      deliverySchema.safeParse({ ...validDelivery, destination: "" }).success
    ).toBe(false)
  })
})
