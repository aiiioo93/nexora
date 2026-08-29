import Link from "next/link"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"

type ClientPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({
  params,
}: ClientPageProps) {
  const { id } = await params

  const client = await prisma.client.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!client) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-10">
        <Link
          href="/clients"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux clients
        </Link>

        <div className="mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Client #{client.id}
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                {client.name}
              </h1>

              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                {client.company ?? "Aucune entreprise renseignée"}
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
                <Link
                href={`/clients/${client.id}/edit`}
                className="flex flex-1 items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-800 sm:flex-none"
                >
                Modifier
                </Link>

                <Link
                href={`/clients/${client.id}/delete`}
                className="flex flex-1 items-center justify-center rounded-lg border border-red-900 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-950/30 sm:flex-none"
                >
                Supprimer
                </Link>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 p-4 sm:p-6">
            <h2 className="font-medium">
              Informations du client
            </h2>
          </div>

          <div className="divide-y divide-zinc-800">
            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
              <p className="text-xs text-zinc-500 sm:text-sm">
                Nom
              </p>

              <p className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {client.name}
              </p>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
              <p className="text-xs text-zinc-500 sm:text-sm">
                Entreprise
              </p>

              <p className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {client.company ?? "—"}
              </p>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
              <p className="text-xs text-zinc-500 sm:text-sm">
                Email
              </p>

              <p className="mt-1 break-all text-sm sm:col-span-2 sm:mt-0">
                {client.email}
              </p>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
              <p className="text-xs text-zinc-500 sm:text-sm">
                Téléphone
              </p>

              <p className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {client.phone ?? "—"}
              </p>
            </div>

            <div className="p-4 sm:grid sm:grid-cols-3 sm:gap-6 sm:p-6">
              <p className="text-xs text-zinc-500 sm:text-sm">
                Ajouté le
              </p>

              <p className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                {client.createdAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}