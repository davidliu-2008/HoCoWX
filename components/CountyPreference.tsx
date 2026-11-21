"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "hocowx-county";

type CountyOption = {
  slug: string;
  county: string;
};

export function CountyPreference({ counties, selected }: { counties: CountyOption[]; selected: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const matches = counties.filter(({ county }) => county.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (selected === "howard" && saved && saved !== "howard" && counties.some((county) => county.slug === saved)) {
      router.replace(`/?county=${encodeURIComponent(saved)}`);
    }
  }, [counties, router, selected]);

  function updateCounty(slug: string) {
    setQuery("");
    localStorage.setItem(STORAGE_KEY, slug);
    router.push(slug === "howard" ? "/" : `/?county=${encodeURIComponent(slug)}`);
  }

  return (
    <section className="flex flex-col gap-3 bg-white py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-bay"><MapPin className="h-5 w-5" /></span>
        <div>
          <p className="text-sm font-bold text-ink">Your Maryland county</p>
        </div>
      </div>
      <div className="grid gap-2 sm:min-w-72">
      <label>
        <span className="sr-only">Search Maryland counties</span>
        <input type="search" placeholder="Search counties" value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-11 w-full rounded-md border border-blue-200 bg-white px-4 text-sm text-ink" />
      </label>
      <label>
        <span className="sr-only">Choose a Maryland county</span>
        <select value={selected} onChange={(event) => updateCounty(event.target.value)} className="min-h-12 w-full rounded-md border border-blue-200 bg-white px-4 text-sm font-bold text-ink outline-none focus:border-bay focus:ring-2 focus:ring-blue-100">
          {counties.filter((county) => county.slug === selected || matches.includes(county)).map((county) => <option key={county.slug} value={county.slug}>{county.county}</option>)}
        </select>
      </label>
      {matches.length === 0 && <p role="status" className="text-sm text-slate-600">No matching counties.</p>}
      </div>
    </section>
  );
}
