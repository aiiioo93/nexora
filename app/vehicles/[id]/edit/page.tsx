import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { updateVehicle } from "../../actions"

type EditVehiclePageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  const { id } = await params
  const vehicleId = parseRouteId(id)

  if (vehicleId === null) {
    notFound()
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  })

  if (!vehicle) {
    notFound()
  }

  const updateVehicleWithId = updateVehicle.bind(
    null,
    vehicle.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href={`/vehicles/${vehicle.id}`}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour à la fiche
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Véhicule #{vehicle.id}
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Modifier le véhicule
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Modifiez les informations de {vehicle.brand}{" "}
            {vehicle.model}.
          </p>
        </header>

        <form
          action={updateVehicleWithId}
          className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
        >
          <div>
            <label
              htmlFor="registration"
              className="mb-2 block text-sm font-medium"
            >
              Immatriculation *
            </label>

            <input
              id="registration"
              name="registration"
              type="text"
              required
              defaultValue={vehicle.registration}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 uppercase outline-none focus:border-zinc-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-medium"
              >
                Marque *
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                required
                defaultValue={vehicle.brand}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-medium"
              >
                Modèle *
              </label>

              <input
                id="model"
                name="model"
                type="text"
                required
                defaultValue={vehicle.model}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium"
              >
                Année *
              </label>

              <input
                id="year"
                name="year"
                type="number"
                required
                min="1900"
                max="2100"
                defaultValue={vehicle.year}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="mileage"
                className="mb-2 block text-sm font-medium"
              >
                Kilométrage *
              </label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                required
                min="0"
                defaultValue={vehicle.mileage}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
              />
            </div>
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
              defaultValue={vehicle.status}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-zinc-500"
            >
              <option value="AVAILABLE">
                Disponible
              </option>

              <option value="ON_DELIVERY">
                En livraison
              </option>

              <option value="MAINTENANCE">
                Maintenance
              </option>

              <option value="OUT_OF_SERVICE">
                Hors service
              </option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href={`/vehicles/${vehicle.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
