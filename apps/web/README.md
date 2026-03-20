`apps/web` is the public gallery site for a personal photography archive.

## Development

From the repo root:

```bash
pnpm dev:web
```

Build and deploy checks:

```bash
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web test
```

## Environment

Copy [`../../.env.example`](../../.env.example) to `.env.local` for local work or set the same values in Vercel for Preview and Production. See [`../../docs/deployment.md`](../../docs/deployment.md) for the launch setup.

## Notes

- The app root is `apps/web`.
- Preview and production deployments should each set `NEXT_PUBLIC_SITE_URL` to their own Vercel URL.
