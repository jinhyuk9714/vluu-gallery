# Personal Gallery

A curated personal photography gallery built with Next.js, Sanity Studio, and Vercel.

## Apps

- `apps/web`: public gallery site
- `apps/studio`: Sanity Studio for editorial workflow

## Scripts

- `pnpm dev:web`
- `pnpm dev:studio`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`

## Environment

Copy [`.env.example`](./.env.example) to `.env.local` for the web app. In Vercel, configure the same values separately for Preview and Production, and follow the launch notes in [`docs/deployment.md`](./docs/deployment.md).
