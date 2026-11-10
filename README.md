# HCPSS Operations + Weather

A student-led Next.js dashboard for Howard County, Maryland that shows:

- Current official HCPSS operational status from [status.hcpss.org](https://status.hcpss.org/)
- Local National Weather Service data for Ellicott City / Howard County
- A transparent rule-based school operations prediction

The weather-based prediction is intentionally conservative and explains the factors behind its score.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Server-side API routes
- National Weather Service API

## Local Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The scripts use Next's WASM compiler package so the app can also run in stricter local environments that block native Node add-ons.

## Environment Variables

Optional for National Weather Service requests:

```bash
NWS_USER_AGENT="Your app name (your-email@example.com)"
```

The National Weather Service recommends a descriptive `User-Agent` header. The app includes a development fallback if this variable is not set.

Visual Crossing provides the historical observation used for the same-time-yesterday temperature comparison. Add the
academic account API key locally in `.env.local` and in the Vercel project's Environment Variables settings:

```bash
VISUAL_CROSSING_API_KEY="your_visual_crossing_api_key"
```

Keep this credential server-side and never prefix it with `NEXT_PUBLIC_`. If it is unavailable, the app falls back to
National Weather Service observation history.

To automatically show Instagram posts and captions, the HoCo Weather Channel Instagram account must be a professional
Creator or Business account connected through a Meta developer app. Add these values locally in `.env.local` and in the
Vercel project's Environment Variables settings:

```bash
INSTAGRAM_USER_ID="your_instagram_professional_account_id"
INSTAGRAM_ACCESS_TOKEN="your_long_lived_instagram_access_token"
INSTAGRAM_API_VERSION="v25.0"
```

Never commit the access token to GitHub. Without these values, the Instagram page displays the featured interview posts
using Instagram's native embeds. With them, the page automatically loads posts and captions and refreshes every 30 minutes.

## API Routes

- `/api/hcpss-status` fetches and parses the official HCPSS status page.
- `/api/weather` fetches NWS forecast, hourly forecast, grid data, and active alerts, then enriches the historical temperature comparison with Visual Crossing when configured.
- `/api/prediction` combines current weather data with the local rule-based prediction model.
- `/api/maryland-operations` checks the Maryland county comparison list with conservative parsing and 30-minute caching.

## Important Implementation Notes

- HCPSS status parsing happens in `lib/hcpss-status.ts`. The parser looks for the official page's `Important Status Message` section, then reads the current status heading and message below it.
- NWS API calls happen in `lib/weather.ts`. The app uses the Ellicott City point coordinates and reads forecast, hourly forecast, grid snowfall, and active alerts.
- Visual Crossing API calls happen in `lib/visual-crossing.ts`. The API key remains on the server, and failed requests fall back without breaking the weather dashboard.
- Prediction rules live in `lib/prediction.ts`. They score winter alerts, freezing rain or ice wording, snowfall amounts, wind gusts, temperature, precipitation chance, and likely timing.
- Maryland district source URLs live in `lib/maryland-districts.ts`. Non-HCPSS status parsing is experimental because districts publish operational updates in different formats.
- HCPSS responses are cached briefly for 5 minutes. NWS responses are cached for 10 minutes.

## Tests

```bash
npm test
```

The included tests use Node's built-in test runner and cover quiet weather, winter storm closure risk, and freezing rain risk.
