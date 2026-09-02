import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { updateDeliveryStatus } from "../actions"

type DeliveryPageProps = {
  params: Promise<{
    id: string
  }>
}

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

export default async function DeliveryPage({
  params,
}: DeliveryPageProps) {
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

  const updateStatusWithId = updateDeliveryStatus.bind(
    null,
    delivery.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-10">

        {/* RETOUR */}
        <Link
          href="/deliveries"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux livraisons
        </Link>

        {/* HEADER */}
        <header className="mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Livraison
          </p>

          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {delivery.reference}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    delivery.status
                  )}`}
                >
                  {getStatusLabel(delivery.status)}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {delivery.origin} → {delivery.destination}
              </p>
            </div>

            <Link
              href={`/deliveries/${delivery.id}/delete`}
              className="flex w-full items-center justify-center rounded-lg border border-red-900 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-950/30 sm:w-auto"
            >
              Supprimer
            </Link>
          </div>
        </header>

        {/* CLIENT / CHAUFFEUR / VEHICULE */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">

          {/* CLIENT */}
          <Link
            href={`/clients/${delivery.client.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <p className="text-xs text-zinc-500">
              Client
            </p>

            <p className="mt-2 font-medium">
              {delivery.client.company ??
                delivery.client.name}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {delivery.client.name}
            </p>
          </Link>

          {/* CHAUFFEUR */}
          <Link
            href={`/drivers/${delivery.driver.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <p className="text-xs text-zinc-500">
              Chauffeur
            </p>

            <p className="mt-2 font-medium">
              {delivery.driver.firstName}{" "}
              {delivery.driver.lastName}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {delivery.driver.phone ?? "—"}
            </p>
          </Link>

          {/* VEHICULE */}
          <Link
            href={`/vehicles/${delivery.vehicle.id}`}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <p className="text-xs text-zinc-500">
              Véhicule
            </p>

            <p className="mt-2 font-medium">
              {delivery.vehicle.brand}{" "}
              {delivery.vehicle.model}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {delivery.vehicle.registration}
            </p>
          </Link>
        </section>

        {/* DETAILS */}
        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-4 sm:p-6">
            <h2 className="font-medium">
              Informations de la mission
            </h2>
          </div>

          <div className="divide-y divide-zinc-800">
            <Info
              label="Départ"
              value={delivery.origin}
            />

            <Info
              label="Destination"
              value={delivery.destination}
            />

            <Info
              label="Date prévue"
              value={delivery.scheduledAt.toLocaleString(
                "fr-FR"
              )}
            />

            <Info
              label="Date de livraison"
              value={
                delivery.deliveredAt
                  ? delivery.deliveredAt.toLocaleString(
                      "fr-FR"
                    )
                  : "—"
              }
            />

            <Info
              label="Notes"
              value={delivery.notes ?? "—"}
            />
          </div>
        </section>

        {/* CHANGEMENT DE STATUT */}
        <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
          <h2 className="font-medium">
            Mettre à jour la livraison
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Modifiez l&apos;état opérationnel de cette mission.
          </p>

          <form
            action={updateStatusWithId}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <select
              name="status"
              defaultValue={delivery.status}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
            >
              <option value="ASSIGNED">
                Assignée
              </option>

              <option value="IN_TRANSIT">
                En cours
              </option>

              <option value="DELAYED">
                En retard
              </option>

              <option value="DELIVERED">
                Livrée
              </option>

              <option value="CANCELLED">
                Annulée
              </option>
            </select>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Mettre à jour
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
      <p className="text-xs text-zinc-500 sm:text-sm">
        {label}
      </p>

      <p className="mt-1 break-words text-sm sm:col-span-2 sm:mt-0">
        {value}
      </p>
    </div>
  )
}
