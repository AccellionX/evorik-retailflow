import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEMO_CUSTOMER,
  ORDER_STATUS_FLOW,
  SEED_ORDERS,
  SEED_PRODUCTS,
  type ChatMessage,
  type Order,
  type OrderStatus,
  type Product,
} from '@/data/seed'
import { uid } from '@/lib/utils'

const STORAGE_KEY = 'evorik-retailflow-demo-v1'

type CartItem = {
  productId: string
  qty: number
}

type BotConfig = {
  greeting: string
  handoffEnabled: boolean
  autoConfirm: boolean
  businessHours: string
}

type IntegrationStatus = {
  dialog360: 'connected' | 'simulated'
  asaas: 'connected' | 'simulated'
}

type PersistedState = {
  products: Product[]
  orders: Order[]
  messages: ChatMessage[]
  cart: CartItem[]
  bot: BotConfig
  integrations: IntegrationStatus
  demoStep: number
  demoRunning: boolean
}

type DemoContextValue = {
  products: Product[]
  orders: Order[]
  messages: ChatMessage[]
  cart: CartItem[]
  bot: BotConfig
  integrations: IntegrationStatus
  demoStep: number
  demoRunning: boolean
  cartTotal: number
  cartCount: number
  stats: {
    revenueToday: number
    ordersToday: number
    avgTicket: number
    conversion: number
  }
  addProduct: (product: Omit<Product, 'id'>) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  advanceOrderStatus: (orderId: string) => void
  addToCart: (productId: string, qty?: number) => void
  clearCart: () => void
  sendCustomerMessage: (text: string) => void
  startDemo: () => void
  resetDemo: () => void
  setBot: (patch: Partial<BotConfig>) => void
  toggleIntegration: (key: keyof IntegrationStatus) => void
  placeOrderFromCart: () => Order | null
}

const defaultBot: BotConfig = {
  greeting:
    'Olá! 👋 Sou o assistente da Casa & Sabor. Posso te ajudar a encontrar produtos e fechar seu pedido pelo WhatsApp.',
  handoffEnabled: true,
  autoConfirm: true,
  businessHours: 'Seg–Sáb · 09:00–20:00',
}

const defaultIntegrations: IntegrationStatus = {
  dialog360: 'simulated',
  asaas: 'simulated',
}

function nowIso() {
  return new Date().toISOString()
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: uid('msg'),
      role: 'system',
      text: 'Conversa simulada · WhatsApp Business',
      timestamp: nowIso(),
    },
    {
      id: uid('msg'),
      role: 'bot',
      text: defaultBot.greeting,
      timestamp: nowIso(),
    },
  ]
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error('empty')
    return JSON.parse(raw) as PersistedState
  } catch {
    return {
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
      messages: initialMessages(),
      cart: [],
      bot: defaultBot,
      integrations: defaultIntegrations,
      demoStep: 0,
      demoRunning: false,
    }
  }
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const cartTotal = useMemo(() => {
    return state.cart.reduce((sum, item) => {
      const product = state.products.find((p) => p.id === item.productId)
      return sum + (product?.price ?? 0) * item.qty
    }, 0)
  }, [state.cart, state.products])

  const cartCount = useMemo(
    () => state.cart.reduce((n, i) => n + i.qty, 0),
    [state.cart],
  )

  const stats = useMemo(() => {
    const revenue = state.orders.reduce((s, o) => s + o.total, 0)
    const ordersToday = state.orders.length
    const avgTicket = ordersToday ? revenue / ordersToday : 0
    return {
      revenueToday: revenue * 0.18 + 1860,
      ordersToday: Math.max(ordersToday, 12),
      avgTicket,
      conversion: 34.2,
    }
  }, [state.orders])

  const pushMessages = useCallback((msgs: Omit<ChatMessage, 'id' | 'timestamp'>[]) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        ...msgs.map((m) => ({
          ...m,
          id: uid('msg'),
          timestamp: nowIso(),
        })),
      ],
    }))
  }, [])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    setState((prev) => ({
      ...prev,
      products: [{ ...product, id: uid('prod') }, ...prev.products],
    }))
  }, [])

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }))
  }, [])

  const advanceOrderStatus = useCallback((orderId: string) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => {
        if (o.id !== orderId) return o
        const idx = ORDER_STATUS_FLOW.indexOf(o.status)
        if (idx < 0 || idx >= ORDER_STATUS_FLOW.length - 1) return o
        return { ...o, status: ORDER_STATUS_FLOW[idx + 1]! }
      }),
    }))
  }, [])

  const addToCart = useCallback((productId: string, qty = 1) => {
    setState((prev) => {
      const existing = prev.cart.find((c) => c.productId === productId)
      const cart = existing
        ? prev.cart.map((c) =>
            c.productId === productId ? { ...c, qty: c.qty + qty } : c,
          )
        : [...prev.cart, { productId, qty }]
      return { ...prev, cart }
    })
  }, [])

  const clearCart = useCallback(() => {
    setState((prev) => ({ ...prev, cart: [] }))
  }, [])

  const placeOrderFromCart = useCallback((): Order | null => {
    const snapshot = state
    if (snapshot.cart.length === 0) return null

    const items = snapshot.cart
      .map((c) => {
        const p = snapshot.products.find((x) => x.id === c.productId)
        if (!p) return null
        return {
          productId: p.id,
          name: p.name,
          qty: c.qty,
          price: p.price,
        }
      })
      .filter(Boolean) as Order['items']

    if (items.length === 0) return null

    const total = items.reduce((s, i) => s + i.price * i.qty, 0)
    const orderNum = 1043 + snapshot.orders.filter((o) => o.fromDemo).length
    const order: Order = {
      id: `PED-${orderNum}`,
      customer: DEMO_CUSTOMER.name,
      phone: DEMO_CUSTOMER.phone,
      channel: 'whatsapp',
      items,
      total,
      status: 'novo',
      createdAt: nowIso(),
      fromDemo: true,
    }

    setState((prev) => ({
      ...prev,
      cart: [],
      orders: [order, ...prev.orders.filter((o) => o.id !== order.id)],
      products: prev.products.map((p) => {
        const bought = items.find((i) => i.productId === p.id)
        return bought ? { ...p, stock: Math.max(0, p.stock - bought.qty) } : p
      }),
      messages: [
        ...prev.messages,
        {
          id: `msg_order_${order.id}`,
          role: 'bot',
          text: `Pedido ${order.id} criado com sucesso! Total ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Acompanhe em Pedidos.`,
          timestamp: order.createdAt,
        },
      ],
    }))

    return order
  }, [state])

  const sendCustomerMessage = useCallback(
    (text: string) => {
      const lower = text.toLowerCase()
      pushMessages([{ role: 'customer', text }])

      window.setTimeout(() => {
        if (
          lower.includes('produto') ||
          lower.includes('cardápio') ||
          lower.includes('catalogo') ||
          lower.includes('catálogo') ||
          lower.includes('ver') ||
          lower.includes('mostrar')
        ) {
          pushMessages([
            {
              role: 'bot',
              text: 'Claro! Aqui estão alguns destaques da Casa & Sabor ✨ Toque em um produto para adicionar ao carrinho.',
              productCards: ['prod_kit', 'prod_cafe', 'prod_vinho', 'prod_azeite'],
            },
          ])
          return
        }

        if (lower.includes('carrinho') || lower.includes('pedido')) {
          pushMessages([
            {
              role: 'bot',
              text:
                cartCount > 0
                  ? `Seu carrinho tem ${cartCount} item(ns), total ${cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Quer finalizar?`
                  : 'Seu carrinho ainda está vazio. Quer ver nossos produtos?',
              actions: cartCount > 0 ? ['checkout'] : undefined,
            },
          ])
          return
        }

        if (lower.includes('humano') || lower.includes('atendente')) {
          pushMessages([
            {
              role: 'bot',
              text: state.bot.handoffEnabled
                ? 'Perfeito! Estou transferindo você para um atendente humano. Aguarde um instante… (simulado)'
                : 'O handoff humano está desativado neste momento. Posso continuar te ajudando por aqui!',
            },
          ])
          return
        }

        pushMessages([
          {
            role: 'bot',
            text: 'Posso te mostrar o catálogo, adicionar itens ao carrinho ou finalizar um pedido. Experimente: “Quero ver produtos”.',
          },
        ])
      }, 650)
    },
    [cartCount, cartTotal, pushMessages, state.bot.handoffEnabled],
  )

  const startDemo = useCallback(() => {
    const kit = SEED_PRODUCTS.find((p) => p.id === 'prod_kit')!
    const cafe = SEED_PRODUCTS.find((p) => p.id === 'prod_cafe')!

    setState((prev) => ({
      ...prev,
      demoRunning: true,
      demoStep: 0,
      cart: [],
      messages: [
        {
          id: uid('msg'),
          role: 'system',
          text: 'Demo guiada iniciada · jornada cliente → pedido',
          timestamp: nowIso(),
        },
      ],
    }))

    const steps: Array<{ delay: number; run: () => void }> = [
      {
        delay: 400,
        run: () =>
          pushMessages([
            {
              role: 'customer',
              text: 'Oi! Quero montar um café da manhã especial 😊',
            },
          ]),
      },
      {
        delay: 1200,
        run: () =>
          pushMessages([
            {
              role: 'bot',
              text: 'Oi, Camila! Que ótimo ✨ Separei opções perfeitas para um café especial:',
              productCards: ['prod_kit', 'prod_cafe', 'prod_mel'],
            },
          ]),
      },
      {
        delay: 2400,
        run: () => {
          addToCart('prod_kit', 1)
          pushMessages([
            {
              role: 'customer',
              text: `Quero o ${kit.name}`,
            },
          ])
        },
      },
      {
        delay: 3200,
        run: () =>
          pushMessages([
            {
              role: 'bot',
              text: `Adicionei 1× ${kit.name} ao carrinho. Quer acrescentar o Café Especial?`,
              actions: ['add_cart'],
            },
          ]),
      },
      {
        delay: 4200,
        run: () => {
          addToCart('prod_cafe', 1)
          pushMessages([
            {
              role: 'customer',
              text: `Sim, adiciona o ${cafe.name} também!`,
            },
          ])
        },
      },
      {
        delay: 5000,
        run: () =>
          pushMessages([
            {
              role: 'bot',
              text: `Pronto! Carrinho: Kit + Café · total R$ ${(kit.price + cafe.price).toFixed(2).replace('.', ',')}. Confirmar pedido?`,
              actions: ['checkout', 'confirm'],
            },
          ]),
      },
      {
        delay: 6200,
        run: () =>
          pushMessages([
            {
              role: 'customer',
              text: 'Pode confirmar! Pagamento via Pix.',
            },
          ]),
      },
      {
        delay: 7200,
        run: () => {
          setState((prev) => {
            const items = [
              {
                productId: kit.id,
                name: kit.name,
                qty: 1,
                price: kit.price,
              },
              {
                productId: cafe.id,
                name: cafe.name,
                qty: 1,
                price: cafe.price,
              },
            ]
            const total = kit.price + cafe.price
            const orderNum = 1043 + prev.orders.filter((o) => o.fromDemo).length
            const order: Order = {
              id: `PED-${orderNum}`,
              customer: DEMO_CUSTOMER.name,
              phone: DEMO_CUSTOMER.phone,
              channel: 'whatsapp',
              items,
              total,
              status: 'confirmado',
              createdAt: nowIso(),
              fromDemo: true,
            }

            return {
              ...prev,
              cart: [],
              demoRunning: false,
              demoStep: 8,
              orders: [order, ...prev.orders.filter((o) => !o.fromDemo || o.id !== order.id)],
              messages: [
                ...prev.messages,
                {
                  id: uid('msg'),
                  role: 'bot',
                  text: `Pedido ${order.id} confirmado! ✅\nTotal: ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nPagamento Pix (Asaas · simulado)\nPrevisão de entrega: hoje, 18h–20h.`,
                  timestamp: nowIso(),
                },
                {
                  id: uid('msg'),
                  role: 'system',
                  text: 'Pedido sincronizado com o painel · veja em Pedidos',
                  timestamp: nowIso(),
                },
              ],
            }
          })
        },
      },
    ]

    steps.forEach(({ delay, run }) => {
      window.setTimeout(run, delay)
    })
  }, [addToCart, pushMessages])

  const resetDemo = useCallback(() => {
    const fresh = {
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
      messages: initialMessages(),
      cart: [],
      bot: defaultBot,
      integrations: defaultIntegrations,
      demoStep: 0,
      demoRunning: false,
    }
    setState(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const setBot = useCallback((patch: Partial<BotConfig>) => {
    setState((prev) => ({ ...prev, bot: { ...prev.bot, ...patch } }))
  }, [])

  const toggleIntegration = useCallback((key: keyof IntegrationStatus) => {
    setState((prev) => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [key]:
          prev.integrations[key] === 'connected' ? 'simulated' : 'connected',
      },
    }))
  }, [])

  const value: DemoContextValue = {
    products: state.products,
    orders: state.orders,
    messages: state.messages,
    cart: state.cart,
    bot: state.bot,
    integrations: state.integrations,
    demoStep: state.demoStep,
    demoRunning: state.demoRunning,
    cartTotal,
    cartCount,
    stats,
    addProduct,
    updateOrderStatus,
    advanceOrderStatus,
    addToCart,
    clearCart,
    sendCustomerMessage,
    startDemo,
    resetDemo,
    setBot,
    toggleIntegration,
    placeOrderFromCart,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
