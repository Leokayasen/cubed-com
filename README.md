# Cubed.com

Cubed is a voxel engine built in-house by BitWave Studios.

You can find our engine source code [here].

You can also find the [docs] for the engine there as well.

## Backend Quickstart

The site now includes a Phase 1 backend for playtest and feedback submissions.

- Prisma + Postgres persistence
- Discord webhook notifications
- Basic admin read endpoint

Detailed setup instructions live in [`docs/backend.md`](docs/backend.md).

## Playtest Discord Webhook Setup

Playtest submissions from `/playtest` can be forwarded to a Discord channel using a webhook.

1. Create a Discord webhook for the channel where you want applications posted.
2. Add the webhook URL to `.env.local`:

```bash
DISCORD_PLAYTEST_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

3. Start the app and submit the form at `/playtest`.

If `DISCORD_PLAYTEST_WEBHOOK_URL` is missing, the API endpoint returns a configuration error.

## Feedback Discord Webhook Setup

Feedback submissions from `/support/feedback/submit` can be forwarded to Discord.

1. Create a webhook for your feedback/review channel.
2. Add the webhook URL to `.env.local`:

```bash
DISCORD_FEEDBACK_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

3. Submit the form at `/support/feedback/submit`.

If `DISCORD_FEEDBACK_WEBHOOK_URL` is missing, `/api/feedback` returns a configuration error.


## License
Cubed is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

[here]:https://codeberg.org/BitWave/voxel-experiment
[docs]:https://docs.bitwave-studios.com
