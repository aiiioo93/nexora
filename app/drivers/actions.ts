"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
  await prisma.driver.delete({
    where: {
      id,
    },
  })

  revalidatePath("/drivers")
  revalidatePath("/")

  redirect("/drivers")
}
