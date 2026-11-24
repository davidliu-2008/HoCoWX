"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map } from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = [number, number];
type Segment = { path: Point[]; time: string; forecast: string | null; message: string; level: "normal" | "wet" | "caution" | "unknown" };
type Result = { start: Point; end: Point; minutes: number; segments: Segment[] };
const colors = { normal: "#176946", wet: "#2159ba", caution: "#a74b05", unknown: "#626c79" };
const mapPoint = ([lon, lat]: Point): Point => [lat, lon];
const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });

export function RouteWeather() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [departure, setDeparture] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    void import("leaflet").then((L) => {
      if (!active || !container.current) return;
      const instance = L.map(container.current, { scrollWheelZoom: false }).setView([39.19, -76.86], 11);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(instance);
      map.current = instance;
      layer.current = L.layerGroup().addTo(instance);
      setReady(true);
    }).catch(() => { if (active) setError("The map could not be loaded."); });
    return () => { active = false; map.current?.remove(); map.current = null; layer.current = null; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    void import("leaflet").then((L) => {
      const group = layer.current;
      if (!active || !group) return;
      group.clearLayers();
      result?.segments.forEach((segment, i) => {
        const detail = document.createElement("div");
        detail.textContent = `Stretch ${i + 1} · Around ${time.format(new Date(segment.time))} ET. ${segment.forecast ? segment.forecast + ". " : ""}${segment.message}`;
        L.polyline(segment.path.map(mapPoint), { color: colors[segment.level], weight: 7, dashArray: segment.level === "unknown" ? "7 7" : undefined }).bindPopup(detail).addTo(group);
      });
      (result ? [result.start, result.end] : []).forEach((pin, i) => L.circleMarker(mapPoint(pin), {
        radius: 8, color: "#fff", weight: 2, fillColor: i ? "#126841" : "#194ca6", fillOpacity: 1
      }).bindTooltip(i ? "Destination" : "Start").addTo(group));
      if (result) map.current?.fitBounds(L.latLngBounds(result.segments.flatMap((segment) => segment.path.map(mapPoint))), { padding: [28, 28], maxZoom: 16, animate: false });
    });
    return () => { active = false; };
  }, [ready, result]);

  async function plan() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/route-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end, departure: departure ? new Date(departure).toISOString() : new Date().toISOString() })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error);
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Route weather could not be loaded.");
    } finally {
      setBusy(false);
    }
  }

  const directions = result ? `https://www.google.com/maps/dir/?api=1&origin=${mapPoint(result.start).join(",")}&destination=${mapPoint(result.end).join(",")}&travelmode=driving` : "";

  return (
    <section aria-labelledby="route-weather-heading" className="mb-8">
      <h2 id="route-weather-heading" className="text-2xl font-bold text-ink">Route Weather</h2>
      <form className="mt-4 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]" onSubmit={(event) => { event.preventDefault(); if (!busy) void plan(); }}>
          <label className="min-w-0 text-sm font-semibold">Starting point
            <input required maxLength={200} disabled={busy} autoComplete="off" placeholder="Columbia" value={start} onChange={(event) => { setStart(event.target.value); setResult(null); setError(""); }} className="mt-1 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base" />
          </label>
          <label className="min-w-0 text-sm font-semibold">Destination
            <input required maxLength={200} disabled={busy} autoComplete="off" placeholder="Howard High School" value={end} onChange={(event) => { setEnd(event.target.value); setResult(null); setError(""); }} className="mt-1 block min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base" />
          </label>
          <label className="text-sm font-semibold">Departure (device time)
            <input type="datetime-local" value={departure} onChange={(event) => { setDeparture(event.target.value); setResult(null); }} disabled={busy} className="mt-1 block min-h-11 max-w-full rounded-md border border-slate-300 bg-white px-2" />
          </label>
          <button type="submit" disabled={!start.trim() || !end.trim() || busy} className="min-h-11 rounded-md bg-navy px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Checking route..." : "Check route weather"}</button>
      </form>
      <p className="mt-2 text-xs text-slate-600">Route search shares submitted locations with the map providers. A nearby landmark works instead of a home address.</p>
      <div ref={container} aria-label="Map of the Maryland area" className="isolate mt-4 h-80 w-full rounded-lg bg-slate-100 sm:h-96" />
      {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
      {result && (
        <div className="mt-4">
          <p className="font-semibold text-ink">About {result.minutes} min driving</p>
          <p className="mt-1 text-sm text-slate-600">Forecasts sampled along the route, not live road conditions or confirmed closures.</p>
          <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.segments.map((segment, i) => <li key={i} className="rounded-md border border-slate-200 p-3 text-sm">
              <p className="font-bold" style={{ color: colors[segment.level] }}>Stretch {i + 1} · Around {time.format(new Date(segment.time))} ET</p>
              {segment.forecast && <p className="mt-1 font-semibold">{segment.forecast}</p>}
              <p className="mt-1 text-slate-700">{segment.message}</p>
            </li>)}
          </ol>
        </div>
      )}
      {directions && <a href={directions} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-bay underline">Open in Google Maps</a>}
    </section>
  );
}
