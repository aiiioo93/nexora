"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import prisma from "@/lib/prisma"

const deliverySchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),

  clientId: z.coerce.number().int().positive(),
  driverId: z.coerce.number().int().positive(),
  vehicleId: z.coerce.number().int().positive(),

  scheduledAt: z.coerce.date(),

  notes: z.string().optional(),
})

export async function createDelivery(formData: FormData) {
  const data = deliverySchema.parse({
    origin: formData.get("origin"),
    destination: formData.get("destination"),

    clientId: formData.get("clientId"),
    driverId: formData.get("driverId"),
    vehicleId: formData.get("vehicleId"),

    scheduledAt: formData.get("scheduledAt"),

    notes: formData.get("notes") || undefined,
  })

  const reference = `NX-${Date.now()
    .toString()
    .slice(-6)}`

  await prisma.delivery.create({
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

  revalidatePath("/deliveries")
  revalidatePath("/")

  redirect("/deliveries")
}