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
  // 1. Vérification des données du formulaire
  const data = deliverySchema.parse({
    origin: formData.get("origin"),
    destination: formData.get("destination"),

    clientId: formData.get("clientId"),
    driverId: formData.get("driverId"),
    vehicleId: formData.get("vehicleId"),

    scheduledAt: formData.get("scheduledAt"),

    notes: formData.get("notes") || undefined,
  })

  // 2. Génération automatique d'une référence NEXORA
  const reference = `NX-${Date.now()
    .toString()
    .slice(-6)}`

  // 3. Transaction :
  // les trois opérations réussissent ensemble
  // ou aucune n'est enregistrée
  await prisma.$transaction([
    // Le chauffeur doit encore être disponible
    prisma.driver.update({
      where: {
        id: data.driverId,
        status: "AVAILABLE",
      },

      data: {
        status: "ON_DELIVERY",
      },
    }),

    // Le véhicule doit encore être disponible
    prisma.vehicle.update({
      where: {
        id: data.vehicleId,
        status: "AVAILABLE",
      },

      data: {
        status: "ON_DELIVERY",
      },
    }),

    // Création de la livraison
    prisma.delivery.create({
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
    }),
  ])

  // 4. Actualisation des pages concernées
  revalidatePath("/deliveries")
  revalidatePath("/drivers")
  revalidatePath("/vehicles")
  revalidatePath("/")

  // 5. Retour vers la liste des livraisons
  redirect("/deliveries")
}