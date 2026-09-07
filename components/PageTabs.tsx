import Link from "next/link";
import { CloudSun, MapPinned } from "lucide-react";

export function PageTabs({ active }: { active: "dashboard" | "maryland" }) {
  const linkClass = (tab: "dashboard" | "maryland") =>
    [
      "inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition",
      active === tab
        ? "border-bay bg-bay text-white shadow-sm"
        : "border-blue-100 bg-white text-bay hover:border-bay"
    ].join(" ");

  return (
    <nav className="mb-6 flex flex-col gap-2 sm:flex-row" aria-label="Main sections">
      <Link href="/" className={linkClass("dashboard")}>
        <CloudSun className="h-4 w-4" />
        Dashboard
      </Link>
      <Link href="/maryland-status" className={linkClass("maryland")}>
        <MapPinned className="h-4 w-4" />
        Maryland Status
      </Link>
    </nav>
  );
}
