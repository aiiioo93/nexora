import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { deleteVehicle } from "../../actions"

type DeleteVehiclePageProps = {
  params: Promise<{
    id: string
  }>

  searchParams: Promise<{
    error?: string
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
  searchParams,
}: DeleteVehiclePageProps) {
  const { id } = await params
  const { error } = await searchParams
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

  const deleteVehicleWithId = deleteVehicle.bind(
    null,
    vehicle.id
  )
  const isLinked = error === "linked"

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

            <p className="mt-1 break-all text-sm text-zinc-500">
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

          {isLinked ? (
            <div className="mt-6 rounded-lg border border-amber-900 bg-amber-950/20 p-4">
              <p className="text-sm font-medium text-amber-300">
                Impossible de supprimer ce véhicule.
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-200/70">
                Ce véhicule possède un historique de livraisons.
                Les livraisons doivent rester associées à leur
                véhicule afin de préserver l&apos;historique de
                NEXORA.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
              <p className="text-sm leading-6 text-red-300">
                Cette action est irréversible. Le véhicule sera supprimé
                définitivement de la base de données.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/vehicles/${vehicle.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              {isLinked ? "Retour au véhicule" : "Annuler"}
            </Link>

            {!isLinked && (
              <form
                action={deleteVehicleWithId}
                className="w-full sm:w-auto"
              >
                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-500 sm:w-auto"
                >
                  Supprimer définitivement
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
