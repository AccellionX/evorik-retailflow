import {
  Bot,
  Cable,
  CreditCard,
  MessageSquareText,
  ShieldCheck,
  UserRoundCog,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useDemo } from '@/context/DemoContext'

export function BotIntegrations() {
  const { bot, setBot, integrations, toggleIntegration } = useDemo()

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">
          Automação
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Bot & Integrações
        </h1>
        <p className="mt-1 text-sm text-muted">
          Configure o assistente e visualize conexões simuladas com o ecossistema brasileiro.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-brand-700" />
              Configuração do bot
            </CardTitle>
            <CardDescription>
              Mensagens e regras usadas na simulação do WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="greeting">Saudação inicial</Label>
              <Input
                id="greeting"
                value={bot.greeting}
                onChange={(e) => setBot({ greeting: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Horário de atendimento</Label>
              <Input
                id="hours"
                value={bot.businessHours}
                onChange={(e) => setBot({ businessHours: e.target.value })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <UserRoundCog className="mt-0.5 h-4 w-4 text-brand-700" />
                <div>
                  <p className="text-sm font-semibold">Handoff humano</p>
                  <p className="text-xs text-muted">
                    Permite transferir a conversa para um atendente.
                  </p>
                </div>
              </div>
              <Switch
                checked={bot.handoffEnabled}
                onCheckedChange={(checked) => setBot({ handoffEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-brand-700" />
                <div>
                  <p className="text-sm font-semibold">Confirmação automática</p>
                  <p className="text-xs text-muted">
                    Confirma pedidos elegíveis sem intervenção manual.
                  </p>
                </div>
              </div>
              <Switch
                checked={bot.autoConfirm}
                onCheckedChange={(checked) => setBot({ autoConfirm: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-brand-700" />
              Fluxo conversacional
            </CardTitle>
            <CardDescription>Visão simplificada do funil do bot.</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                'Cliente inicia no WhatsApp',
                'Bot apresenta catálogo e preços',
                'Itens entram no carrinho',
                'Pedido confirmado + Pix (simulado)',
                'Painel do lojista atualiza status',
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-3 rounded-xl border border-line bg-white/70 px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cable className="h-4 w-4 text-brand-700" />
            Integrações
          </CardTitle>
          <CardDescription>
            Status visual apenas — nenhuma API real é chamada nesta demo.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-brand-50/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">360dialog</p>
                <p className="mt-1 text-xs text-muted">
                  Provedor oficial da API do WhatsApp Business.
                </p>
              </div>
              <Badge
                variant={
                  integrations.dialog360 === 'connected' ? 'success' : 'simulated'
                }
              >
                {integrations.dialog360 === 'connected'
                  ? 'Conectado (simulado)'
                  : 'Simulado'}
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  integrations.dialog360 === 'connected'
                    ? 'bg-emerald-500'
                    : 'bg-amber-400 animate-pulse-soft'
                }`}
              />
              <span className="text-xs text-muted">
                Canal WA · número da loja · webhooks fictícios
              </span>
            </div>
            <Button
              className="mt-4"
              variant="secondary"
              size="sm"
              onClick={() => toggleIntegration('dialog360')}
            >
              Alternar status simulado
            </Button>
          </div>

          <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-amber-50/50 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-700" />
                  <p className="text-sm font-semibold">Asaas</p>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Cobranças Pix e boleto para o varejo brasileiro.
                </p>
              </div>
              <Badge
                variant={integrations.asaas === 'connected' ? 'success' : 'simulated'}
              >
                {integrations.asaas === 'connected'
                  ? 'Conectado (simulado)'
                  : 'Simulado'}
              </Badge>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  integrations.asaas === 'connected'
                    ? 'bg-emerald-500'
                    : 'bg-amber-400 animate-pulse-soft'
                }`}
              />
              <span className="text-xs text-muted">
                Pix instantâneo · split · confirmação fictícia
              </span>
            </div>
            <Button
              className="mt-4"
              variant="secondary"
              size="sm"
              onClick={() => toggleIntegration('asaas')}
            >
              Alternar status simulado
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
        <strong>Independent Concept Demo</strong> — integrações, pagamentos e WhatsApp são
        apenas ilustrativos. Nenhum dado sai do seu navegador.
      </div>
    </div>
  )
}
