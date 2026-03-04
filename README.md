# WorkoutApp

Base Next.js app con frontend e backend nello stesso progetto.

## Avvio

```bash
npm install
npm run dev
```

Apri http://localhost:3000 e prova l'API su http://localhost:3000/api/health.

## Deploy su GitHub Pages

Il progetto è configurato per deploy automatico con GitHub Actions.

- Workflow: `.github/workflows/nextjs.yml`
- Build output statico: cartella `out/`
- Deploy automatico a ogni push su `main`

### Nota importante su API Routes

GitHub Pages ospita solo contenuti statici. Le route server (esempio: `/api/*`) non vengono eseguite su Pages.
Per API backend usa un servizio separato (Vercel Functions, Railway, Render, ecc.) oppure mantieni solo frontend statico su Pages.
