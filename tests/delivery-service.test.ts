import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  createDeliveryWithAssignments,
  deleteDeliveryWithResources,
  updateDeliveryStatusWithResources,
} from "@/lib/delivery-service"

function createDatabaseMock() {
  const tx = {
    driver: {
      update: vi.fn().mockResolvedValue({ id: 2 }),
    },
    vehicle: {
      update: vi.fn().mockResolvedValue({ id: 3 }),
    },
    delivery: {
      create: vi.fn().mockResolvedValue({ id: 10 }),
      findUnique: vi.fn().mockResolvedValue({
        status: "IN_TRANSIT",
        driverId: 2,
        vehicleId: 3,
      }),
      update: vi.fn().mockResolvedValue({ id: 10 }),
      delete: vi.fn().mockResolvedValue({ id: 10 }),
    },
  }

  const database = {
    $transaction: vi.fn(
      async (callback: (client: typeof tx) => Promise<unknown>) =>
        callback(tx)
    ),
  }

  return {
    tx,
    database: database as unknown as Parameters<
      typeof createDeliveryWithAssignments
    >[0],
  }
}

const deliveryInput = {
  origin: "Paris",
  destination: "Nantes",
  clientId: 1,
  driverId: 2,
  vehicleId: 3,
  scheduledAt: new Date("2026-09-01T10:30:00.000Z"),
}

describe("logique métier Delivery", () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it("crée une livraison et occupe le chauffeur et le véhicule", async () => {
    const { database, tx } = createDatabaseMock()

    await createDeliveryWithAssignments(database, deliveryInput, "NX-123456")

    expect(tx.driver.update).toHaveBeenCalledWith({
      where: { id: 2, status: "AVAILABLE" },
      data: { status: "ON_DELIVERY" },
    })
    expect(tx.vehicle.update).toHaveBeenCalledWith({
      where: { id: 3, status: "AVAILABLE" },
      data: { status: "ON_DELIVERY" },
    })
    expect(tx.delivery.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        reference: "NX-123456",
        status: "ASSIGNED",
        clientId: 1,
        driverId: 2,
        vehicleId: 3,
      }),
    })
  })

  it("termine une livraison, date la livraison et libère les ressources", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-09-01T12:00:00.000Z"))
    const { database, tx } = createDatabaseMock()

    await updateDeliveryStatusWithResources(database, 10, "DELIVERED")

    expect(tx.delivery.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date("2026-09-01T12:00:00.000Z"),
      },
    })
    expect(tx.driver.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { status: "AVAILABLE" },
    })
    expect(tx.vehicle.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { status: "AVAILABLE" },
    })
  })

  it("annule une livraison et libère les ressources", async () => {
    const { database, tx } = createDatabaseMock()

    await updateDeliveryStatusWithResources(database, 10, "CANCELLED")

    expect(tx.delivery.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { status: "CANCELLED", deliveredAt: null },
    })
    expect(tx.driver.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { status: "AVAILABLE" },
    })
    expect(tx.vehicle.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { status: "AVAILABLE" },
    })
  })

  it("supprime une livraison active et libère les ressources", async () => {
    const { database, tx } = createDatabaseMock()

    await deleteDeliveryWithResources(database, 10)

    expect(tx.delivery.delete).toHaveBeenCalledWith({ where: { id: 10 } })
    expect(tx.driver.update).toHaveBeenCalledWith({
      where: { id: 2 },
      data: { status: "AVAILABLE" },
    })
    expect(tx.vehicle.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { status: "AVAILABLE" },
    })
  })

  it("refuse la création si le chauffeur n'est plus disponible", async () => {
    const { database, tx } = createDatabaseMock()
    tx.driver.update.mockRejectedValueOnce(
      new Error("Le chauffeur n'est pas disponible")
    )

    await expect(
      createDeliveryWithAssignments(database, deliveryInput, "NX-123456")
    ).rejects.toThrow("chauffeur")
    expect(tx.delivery.create).not.toHaveBeenCalled()
  })

  it("refuse la création si le véhicule n'est plus disponible", async () => {
    const { database, tx } = createDatabaseMock()
    tx.vehicle.update.mockRejectedValueOnce(
      new Error("Le véhicule n'est pas disponible")
    )

    await expect(
      createDeliveryWithAssignments(database, deliveryInput, "NX-123456")
    ).rejects.toThrow("véhicule")
    expect(tx.delivery.create).not.toHaveBeenCalled()
  })
})
