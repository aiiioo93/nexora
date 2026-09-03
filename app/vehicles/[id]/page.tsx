import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Truck } from "lucide-react"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"

type VehiclePageProps = {
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

export default async function VehiclePage({
  params,
}: VehiclePageProps) {
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href="/vehicles"
          className="record-back-link"
        >
          <ArrowLeft size={15} />
          Véhicules
        </Link>

        <header className="record-hero">
          <div className="record-identity">
            <div className="record-icon"><Truck size={21} /></div>
            <div className="min-w-0">
              <p className="record-eyebrow">Véhicule #{vehicle.id}</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {vehicle.brand} {vehicle.model}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    vehicle.status
                  )}`}
                >
                  {getStatusLabel(vehicle.status)}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {vehicle.registration}
              </p>
            </div>
          </div>

          <div className="record-actions">
            <Link href={`/vehicles/${vehicle.id}/edit`} className="record-action">
              <Pencil size={15} /> Modifier
            </Link>
            <Link href={`/vehicles/${vehicle.id}/delete`} className="record-action record-action-danger">
              <Trash2 size={15} /> Supprimer
            </Link>
          </div>
        </header>

        <section className="record-panel">

          <div className="record-panel-heading">
            <h2 className="font-medium">
              Informations du véhicule
            </h2>
          </div>

          <div className="record-info-grid">
            <Info
              label="Immatriculation"
              value={vehicle.registration}
            />

            <Info
              label="Marque"
              value={vehicle.brand}
            />

            <Info
              label="Modèle"
              value={vehicle.model}
            />

            <Info
              label="Année"
              value={vehicle.year.toString()}
            />

            <Info
              label="Kilométrage"
              value={`${vehicle.mileage.toLocaleString("fr-FR")} km`}
            />

            <Info
              label="Statut"
              value={getStatusLabel(vehicle.status)}
            />

            <Info
              label="Ajouté le"
              value={vehicle.createdAt.toLocaleDateString("fr-FR")}
            />
          </div>
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
