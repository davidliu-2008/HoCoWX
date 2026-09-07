import { ExternalLink, MapPinned } from "lucide-react";
import type { MarylandOperationStatus } from "@/lib/maryland-operations";

type LoadState<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function statusBadgeClass(statusKind: MarylandOperationStatus["statusKind"]) {
  switch (statusKind) {
    case "normal":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
    case "delay":
      return "bg-yellow-100 text-yellow-900 ring-yellow-200";
    case "closed":
      return "bg-red-100 text-red-800 ring-red-200";
    case "virtual":
      return "bg-blue-100 text-blue-800 ring-blue-200";
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200";
  }
}

function compactTime(value: string | null | undefined) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York"
  }).format(new Date(value));
}

export function MarylandComparisonSection({
  comparison
}: {
  comparison: LoadState<MarylandOperationStatus[]>;
}) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-panel md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
            <MapPinned className="h-5 w-5 text-bay" />
            Maryland School Operations Comparison
          </h2>
        </div>
        <div className="rounded-lg bg-ice px-3 py-2 text-sm font-medium text-bay">
          Cached for 30 minutes
        </div>
      </div>

      {comparison.ok ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">County</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">School District</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Status</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Last Updated</th>
                <th className="border-b border-blue-100 px-3 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {comparison.data.map((item) => (
                <tr key={item.county} className="align-top odd:bg-ice/60">
                  <td className="border-b border-blue-50 px-3 py-3 font-semibold text-ink">
                    {item.county}
                    {item.county === "Howard County" ? (
                      <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-bay">
                        HCPSS
                      </span>
                    ) : null}
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3 text-slate-700">
                    {item.district}
                    <span className="mt-1 block text-xs text-slate-500">
                      {item.parserType === "authoritative"
                        ? "Authoritative status page"
                        : item.parserType === "county-specific"
                          ? "County-specific parser"
                          : "Experimental parser"}
                    </span>
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusBadgeClass(item.statusKind)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3 text-slate-600">
                    {compactTime(item.lastUpdated ?? item.checkedAt)}
                  </td>
                  <td className="border-b border-blue-50 px-3 py-3">
                    <a
                      href={item.statusUrl}
                      className="inline-flex items-center gap-1 font-semibold text-bay hover:underline"
                    >
                      Source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Maryland comparison data could not be loaded. {comparison.error}
        </p>
      )}
    </section>
  );
}
