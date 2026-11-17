import {
  LayoutDashboard,
  MessageCircle,
  Package,
  Puzzle,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/context/DemoContext'
import { STORE } from '@/data/seed'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { to: '/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { to: '/bot', label: 'Bot & Integrações', icon: Puzzle },
]

export function AppShell() {
  const [open, setOpen] = useState(false)
  const { startDemo, resetDemo, demoRunning, orders } = useDemo()
  const navigate = useNavigate()
  const demoOrders = orders.filter((o) => o.fromDemo).length

  const onStartDemo = () => {
    navigate('/whatsapp')
    startDemo()
    setOpen(false)
  }

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-brand-700 text-white shadow-sm shadow-brand-700/30'
                : 'text-slate-600 hover:bg-brand-50 hover:text-brand-900',
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="relative hidden border-r border-line/80 bg-white/70 p-5 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg font-bold text-white shadow-lg shadow-brand-700/30">
              E
            </div>
            <div>
              <p className="font-display text-xl font-semibold tracking-tight text-ink">
                Evorik
              </p>
              <p className="text-xs font-medium text-brand-700">RetailFlow</p>
            </div>
          </div>
          <Badge variant="simulated" className="mt-4">
            Independent Concept Demo
          </Badge>
        </div>

        <NavItems />

        <div className="mt-auto space-y-3 pt-8">
          <Button
            variant="accent"
            className="w-full"
            size="lg"
            onClick={onStartDemo}
            disabled={demoRunning}
          >
            <Sparkles className="h-4 w-4" />
            {demoRunning ? 'Demo em andamento…' : 'Start Demo'}
          </Button>
          <Button variant="ghost" className="w-full" size="sm" onClick={resetDemo}>
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar demo
          </Button>
          <div className="rounded-2xl border border-line bg-brand-50/60 p-3">
            <p className="text-xs font-semibold text-brand-900">{STORE.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">{STORE.city}</p>
            {demoOrders > 0 && (
              <p className="mt-2 text-[11px] font-medium text-brand-700">
                {demoOrders} pedido(s) da jornada demo
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line/70 bg-white/75 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-line p-2 text-ink lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden">
              <p className="font-display text-lg font-semibold leading-none">Evorik</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                RetailFlow
              </p>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-ink">Painel do lojista</p>
              <p className="text-xs text-muted">Varejo via WhatsApp · dados de demonstração</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={onStartDemo}
              disabled={demoRunning}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Start Demo
            </Button>
            <Button
              variant="accent"
              size="icon"
              className="sm:hidden"
              onClick={onStartDemo}
              disabled={demoRunning}
              aria-label="Start Demo"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="hidden md:inline-flex">
              PT-BR
            </Badge>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <Outlet />
        </main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
          <div className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white p-5 shadow-2xl animate-fade-up">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-semibold">Evorik</p>
                <Badge variant="simulated" className="mt-2">
                  Independent Concept Demo
                </Badge>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavItems onNavigate={() => setOpen(false)} />
            <div className="mt-auto space-y-2 pt-6">
              <Button className="w-full" variant="accent" onClick={onStartDemo}>
                <Sparkles className="h-4 w-4" />
                Start Demo
              </Button>
              <Button className="w-full" variant="ghost" onClick={resetDemo}>
                Resetar demo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
