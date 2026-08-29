import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { deleteVehicle } from "../../actions"

type DeleteVehiclePageProps = {
  params: Promise<{
    id: string
  }>
}

function getStatusLabel(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "Disponible"
    case "ON_DELIVERY":
      return "En livraison"
    case "MAINTENANCE":
      return "Maintenance"
    case "OUT_OF_SERVICE":
      return "Hors service"
    default:
      return status
  }
}

export default async function DeleteVehiclePage({
  params,
}: DeleteVehiclePageProps) {
  const { id } = await params

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!vehicle) {
    notFound()
  }

  const deleteVehicleWithId = deleteVehicle.bind(
    null,
    vehicle.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6">

        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <p className="text-xs font-medium text-red-400 sm:text-sm">
            Suppression définitive
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Supprimer ce véhicule ?
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Vous êtes sur le point de supprimer définitivement{" "}
            <span className="font-medium text-white">
              {vehicle.brand} {vehicle.model}
            </span>
            .
          </p>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-medium">
              {vehicle.brand} {vehicle.model}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {vehicle.registration}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-600">
                  Kilométrage
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {vehicle.mileage.toLocaleString("fr-FR")} km
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-600">
                  Statut
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {getStatusLabel(vehicle.status)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
            <p className="text-sm leading-6 text-red-300">
              Cette action est irréversible. Le véhicule sera supprimé
              définitivement de la base de données.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/vehicles/${vehicle.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <form
              action={deleteVehicleWithId}
              className="w-full sm:w-auto"
            >
              <button
                type="submit"
                className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Supprimer définitivement
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}