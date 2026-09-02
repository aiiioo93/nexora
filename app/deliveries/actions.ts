"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  createDeliveryWithAssignments,
  deleteDeliveryWithResources,
  updateDeliveryStatusWithResources,
} from "@/lib/delivery-service"
import prisma from "@/lib/prisma"
import {
  deliverySchema,
  deliveryStatusSchema,
} from "@/lib/validations"

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

  await createDeliveryWithAssignments(prisma, data, reference)

  revalidatePath("/deliveries")
  revalidatePath("/drivers")
  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect("/deliveries")
}

export async function updateDeliveryStatus(
  id: number,
  formData: FormData
) {
  const status = deliveryStatusSchema.parse(
    formData.get("status")
  )

  await updateDeliveryStatusWithResources(prisma, id, status)

  revalidatePath("/deliveries")
  revalidatePath(`/deliveries/${id}`)
  revalidatePath("/drivers")
  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect(`/deliveries/${id}`)
}

export async function deleteDelivery(id: number) {
  await deleteDeliveryWithResources(prisma, id)

  revalidatePath("/deliveries")
  revalidatePath("/drivers")
  revalidatePath("/vehicles")
  revalidatePath("/")

  redirect("/deliveries")
}
