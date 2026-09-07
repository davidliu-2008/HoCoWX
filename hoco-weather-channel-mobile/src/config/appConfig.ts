import Constants from "expo-constants";

const configuredBaseUrl =
  Constants.expoConfig?.extra?.apiBaseUrl ??
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://hocoweatherchannel.vercel.app";

export const appConfig = {
  apiBaseUrl: configuredBaseUrl.replace(/\/$/, ""),
  officialHcpssUrl: "https://status.hcpss.org/",
  instagramUrl: "https://www.instagram.com/hocoweatherchannel/?hl=en",
  privacySummary:
    "HoCo Weather Channel only fetches public weather and school status data. It does not require login, collect student information, or sell personal data."
};
