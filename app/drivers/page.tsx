import Link from "next/link"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

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

export default async function DriversPage() {
  const drivers = await prisma.driver.findMany({
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
                Chauffeurs
              </h1>

              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                Gérez les chauffeurs et leur disponibilité.
              </p>
            </div>

            <Link
              href="/drivers/new"
              className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto"
            >
              + Ajouter un chauffeur
            </Link>
          </div>
        </header>

        {drivers.length === 0 ? (
          /* ÉTAT VIDE */
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-12 text-center sm:px-6">
            <p className="font-medium">
              Aucun chauffeur
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Ajoutez votre premier chauffeur à la flotte NEXORA.
            </p>

            <Link
              href="/drivers/new"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black sm:w-auto"
            >
              Ajouter un chauffeur
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE */}
            <div className="space-y-3 md:hidden">
              {drivers.map((driver) => (
                <article
                  key={driver.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                    <Link
                    href={`/drivers/${driver.id}`}
                    className="font-medium transition hover:text-zinc-300"
                    >
                    {driver.firstName} {driver.lastName}
                    </Link>

                      <p className="mt-1 truncate text-sm text-zinc-500">
                        {driver.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                        driver.status
                      )}`}
                    >
                      {getStatusLabel(driver.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Téléphone
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {driver.phone ?? "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600">
                        Permis
                      </p>

                      <p className="mt-1 text-sm text-zinc-300">
                        {driver.licenseNumber}
                      </p>
                    </div>
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
                      Chauffeur
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Email
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Téléphone
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Permis
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Statut
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="border-b border-zinc-800 last:border-0"
                    >
                        <td className="px-6 py-4">
                        <Link
                            href={`/drivers/${driver.id}`}
                            className="font-medium transition hover:text-zinc-300"
                        >
                            {driver.firstName} {driver.lastName}
                        </Link>
                        </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {driver.email}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {driver.phone ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {driver.licenseNumber}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            driver.status
                          )}`}
                        >
                          {getStatusLabel(driver.status)}
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