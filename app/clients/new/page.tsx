import Link from "next/link"

import { createClient } from "../actions"

export default function NewClientPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 md:py-10">
        
        <div className="mb-8">
          <Link
            href="/clients"
            className="text-sm text-zinc-500 transition hover:text-white"
          >
            ← Retour aux clients
          </Link>

          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Ajouter un client
          </h1>

          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Ajoutez une nouvelle entreprise cliente à NEXORA.
          </p>
        </div>

        <form
          action={createClient}
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
              placeholder="Sophie Martin"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
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
              placeholder="Novatek Industries"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
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
              placeholder="sophie@novatek.fr"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
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
              placeholder="06 12 34 56 78"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-base outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/clients"
              className="flex w-full items-center justify-center rounded-lg border border-zinc-700 px-4 py-3 text-sm font-medium sm:w-auto"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="w-full rounded-lg bg-white px-5 py-3 text-sm font-medium text-black sm:w-auto"
            >
              Ajouter le client
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}