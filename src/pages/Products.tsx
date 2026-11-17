import { Plus, Search } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDemo } from '@/context/DemoContext'
import { formatBRL } from '@/lib/utils'

const EMOJIS = ['☕', '🫒', '🥣', '🍷', '🍯', '🍫', '🧺', '🧀', '🥐', '🧃']

export function Products() {
  const { products, addProduct } = useDemo()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'Mercearia',
    price: '',
    stock: '20',
    description: '',
    emoji: '☕',
  })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }, [products, query])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const price = Number(form.price.replace(',', '.'))
    const stock = Number(form.stock)
    if (!form.name || Number.isNaN(price) || Number.isNaN(stock)) return

    addProduct({
      name: form.name,
      category: form.category,
      price,
      stock,
      description: form.description || 'Produto adicionado na demo.',
      emoji: form.emoji,
      popular: false,
    })
    setForm({
      name: '',
      category: 'Mercearia',
      price: '',
      stock: '20',
      description: '',
      emoji: '☕',
    })
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
            Catálogo
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Produtos
          </h1>
          <p className="mt-1 text-sm text-muted">
            Vitrine sincronizada com o bot do WhatsApp · preços em BRL
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4" />
              Adicionar produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo produto</DialogTitle>
              <DialogDescription>
                O item entra no catálogo local e pode aparecer na conversa do bot.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Geleia de Morango Artesanal"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="39,90"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, emoji }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition ${
                        form.emoji === emoji
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-line hover:bg-slate-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Breve descrição do produto"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar produto</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome ou categoria…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((product, index) => (
          <Card
            key={product.id}
            className="group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-700/10"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <CardContent className="p-0">
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-brand-50 via-white to-amber-50">
                <span className="text-5xl transition duration-300 group-hover:scale-110">
                  {product.emoji}
                </span>
                {product.popular && (
                  <Badge className="absolute left-3 top-3" variant="warning">
                    Popular
                  </Badge>
                )}
                <Badge
                  className="absolute right-3 top-3"
                  variant={product.stock < 20 ? 'warning' : 'secondary'}
                >
                  {product.stock} un.
                </Badge>
              </div>
              <div className="space-y-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  {product.category}
                </p>
                <h3 className="text-sm font-semibold leading-snug text-ink">{product.name}</h3>
                <p className="line-clamp-2 text-xs text-muted">{product.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <p className="font-display text-xl font-semibold text-brand-800">
                    {formatBRL(product.price)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
