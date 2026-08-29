"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import prisma from "@/lib/prisma"

const vehicleSchema = z.object({
  registration: z.string().min(2),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.coerce.number().int().min(1900).max(2100),
  mileage: z.coerce.number().int().min(0),

  status: z.enum([
    "AVAILABLE",
    "ON_DELIVERY",
    "MAINTENANCE",
    "OUT_OF_SERVICE",
  ]),
})

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