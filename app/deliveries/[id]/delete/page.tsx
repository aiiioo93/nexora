import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { deleteDelivery } from "../../actions"

type DeleteDeliveryPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DeleteDeliveryPage({
  params,
}: DeleteDeliveryPageProps) {
  const { id } = await params
  const deliveryId = parseRouteId(id)

  if (deliveryId === null) {
    notFound()
  }

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveryId,
    },

    include: {
      client: true,
      driver: true,
      vehicle: true,
    },
  })

  if (!delivery) {
    notFound()
  }

  const deleteDeliveryWithId = deleteDelivery.bind(
    null,
    delivery.id
  )

  const isActive =
    delivery.status === "PENDING" ||
    delivery.status === "ASSIGNED" ||
    delivery.status === "IN_TRANSIT" ||
    delivery.status === "DELAYED"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6">

        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <p className="text-xs font-medium text-red-400 sm:text-sm">
            Suppression définitive
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Supprimer cette livraison ?
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Vous êtes sur le point de supprimer définitivement{" "}
            <span className="font-medium text-white">
              {delivery.reference}
            </span>
            .
          </p>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-medium">
              {delivery.origin} → {delivery.destination}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {delivery.client.company ??
                delivery.client.name}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
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
          </div>

          {isActive && (
            <div className="mt-6 rounded-lg border border-amber-950 bg-amber-950/20 p-4">
              <p className="text-sm leading-6 text-amber-300">
                Cette livraison est encore active. Sa suppression
                remettra automatiquement le chauffeur et le véhicule
                au statut disponible.
              </p>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
            <p className="text-sm leading-6 text-red-300">
              Cette action est irréversible. La livraison sera
              définitivement supprimée de PostgreSQL.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/deliveries/${delivery.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <form
              action={deleteDeliveryWithId}
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
