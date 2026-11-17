export type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  emoji: string
  description: string
  popular?: boolean
}

export type OrderStatus =
  | 'novo'
  | 'confirmado'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado'

export type OrderItem = {
  productId: string
  name: string
  qty: number
  price: number
}

export type Order = {
  id: string
  customer: string
  phone: string
  channel: 'whatsapp'
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  fromDemo?: boolean
}

export type ChatMessage = {
  id: string
  role: 'customer' | 'bot' | 'system'
  text: string
  timestamp: string
  productCards?: string[]
  actions?: Array<'add_cart' | 'checkout' | 'confirm'>
}

export type RevenuePoint = {
  day: string
  receita: number
  pedidos: number
}

export const STORE = {
  name: 'Casa & Sabor Market',
  city: 'Curitiba, PR',
  phone: '+55 41 99876-4421',
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_cafe',
    name: 'Café Especial Cerrado 500g',
    category: 'Mercearia',
    price: 42.9,
    stock: 48,
    emoji: '☕',
    description: 'Torrado artesanal, notas de chocolate e caramelo.',
    popular: true,
  },
  {
    id: 'prod_azeite',
    name: 'Azeite Extra Virgem 500ml',
    category: 'Mercearia',
    price: 58.5,
    stock: 32,
    emoji: '🫒',
    description: 'Importado da Espanha, acidez 0,2%.',
    popular: true,
  },
  {
    id: 'prod_granola',
    name: 'Granola Premium com Castanhas',
    category: 'Café da manhã',
    price: 29.9,
    stock: 67,
    emoji: '🥣',
    description: 'Sem açúcar refinado, crocante e nutritiva.',
  },
  {
    id: 'prod_vinho',
    name: 'Vinho Tinto Malbec 750ml',
    category: 'Bebidas',
    price: 79.9,
    stock: 24,
    emoji: '🍷',
    description: 'Harmoniza com queijos e carnes grelhadas.',
    popular: true,
  },
  {
    id: 'prod_mel',
    name: 'Mel Silvestre Orgânico 300g',
    category: 'Mercearia',
    price: 34.5,
    stock: 41,
    emoji: '🍯',
    description: 'Produzido no Paraná, puro e cremoso.',
  },
  {
    id: 'prod_choc',
    name: 'Chocolate 70% Cacau 100g',
    category: 'Doces',
    price: 18.9,
    stock: 90,
    emoji: '🍫',
    description: 'Bean-to-bar brasileiro, intensidade média.',
  },
  {
    id: 'prod_kit',
    name: 'Kit Café da Manhã Completo',
    category: 'Kits',
    price: 89.9,
    stock: 18,
    emoji: '🧺',
    description: 'Café, granola, mel e chocolate — pronto para presentear.',
    popular: true,
  },
  {
    id: 'prod_queijo',
    name: 'Queijo Canastra Meia Cura 400g',
    category: 'Frios',
    price: 64.0,
    stock: 15,
    emoji: '🧀',
    description: 'Artesanal de Minas, maturação 30 dias.',
  },
]

export const SEED_ORDERS: Order[] = [
  {
    id: 'PED-1042',
    customer: 'Mariana Costa',
    phone: '+55 41 99123-8877',
    channel: 'whatsapp',
    items: [
      { productId: 'prod_kit', name: 'Kit Café da Manhã Completo', qty: 1, price: 89.9 },
      { productId: 'prod_mel', name: 'Mel Silvestre Orgânico 300g', qty: 1, price: 34.5 },
    ],
    total: 124.4,
    status: 'enviado',
    createdAt: '2026-11-17T14:22:00.000Z',
  },
  {
    id: 'PED-1041',
    customer: 'Rafael Oliveira',
    phone: '+55 41 98765-1122',
    channel: 'whatsapp',
    items: [
      { productId: 'prod_vinho', name: 'Vinho Tinto Malbec 750ml', qty: 2, price: 79.9 },
    ],
    total: 159.8,
    status: 'preparando',
    createdAt: '2026-11-17T12:05:00.000Z',
  },
  {
    id: 'PED-1040',
    customer: 'Ana Beatriz Lima',
    phone: '+55 41 99654-3300',
    channel: 'whatsapp',
    items: [
      { productId: 'prod_cafe', name: 'Café Especial Cerrado 500g', qty: 1, price: 42.9 },
      { productId: 'prod_granola', name: 'Granola Premium com Castanhas', qty: 2, price: 29.9 },
    ],
    total: 102.7,
    status: 'entregue',
    createdAt: '2026-11-16T19:40:00.000Z',
  },
  {
    id: 'PED-1039',
    customer: 'Pedro Henrique Souza',
    phone: '+55 41 98811-7766',
    channel: 'whatsapp',
    items: [
      { productId: 'prod_azeite', name: 'Azeite Extra Virgem 500ml', qty: 1, price: 58.5 },
      { productId: 'prod_queijo', name: 'Queijo Canastra Meia Cura 400g', qty: 1, price: 64.0 },
    ],
    total: 122.5,
    status: 'confirmado',
    createdAt: '2026-11-16T16:18:00.000Z',
  },
  {
    id: 'PED-1038',
    customer: 'Juliana Mendes',
    phone: '+55 41 99222-4455',
    channel: 'whatsapp',
    items: [
      { productId: 'prod_choc', name: 'Chocolate 70% Cacau 100g', qty: 3, price: 18.9 },
    ],
    total: 56.7,
    status: 'entregue',
    createdAt: '2026-11-15T21:02:00.000Z',
  },
]

export const REVENUE_SERIES: RevenuePoint[] = [
  { day: 'Seg', receita: 1240, pedidos: 18 },
  { day: 'Ter', receita: 1580, pedidos: 22 },
  { day: 'Qua', receita: 1320, pedidos: 19 },
  { day: 'Qui', receita: 1890, pedidos: 27 },
  { day: 'Sex', receita: 2450, pedidos: 34 },
  { day: 'Sáb', receita: 2780, pedidos: 41 },
  { day: 'Dom', receita: 1640, pedidos: 24 },
]

export const DEMO_CUSTOMER = {
  name: 'Camila Ferreira',
  phone: '+55 41 99777-2211',
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  novo: 'Novo',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'novo',
  'confirmado',
  'preparando',
  'enviado',
  'entregue',
]
