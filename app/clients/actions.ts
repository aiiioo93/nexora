"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { clientSchema } from "@/lib/validations"

export async function createClient(formData: FormData) {
  const data = clientSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
  })

  await prisma.client.create({
    data,
  })

  revalidatePath("/clients")
  redirect("/clients")
}

export async function updateClient(
  id: number,
  formData: FormData
) {
  const data = clientSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    company: formData.get("company") || undefined,
  })

  await prisma.client.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath("/clients")
  revalidatePath(`/clients/${id}`)

  redirect(`/clients/${id}`)
}

export async function deleteClient(id: number) {
  await prisma.client.delete({
    where: {
      id,
    },
  })

  revalidatePath("/clients")

  redirect("/clients")
}
