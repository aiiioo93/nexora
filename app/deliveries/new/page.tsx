import Link from "next/link"

import prisma from "@/lib/prisma"
import { createDelivery } from "../actions"

export const dynamic = "force-dynamic"

export default async function NewDeliveryPage() {
  const [clients, drivers, vehicles] = await Promise.all([
    prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.driver.findMany({
      where: {
        status: "AVAILABLE",
      },

      orderBy: {
        lastName: "asc",
      },
    }),

    prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
      },

      orderBy: {
        registration: "asc",
      },
    }),
  ])

  const canCreateDelivery =
    clients.length > 0 &&
    drivers.length > 0 &&
    vehicles.length > 0

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href="/deliveries"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux livraisons
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Nouvelle livraison
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-400 sm:text-base">
            Assignez un client, un chauffeur et un véhicule à une
            nouvelle mission.
          </p>
        </header>

        {!canCreateDelivery ? (
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 sm:p-6">
            <h2 className="font-medium text-amber-300">
              Impossible de créer une livraison
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Une livraison nécessite au minimum un client, un
              chauffeur disponible et un véhicule disponible.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              <p>
                Clients :{" "}
                <span className="text-zinc-400">
                  {clients.length}
                </span>
              </p>

              <p>
                Chauffeurs disponibles :{" "}
                <span className="text-zinc-400">
                  {drivers.length}
                </span>
              </p>

              <p>
                Véhicules disponibles :{" "}
                <span className="text-zinc-400">
                  {vehicles.length}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <form
            action={createDelivery}
            className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
          >

            {/* CLIENT */}
            <div>
              <label
                htmlFor="clientId"
                className="mb-2 block text-sm font-medium"
              >
                Client *
              </label>

              <select
                id="clientId"
                name="clientId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
              >
                <option value="" disabled>
                  Sélectionner un client
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.company
                      ? `${client.company} · ${client.name}`
                      : client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* CHAUFFEUR */}
            <div>
              <label
                htmlFor="driverId"
                className="mb-2 block text-sm font-medium"
              >
                Chauffeur *
              </label>

              <select
                id="driverId"
                name="driverId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
              >
                <option value="" disabled>
                  Sélectionner un chauffeur
                </option>

                {drivers.map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.firstName} {driver.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* VÉHICULE */}
            <div>
              <label
                htmlFor="vehicleId"
                className="mb-2 block text-sm font-medium"
              >
                Véhicule *
              </label>

              <select
                id="vehicleId"
                name="vehicleId"
                required
                defaultValue=""
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
              >
                <option value="" disabled>
                  Sélectionner un véhicule
                </option>

                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.brand} {vehicle.model} ·{" "}
                    {vehicle.registration}
                  </option>
                ))}
              </select>
            </div>

            {/* TRAJET */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="origin"
                  className="mb-2 block text-sm font-medium"
                >
                  Départ *
                </label>

                <input
                  id="origin"
                  name="origin"
                  type="text"
                  required
                  placeholder="Paris"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
                />
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-2 block text-sm font-medium"
                >
                  Destination *
                </label>

                <input
                  id="destination"
                  name="destination"
                  type="text"
                  required
                  placeholder="Nantes"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
                />
              </div>
            </div>

            {/* DATE */}
            <div>
              <label
                htmlFor="scheduledAt"
                className="mb-2 block text-sm font-medium"
              >
                Date et heure prévues *
              </label>

              <input
                id="scheduledAt"
                name="scheduledAt"
                type="datetime-local"
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
              />
            </div>

            {/* NOTES */}
            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium"
              >
                Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                rows={4}
                placeholder="Informations particulières concernant la livraison..."
                className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/deliveries"
                className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
              >
                Annuler
              </Link>

              <button
                type="submit"
                className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
              >
                Créer la livraison
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}