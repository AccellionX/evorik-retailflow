import {
  CheckCheck,
  MessageCircle,
  Send,
  ShoppingCart,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDemo } from '@/context/DemoContext'
import { DEMO_CUSTOMER, STORE } from '@/data/seed'
import { formatBRL } from '@/lib/utils'

export function WhatsAppSimulator() {
  const {
    messages,
    products,
    cart,
    cartTotal,
    cartCount,
    addToCart,
    sendCustomerMessage,
    placeOrderFromCart,
    startDemo,
    demoRunning,
  } = useDemo()
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, demoRunning])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || demoRunning) return
    sendCustomerMessage(value)
    setText('')
  }

  const checkout = () => {
    const order = placeOrderFromCart()
    if (!order) return
    window.setTimeout(() => navigate('/pedidos'), 900)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
            Canal conversacional
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            WhatsApp Simulator
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Simule a jornada do cliente: descobrir produtos, montar o carrinho e confirmar o pedido.
          </p>
        </div>
        <Button variant="wa" size="lg" onClick={startDemo} disabled={demoRunning}>
          <Sparkles className="h-4 w-4" />
          {demoRunning ? 'Reproduzindo jornada…' : 'Start Demo'}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <Card className="overflow-hidden border-0 shadow-xl shadow-emerald-900/10">
          <div className="bg-[#075E54] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{STORE.name}</p>
                <p className="text-xs text-emerald-100">online · bot RetailFlow</p>
              </div>
              <Badge className="border-white/20 bg-white/10 text-white">Simulado</Badge>
            </div>
          </div>

          <div
            className="relative h-[min(62vh,560px)] overflow-y-auto px-3 py-4 sm:px-4"
            style={{
              backgroundColor: '#ECE5DD',
              backgroundImage:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(7,94,84,0.06), transparent 35%)',
            }}
          >
            <div className="mb-4 flex justify-center">
              <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
                {DEMO_CUSTOMER.name} · {DEMO_CUSTOMER.phone}
              </span>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => {
                if (msg.role === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center msg-in">
                      <span className="rounded-full bg-amber-100/90 px-3 py-1 text-[11px] font-medium text-amber-900">
                        {msg.text}
                      </span>
                    </div>
                  )
                }

                const isCustomer = msg.role === 'customer'
                return (
                  <div
                    key={msg.id}
                    className={`flex msg-in ${isCustomer ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[75%] ${
                        isCustomer
                          ? 'rounded-br-md bg-[#DCF8C6] text-ink'
                          : 'rounded-bl-md bg-white text-ink'
                      }`}
                    >
                      {!isCustomer && (
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                          Bot Evorik
                        </p>
                      )}
                      <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>

                      {msg.productCards && (
                        <div className="mt-3 grid gap-2">
                          {msg.productCards.map((pid) => {
                            const product = products.find((p) => p.id === pid)
                            if (!product) return null
                            return (
                              <div
                                key={pid}
                                className="flex items-center gap-3 rounded-xl border border-line bg-slate-50/80 p-2.5"
                              >
                                <span className="text-2xl">{product.emoji}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold">{product.name}</p>
                                  <p className="text-xs text-brand-700">
                                    {formatBRL(product.price)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="wa"
                                  disabled={demoRunning}
                                  onClick={() => addToCart(product.id)}
                                >
                                  + Carrinho
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {msg.actions?.includes('checkout') && cartCount > 0 && (
                        <div className="mt-3">
                          <Button
                            size="sm"
                            className="w-full"
                            variant="accent"
                            disabled={demoRunning}
                            onClick={checkout}
                          >
                            Finalizar pedido
                          </Button>
                        </div>
                      )}

                      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {isCustomer && <CheckCheck className="h-3 w-3 text-sky-600" />}
                      </div>
                    </div>
                  </div>
                )
              })}
              {demoRunning && (
                <div className="flex justify-start msg-in">
                  <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-slate-400" />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-pulse-soft rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          <form
            onSubmit={submit}
            className="flex items-center gap-2 border-t border-line bg-[#F0F2F5] p-3"
          >
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                demoRunning
                  ? 'Demo automática em andamento…'
                  : 'Digite como cliente… ex: Quero ver produtos'
              }
              disabled={demoRunning}
              className="rounded-full border-0 bg-white shadow-sm"
            />
            <Button type="submit" size="icon" variant="wa" disabled={demoRunning || !text.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4 text-brand-700" />
                Carrinho ao vivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cart.length === 0 ? (
                <p className="text-sm text-muted">Nenhum item ainda.</p>
              ) : (
                cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId)
                  if (!product) return null
                  return (
                    <div key={item.productId} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold">
                          {product.emoji} {product.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          {item.qty}× {formatBRL(product.price)}
                        </p>
                      </div>
                      <p className="text-xs font-semibold">
                        {formatBRL(product.price * item.qty)}
                      </p>
                    </div>
                  )
                })
              )}
              <div className="border-t border-line pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Total</span>
                  <span className="font-display text-lg font-semibold">
                    {formatBRL(cartTotal)}
                  </span>
                </div>
                <Button
                  className="mt-3 w-full"
                  variant="accent"
                  disabled={cartCount === 0 || demoRunning}
                  onClick={checkout}
                >
                  Confirmar pedido
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-brand-700 to-brand-900 text-white">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                <p className="text-sm font-semibold">Atalhos do cliente</p>
              </div>
              <div className="flex flex-col gap-2">
                {['Quero ver produtos', 'Como está meu carrinho?', 'Falar com atendente'].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={demoRunning}
                      onClick={() => sendCustomerMessage(suggestion)}
                      className="rounded-xl bg-white/10 px-3 py-2 text-left text-xs font-medium transition hover:bg-white/20 disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
