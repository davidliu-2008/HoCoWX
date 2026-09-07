# HoCo Weather Channel Mobile

Separate Expo React Native app for HoCo Weather Channel.

This app is designed for Howard County students, families, teachers, and school communities. It shows official HCPSS status separately from unofficial weather-based predictions.

## Features

- Bottom tab navigation
- Current official HCPSS status
- Howard County weather summary and hourly forecast
- Unofficial school operation prediction
- Risk score breakdown and top factors
- Nearby Maryland school status comparison
- How predictions work and disclaimer screen
- Instagram and official HCPSS links
- Loading, error, and pull-to-refresh states
- iPhone safe-area support
- Light/dark mode support through system settings

## API Base URL

The app fetches from the existing website API routes:

- `/api/hcpss-status`
- `/api/weather`
- `/api/prediction`
- `/api/maryland-operations`

Set the deployed website URL in `app.json`:

```json
"extra": {
  "apiBaseUrl": "https://hocoweatherchannel.vercel.app"
}
```

For local testing, you may also use:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-site.vercel.app npx expo start
```

Use a deployed HTTPS URL for Expo Go. A phone usually cannot access `localhost` from your computer.

## Local Setup

```bash
cd hoco-weather-channel-mobile
npm install
npx expo install --fix
npx expo-doctor
npx expo start
```

Then scan the QR code with Expo Go on your iPhone.

## Type Check

```bash
npm run typecheck
```

## Tests

```bash
npm test
```

## App Store Build With EAS

Install EAS CLI:

```bash
npm install -g eas-cli
```

Log in:

```bash
eas login
```

Configure the project:

```bash
eas build:configure
```

Build for iOS:

```bash
eas build --platform ios --profile production
```

Submit to App Store Connect:

```bash
eas submit --platform ios
```

## App Store Notes

Bundle identifier placeholder:

```text
com.hocoweatherchannel.app
```

Privacy-policy-ready summary:

```text
HoCo Weather Channel only fetches public weather and school status data. It does not require login, collect student information, or sell personal data.
```

Disclaimer:

```text
This app is unofficial and is not affiliated with HCPSS. Always check the official HCPSS status page for final decisions.
```
