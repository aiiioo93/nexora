import Link from "next/link"

import { createVehicle } from "../actions"

export default function NewVehiclePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href="/vehicles"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux véhicules
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Flotte
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Ajouter un véhicule
          </h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Enregistrez un nouveau véhicule dans la flotte NEXORA.
          </p>
        </header>

        <form
          action={createVehicle}
          className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
        >
          <div>
            <label
              htmlFor="registration"
              className="mb-2 block text-sm font-medium"
            >
              Immatriculation *
            </label>

            <input
              id="registration"
              name="registration"
              type="text"
              required
              placeholder="GH-482-LP"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base uppercase outline-none placeholder:normal-case placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="brand"
                className="mb-2 block text-sm font-medium"
              >
                Marque *
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                required
                placeholder="Renault"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="model"
                className="mb-2 block text-sm font-medium"
              >
                Modèle *
              </label>

              <input
                id="model"
                name="model"
                type="text"
                required
                placeholder="Master"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium"
              >
                Année *
              </label>

              <input
                id="year"
                name="year"
                type="number"
                required
                min="1900"
                max="2100"
                placeholder="2023"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="mileage"
                className="mb-2 block text-sm font-medium"
              >
                Kilométrage *
              </label>

              <input
                id="mileage"
                name="mileage"
                type="number"
                required
                min="0"
                defaultValue="0"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium"
            >
              Statut *
            </label>

            <select
              id="status"
              name="status"
              defaultValue="AVAILABLE"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none focus:border-zinc-500"
            >
              <option value="AVAILABLE">
                Disponible
              </option>

              <option value="ON_DELIVERY">
                En livraison
              </option>

              <option value="MAINTENANCE">
                Maintenance
              </option>

              <option value="OUT_OF_SERVICE">
                Hors service
              </option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/vehicles"
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Ajouter le véhicule
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}