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
    <main className="min-h-screen w-full pb-6">
      <PageTabs active="maryland" />

      <header className="flex flex-col gap-4 border-b border-blue-100 px-4 py-5 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-bay">
            Nearby Districts
          </p>
          <h1 className="text-3xl font-bold text-ink md:text-5xl">Maryland School Status</h1>
        </div>
      </header>

      <MarylandComparisonSection comparison={comparison} />
    </main>
  );
}
