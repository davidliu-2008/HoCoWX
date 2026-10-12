import Link from "next/link";
import { BarChart3, BookOpen, CloudSun, FileText, Instagram, MapPinned, Mic2 } from "lucide-react";

type Tab = "dashboard" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "briefings";

export function PageTabs({ active }: { active: Tab }) {
  const linkClass = (tab: Tab) =>
    [
      "inline-flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition",
      active === tab
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");

  return (
    <nav className="mb-3 flex gap-1 overflow-x-auto border-y border-blue-100 bg-white/60 px-1" aria-label="Main sections">
      <Link href="/" className={linkClass("dashboard")}>
        <CloudSun className="h-4 w-4" />
        Dashboard
      </Link>
      <Link href="/maryland-status" className={linkClass("maryland")}>
        <MapPinned className="h-4 w-4" />
        Maryland Status
      </Link>
      <Link href="/interview" className={linkClass("interview")}>
        <Mic2 className="h-4 w-4" />
        Interview
      </Link>
      <Link href="/instagram" className={linkClass("instagram")}>
        <Instagram className="h-4 w-4" />
        Weather Insights
      </Link>
      <Link href="/student-polls" className={linkClass("student-polls")}>
        <BarChart3 className="h-4 w-4" />
        Student Prediction Lab
      </Link>
      <Link href="/weather-literacy" className={linkClass("literacy")}>
        <BookOpen className="h-4 w-4" />
        Weather Literacy
      </Link>
      <Link href="/briefings" className={linkClass("briefings")}>
        <FileText className="h-4 w-4" />
        Briefings
      </Link>
    </nav>
  );
}
