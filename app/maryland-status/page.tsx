import { Suspense } from "react";
import { MarylandComparisonSection } from "@/components/MarylandComparisonSection";
import { MarylandStatusMap } from "@/components/MarylandStatusMap";
import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";
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

      <PageHero title="Maryland School Status" description="Compare reported school operations across Maryland and find your district’s official source." />

      <Suspense fallback={<p role="status" className="mx-auto max-w-[1440px] px-5 py-8 text-slate-600 sm:px-8 lg:px-12">Loading district status reports…</p>}>
        <DistrictReports />
      </Suspense>
    </main>
  );
}
