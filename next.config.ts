import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.weather.gov", pathname: "/images/wrn/Infographics/**", search: "" }]
  },
  typescript: {
    ignoreBuildErrors: false
  }
};

export default nextConfig;
