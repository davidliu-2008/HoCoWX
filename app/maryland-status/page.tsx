import { Instagram } from "lucide-react";
import { MarylandComparisonSection } from "@/components/MarylandComparisonSection";
import { PageTabs } from "@/components/PageTabs";
import { getMarylandOperationsComparison, type MarylandOperationStatus } from "@/lib/maryland-operations";

export const dynamic = "force-dynamic";

type LoadState<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function safeLoad<T>(loader: () => Promise<T>): Promise<LoadState<T>> {
  try {
    return { ok: true, data: await loader() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Something went wrong."
    };
  }
}

export default async function MarylandStatusPage() {
  const comparison = await safeLoad<MarylandOperationStatus[]>(getMarylandOperationsComparison);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src="/hoco-weather-channel-logo.png"
            alt="HoCo Weather Channel"
            className="h-20 w-20 rounded-lg border border-blue-100 bg-white object-contain p-2 shadow-sm"
          />
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-bay">
              Nearby Districts
            </p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Maryland School Status</h1>
          </div>
        </div>
        <a
          href="https://www.instagram.com/hocoweatherchannel/?hl=en"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </a>
      </header>

      <PageTabs active="maryland" />

      <MarylandComparisonSection comparison={comparison} />
    </main>
  );
}
