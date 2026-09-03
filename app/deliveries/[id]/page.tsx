import Link from "next/link"
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  PackageCheck,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react"
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
  const isFinalStatus =
    delivery.status === "DELIVERED" ||
    delivery.status === "CANCELLED"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-10">

        {/* RETOUR */}
        <Link
          href="/deliveries"
          className="record-back-link"
        >
          <ArrowLeft size={15} />
          Livraisons
        </Link>

        {/* HEADER */}
        <header className="record-hero">
          <div className="record-identity">
            <div className="record-icon"><PackageCheck size={21} /></div>
            <div className="min-w-0">
              <p className="record-eyebrow">Mission logistique</p>
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
          </div>

          <div className="record-actions record-actions-single">
            <Link
              href={`/deliveries/${delivery.id}/delete`}
              className="record-action record-action-danger"
            >
              <Trash2 size={15} />
              Supprimer
            </Link>
          </div>
        </header>

        {/* CLIENT / CHAUFFEUR / VEHICULE */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">

          {/* CLIENT */}
          <Link
            href={`/clients/${delivery.client.id}`}
            className="record-related-card"
          >
            <span className="record-related-icon"><Building2 size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="record-info-label">Client</span>
              <span className="mt-1 block truncate text-sm font-semibold text-slate-200">
                {delivery.client.company ?? delivery.client.name}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{delivery.client.name}</span>
            </span>
            <ChevronRight size={16} className="text-slate-600" />
          </Link>

          {/* CHAUFFEUR */}
          <Link
            href={`/drivers/${delivery.driver.id}`}
            className="record-related-card"
          >
            <span className="record-related-icon"><UserRound size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="record-info-label">Chauffeur</span>
              <span className="mt-1 block truncate text-sm font-semibold text-slate-200">
                {delivery.driver.firstName} {delivery.driver.lastName}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{delivery.driver.phone ?? "—"}</span>
            </span>
            <ChevronRight size={16} className="text-slate-600" />
          </Link>

          {/* VEHICULE */}
          <Link
            href={`/vehicles/${delivery.vehicle.id}`}
            className="record-related-card"
          >
            <span className="record-related-icon"><Truck size={17} /></span>
            <span className="min-w-0 flex-1">
              <span className="record-info-label">Véhicule</span>
              <span className="mt-1 block truncate text-sm font-semibold text-slate-200">
                {delivery.vehicle.brand} {delivery.vehicle.model}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{delivery.vehicle.registration}</span>
            </span>
            <ChevronRight size={16} className="text-slate-600" />
          </Link>
        </section>

        {/* DETAILS */}
        <section className="record-panel">
          <div className="record-panel-heading">
            <h2 className="font-medium">
              Informations de la mission
            </h2>
          </div>

          <div className="record-info-grid">
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
        {isFinalStatus ? (
          <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
            <h2 className="font-medium">
              Livraison terminée
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Cette livraison est terminée. Son statut ne peut plus être modifié.
            </p>
          </section>
        ) : (
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
        )}
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
    <div className="record-info">
      <p className="record-info-label">
        {label}
      </p>

      <p className="record-info-value">
        {value}
      </p>
    </div>
  )
}
