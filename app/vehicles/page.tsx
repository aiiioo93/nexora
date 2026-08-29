import Link from "next/link"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

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

function getStatusClass(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "border-emerald-900 bg-emerald-950/30 text-emerald-400"

    case "ON_DELIVERY":
      return "border-blue-900 bg-blue-950/30 text-blue-400"

    case "MAINTENANCE":
      return "border-amber-900 bg-amber-950/30 text-amber-400"

    case "OUT_OF_SERVICE":
      return "border-red-900 bg-red-950/30 text-red-400"

    default:
      return "border-zinc-700 text-zinc-400"
  }
}

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">

        {/* HEADER */}
        <header className="mb-6 md:mb-8">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Flotte
          </p>

          <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Véhicules
              </h1>

              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                Gérez les véhicules de la flotte NEXORA.
              </p>
            </div>

            <Link
              href="/vehicles/new"
              className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto"
            >
              + Ajouter un véhicule
            </Link>
          </div>
        </header>

        {vehicles.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-12 text-center sm:px-6">
            <p className="font-medium">
              Aucun véhicule
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Ajoutez votre premier véhicule à la flotte.
            </p>

            <Link
              href="/vehicles/new"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black sm:w-auto"
            >
              Ajouter un véhicule
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <div className="space-y-3 md:hidden">
              {vehicles.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="font-medium transition hover:text-zinc-300"
                      >
                        {vehicle.brand} {vehicle.model}
                      </Link>

                      <p className="mt-1 text-sm text-zinc-500">
                        {vehicle.registration}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                        vehicle.status
                      )}`}
                    >
                      {getStatusLabel(vehicle.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Année
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {vehicle.year}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600">
                        Kilométrage
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {vehicle.mileage.toLocaleString("fr-FR")} km
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-800"
                    >
                      Voir la fiche
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* TABLETTE / DESKTOP */}
            <div className="hidden overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 md:block">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left text-sm text-zinc-500">
                    <th className="px-6 py-4 font-medium">
                      Véhicule
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Immatriculation
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Année
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Kilométrage
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Statut
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="border-b border-zinc-800 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          className="font-medium transition hover:text-zinc-300"
                        >
                          {vehicle.brand} {vehicle.model}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {vehicle.registration}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {vehicle.year}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {vehicle.mileage.toLocaleString("fr-FR")} km
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            vehicle.status
                          )}`}
                        >
                          {getStatusLabel(vehicle.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  )
}