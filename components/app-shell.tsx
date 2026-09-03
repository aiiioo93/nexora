"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Boxes,
  LayoutDashboard,
  PackageCheck,
  Plus,
  Truck,
  UserRound,
  Users,
} from "lucide-react"

const navigation = [
  { href: "/", label: "Accueil", icon: LayoutDashboard },
  { href: "/deliveries", label: "Livraisons", icon: PackageCheck },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/drivers", label: "Chauffeurs", icon: UserRound },
  { href: "/vehicles", label: "Véhicules", icon: Truck },
]

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Retour à l’accueil NEXORA"
      className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 shadow-[0_0_32px_rgba(34,211,238,0.14)] transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/15">
        <Boxes size={20} strokeWidth={1.8} />
        <span className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
      </span>
      <span className={compact ? "sr-only" : "block"}>
        <span className="block text-[15px] font-semibold tracking-[0.22em] text-white">
          NEXORA
        </span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Logistics OS
        </span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="nexora-app-shell">
      <aside className="nexora-sidebar">
        <Brand />

        <div className="mt-10 flex items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          <span className="h-px flex-1 bg-slate-800" />
          Navigation
          <span className="h-px flex-1 bg-slate-800" />
        </div>

        <nav aria-label="Navigation principale" className="mt-4 space-y-1.5">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href)

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`nexora-nav-link ${active ? "nexora-nav-link-active" : ""}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {active ? <span className="ml-auto size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" /> : null}
              </Link>
            )
          })}
        </nav>

        <Link href="/deliveries/new" className="nexora-primary-action mt-7">
          <Plus size={17} />
          Nouvelle livraison
        </Link>

        <div className="mt-auto rounded-2xl border border-slate-800/80 bg-slate-900/55 p-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Centre opérationnel
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Données synchronisées avec votre environnement logistique.
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="nexora-mobile-header">
          <Brand />
          <Link
            href="/deliveries/new"
            aria-label="Créer une livraison"
            className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300 transition active:scale-95"
          >
            <Plus size={19} />
          </Link>
        </header>

        <div className="nexora-content">{children}</div>
      </div>

      <nav aria-label="Navigation mobile" className="nexora-mobile-nav">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`nexora-mobile-link ${active ? "nexora-mobile-link-active" : ""}`}
            >
              <Icon size={19} strokeWidth={active ? 2.2 : 1.7} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
