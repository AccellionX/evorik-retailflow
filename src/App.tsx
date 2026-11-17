import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DemoProvider } from '@/context/DemoContext'
import { BotIntegrations } from '@/pages/BotIntegrations'
import { Dashboard } from '@/pages/Dashboard'
import { Orders } from '@/pages/Orders'
import { Products } from '@/pages/Products'
import { WhatsAppSimulator } from '@/pages/WhatsAppSimulator'

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<Products />} />
            <Route path="whatsapp" element={<WhatsAppSimulator />} />
            <Route path="pedidos" element={<Orders />} />
            <Route path="bot" element={<BotIntegrations />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DemoProvider>
  )
}
