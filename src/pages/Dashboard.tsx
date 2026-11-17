import {
  ArrowUpRight,
  MessageCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDemo } from '@/context/DemoContext'
import { ORDER_STATUS_LABEL, REVENUE_SERIES } from '@/data/seed'
import { formatBRL, formatDateTime } from '@/lib/utils'

export function Dashboard() {
  const { stats, orders, products } = useDemo()
  const recent = orders.slice(0, 5)
  const lowStock = products.filter((p) => p.stock < 25).length

  const cards = [
    {
      label: 'Receita (7 dias)',
      value: formatBRL(stats.revenueToday),
      hint: '+12,4% vs semana anterior',
      icon: Wallet,
      tone: 'from-brand-600 to-brand-800',
    },
    {
      label: 'Pedidos ativos',
      value: String(stats.ordersToday),
      hint: `${orders.filter((o) => o.fromDemo).length} da jornada demo`,
      icon: ShoppingBag,
      tone: 'from-amber-500 to-amber-700',
    },
    {
      label: 'Ticket médio',
      value: formatBRL(stats.avgTicket || 118.4),
      hint: 'Canal WhatsApp',
      icon: TrendingUp,
      tone: 'from-slate-700 to-slate-900',
    },
    {
      label: 'Conversão do bot',
      value: `${stats.conversion.toFixed(1)}%`,
      hint: 'Catálogo → pedido',
      icon: MessageCircle,
      tone: 'from-emerald-500 to-emerald-700',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
            Visão geral
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Performance do varejo conversacional com dados realistas do mercado brasileiro.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Atualizado agora · demo local
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="overflow-hidden">
            <CardContent className="relative p-5">
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.tone} opacity-10`}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
                    {card.value}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-brand-700">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {card.hint}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.tone} text-white shadow-md`}
                >
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Receita semanal</CardTitle>
            <CardDescription>Vendas via WhatsApp · valores em BRL</CardDescription>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_SERIES}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                />
                <Tooltip
                  formatter={(value) => [formatBRL(Number(value ?? 0)), 'Receita']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  fill="url(#revFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pedidos por dia</CardTitle>
            <CardDescription>Volume conversacional</CardDescription>
          </CardHeader>
          <CardContent className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value) => [Number(value ?? 0), 'Pedidos']}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Bar dataKey="pedidos" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pedidos recentes</CardTitle>
            <CardDescription>Últimas conversas convertidas em vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recent.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-2 rounded-xl border border-line/80 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{order.id}</p>
                      {order.fromDemo && <Badge variant="warning">Demo</Badge>}
                      <Badge variant="secondary">{ORDER_STATUS_LABEL[order.status]}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {order.customer} · {order.items.length} item(ns)
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold">{formatBRL(order.total)}</p>
                    <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saúde da loja</CardTitle>
            <CardDescription>Sinais rápidos do catálogo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-brand-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-brand-700" />
                <span className="text-sm font-medium">Produtos ativos</span>
              </div>
              <span className="font-semibold">{products.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-amber-700" />
                <span className="text-sm font-medium">Estoque baixo</span>
              </div>
              <span className="font-semibold">{lowStock}</span>
            </div>
            <div className="rounded-xl border border-dashed border-brand-200 bg-white/60 p-4">
              <p className="text-sm font-semibold text-brand-900">Dica da demo</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Clique em <strong>Start Demo</strong> para ver uma cliente descobrir produtos no WhatsApp e gerar um pedido no painel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
