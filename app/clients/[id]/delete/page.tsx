import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { deleteClient } from "../../actions"

type DeleteClientPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function DeleteClientPage({
  params,
}: DeleteClientPageProps) {
  const { id } = await params

  const clientId = parseRouteId(id)

  if (clientId === null) {
    notFound()
  }

  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  })

  if (!client) {
    notFound()
  }

  const deleteClientWithId = deleteClient.bind(
    null,
    client.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6">
        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          <div className="mb-6">
            <p className="text-xs text-red-400 sm:text-sm">
              Suppression définitive
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              Supprimer ce client ?
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Vous êtes sur le point de supprimer définitivement{" "}
              <span className="font-medium text-white">
                {client.name}
              </span>
              .
            </p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-medium">
              {client.name}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {client.company ?? "Aucune entreprise"}
            </p>

            <p className="mt-3 break-all text-sm text-zinc-400">
              {client.email}
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
            <p className="text-sm text-red-300">
              Cette action est irréversible. Les informations de ce client
              seront supprimées de la base de données.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/clients/${client.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <form action={deleteClientWithId} className="w-full sm:w-auto">
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
