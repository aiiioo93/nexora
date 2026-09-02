import prisma from "../lib/prisma"
import {
  createDeliveryWithAssignments,
  deleteDeliveryWithResources,
  updateDeliveryStatusWithResources,
} from "../lib/delivery-service"
import { deliverySchema } from "../lib/validations"

const summaryLabels = [
  "Connection Supabase",
  "Create test resources",
  "Create Delivery",
  "Driver -> ON_DELIVERY",
  "Vehicle -> ON_DELIVERY",
  "IN_TRANSIT",
  "DELIVERED",
  "deliveredAt",
  "Driver -> AVAILABLE",
  "Vehicle -> AVAILABLE",
  "Delete active Delivery",
  "Release Driver",
  "Release Vehicle",
  "Cleanup",
] as const

type SummaryLabel = (typeof summaryLabels)[number]

const summary = new Map<SummaryLabel, boolean>()
const deliveryIds = new Set<number>()

let clientId: number | null = null
let driverId: number | null = null
let vehicleId: number | null = null
let failed = false

function verification(description: string, passed: boolean) {
  console.log(`${passed ? "✅ PASS" : "❌ FAIL"} — ${description}`)

  if (!passed) {
    failed = true
  }

  return passed
}

function record(label: SummaryLabel, passed: boolean) {
  summary.set(label, passed)

  if (!passed) {
    failed = true
  }
}

function requireChecks(stage: string, checks: boolean[]) {
  if (checks.every(Boolean)) {
    return
  }

  throw new Error(`Échec des vérifications de l'étape : ${stage}`)
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function main() {
  const timestamp = Date.now()
  const unique = `${timestamp}_${process.pid}`

  const clientEmail = `smoke-test-client-${unique}@nexora.local`
  const driverEmail = `smoke-test-driver-${unique}@nexora.local`
  const firstReference = `SMOKE_TEST_DELIVERY_1_${unique}`
  const secondReference = `SMOKE_TEST_DELIVERY_2_${unique}`

  console.log("====================================")
  console.log("NEXORA — REAL DATABASE SMOKE TEST")
  console.log("====================================")
  console.log(`Run ID: SMOKE_TEST_${unique}`)
  console.log("")

  try {
    const connectionProbe = await prisma.client.count({
      where: {
        email: `SMOKE_TEST_CONNECTION_PROBE_${unique}@nexora.local`,
      },
    })
    const connectionPassed = verification(
      "La connexion DATABASE_URL exécute une vraie requête PostgreSQL",
      connectionProbe === 0
    )
    record("Connection Supabase", connectionPassed)
    requireChecks("Connexion Supabase", [connectionPassed])

    const client = await prisma.client.create({
      data: {
        name: `SMOKE_TEST_CLIENT_${unique}`,
        email: clientEmail,
        phone: `SMOKE_TEST_PHONE_${unique}`,
        company: `SMOKE_TEST_COMPANY_${unique}`,
      },
    })
    clientId = client.id

    const driver = await prisma.driver.create({
      data: {
        firstName: "SMOKE_TEST",
        lastName: `DRIVER_${unique}`,
        email: driverEmail,
        phone: `SMOKE_TEST_PHONE_${unique}`,
        licenseNumber: `SMOKE-${unique}-LIC`,
        status: "AVAILABLE",
      },
    })
    driverId = driver.id

    const vehicle = await prisma.vehicle.create({
      data: {
        registration: `SMOKE-${unique}-REG`,
        brand: "SMOKE_TEST",
        model: `VEHICLE_${unique}`,
        year: 2026,
        mileage: 0,
        status: "AVAILABLE",
      },
    })
    vehicleId = vehicle.id

    const [storedClient, storedDriver, storedVehicle] = await Promise.all([
      prisma.client.findUnique({ where: { id: clientId } }),
      prisma.driver.findUnique({ where: { id: driverId } }),
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    ])

    const resourceChecks = [
      verification("Le Client temporaire existe", storedClient?.id === clientId),
      verification(
        "Le Driver temporaire existe avec le statut AVAILABLE",
        storedDriver?.id === driverId && storedDriver.status === "AVAILABLE"
      ),
      verification(
        "Le Vehicle temporaire existe avec le statut AVAILABLE",
        storedVehicle?.id === vehicleId && storedVehicle.status === "AVAILABLE"
      ),
    ]
    record("Create test resources", resourceChecks.every(Boolean))
    requireChecks("Création des ressources temporaires", resourceChecks)

    const firstDeliveryInput = deliverySchema.parse({
      origin: `SMOKE_TEST_ORIGIN_${unique}`,
      destination: `SMOKE_TEST_DESTINATION_${unique}`,
      clientId,
      driverId,
      vehicleId,
      scheduledAt: new Date(timestamp + 60 * 60 * 1000),
      notes: `SMOKE_TEST_FIRST_DELIVERY_${unique}`,
    })

    const firstDelivery = await createDeliveryWithAssignments(
      prisma,
      firstDeliveryInput,
      firstReference
    )
    deliveryIds.add(firstDelivery.id)

    const [createdDelivery, busyDriver, busyVehicle] = await Promise.all([
      prisma.delivery.findUnique({ where: { id: firstDelivery.id } }),
      prisma.driver.findUnique({ where: { id: driverId } }),
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    ])

    const deliveryExists = verification(
      "La première Delivery existe en base",
      createdDelivery?.id === firstDelivery.id
    )
    const deliveryAssigned = verification(
      "La première Delivery a le statut ASSIGNED",
      createdDelivery?.status === "ASSIGNED"
    )
    const driverBusy = verification(
      "Le Driver a le statut ON_DELIVERY après création",
      busyDriver?.status === "ON_DELIVERY"
    )
    const vehicleBusy = verification(
      "Le Vehicle a le statut ON_DELIVERY après création",
      busyVehicle?.status === "ON_DELIVERY"
    )

    record("Create Delivery", deliveryExists && deliveryAssigned)
    record("Driver -> ON_DELIVERY", driverBusy)
    record("Vehicle -> ON_DELIVERY", vehicleBusy)
    requireChecks("Création Delivery", [
      deliveryExists,
      deliveryAssigned,
      driverBusy,
      vehicleBusy,
    ])

    await updateDeliveryStatusWithResources(
      prisma,
      firstDelivery.id,
      "IN_TRANSIT"
    )

    const [inTransitDelivery, inTransitDriver, inTransitVehicle] =
      await Promise.all([
        prisma.delivery.findUnique({ where: { id: firstDelivery.id } }),
        prisma.driver.findUnique({ where: { id: driverId } }),
        prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      ])

    const inTransitChecks = [
      verification(
        "La Delivery a le statut IN_TRANSIT",
        inTransitDelivery?.status === "IN_TRANSIT"
      ),
      verification(
        "Le Driver reste ON_DELIVERY pendant le transport",
        inTransitDriver?.status === "ON_DELIVERY"
      ),
      verification(
        "Le Vehicle reste ON_DELIVERY pendant le transport",
        inTransitVehicle?.status === "ON_DELIVERY"
      ),
    ]
    record("IN_TRANSIT", inTransitChecks.every(Boolean))
    requireChecks("Passage IN_TRANSIT", inTransitChecks)

    await updateDeliveryStatusWithResources(
      prisma,
      firstDelivery.id,
      "DELIVERED"
    )

    const [deliveredDelivery, availableDriver, availableVehicle] =
      await Promise.all([
        prisma.delivery.findUnique({ where: { id: firstDelivery.id } }),
        prisma.driver.findUnique({ where: { id: driverId } }),
        prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      ])

    const delivered = verification(
      "La Delivery a le statut DELIVERED",
      deliveredDelivery?.status === "DELIVERED"
    )
    const deliveredAt = verification(
      "deliveredAt est renseigné",
      deliveredDelivery?.deliveredAt instanceof Date
    )
    const driverAvailable = verification(
      "Le Driver repasse AVAILABLE après livraison",
      availableDriver?.status === "AVAILABLE"
    )
    const vehicleAvailable = verification(
      "Le Vehicle repasse AVAILABLE après livraison",
      availableVehicle?.status === "AVAILABLE"
    )

    record("DELIVERED", delivered)
    record("deliveredAt", deliveredAt)
    record("Driver -> AVAILABLE", driverAvailable)
    record("Vehicle -> AVAILABLE", vehicleAvailable)
    requireChecks("Passage DELIVERED", [
      delivered,
      deliveredAt,
      driverAvailable,
      vehicleAvailable,
    ])

    const secondDeliveryInput = deliverySchema.parse({
      ...firstDeliveryInput,
      scheduledAt: new Date(timestamp + 2 * 60 * 60 * 1000),
      notes: `SMOKE_TEST_SECOND_DELIVERY_${unique}`,
    })

    const secondDelivery = await createDeliveryWithAssignments(
      prisma,
      secondDeliveryInput,
      secondReference
    )
    deliveryIds.add(secondDelivery.id)

    const [secondBusyDriver, secondBusyVehicle] = await Promise.all([
      prisma.driver.findUnique({ where: { id: driverId } }),
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    ])

    const secondDriverBusy = verification(
      "Le Driver repasse ON_DELIVERY pour la seconde Delivery",
      secondBusyDriver?.status === "ON_DELIVERY"
    )
    const secondVehicleBusy = verification(
      "Le Vehicle repasse ON_DELIVERY pour la seconde Delivery",
      secondBusyVehicle?.status === "ON_DELIVERY"
    )
    requireChecks("Création de la seconde Delivery", [
      secondDriverBusy,
      secondVehicleBusy,
    ])

    await deleteDeliveryWithResources(prisma, secondDelivery.id)

    const [deletedDelivery, releasedDriver, releasedVehicle] =
      await Promise.all([
        prisma.delivery.findUnique({ where: { id: secondDelivery.id } }),
        prisma.driver.findUnique({ where: { id: driverId } }),
        prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      ])

    const deliveryDeleted = verification(
      "La seconde Delivery active n'existe plus",
      deletedDelivery === null
    )
    const driverReleased = verification(
      "Le Driver est libéré après suppression active",
      releasedDriver?.status === "AVAILABLE"
    )
    const vehicleReleased = verification(
      "Le Vehicle est libéré après suppression active",
      releasedVehicle?.status === "AVAILABLE"
    )

    if (deliveryDeleted) {
      deliveryIds.delete(secondDelivery.id)
    }

    record("Delete active Delivery", deliveryDeleted)
    record("Release Driver", driverReleased)
    record("Release Vehicle", vehicleReleased)
    requireChecks("Suppression de la Delivery active", [
      deliveryDeleted,
      driverReleased,
      vehicleReleased,
    ])
  } catch (error) {
    failed = true
    console.error("")
    console.error(`❌ ERROR — ${errorMessage(error)}`)
    console.error(error instanceof Error ? error.stack : error)
  } finally {
    const cleanupErrors: string[] = []

    for (const id of [...deliveryIds].reverse()) {
      try {
        const delivery = await prisma.delivery.findUnique({
          where: { id },
          select: { id: true },
        })

        if (delivery) {
          await prisma.delivery.delete({ where: { id } })
        }
      } catch (error) {
        cleanupErrors.push(`Delivery ${id}: ${errorMessage(error)}`)
      }
    }

    if (driverId !== null) {
      try {
        const driver = await prisma.driver.findUnique({
          where: { id: driverId },
          select: { id: true },
        })

        if (driver) {
          await prisma.driver.delete({ where: { id: driverId } })
        }
      } catch (error) {
        cleanupErrors.push(`Driver ${driverId}: ${errorMessage(error)}`)
      }
    }

    if (vehicleId !== null) {
      try {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: vehicleId },
          select: { id: true },
        })

        if (vehicle) {
          await prisma.vehicle.delete({ where: { id: vehicleId } })
        }
      } catch (error) {
        cleanupErrors.push(`Vehicle ${vehicleId}: ${errorMessage(error)}`)
      }
    }

    if (clientId !== null) {
      try {
        const client = await prisma.client.findUnique({
          where: { id: clientId },
          select: { id: true },
        })

        if (client) {
          await prisma.client.delete({ where: { id: clientId } })
        }
      } catch (error) {
        cleanupErrors.push(`Client ${clientId}: ${errorMessage(error)}`)
      }
    }

    const cleanupPassed = cleanupErrors.length === 0
    verification(
      cleanupPassed
        ? "Toutes les données SMOKE_TEST créées par ce run ont été supprimées"
        : `Nettoyage incomplet : ${cleanupErrors.join(" | ")}`,
      cleanupPassed
    )
    record("Cleanup", cleanupPassed)

    try {
      await prisma.$disconnect()
    } catch (error) {
      failed = true
      console.error(`❌ ERROR — Déconnexion Prisma : ${errorMessage(error)}`)
    }
  }

  console.log("")
  console.log("====================================")
  console.log("NEXORA — REAL DATABASE SMOKE TEST")
  console.log("====================================")

  for (const label of summaryLabels) {
    const passed = summary.get(label) === true
    console.log(`${label.padEnd(29, ".")} ${passed ? "✅" : "❌"}`)
  }

  const passedCount = summaryLabels.filter(
    (label) => summary.get(label) === true
  ).length

  console.log("------------------------------------")
  console.log(
    `RESULT: ${passedCount}/${summaryLabels.length} PASSED ${
      passedCount === summaryLabels.length ? "✅" : "❌"
    }`
  )
  console.log("------------------------------------")

  process.exitCode =
    failed || passedCount !== summaryLabels.length ? 1 : 0
}

void main()
