import Link from "next/link"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-5 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs text-zinc-500 sm:text-sm">
              NEXORA · Operations
            </p>

            <h1 className="text-2xl font-semibold sm:text-3xl">
              Clients
            </h1>

            <p className="mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
              Gérez les entreprises clientes de NEXORA.
            </p>
          </div>

          <Link
            href="/clients/new"
            className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto md:py-2"
          >
            + Ajouter un client
          </Link>
        </div>

        {/* AUCUN CLIENT */}
        {clients.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-12 text-center sm:px-6">
            <p className="font-medium">
              Aucun client
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Ajoutez votre premier client pour commencer.
            </p>

            <Link
              href="/clients/new"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Ajouter un client
            </Link>
          </div>
        ) : (
          <>
            {/* MOBILE : CARTES */}
            <div className="space-y-3 md:hidden">
              {clients.map((client) => (
                <article
                  key={client.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-4">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-base font-medium transition hover:text-zinc-300"
                    >
                      {client.name}
                    </Link>

                    <p className="mt-1 text-sm text-zinc-500">
                      {client.company ?? "Aucune entreprise"}
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-zinc-600">
                        Email
                      </p>

                      <p className="mt-1 break-all text-zinc-300">
                        {client.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-600">
                        Téléphone
                      </p>

                      <p className="mt-1 text-zinc-300">
                        {client.phone ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-zinc-800 pt-4">
                    <Link
                      href={`/clients/${client.id}`}
                      className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium transition hover:bg-zinc-800"
                    >
                      Voir la fiche
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* TABLETTE / DESKTOP : TABLEAU */}
            <div className="hidden overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 md:block">
              <table className="w-full">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left text-sm text-zinc-500">
                    <th className="px-6 py-4 font-medium">
                      Client
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Entreprise
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Email
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Téléphone
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-zinc-800 last:border-0"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium transition hover:text-zinc-300"
                        >
                          {client.name}
                        </Link>
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {client.company ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {client.email}
                      </td>

                      <td className="px-6 py-4 text-zinc-400">
                        {client.phone ?? "—"}
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/clients/${client.id}`}
                          className="text-sm font-medium text-zinc-300 transition hover:text-white"
                        >
                          Voir →
                        </Link>
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