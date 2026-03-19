# Backend Bootstrap (Phase 1)

This project now has a basic backend foundation for submissions:

- `POST /api/playtest` stores submissions in Postgres and forwards to Discord webhook.
- `POST /api/feedback` stores submissions in Postgres and forwards to Discord webhook.
- `GET /api/admin/submissions` returns recent submissions when `x-admin-token` is valid.

## Environment Variables

Create `.env.local` with:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
DISCORD_PLAYTEST_WEBHOOK_URL=https://discord.com/api/webhooks/...
DISCORD_FEEDBACK_WEBHOOK_URL=https://discord.com/api/webhooks/...
ADMIN_API_TOKEN=choose-a-long-random-secret
```

## Database Setup

```bash
npm run db:generate
npm run db:migrate -- --name init_submissions
```

## Production Deploy Step

If your forms return 500 after deploy, the most common cause is unapplied migrations.

Run this against production before testing forms:

```bash
npm run db:deploy
```

For Vercel, set your Build Command to run migrations before build:

```bash
npm run db:deploy && npm run build
```

## Smoke Check

```bash
npm run backend:smoke
```

## Admin Endpoint

```bash
curl -H "x-admin-token: YOUR_ADMIN_API_TOKEN" "http://localhost:3000/api/admin/submissions?type=feedback&limit=25"
```

Use `type=playtest` or omit `type` to fetch both.

