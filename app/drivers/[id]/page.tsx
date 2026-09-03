import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, UserRound } from "lucide-react"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"

type DriverPageProps = {
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
    case "OFF_DUTY":
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
      return "border-amber-900 bg-amber-950/30 text-amber-400"

    case "OFF_DUTY":
      return "border-zinc-700 bg-zinc-800 text-zinc-400"

    default:
      return "border-zinc-700 text-zinc-400"
  }
}

export default async function DriverPage({
  params,
}: DriverPageProps) {
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href="/drivers"
          className="record-back-link"
        >
          <ArrowLeft size={15} />
          Chauffeurs
        </Link>

        <header className="record-hero">
          <div className="record-identity">
            <div className="record-icon"><UserRound size={21} /></div>
            <div className="min-w-0">
              <p className="record-eyebrow">Chauffeur #{driver.id}</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {driver.firstName} {driver.lastName}
                </h1>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    driver.status
                  )}`}
                >
                  {getStatusLabel(driver.status)}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                Chauffeur NEXORA
              </p>
            </div>
          </div>

          <div className="record-actions">
            <Link href={`/drivers/${driver.id}/edit`} className="record-action">
              <Pencil size={15} /> Modifier
            </Link>
            <Link href={`/drivers/${driver.id}/delete`} className="record-action record-action-danger">
              <Trash2 size={15} /> Supprimer
            </Link>
          </div>
        </header>

        <section className="record-panel">
          <div className="record-panel-heading">
            <h2 className="font-medium">
              Informations du chauffeur
            </h2>
          </div>

          <div className="record-info-grid">
            <Info
              label="Prénom"
              value={driver.firstName}
            />

            <Info
              label="Nom"
              value={driver.lastName}
            />

            <Info
              label="Email"
              value={driver.email}
            />

            <Info
              label="Téléphone"
              value={driver.phone ?? "—"}
            />

            <Info
              label="Numéro de permis"
              value={driver.licenseNumber}
            />

            <Info
              label="Statut"
              value={getStatusLabel(driver.status)}
            />

            <Info
              label="Ajouté le"
              value={driver.createdAt.toLocaleDateString("fr-FR")}
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
