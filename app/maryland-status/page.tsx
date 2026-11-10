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

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-bay">
            Nearby Districts
          </p>
          <h1 className="text-4xl font-black text-ink md:text-6xl">Maryland School Status</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8">Compare current operations across Maryland public school districts and open each district&apos;s official source.</p>
        </div>
      </header>

      <MarylandComparisonSection comparison={comparison} />
    </main>
  );
}
