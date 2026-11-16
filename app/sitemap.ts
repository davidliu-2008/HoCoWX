import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hocoweatherchannel.org";
  const paths = [
    "/",
    "/about",
    "/commute",
    "/predictions",
    "/maryland-status",
    "/interview",
    "/weather-literacy",
    "/student-polls",
    "/partnerships",
    "/accessibility"
  ];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`
  }));
}
