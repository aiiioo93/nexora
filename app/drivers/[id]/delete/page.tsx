import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { deleteDriver } from "../../actions"

type DeleteDriverPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DeleteDriverPage({
  params,
}: DeleteDriverPageProps) {
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

  const deleteDriverWithId = deleteDriver.bind(
    null,
    driver.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6">

        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <p className="text-xs font-medium text-red-400 sm:text-sm">
            Suppression définitive
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Supprimer ce chauffeur ?
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Vous êtes sur le point de supprimer définitivement{" "}
            <span className="font-medium text-white">
              {driver.firstName} {driver.lastName}
            </span>
            .
          </p>

          {/* RÉSUMÉ CHAUFFEUR */}
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-medium">
              {driver.firstName} {driver.lastName}
            </p>

            <p className="mt-1 break-all text-sm text-zinc-500">
              {driver.email}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-zinc-600">
                  Permis
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {driver.licenseNumber}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-600">
                  Téléphone
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  {driver.phone ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* AVERTISSEMENT */}
          <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
            <p className="text-sm leading-6 text-red-300">
              Cette action est irréversible. Toutes les informations de ce
              chauffeur seront supprimées de la base de données.
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/drivers/${driver.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <form
              action={deleteDriverWithId}
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
