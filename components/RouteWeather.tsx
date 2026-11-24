"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map } from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = [number, number];
type Segment = { path: Point[]; time: string; forecast: string | null; message: string; level: "normal" | "wet" | "caution" | "unknown" };
type Result = { minutes: number; segments: Segment[] };
const colors = { normal: "#176946", wet: "#2159ba", caution: "#a74b05", unknown: "#626c79" };
const mapPoint = ([lon, lat]: Point): Point => [lat, lon];
const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" });
const schoolLayer = "https://mdgeodata.md.gov/imap/rest/services/Education/MD_EducationFacilities/FeatureServer/5/query";
const schoolQuery = new URLSearchParams({
  where: "School_Type IN ('High', 'Middle/High', 'Elementary/Middle/High')",
  outFields: "SCHOOL_NAME",
  outSR: "4326",
  f: "geojson"
});
type School = { properties: { SCHOOL_NAME: string }; geometry: { coordinates: Point } | null };

export function RouteWeather() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [pins, setPins] = useState<Point[]>([]);
  const [departure, setDeparture] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [schoolError, setSchoolError] = useState(false);

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
      instance.on("click", ({ latlng }) => setPins((points) => points.length < 2 ? [...points, [latlng.lng, latlng.lat]] : points));
      setReady(true);
      const schools = L.layerGroup().addTo(instance);
      instance.attributionControl.addAttribution('<a href="https://mdgeodata.md.gov/imap/rest/services/Education/MD_EducationFacilities/FeatureServer/5">Maryland iMAP schools</a>');
      void fetch(`${schoolLayer}?${schoolQuery}`).then(async (response) => {
        if (!response.ok) throw new Error("Schools unavailable");
        const { features } = await response.json() as { features?: School[] };
        if (!features?.length) throw new Error("Schools unavailable");
        if (!active) return;
        function drawSchools() {
          schools.clearLayers();
          if (instance.getZoom() < 10) return;
          const bounds = instance.getBounds().pad(0.15);
          for (const { properties, geometry } of features ?? []) {
            if (!geometry || !properties.SCHOOL_NAME || !bounds.contains(mapPoint(geometry.coordinates))) continue;
            const name = properties.SCHOOL_NAME;
            const label = document.createElement("span");
            label.textContent = name;
            L.marker(mapPoint(geometry.coordinates), {
              title: name, alt: name, icon: L.divIcon({
                className: "rounded-full border-2 border-white bg-indigo-700 shadow",
                iconSize: [14, 14]
              })
            }).bindTooltip(label, { permanent: instance.getZoom() >= 11, direction: "right", offset: [7, 0] })
              .on("click", () => setPins((points) => points.length < 2 ? [...points, geometry.coordinates] : points))
              .addTo(schools);
          }
        }
        instance.on("moveend", drawSchools);
        drawSchools();
      }).catch(() => { if (active) setSchoolError(true); });
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
      pins.forEach((pin, i) => L.circleMarker(mapPoint(pin), {
        radius: 8, color: "#fff", weight: 2, fillColor: i ? "#126841" : "#194ca6", fillOpacity: 1
      }).bindTooltip(i ? "Destination" : "Start").addTo(group));
      if (result) map.current?.fitBounds(L.latLngBounds(result.segments.flatMap((segment) => segment.path.map(mapPoint))), { padding: [28, 28], maxZoom: 16, animate: false });
    });
    return () => { active = false; };
  }, [pins, ready, result]);

  async function plan() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/route-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: pins[0], end: pins[1], departure: departure ? new Date(departure).toISOString() : new Date().toISOString() })
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

  const directions = pins.length === 2 ? `https://www.google.com/maps/dir/?api=1&origin=${mapPoint(pins[0]).join(",")}&destination=${mapPoint(pins[1]).join(",")}&travelmode=driving` : "";

  return (
    <section aria-labelledby="route-weather-heading" className="mb-8">
      <h2 id="route-weather-heading" className="text-2xl font-bold text-ink">Route Weather</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-wrap items-end gap-3">
          <button type="button" disabled={!ready || busy || pins.length === 2} onClick={() => {
            const center = map.current?.getCenter();
            if (center) setPins([...pins, [center.lng, center.lat]]);
          }} className="min-h-11 rounded-md border border-slate-300 px-3 text-sm font-semibold disabled:opacity-50">
            {pins.length === 2 ? "Both pins set" : pins.length ? "Set destination at map center" : "Set start at map center"}
          </button>
          <button type="button" disabled={!pins.length || busy} onClick={() => { setPins([]); setResult(null); setError(""); }} className="min-h-11 px-2 text-sm font-semibold underline disabled:opacity-50">Clear pins</button>
        </div>
        <div className="flex flex-wrap items-end gap-3 sm:justify-end">
          <label className="text-sm font-semibold">Departure (device time)
            <input type="datetime-local" value={departure} onChange={(event) => { setDeparture(event.target.value); setResult(null); }} disabled={busy} className="mt-1 block min-h-11 max-w-full rounded-md border border-slate-300 bg-white px-2" />
          </label>
          <button type="button" disabled={pins.length !== 2 || busy} onClick={() => void plan()} className="min-h-11 rounded-md bg-navy px-4 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Checking route..." : "Check route weather"}</button>
        </div>
      </div>
      <div ref={container} aria-label="Map of the Maryland area" className="isolate mt-4 h-80 w-full rounded-lg bg-slate-100 sm:h-96" />
      <p className="mt-2 text-sm text-slate-600" role="status">
        {pins.length === 2 ? "Start and destination set." : pins.length === 1 ? "Choose a high school or drop a destination pin." : "Drop a starting pin or select a high school."}
      </p>
      {schoolError && <p className="mt-2 text-sm text-slate-600">School labels are unavailable. You can still drop pins on the map.</p>}
      <p className="mt-2 text-sm text-slate-600">{pins.length === 2 ? "Start and destination set." : pins.length === 1 ? "Select your destination on the map." : "Select your starting point on the map."}</p>
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
