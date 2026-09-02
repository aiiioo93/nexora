"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { Prisma } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"
import { driverSchema } from "@/lib/validations"

export async function createDriver(formData: FormData) {
  const data = driverSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    licenseNumber: formData.get("licenseNumber"),
    status: formData.get("status"),
  })

  await prisma.driver.create({
    data,
  })

  revalidatePath("/drivers")
  revalidatePath("/")

  redirect("/drivers")
}

export async function updateDriver(
  id: number,
  formData: FormData
) {
  const data = driverSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    licenseNumber: formData.get("licenseNumber"),
    status: formData.get("status"),
  })

  await prisma.driver.update({
    where: {
      id,
    },
    data,
  })

  revalidatePath("/drivers")
  revalidatePath(`/drivers/${id}`)
  revalidatePath("/")

  redirect(`/drivers/${id}`)
}

export async function deleteDriver(id: number) {
  const deliveriesCount = await prisma.delivery.count({
    where: {
      driverId: id,
    },
  })

  if (deliveriesCount > 0) {
    redirect(`/drivers/${id}/delete?error=linked`)
  }

  let isLinked = false

  try {
    await prisma.driver.delete({
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
    redirect(`/drivers/${id}/delete?error=linked`)
  }

  revalidatePath("/drivers")
  revalidatePath("/")

  redirect("/drivers")
}
