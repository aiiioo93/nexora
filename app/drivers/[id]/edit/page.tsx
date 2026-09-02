import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { updateDriver } from "../../actions"

type EditDriverPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditDriverPage({
  params,
}: EditDriverPageProps) {
  const { id } = await params
  const driverId = parseRouteId(id)

  if (driverId === null) {
    notFound()
  }

  const driver = await prisma.driver.findUnique({
    where: {
      id: driverId,
    },
  })

  if (!driver) {
    notFound()
  }

  const updateDriverWithId = updateDriver.bind(
    null,
    driver.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href={`/drivers/${driver.id}`}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour à la fiche
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Chauffeur #{driver.id}
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Modifier le chauffeur
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Modifiez les informations de {driver.firstName}{" "}
            {driver.lastName}.
          </p>
        </header>

        <form
          action={updateDriverWithId}
          className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium"
              >
                Prénom *
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                defaultValue={driver.firstName}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium"
              >
                Nom *
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                defaultValue={driver.lastName}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={driver.email}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Téléphone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={driver.phone ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="licenseNumber"
              className="mb-2 block text-sm font-medium"
            >
              Numéro de permis *
            </label>

            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              required
              defaultValue={driver.licenseNumber}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium"
            >
              Statut *
            </label>

            <select
              id="status"
              name="status"
              defaultValue={driver.status}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
            >
              <option value="AVAILABLE">
                Disponible
              </option>

              <option value="ON_DELIVERY">
                En livraison
              </option>

              <option value="OFF_DUTY">
                Hors service
              </option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href={`/drivers/${driver.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black sm:w-auto"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
