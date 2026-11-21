"use client";

import { ArrowUpRight, X } from "lucide-react";
import { useState } from "react";

export function DashboardAnnouncement() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <aside aria-label="Dashboard announcement" className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-blue-100 bg-ice px-4">
      <p className="py-2 text-center text-sm text-slate-700">
        HCPSS severe weather broadcasting and a planned NOAA discussion.{" "}
        <a href="/announcements" className="group inline-flex items-center gap-1 font-semibold text-bay underline underline-offset-4">
          Read the announcements
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5" />
        </a>
      </p>
      <button type="button" aria-label="Dismiss announcement" onClick={() => setVisible(false)} className="grid h-11 w-11 place-items-center text-slate-600 hover:text-ink">
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </aside>
  );
}
