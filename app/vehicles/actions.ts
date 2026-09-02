"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
  await prisma.vehicle.delete({
    where: {
      id,
    },
  })

  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect("/vehicles")
}
