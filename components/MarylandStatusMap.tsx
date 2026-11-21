"use client";

import { useState } from "react";
import boundaries from "@/lib/maryland-county-paths.json";
import type { MarylandOperationStatus, OperationStatusKind } from "@/lib/maryland-operations";

const legend: Record<OperationStatusKind, { label: string; fill: string }> = {
  normal: { label: "Normal operations", fill: "#22c55e" },
  delay: { label: "Delay", fill: "#facc15" },
  closed: { label: "Closed", fill: "#f43f5e" },
  virtual: { label: "Virtual / modified", fill: "#3b82f6" },
  unknown: { label: "Status unavailable", fill: "#94a3b8" }
};

const checkedTime = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York"
});

export function MarylandStatusMap({ reports }: { reports: MarylandOperationStatus[] }) {
  const [selected, setSelected] = useState("Howard County");
  const byCounty = new Map(reports.map((report) => [report.county, report]));
  const report = byCounty.get(selected);
  const status = report?.statusKind ?? "unknown";
  const selectedPath = boundaries.counties.find(({ name }) => name === selected)?.path;

  return (
    <section aria-labelledby="maryland-map-heading" className="bg-white px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <h2 id="maryland-map-heading" className="text-2xl font-bold text-ink">Maryland district status map</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.36fr)] lg:items-start">
          <div className="min-w-0">
            <svg aria-hidden="true" viewBox={boundaries.viewBox} className="block h-auto w-full rounded-lg bg-ice">
              {boundaries.counties.map(({ name, path }) => {
                const item = byCounty.get(name);
                return (
                  <path key={name} d={path} fill={legend[item?.statusKind ?? "unknown"].fill} fillRule="evenodd" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" onClick={() => setSelected(name)} className="cursor-pointer hover:brightness-110 motion-safe:transition-[filter]">
                    <title>{name}: {item?.statusKind === "unknown" ? legend.unknown.label : item?.status ?? legend.unknown.label}</title>
                  </path>
                );
              })}
              <path key={selected} d={selectedPath} fill="none" stroke="#10213f" strokeWidth={3} strokeLinejoin="round" className="maryland-map-selection pointer-events-none" />
            </svg>
            <ul aria-label="Map legend" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-700">
              {Object.values(legend).map(({ label, fill }) => <li key={label} className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ backgroundColor: fill }} />{label}</li>)}
            </ul>
            <a href="https://github.com/topojson/us-atlas#file-reference" className="mt-3 inline-block text-xs text-slate-600 underline underline-offset-2">Map boundaries: U.S. Census Bureau via U.S. Atlas</a>
          </div>
          <div className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <label className="block text-sm font-semibold text-ink">
              Select a county or city
              <select value={selected} onChange={(event) => setSelected(event.target.value)} className="mt-2 min-h-11 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-ink">
                {boundaries.counties.map(({ name }) => <option key={name} value={name}>{name}</option>)}
              </select>
            </label>
            <div role="status" className="mt-4">
              <div key={selected} className="county-data-in">
                <h3 className="text-lg font-bold text-ink">{selected}</h3>
                <p className="mt-1 text-sm font-semibold text-slate-700">{status === "unknown" ? legend.unknown.label : report?.status}</p>
                {report?.checkedAt && <p className="mt-2 text-xs text-slate-600">Checked {checkedTime.format(new Date(report.checkedAt))} ET</p>}
              </div>
            </div>
            {report && <a href={report.statusUrl} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-bay underline underline-offset-4">View official district source</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
