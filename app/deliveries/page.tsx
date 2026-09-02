import Link from "next/link"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "En attente"

    case "ASSIGNED":
      return "Assignée"

    case "IN_TRANSIT":
      return "En cours"

    case "DELIVERED":
      return "Livrée"

    case "DELAYED":
      return "En retard"

    case "CANCELLED":
      return "Annulée"

    default:
      return status
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "border-emerald-900 bg-emerald-950/30 text-emerald-400"

    case "IN_TRANSIT":
      return "border-blue-900 bg-blue-950/30 text-blue-400"

    case "DELAYED":
      return "border-red-900 bg-red-950/30 text-red-400"

    case "ASSIGNED":
      return "border-violet-900 bg-violet-950/30 text-violet-400"

    case "CANCELLED":
      return "border-zinc-700 bg-zinc-800 text-zinc-500"

    default:
      return "border-amber-900 bg-amber-950/30 text-amber-400"
  }
}

export default async function DeliveriesPage() {
  const deliveries = await prisma.delivery.findMany({
    include: {
      client: true,
      driver: true,
      vehicle: true,
    },

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
            NEXORA · Operations
          </p>

          <div className="mt-2 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                Livraisons
              </h1>

              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                Suivez et gérez les missions logistiques de NEXORA.
              </p>
            </div>

            <Link
              href="/deliveries/new"
              className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto"
            >
              + Nouvelle livraison
            </Link>
          </div>
        </header>

        {/* AUCUNE LIVRAISON */}
        {deliveries.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-12 text-center sm:px-6">
            <p className="font-medium">
              Aucune livraison
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Créez votre première mission logistique.
            </p>

            <Link
              href="/deliveries/new"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Créer une livraison
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <div className="space-y-3 md:hidden">
              {deliveries.map((delivery) => (
                <article
                  key={delivery.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/deliveries/${delivery.id}`}
                        className="font-medium transition hover:text-zinc-300"
                      >
                        {delivery.reference}
                      </Link>

                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {delivery.client.company ??
                          delivery.client.name}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                        delivery.status
                      )}`}
                    >
                      {getStatusLabel(delivery.status)}
                    </span>
                  </div>

                  {/* TRAJET */}
                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <p className="text-xs text-zinc-600">
                      Trajet
                    </p>

                    <p className="mt-1 text-sm">
                      {delivery.origin} →{" "}
                      {delivery.destination}
                    </p>
                  </div>

                  {/* CHAUFFEUR / VEHICULE */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Chauffeur
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {delivery.driver.firstName}{" "}
                        {delivery.driver.lastName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600">
                        Véhicule
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {delivery.vehicle.registration}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="mt-4">
                    <p className="text-xs text-zinc-600">
                      Date prévue
                    </p>

                    <p className="mt-1 text-sm text-zinc-300">
                      {delivery.scheduledAt.toLocaleString(
                        "fr-FR"
                      )}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <Link
                      href={`/deliveries/${delivery.id}`}
                      className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-800"
                    >
                      Voir la livraison
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
                      Référence
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Client
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Trajet
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Chauffeur
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Véhicule
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Date prévue
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Statut
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {deliveries.map((delivery) => (
                    <tr
                      key={delivery.id}
                      className="border-b border-zinc-800 last:border-0"
                    >
                      {/* REFERENCE */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/deliveries/${delivery.id}`}
                          className="font-medium transition hover:text-zinc-300"
                        >
                          {delivery.reference}
                        </Link>
                      </td>

                      {/* CLIENT */}
                      <td className="px-6 py-4 text-zinc-400">
                        {delivery.client.company ??
                          delivery.client.name}
                      </td>

                      {/* TRAJET */}
                      <td className="px-6 py-4 text-zinc-400">
                        {delivery.origin} →{" "}
                        {delivery.destination}
                      </td>

                      {/* CHAUFFEUR */}
                      <td className="px-6 py-4 text-zinc-400">
                        {delivery.driver.firstName}{" "}
                        {delivery.driver.lastName}
                      </td>

                      {/* VEHICULE */}
                      <td className="px-6 py-4 text-zinc-400">
                        {delivery.vehicle.registration}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-zinc-400">
                        {delivery.scheduledAt.toLocaleDateString(
                          "fr-FR"
                        )}
                      </td>

                      {/* STATUT */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            delivery.status
                          )}`}
                        >
                          {getStatusLabel(delivery.status)}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <Link
                          href={`/deliveries/${delivery.id}`}
                          className="text-sm font-medium text-zinc-300 transition hover:text-white"
                        >
                          Voir →
                        </Link>
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