import Link from "next/link"
import { ArrowLeft, Building2, Pencil, Trash2 } from "lucide-react"
import { notFound } from "next/navigation"

import prisma from "@/lib/prisma"
import { parseRouteId } from "@/lib/route-id"

type ClientPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({
  params,
}: ClientPageProps) {
  const { id } = await params
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 md:py-10">
        <Link
          href="/clients"
          className="record-back-link"
        >
          <ArrowLeft size={15} />
          Clients
        </Link>

        <header className="record-hero">
          <div className="record-identity">
            <div className="record-icon">
              <Building2 size={21} />
            </div>
            <div className="min-w-0">
              <p className="record-eyebrow">Client #{client.id}</p>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                {client.name}
              </h1>
              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                {client.company ?? "Aucune entreprise renseignée"}
              </p>
            </div>
          </div>

          <div className="record-actions">
            <Link href={`/clients/${client.id}/edit`} className="record-action">
              <Pencil size={15} />
              Modifier
            </Link>
            <Link href={`/clients/${client.id}/delete`} className="record-action record-action-danger">
              <Trash2 size={15} />
              Supprimer
            </Link>
          </div>
        </header>

        <section className="record-panel">
          <div className="record-panel-heading">
            <h2 className="font-medium">Informations du client</h2>
          </div>

          <div className="record-info-grid">
            <div className="record-info">
              <p className="record-info-label">Nom</p>
              <p className="record-info-value">{client.name}</p>
            </div>

            <div className="record-info">
              <p className="record-info-label">Entreprise</p>
              <p className="record-info-value">{client.company ?? "—"}</p>
            </div>

            <div className="record-info record-info-wide">
              <p className="record-info-label">Email</p>
              <p className="record-info-value">{client.email}</p>
            </div>

            <div className="record-info">
              <p className="record-info-label">Téléphone</p>
              <p className="record-info-value">{client.phone ?? "—"}</p>
            </div>

            <div className="record-info">
              <p className="record-info-label">Ajouté le</p>
              <p className="record-info-value">{client.createdAt.toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
