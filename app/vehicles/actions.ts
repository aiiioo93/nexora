"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { Prisma } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"
import { vehicleSchema } from "@/lib/validations"

export async function createVehicle(formData: FormData) {
  const data = vehicleSchema.parse({
    registration: formData.get("registration"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
    status: formData.get("status"),
  })

  await prisma.vehicle.create({
    data,
  })

  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect("/vehicles")
}

export async function updateVehicle(
  id: number,
  formData: FormData
) {
  const data = vehicleSchema.parse({
    registration: formData.get("registration"),
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
    status: formData.get("status"),
  })

  await prisma.vehicle.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath("/vehicles")
  revalidatePath(`/vehicles/${id}`)
  revalidatePath("/")

  redirect(`/vehicles/${id}`)
}

export async function deleteVehicle(id: number) {
  const deliveriesCount = await prisma.delivery.count({
    where: {
      vehicleId: id,
    },
  })

  if (deliveriesCount > 0) {
    redirect(`/vehicles/${id}/delete?error=linked`)
  }

  let isLinked = false

  try {
    await prisma.vehicle.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      isLinked = true
    } else {
      throw error
    }
  }

  if (isLinked) {
    redirect(`/vehicles/${id}/delete?error=linked`)
  }

  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect("/vehicles")
}
