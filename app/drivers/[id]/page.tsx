import Link from "next/link"
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
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux chauffeurs
        </Link>

        <header className="mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Chauffeur #{driver.id}
          </p>

          <div className="mt-2 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
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

            <div className="flex w-full gap-2 sm:w-auto">
              <Link
                href={`/drivers/${driver.id}/edit`}
                className="flex flex-1 items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-800 sm:flex-none"
              >
                Modifier
              </Link>

              <Link
                href={`/drivers/${driver.id}/delete`}
                className="flex flex-1 items-center justify-center rounded-lg border border-red-900 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-950/30 sm:flex-none"
              >
                Supprimer
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-4 sm:p-6">
            <h2 className="font-medium">
              Informations du chauffeur
            </h2>
          </div>

          <div className="divide-y divide-zinc-800">
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
    <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
      <p className="text-xs text-zinc-500 sm:text-sm">
        {label}
      </p>

      <p className="mt-1 break-all text-sm sm:col-span-2 sm:mt-0">
        {value}
      </p>
    </div>
  )
}
