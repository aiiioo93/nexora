import Link from "next/link"

import { createDriver } from "../actions"

export default function NewDriverPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">

        <Link
          href="/drivers"
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← Retour aux chauffeurs
        </Link>

        <header className="mb-8 mt-6">
          <p className="text-xs text-zinc-500 sm:text-sm">
            NEXORA · Flotte
          </p>

          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">
            Ajouter un chauffeur
          </h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Enregistrez un nouveau chauffeur dans NEXORA.
          </p>
        </header>

        <form
          action={createDriver}
          className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6"
        >
          {/* PRÉNOM + NOM */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium"
              >
                Prénom *
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Mamadou"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium"
              >
                Nom *
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Diallo"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>
          </div>

          {/* EMAIL */}
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
              placeholder="mamadou@nexora-demo.fr"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          {/* TÉLÉPHONE */}
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
              placeholder="06 12 34 56 78"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          {/* PERMIS */}
          <div>
            <label
              htmlFor="licenseNumber"
              className="mb-2 block text-sm font-medium"
            >
              Numéro de permis *
            </label>

            <input
              id="licenseNumber"
              name="licenseNumber"
              type="text"
              required
              placeholder="PERMIS-78452"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          {/* STATUT */}
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition focus:border-zinc-500"
            >
              <option value="AVAILABLE">
                Disponible
              </option>

              <option value="ON_DELIVERY">
                En livraison
              </option>

              <option value="OFF_DUTY">
                Hors service
              </option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/drivers"
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium transition hover:bg-zinc-800 sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
            >
              Ajouter le chauffeur
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}