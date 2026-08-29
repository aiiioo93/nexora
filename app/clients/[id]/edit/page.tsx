import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { updateClient } from "../../actions"

type EditClientPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditClientPage({
  params,
}: EditClientPageProps) {
  const { id } = await params

  const clientId = Number(id)

  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  })

  if (!client) {
    notFound()
  }

  const updateClientWithId = updateClient.bind(
    null,
    client.id
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        {/* RETOUR */}
        <Link
          href={`/clients/${client.id}`}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour à la fiche
        </Link>

        {/* HEADER */}
        <div className="mb-8 mt-6">
          <p className="mb-2 text-xs text-zinc-500 sm:text-sm">
            NEXORA · Client #{client.id}
          </p>

          <h1 className="text-2xl font-semibold sm:text-3xl">
            Modifier le client
          </h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Modifiez les informations de {client.name}.
          </p>
        </div>

        {/* FORMULAIRE */}
        <form
          action={updateClientWithId}
          className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium"
            >
              Nom du contact *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={client.name}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-sm font-medium"
            >
              Entreprise
            </label>

            <input
              id="company"
              name="company"
              type="text"
              defaultValue={client.company ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={client.email}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition focus:border-zinc-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium"
            >
              Téléphone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={client.phone ?? ""}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition focus:border-zinc-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href={`/clients/${client.id}`}
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}