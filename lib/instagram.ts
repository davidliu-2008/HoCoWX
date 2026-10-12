export type InstagramMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
};

export type InstagramFeed = {
  configured: boolean;
  items: InstagramMedia[];
  error?: string;
};

type InstagramResponse = {
  data?: InstagramMedia[];
  paging?: { next?: string };
  error?: { message?: string };
};

const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";

export async function getInstagramFeed(): Promise<InstagramFeed> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  const apiVersion = process.env.INSTAGRAM_API_VERSION || "v25.0";

  if (!accessToken || !userId) {
    return { configured: false, items: [] };
  }

  const items: InstagramMedia[] = [];
  let nextUrl: string | undefined =
    `https://graph.instagram.com/${apiVersion}/${encodeURIComponent(userId)}/media` +
    `?fields=${encodeURIComponent(FIELDS)}&limit=100&access_token=${encodeURIComponent(accessToken)}`;

  try {
    for (let page = 0; nextUrl && page < 10; page += 1) {
      const response = await fetch(nextUrl, { next: { revalidate: 1800 } });
      const payload = (await response.json()) as InstagramResponse;

      if (!response.ok || payload.error) {
        throw new Error(payload.error?.message || `Instagram returned ${response.status}.`);
      }

      items.push(...(payload.data ?? []));
      nextUrl = payload.paging?.next;
    }

    return { configured: true, items };
  } catch (error) {
    return {
      configured: true,
      items: [],
      error: error instanceof Error ? error.message : "The Instagram feed could not be loaded."
    };
  }
}
