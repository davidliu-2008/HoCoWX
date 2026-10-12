import { ExternalLink, Instagram, Mail } from "lucide-react";
import { InstagramEmbeds } from "@/components/InstagramEmbeds";
import { PageTabs } from "@/components/PageTabs";
import { getInstagramFeed, type InstagramMedia } from "@/lib/instagram";

const featuredPosts = [
  "https://www.instagram.com/p/DV7cV7skY_1/?hl=en",
  "https://www.instagram.com/p/DV7HWXFEXuw/?hl=en"
];

export const metadata = {
  title: "Weather Insights | HoCo Weather Channel",
  description: "Weather updates, educational information, and community insights from HoCo Weather Channel."
};

export const revalidate = 1800;

function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

function InstagramCard({ item }: { item: InstagramMedia }) {
  const preview = item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url;

  return (
    <article className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <a href={item.permalink} target="_blank" rel="noreferrer" className="block bg-slate-100">
        {preview ? (
          <img src={preview} alt="" className="aspect-square w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex aspect-square items-center justify-center text-bay">
            <Instagram className="h-10 w-10" />
          </div>
        )}
      </a>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatPostDate(item.timestamp)}</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
          {item.caption || "View this post on Instagram."}
        </p>
        <a
          href={item.permalink}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-bay hover:underline"
        >
          Open post <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

export default async function InstagramPage() {
  const feed = await getInstagramFeed();

  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src="/hoco-weather-channel-logo.png"
            alt="HoCo Weather Channel"
            className="h-20 w-20 rounded-lg border border-blue-100 bg-white object-contain p-2 shadow-sm"
          />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
              <Instagram className="h-4 w-4" /> Weather Literacy &amp; Updates
            </p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Weather Updates &amp; Insights</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href="mailto:howardcountyweather@gmail.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href="https://www.instagram.com/hocoweatherchannel/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </header>

      <PageTabs active="instagram" />

      {feed.items.length > 0 ? (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-bay">Latest Updates</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">Weather posts and insights</h2>
            </div>
            <p className="text-sm text-slate-500">Refreshes every 30 minutes</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {feed.items.map((item) => <InstagramCard key={item.id} item={item} />)}
          </div>
        </section>
      ) : (
        <section>
          <div className="mb-5 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Featured Weather Updates</h2>
            <p className="mt-1 text-slate-600">
              These Instagram posts include the original media and descriptions. The complete automatic feed will appear
              here once the Instagram account connection is added.
            </p>
            {feed.error ? <p className="mt-3 text-sm text-red-700">Feed connection error: {feed.error}</p> : null}
          </div>
          <InstagramEmbeds urls={featuredPosts} />
        </section>
      )}
    </main>
  );
}
