# Evorik RetailFlow

Interactive concept demo of a WhatsApp-based retail SaaS for Brazilian merchants.

**Stack:** React · TypeScript · Vite · Tailwind CSS · shadcn/ui-style components

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite** (build: `npm run build`, output: `dist`).
4. Deploy — `vercel.json` already handles SPA routing.

Or with the CLI:

```bash
npx vercel
```

> Independent Concept Demo — no backend, auth, or real WhatsApp/Asaas APIs. State lives in `localStorage`.
