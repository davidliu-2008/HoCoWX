"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, CloudRain, ExternalLink, LoaderCircle, MapPin, School, Wind } from "lucide-react";

type DistrictOption = { slug: string; county: string };
type CommuteWindow = "morning" | "afternoon";
type CommuteData = {
  county: string;
  district: string;
  status: string;
  statusKind: string;
  statusUrl: string;
  window: CommuteWindow;
  forecastDate: string | null;
  temperatureLowF: number | null;
  temperatureHighF: number | null;
  precipitationChance: number;
  windSpeed: string;
  forecasts: string[];
  alerts: string[];
  riskLevel: "Low" | "Medium" | "High";
  explanation: string;
  checkedAt: string;
};

const STORAGE_KEY = "hocowx-commute-preferences";

function riskClass(level: CommuteData["riskLevel"]) {
  if (level === "High") return "bg-red-100 text-red-800";
  if (level === "Medium") return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-800";
}

export function CommutePlanner({ districts }: { districts: DistrictOption[] }) {
  const [county, setCounty] = useState("howard");
  const [window, setWindow] = useState<CommuteWindow>("morning");
  const [data, setData] = useState<CommuteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { county?: string; window?: CommuteWindow } | null;
      if (saved?.county && districts.some((district) => district.slug === saved.county)) setCounty(saved.county);
      if (saved?.window === "morning" || saved?.window === "afternoon") setWindow(saved.window);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, [districts]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ county, window }));
      const response = await fetch(`/api/county-commute?county=${encodeURIComponent(county)}&window=${window}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail ?? result.error ?? "Commute data could not be loaded.");
      setData(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Commute data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [county, window]);

  useEffect(() => {
    if (ready) void load();
  }, [load, ready]);

  return (
    <div className="space-y-5">
      <section className="grid gap-5 rounded-lg bg-white p-5 shadow-panel sm:p-7 lg:grid-cols-[1fr_0.72fr]">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Maryland county</span>
          <select value={county} onChange={(event) => setCounty(event.target.value)} className="min-h-12 w-full rounded-md border border-blue-200 bg-white px-4 text-base text-ink outline-none focus:border-bay focus:ring-2 focus:ring-blue-100">
            {districts.map((district) => <option key={district.slug} value={district.slug}>{district.county}</option>)}
          </select>
        </label>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink">Commute window</legend>
          <div className="grid grid-cols-2 rounded-md bg-blue-50 p-1">
            {(["morning", "afternoon"] as const).map((option) => (
              <button key={option} type="button" onClick={() => setWindow(option)} className={`min-h-11 rounded px-3 text-sm font-bold capitalize transition ${window === option ? "bg-white text-bay shadow-sm" : "text-slate-500 hover:text-bay"}`}>
                {option === "morning" ? "5–9 AM" : "2–5 PM"}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="flex items-center gap-2 text-xs leading-5 text-slate-500 lg:col-span-2"><Check className="h-4 w-4 text-emerald-600" />Your selection is saved only in this browser. No account or precise address is used.</p>
      </section>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-lg bg-white"><LoaderCircle className="h-7 w-7 animate-spin text-bay" /><span className="ml-3 font-semibold text-slate-600">Loading your commute outlook…</span></div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-5 text-red-800"><p className="font-bold">Commute outlook unavailable</p><p className="mt-2 text-sm">{error}</p><button type="button" onClick={() => void load()} className="mt-4 font-bold underline">Try again</button></div>
      ) : data ? (
        <section className="overflow-hidden rounded-lg bg-navy text-white shadow-panel" aria-live="polite">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-200">{data.county}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3"><h2 className="text-3xl font-black">{data.riskLevel} commute risk</h2><span className={`rounded-full px-3 py-1 text-xs font-black ${riskClass(data.riskLevel)}`}>{data.riskLevel}</span></div>
              <p className="mt-4 leading-7 text-blue-100">{data.explanation}</p>
              <p className="mt-5 text-sm font-semibold text-blue-200">{data.forecastDate ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "America/New_York" }).format(new Date(data.forecastDate)) : "Next available school commute"}</p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              <div className="bg-white/5 p-6"><p className="flex items-center gap-2 text-sm font-bold text-blue-200"><MapPin className="h-4 w-4" />Temperature</p><p className="mt-3 text-3xl font-black">{data.temperatureLowF === null ? "Unavailable" : `${data.temperatureLowF}°–${data.temperatureHighF}°`}</p></div>
              <div className="bg-white/5 p-6"><p className="flex items-center gap-2 text-sm font-bold text-blue-200"><CloudRain className="h-4 w-4" />Precipitation</p><p className="mt-3 text-3xl font-black">{data.precipitationChance}%</p></div>
              <div className="bg-white/5 p-6"><p className="flex items-center gap-2 text-sm font-bold text-blue-200"><Wind className="h-4 w-4" />Wind</p><p className="mt-3 text-2xl font-black">{data.windSpeed}</p></div>
              <div className="bg-white/5 p-6"><p className="flex items-center gap-2 text-sm font-bold text-blue-200"><School className="h-4 w-4" />District status</p><p className="mt-3 text-2xl font-black">{data.status}</p><a href={data.statusUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-blue-200 hover:text-white">Official source <ExternalLink className="h-3.5 w-3.5" /></a></div>
            </div>
          </div>
          <div className="grid gap-4 border-t border-white/10 p-6 sm:grid-cols-2 sm:p-8">
            <div><p className="text-xs font-bold uppercase tracking-wide text-blue-200">Forecast</p><p className="mt-2 leading-7">{data.forecasts.join(" changing to ") || "Forecast text unavailable."}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-wide text-blue-200">Active alerts</p>{data.alerts.length ? <ul className="mt-2 space-y-2">{data.alerts.map((alert) => <li key={alert} className="flex gap-2 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />{alert}</li>)}</ul> : <p className="mt-2 text-blue-100">No active NWS alerts for this county point.</p>}</div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
