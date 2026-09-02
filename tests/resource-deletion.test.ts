import { beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => {
  class RedirectError extends Error {
    constructor(public readonly location: string) {
      super(`Redirect to ${location}`)
    }
  }

  return {
    deliveryCount: vi.fn(),
    clientDelete: vi.fn(),
    driverDelete: vi.fn(),
    vehicleDelete: vi.fn(),
    revalidatePath: vi.fn(),
    redirect: vi.fn((location: string): never => {
      throw new RedirectError(location)
    }),
  }
})

vi.mock("@/lib/prisma", () => ({
  default: {
    delivery: {
      count: mocks.deliveryCount,
    },
    client: {
      delete: mocks.clientDelete,
    },
    driver: {
      delete: mocks.driverDelete,
    },
    vehicle: {
      delete: mocks.vehicleDelete,
    },
  },
}))

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}))

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}))

import { Prisma } from "@/app/generated/prisma/client"
import { deleteClient } from "@/app/clients/actions"
import { deleteDriver } from "@/app/drivers/actions"
import { deleteVehicle } from "@/app/vehicles/actions"

function p2003Error() {
  return new Prisma.PrismaClientKnownRequestError(
    "Foreign key constraint failed",
    {
      code: "P2003",
      clientVersion: "7.10.0",
    }
  )
}

async function expectRedirect(
  action: () => Promise<void>,
  location: string
) {
  await expect(action()).rejects.toMatchObject({ location })
  expect(mocks.redirect).toHaveBeenCalledWith(location)
}

describe("protection des suppressions liées", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.deliveryCount.mockResolvedValue(0)
    mocks.clientDelete.mockResolvedValue({ id: 1 })
    mocks.driverDelete.mockResolvedValue({ id: 2 })
    mocks.vehicleDelete.mockResolvedValue({ id: 3 })
  })

  it("refuse de supprimer un Client lié à une Delivery", async () => {
    mocks.deliveryCount.mockResolvedValueOnce(1)

    await expectRedirect(
      () => deleteClient(1),
      "/clients/1/delete?error=linked"
    )

    expect(mocks.deliveryCount).toHaveBeenCalledWith({
      where: { clientId: 1 },
    })
    expect(mocks.clientDelete).not.toHaveBeenCalled()
  })

  it("refuse de supprimer un Driver lié à une Delivery", async () => {
    mocks.deliveryCount.mockResolvedValueOnce(1)

    await expectRedirect(
      () => deleteDriver(2),
      "/drivers/2/delete?error=linked"
    )

    expect(mocks.deliveryCount).toHaveBeenCalledWith({
      where: { driverId: 2 },
    })
    expect(mocks.driverDelete).not.toHaveBeenCalled()
  })

  it("refuse de supprimer un Vehicle lié à une Delivery", async () => {
    mocks.deliveryCount.mockResolvedValueOnce(1)

    await expectRedirect(
      () => deleteVehicle(3),
      "/vehicles/3/delete?error=linked"
    )

    expect(mocks.deliveryCount).toHaveBeenCalledWith({
      where: { vehicleId: 3 },
    })
    expect(mocks.vehicleDelete).not.toHaveBeenCalled()
  })

  it("autorise la suppression d'un Client sans Delivery", async () => {
    await expectRedirect(() => deleteClient(1), "/clients")

    expect(mocks.clientDelete).toHaveBeenCalledWith({ where: { id: 1 } })
  })

  it("autorise la suppression d'un Driver sans Delivery", async () => {
    await expectRedirect(() => deleteDriver(2), "/drivers")

    expect(mocks.driverDelete).toHaveBeenCalledWith({ where: { id: 2 } })
  })

  it("autorise la suppression d'un Vehicle sans Delivery", async () => {
    await expectRedirect(() => deleteVehicle(3), "/vehicles")

    expect(mocks.vehicleDelete).toHaveBeenCalledWith({ where: { id: 3 } })
  })

  it.each([
    ["Client", mocks.clientDelete, () => deleteClient(1), "/clients/1/delete?error=linked"],
    ["Driver", mocks.driverDelete, () => deleteDriver(2), "/drivers/2/delete?error=linked"],
    ["Vehicle", mocks.vehicleDelete, () => deleteVehicle(3), "/vehicles/3/delete?error=linked"],
  ] as const)(
    "convertit P2003 en erreur métier pour %s",
    async (_resource, deleteMock, action, location) => {
      deleteMock.mockRejectedValueOnce(p2003Error())

      await expectRedirect(action, location)
    }
  )

  it("ne masque pas une erreur Prisma sans rapport", async () => {
    const unexpectedError = new Error("Database unavailable")
    mocks.clientDelete.mockRejectedValueOnce(unexpectedError)

    await expect(deleteClient(1)).rejects.toBe(unexpectedError)
    expect(mocks.redirect).not.toHaveBeenCalled()
  })
})
