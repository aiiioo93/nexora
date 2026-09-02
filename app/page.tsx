import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Package,
  Truck,
  UserRound,
  Users,
} from "lucide-react"

import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

function getDeliveryStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "En attente"

    case "ASSIGNED":
      return "Assignée"

    case "IN_TRANSIT":
      return "En cours"

    case "DELIVERED":
      return "Livrée"

    case "DELAYED":
      return "En retard"

    case "CANCELLED":
      return "Annulée"

    default:
      return status
  }
}

function getDeliveryStatusClass(status: string) {
  switch (status) {
    case "DELIVERED":
      return "border-emerald-900 bg-emerald-950/30 text-emerald-400"

    case "IN_TRANSIT":
      return "border-blue-900 bg-blue-950/30 text-blue-400"

    case "DELAYED":
      return "border-red-900 bg-red-950/30 text-red-400"

    case "ASSIGNED":
      return "border-violet-900 bg-violet-950/30 text-violet-400"

    case "CANCELLED":
      return "border-zinc-700 bg-zinc-800 text-zinc-500"

    default:
      return "border-amber-900 bg-amber-950/30 text-amber-400"
  }
}

export default async function DashboardPage() {
  const [
    clientsCount,

    deliveriesCount,
    activeDeliveriesCount,
    delayedDeliveriesCount,
    deliveredDeliveriesCount,

    availableDriversCount,
    busyDriversCount,

    availableVehiclesCount,
    busyVehiclesCount,
    maintenanceVehiclesCount,

    recentDeliveries,
  ] = await Promise.all([
    prisma.client.count(),

    prisma.delivery.count(),

    prisma.delivery.count({
      where: {
        status: {
          in: ["PENDING", "ASSIGNED", "IN_TRANSIT", "DELAYED"],
        },
      },
    }),

    prisma.delivery.count({
      where: {
        status: "DELAYED",
      },
    }),

    prisma.delivery.count({
      where: {
        status: "DELIVERED",
      },
    }),

    prisma.driver.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.driver.count({
      where: {
        status: "ON_DELIVERY",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "AVAILABLE",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "ON_DELIVERY",
      },
    }),

    prisma.vehicle.count({
      where: {
        status: "MAINTENANCE",
      },
    }),

    prisma.delivery.findMany({
      take: 5,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        client: true,
        driver: true,
        vehicle: true,
      },
    }),
  ])

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
                Suivez en temps réel les clients, les livraisons,
                les chauffeurs et la flotte NEXORA.
              </p>
            </div>

            <Link
              href="/deliveries/new"
              className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 md:w-auto"
            >
              + Nouvelle livraison
            </Link>
          </div>
        </header>

        {/* KPI PRINCIPAUX */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* CLIENTS */}
          <Link
            href="/clients"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <Users
                size={17}
                className="text-zinc-400"
              />
            </div>

            <p className="mt-5 text-2xl font-semibold sm:text-3xl">
              {clientsCount}
            </p>

            <p className="mt-1 text-sm font-medium">
              Clients
            </p>

            <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
              Entreprises enregistrées
            </p>
          </Link>

          {/* LIVRAISONS */}
          <Link
            href="/deliveries"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <Package
                size={17}
                className="text-zinc-400"
              />
            </div>

            <p className="mt-5 text-2xl font-semibold sm:text-3xl">
              {activeDeliveriesCount}
            </p>

            <p className="mt-1 text-sm font-medium">
              Livraisons actives
            </p>

            <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
              {deliveriesCount} mission(s) au total
            </p>
          </Link>

          {/* CHAUFFEURS */}
          <Link
            href="/drivers"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <UserRound
                size={17}
                className="text-zinc-400"
              />
            </div>

            <p className="mt-5 text-2xl font-semibold sm:text-3xl">
              {availableDriversCount}
            </p>

            <p className="mt-1 text-sm font-medium">
              Chauffeurs disponibles
            </p>

            <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
              {busyDriversCount} en livraison
            </p>
          </Link>

          {/* VEHICULES */}
          <Link
            href="/vehicles"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 sm:p-5"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
              <Truck
                size={17}
                className="text-zinc-400"
              />
            </div>

            <p className="mt-5 text-2xl font-semibold sm:text-3xl">
              {availableVehiclesCount}
            </p>

            <p className="mt-1 text-sm font-medium">
              Véhicules disponibles
            </p>

            <p className="mt-1 hidden text-xs text-zinc-500 sm:block">
              {busyVehiclesCount} en livraison
            </p>
          </Link>
        </section>

        {/* ALERTES OPERATIONNELLES */}
        <section className="mt-6 grid gap-3 sm:grid-cols-3">

          {/* RETARDS */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-red-950 bg-red-950/20">
                <AlertTriangle
                  size={17}
                  className="text-red-400"
                />
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {delayedDeliveriesCount}
                </p>

                <p className="text-xs text-zinc-500">
                  Livraison(s) en retard
                </p>
              </div>
            </div>
          </div>

          {/* TERMINEES */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-emerald-950 bg-emerald-950/20">
                <CheckCircle2
                  size={17}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {deliveredDeliveriesCount}
                </p>

                <p className="text-xs text-zinc-500">
                  Livraison(s) terminée(s)
                </p>
              </div>
            </div>
          </div>

          {/* MAINTENANCE */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-amber-950 bg-amber-950/20">
                <Truck
                  size={17}
                  className="text-amber-400"
                />
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {maintenanceVehiclesCount}
                </p>

                <p className="text-xs text-zinc-500">
                  Véhicule(s) en maintenance
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVITE */}
        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">

          <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-6">
            <div>
              <h2 className="font-medium">
                Activité récente
              </h2>

              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                Dernières missions enregistrées
              </p>
            </div>

            <Link
              href="/deliveries"
              className="flex items-center gap-1 text-xs font-medium text-zinc-400 transition hover:text-white sm:text-sm"
            >
              Voir tout
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentDeliveries.length === 0 ? (
            <div className="px-4 py-12 text-center sm:px-6">
              <Package
                size={22}
                className="mx-auto text-zinc-600"
              />

              <p className="mt-4 font-medium">
                Aucune livraison
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Créez une première mission pour alimenter le dashboard.
              </p>

              <Link
                href="/deliveries/new"
                className="mt-5 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black"
              >
                Nouvelle livraison
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {recentDeliveries.map((delivery) => (
                <Link
                  key={delivery.id}
                  href={`/deliveries/${delivery.id}`}
                  className="block p-4 transition hover:bg-zinc-800/40 sm:px-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {delivery.reference}
                        </p>

                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getDeliveryStatusClass(
                            delivery.status
                          )}`}
                        >
                          {getDeliveryStatusLabel(
                            delivery.status
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-zinc-300">
                        {delivery.origin} →{" "}
                        {delivery.destination}
                      </p>

                      <p className="mt-2 truncate text-xs text-zinc-500">
                        {delivery.client.company ??
                          delivery.client.name}
                        {" · "}
                        {delivery.driver.firstName}{" "}
                        {delivery.driver.lastName}
                        {" · "}
                        {delivery.vehicle.registration}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-zinc-600"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
