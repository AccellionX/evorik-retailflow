import { ChevronRight, PackageCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDemo } from '@/context/DemoContext'
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type OrderStatus } from '@/data/seed'
import { formatBRL, formatDateTime } from '@/lib/utils'

function statusVariant(status: OrderStatus) {
  switch (status) {
    case 'novo':
      return 'warning' as const
    case 'confirmado':
      return 'default' as const
    case 'preparando':
      return 'secondary' as const
    case 'enviado':
      return 'default' as const
    case 'entregue':
      return 'success' as const
    case 'cancelado':
      return 'danger' as const
  }
}

export function Orders() {
  const { orders, advanceOrderStatus } = useDemo()
  const demoOrders = orders.filter((o) => o.fromDemo)

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
          Operação
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Pedidos
        </h1>
        <p className="mt-1 text-sm text-muted">
          Acompanhe e avance o status dos pedidos gerados pelo WhatsApp.
        </p>
      </div>

      {demoOrders.length > 0 && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-950">
                  Pedido da jornada demo sincronizado
                </p>
                <p className="text-xs text-amber-900/70">
                  {demoOrders[0]?.id} · {demoOrders[0]?.customer} ·{' '}
                  {formatBRL(demoOrders[0]?.total ?? 0)}
                </p>
              </div>
            </div>
            <Badge variant="warning">WhatsApp → Painel</Badge>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {orders.map((order) => {
          const idx = ORDER_STATUS_FLOW.indexOf(order.status)
          const canAdvance = idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1

          return (
            <Card key={order.id} className={order.fromDemo ? 'ring-1 ring-amber-300/70' : ''}>
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{order.id}</CardTitle>
                      <Badge variant={statusVariant(order.status)}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                      {order.fromDemo && <Badge variant="simulated">Da demo</Badge>}
                    </div>
                    <CardDescription className="mt-1">
                      {order.customer} · {order.phone} · {formatDateTime(order.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-display text-2xl font-semibold">
                      {formatBRL(order.total)}
                    </p>
                    <p className="text-xs text-muted">WhatsApp</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="rounded-xl border border-line/80 bg-slate-50/70 px-3 py-2"
                    >
                      <p className="text-sm font-medium">
                        {item.qty}× {item.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatBRL(item.price)} · subtotal {formatBRL(item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ORDER_STATUS_FLOW.map((step, i) => (
                      <div key={step} className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            i <= idx
                              ? 'bg-brand-700 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {ORDER_STATUS_LABEL[step]}
                        </span>
                        {i < ORDER_STATUS_FLOW.length - 1 && (
                          <ChevronRight className="h-3 w-3 text-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>

                  {canAdvance && (
                    <Button onClick={() => advanceOrderStatus(order.id)}>
                      Avançar para {ORDER_STATUS_LABEL[ORDER_STATUS_FLOW[idx + 1]!]}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
