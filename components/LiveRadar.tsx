"use client";

import { ExternalLink, Radar } from "lucide-react";
import { useEffect, useState } from "react";

const radarPage = "https://radar.weather.gov/station/KLWX/standard";

export function LiveRadar() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  return (
    <section className="overflow-hidden bg-navy text-white">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Updated by the National Weather Service</p>
          <h2 className="mt-2 flex items-center gap-2 text-3xl font-black">
            <Radar aria-hidden="true" className="h-7 w-7" /> Live Regional Radar
          </h2>
          <p className="mt-4 leading-7 text-blue-100">
            Animated KLWX radar covers Howard County and the Baltimore-Washington region. The loop updates approximately every five minutes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setPlaying((current) => !current)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-3 font-bold text-navy transition hover:bg-blue-50"
            >
              {playing ? "Pause radar" : "Play radar"}
            </button>
            <a
              href={radarPage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-blue-200 px-4 py-3 font-bold text-white transition hover:bg-white/10"
            >
              Open interactive radar
              <span className="sr-only"> (opens in a new tab)</span>
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative flex min-h-80 items-center justify-center bg-black lg:min-h-[520px]">
          {playing ? (
            <img
              src="https://radar.weather.gov/ridge/standard/KLWX_loop.gif"
              alt="Animated National Weather Service KLWX regional radar loop"
              className="absolute inset-0 h-full w-full object-contain"
            />
          ) : (
            <div className="px-6 text-center text-blue-100">
              <Radar aria-hidden="true" className="mx-auto h-12 w-12" />
              <p className="mt-4 max-w-md font-semibold">Radar animation is paused. Use Play radar to begin the loop.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
