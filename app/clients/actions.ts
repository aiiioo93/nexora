"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { Prisma } from "@/app/generated/prisma/client"
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
  const deliveriesCount = await prisma.delivery.count({
    where: {
      clientId: id,
    },
  })

  if (deliveriesCount > 0) {
    redirect(`/clients/${id}/delete?error=linked`)
  }

  let isLinked = false

  try {
    await prisma.client.delete({
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
    redirect(`/clients/${id}/delete?error=linked`)
  }

  revalidatePath("/clients")
  revalidatePath("/")

  redirect("/clients")
}
