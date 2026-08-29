import Link from "next/link"
import {
  ArrowRight,
  Building2,
  Package,
  Truck,
  UserRound,
  Users,
} from "lucide-react"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const [clientsCount, recentClients] = await Promise.all([
    prisma.client.count(),

    prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ])

  const stats = [
    {
      label: "Clients",
      value: clientsCount,
      description: "Entreprises enregistrées",
      icon: Users,
      href: "/clients",
      active: true,
    },
    {
      label: "Livraisons",
      value: 0,
      description: "Livraisons en cours",
      icon: Package,
      href: "/deliveries",
      active: false,
    },
    {
      label: "Chauffeurs",
      value: 0,
      description: "Chauffeurs actifs",
      icon: UserRound,
      href: "/drivers",
      active: false,
    },
    {
      label: "Véhicules",
      value: 0,
      description: "Véhicules disponibles",
      icon: Truck,
      href: "/vehicles",
      active: false,
    },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10">

        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 sm:text-sm">
            NEXORA · Operations Control Center
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Vue d&apos;ensemble
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Suivez l&apos;activité opérationnelle de NEXORA et gérez
                vos ressources depuis un seul espace.
              </p>
            </div>

            <Link
              href="/clients/new"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto"
            >
              + Ajouter un client
            </Link>
          </div>
        </header>

        {/* KPI */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
                    <Icon size={17} className="text-zinc-400" />
                  </div>

                  {!stat.active && (
                    <span className="rounded-full border border-zinc-800 px-2 py-1 text-[9px] uppercase tracking-wide text-zinc-600 sm:text-[10px]">
                      Bientôt
                    </span>
                  )}
                </div>

                <p className="mt-5 text-2xl font-semibold sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium">
                  {stat.label}
                </p>

                <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </section>

        {/* CONTENU PRINCIPAL */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

          {/* CLIENTS RÉCENTS */}
          <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-6">
              <div>
                <h2 className="font-medium">
                  Clients récents
                </h2>

                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                  Dernières entreprises enregistrées
                </p>
              </div>

              <Link
                href="/clients"
                className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white sm:text-sm"
              >
                Voir tout
                <ArrowRight size={15} />
              </Link>
            </div>

            {recentClients.length === 0 ? (
              <div className="px-4 py-12 text-center sm:px-6">
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
                  <Building2 size={19} className="text-zinc-500" />
                </div>

                <p className="mt-4 font-medium">
                  Aucun client
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Ajoutez votre premier client pour démarrer.
                </p>

                <Link
                  href="/clients/new"
                  className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black"
                >
                  Ajouter un client
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800">
                {recentClients.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between gap-4 p-4 transition hover:bg-zinc-800/40 sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {client.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {client.company ?? client.email}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="shrink-0 text-zinc-600"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ÉTAT DU SYSTÈME */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6">
            <div>
              <h2 className="font-medium">
                État des opérations
              </h2>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Modules actuellement disponibles
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div>
                  <p className="text-sm font-medium">
                    Gestion clients
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    CRUD opérationnel
                  </p>
                </div>

                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  Actif
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div>
                  <p className="text-sm font-medium">
                    Gestion livraisons
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Prochaine étape
                  </p>
                </div>

                <span className="text-xs text-zinc-600">
                  À venir
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div>
                  <p className="text-sm font-medium">
                    Flotte & chauffeurs
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Pas encore configuré
                  </p>
                </div>

                <span className="text-xs text-zinc-600">
                  À venir
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FUTURE ZONE OPÉRATIONNELLE */}
        <section className="mt-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
            Prochaine évolution
          </p>

          <h2 className="mt-2 text-lg font-medium">
            Centre de suivi des livraisons
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Cette zone affichera bientôt les livraisons en cours, les retards,
            les chauffeurs assignés et les incidents opérationnels.
          </p>
        </section>
      </div>
    </main>
  )
}