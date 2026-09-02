import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"
import { deleteClient } from "../../actions"

type DeleteClientPageProps = {
  params: Promise<{
    id: string
  }>

  searchParams: Promise<{
    error?: string
  }>
}

export default async function DeleteClientPage({
  params,
  searchParams,
}: DeleteClientPageProps) {
  const { id } = await params
  const { error } = await searchParams

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

  const isLinked = error === "linked"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6">
        <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">

          {/* HEADER */}
          <p className="text-xs font-medium text-red-400 sm:text-sm">
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

          {/* INFORMATIONS CLIENT */}
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="font-medium">
              {client.name}
            </p>

            {client.company && (
              <p className="mt-1 text-sm text-zinc-400">
                {client.company}
              </p>
            )}

            <div className="mt-4 space-y-1">
              <p className="break-all text-sm text-zinc-500">
                {client.email}
              </p>

              {client.phone && (
                <p className="text-sm text-zinc-500">
                  {client.phone}
                </p>
              )}
            </div>
          </div>

          {/* CLIENT LIÉ À UNE LIVRAISON */}
          {isLinked ? (
            <div className="mt-6 rounded-lg border border-amber-900 bg-amber-950/20 p-4">
              <p className="text-sm font-medium text-amber-300">
                Impossible de supprimer ce client.
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-200/70">
                Ce client possède un historique de livraisons.
                Les livraisons doivent rester associées à leur
                client afin de préserver l&apos;historique de
                NEXORA.
              </p>
            </div>
          ) : (
            /* AVERTISSEMENT NORMAL */
            <div className="mt-6 rounded-lg border border-red-950 bg-red-950/20 p-4">
              <p className="text-sm leading-6 text-red-300">
                Cette action est irréversible. Le client sera
                définitivement supprimé de la base de données.
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href={`/clients/${client.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              {isLinked ? "Retour au client" : "Annuler"}
            </Link>

            {!isLinked && (
              <form
                action={deleteClientWithId}
                className="w-full sm:w-auto"
              >
                <button
                  type="submit"
                  className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-500 sm:w-auto"
                >
                  Supprimer définitivement
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
