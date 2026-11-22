import { Suspense } from "react";
import { MarylandComparisonSection } from "@/components/MarylandComparisonSection";
import { MarylandStatusMap } from "@/components/MarylandStatusMap";
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

async function DistrictReports() {
  const comparison = await safeLoad<MarylandOperationStatus[]>(getMarylandOperationsComparison);

  return (
    <>
      <MarylandStatusMap reports={comparison.ok ? comparison.data : []} />
      <MarylandComparisonSection comparison={comparison} />
    </>
  );
}

export default function MarylandStatusPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-6">
      <PageTabs active="maryland" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black text-ink md:text-6xl">Maryland School Status</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8">Compare current operations across Maryland public school districts and open each district&apos;s official source.</p>
        </div>
      </header>

      <Suspense fallback={<p role="status" className="mx-auto max-w-[1440px] px-5 py-8 text-slate-600 sm:px-8 lg:px-12">Loading district status reports…</p>}>
        <DistrictReports />
      </Suspense>
    </main>
  );
}
