import type { PrismaClient } from "@/app/generated/prisma/client"
import type {
  DeliveryInput,
  DeliveryStatusInput,
} from "@/lib/validations"

type DeliveryDatabase = Pick<PrismaClient, "$transaction">

const activeStatuses: readonly string[] = [
  "PENDING",
  "ASSIGNED",
  "IN_TRANSIT",
  "DELAYED",
] as const

export async function createDeliveryWithAssignments(
  database: DeliveryDatabase,
  data: DeliveryInput,
  reference: string
) {
  return database.$transaction(async (tx) => {
    await tx.driver.update({
      where: {
        id: data.driverId,
        status: "AVAILABLE",
      },
      data: {
        status: "ON_DELIVERY",
      },
    })

    await tx.vehicle.update({
      where: {
        id: data.vehicleId,
        status: "AVAILABLE",
      },
      data: {
        status: "ON_DELIVERY",
      },
    })

    return tx.delivery.create({
      data: {
        reference,
        origin: data.origin,
        destination: data.destination,
        scheduledAt: data.scheduledAt,
        notes: data.notes,
        status: "ASSIGNED",
        clientId: data.clientId,
        driverId: data.driverId,
        vehicleId: data.vehicleId,
      },
    })
  })
}

export async function updateDeliveryStatusWithResources(
  database: DeliveryDatabase,
  id: number,
  status: DeliveryStatusInput
) {
  return database.$transaction(async (tx) => {
    const delivery = await tx.delivery.findUnique({
      where: { id },
      select: {
        driverId: true,
        vehicleId: true,
      },
    })

    if (!delivery) {
      throw new Error("Livraison introuvable.")
    }

    const isFinished =
      status === "DELIVERED" || status === "CANCELLED"

    const updatedDelivery = await tx.delivery.update({
      where: { id },
      data: {
        status,
        deliveredAt: status === "DELIVERED" ? new Date() : null,
      },
    })

    await tx.driver.update({
      where: { id: delivery.driverId },
      data: {
        status: isFinished ? "AVAILABLE" : "ON_DELIVERY",
      },
    })

    await tx.vehicle.update({
      where: { id: delivery.vehicleId },
      data: {
        status: isFinished ? "AVAILABLE" : "ON_DELIVERY",
      },
    })

    return updatedDelivery
  })
}

export async function deleteDeliveryWithResources(
  database: DeliveryDatabase,
  id: number
) {
  return database.$transaction(async (tx) => {
    const delivery = await tx.delivery.findUnique({
      where: { id },
      select: {
        status: true,
        driverId: true,
        vehicleId: true,
      },
    })

    if (!delivery) {
      throw new Error("Livraison introuvable.")
    }

    const deletedDelivery = await tx.delivery.delete({
      where: { id },
    })

    if (activeStatuses.includes(delivery.status)) {
      await tx.driver.update({
        where: { id: delivery.driverId },
        data: { status: "AVAILABLE" },
      })

      await tx.vehicle.update({
        where: { id: delivery.vehicleId },
        data: { status: "AVAILABLE" },
      })
    }

    return deletedDelivery
  })
}
