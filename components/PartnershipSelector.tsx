"use client";

import { useState } from "react";
import { BellRing, CheckCircle2, CloudSun, School, Snowflake, Users } from "lucide-react";

type Partnership = "hcpss" | "capital-weather";

export function PartnershipSelector() {
  const [selected, setSelected] = useState<Partnership>("hcpss");

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
      <section className="flex flex-col gap-3 border border-blue-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Choose a partnership</p>
          <p className="mt-1 text-sm text-slate-600">Explore current collaborations and what each one is building.</p>
        </div>
        <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-ink sm:w-80">
          Partnership
          <select
            value={selected}
            onChange={(event) => setSelected(event.target.value as Partnership)}
            className="w-full border border-blue-200 bg-white px-3 py-3 text-base font-semibold text-ink outline-none focus:border-bay focus:ring-2 focus:ring-blue-100"
          >
            <option value="hcpss">Howard County Public Schools</option>
            <option value="capital-weather">Capital Weather Gang</option>
          </select>
        </label>
      </section>

      {selected === "hcpss" ? <HcpssPartnership /> : <CapitalWeatherPartnership />}
    </div>
  );
}

function HcpssPartnership() {
  return (
    <section className="overflow-hidden border border-blue-200 bg-blue-50/55">
      <div className="grid items-start gap-8 p-5 sm:p-7 xl:grid-cols-[0.82fr_1.18fr] xl:p-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><School className="h-4 w-4" /> Formal HCPSS Partnership</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Weather information inside the HCPSS experience</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">HoCo Weather Channel will be integrated into the official HCPSS structure, bringing timely environmental news and weather literacy resources to approximately 66,000 students and staff.</p>

          <div className="mt-6 divide-y divide-blue-100 border-y border-blue-100">
            <PartnershipPoint icon={<CheckCircle2 className="h-5 w-5" />} title="Working with the HCPSS weather team">Developing useful weather information and literacy resources for the school community.</PartnershipPoint>
            <PartnershipPoint icon={<CheckCircle2 className="h-5 w-5" />} title="Contributing to weather-related discussions">Sitting in on operational decision discussions and contributing weather analysis to help determine those decisions.</PartnershipPoint>
            <PartnershipPoint icon={<Users className="h-5 w-5" />} title="Reaching the full HCPSS community">Serving environmental news through familiar district platforms used by students and staff.</PartnershipPoint>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-bay">Proof of concept</p><h3 className="mt-1 font-bold text-ink">Sample Canvas homepage announcement</h3></div>
            <span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-bay">Concept preview</span>
          </div>
          <div className="overflow-hidden border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3"><div className="h-8 w-8 bg-red-700" aria-hidden="true" /><div><p className="text-xs text-slate-500">HCPSS Canvas</p><p className="text-sm font-bold text-slate-800">Student Homepage</p></div></div>
              <BellRing className="h-5 w-5 text-slate-500" />
            </div>
            <div className="grid md:grid-cols-[0.28fr_0.72fr]">
              <div className="hidden border-r border-slate-200 bg-slate-50/70 p-4 md:block"><div className="space-y-3 text-sm text-slate-500"><p className="font-semibold text-slate-800">Home</p><p>Courses</p><p>Calendar</p><p>Resources</p></div></div>
              <div className="p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Special Weather Announcement</p>
                <div className="mt-3 border-l-4 border-bay bg-blue-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row"><div className="flex h-12 w-12 shrink-0 items-center justify-center bg-bay text-white"><Snowflake className="h-7 w-7" /></div><div><div className="flex flex-wrap items-center gap-2"><h4 className="text-xl font-bold text-ink">Winter weather update</h4><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-bay">HoCoWX</span></div><p className="mt-2 text-sm leading-6 text-slate-700">A period of winter weather may affect Howard County. Review the latest timing, impacts, and safety information before travel.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"><span>Timing: Overnight into morning</span><span>Primary concern: Icy roads</span></div><span className="mt-4 inline-block bg-bay px-4 py-2 text-sm font-bold text-white">View weather update</span></div></div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Sample layout for discussion purposes. Final placement and language will be developed with HCPSS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapitalWeatherPartnership() {
  return (
    <section className="overflow-hidden border border-blue-200 bg-white">
      <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
        <div className="bg-navy p-6 text-white sm:p-8">
          <CloudSun className="h-8 w-8 text-blue-200" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-blue-200">Capital Weather Partnership</p>
          <h2 className="mt-2 text-3xl font-bold">Connecting students with regional weather expertise</h2>
        </div>
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Capital Weather Gang</p>
          <h3 className="mt-2 text-2xl font-bold text-ink">Weather communication beyond Howard County</h3>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">HoCo Weather Channel is developing a partnership with Jason Samenow and Capital Weather Gang to expand student weather literacy, strengthen regional weather communication, and explore opportunities for collaboration.</p>
          <div className="mt-6 border-l-4 border-bay bg-blue-50 px-5 py-4">
            <p className="font-bold text-ink">Collaboration in development</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">More information will be added as the partnership takes shape.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnershipPoint({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-4">
      <span className="mt-0.5 shrink-0 text-bay">{icon}</span>
      <div><h3 className="font-bold text-ink">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{children}</p></div>
    </div>
  );
}
