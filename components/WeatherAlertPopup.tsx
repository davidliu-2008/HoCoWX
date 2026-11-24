"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function WeatherAlertPopup({ county, events }: { county: string; events: string[] }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !events.length) return null;

  return (
    <aside aria-label="Active weather alerts" className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 shadow-lg sm:left-auto">
      <AlertTriangle aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div role="status">
          <p className="text-sm font-semibold">{county} weather {events.length === 1 ? "alert" : "alerts"}</p>
          <p className="mt-1 break-words text-sm">{events.slice(0, 2).join(" · ")}{events.length > 2 ? ` (+${events.length - 2} more)` : ""}</p>
        </div>
        <a href="#weather-alerts" onClick={() => setDismissed(true)} className="mt-2 inline-block text-sm font-semibold underline underline-offset-4">View alerts</a>
      </div>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss weather alert pop-up" className="grid h-11 w-11 shrink-0 place-items-center rounded-md hover:bg-amber-100">
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </aside>
  );
}
