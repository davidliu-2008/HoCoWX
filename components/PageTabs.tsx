import Link from "next/link";
import { BarChart3, BookOpen, ChevronDown, CloudSun, GraduationCap, Handshake, Instagram, MapPinned, Mic2, School } from "lucide-react";

type Tab = "dashboard" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships";

export function PageTabs({ active }: { active: Tab }) {
  const itemClass = (isActive: boolean) =>
    [
      "inline-flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition",
      isActive
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");
  const menuLinkClass = "flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";
  const operationsActive = active === "maryland" || active === "interview";
  const learningActive = active === "instagram" || active === "student-polls" || active === "literacy";

  return (
    <nav className="relative z-40 flex flex-wrap gap-1 overflow-visible border-y border-blue-100 bg-white/90 px-1" aria-label="Main sections">
      <Link href="/" className={itemClass(active === "dashboard")}>
        <CloudSun className="h-4 w-4" />
        Dashboard
      </Link>

      <details className="group relative">
        <summary className={`${itemClass(operationsActive)} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <School className="h-4 w-4" />
          School Operations
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute left-0 top-full z-50 mt-1 min-w-64 border border-blue-100 bg-white p-1 shadow-lg">
          <Link href="/maryland-status" className={menuLinkClass}>
            <MapPinned className="h-4 w-4 text-bay" /> Maryland Status
          </Link>
          <Link href="/interview" className={`${menuLinkClass} border-t border-blue-50`}>
            <Mic2 className="h-4 w-4 text-bay" /> Superintendent Interview
          </Link>
        </div>
      </details>

      <details className="group relative">
        <summary className={`${itemClass(learningActive)} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <GraduationCap className="h-4 w-4" />
          Learn
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute left-0 top-full z-50 mt-1 min-w-64 border border-blue-100 bg-white p-1 shadow-lg">
          <Link href="/instagram" className={menuLinkClass}>
            <Instagram className="h-4 w-4 text-bay" /> Weather Insights
          </Link>
          <Link href="/weather-literacy" className={`${menuLinkClass} border-t border-blue-50`}>
            <BookOpen className="h-4 w-4 text-bay" /> Weather Literacy
          </Link>
          <Link href="/student-polls" className={`${menuLinkClass} border-t border-blue-50`}>
            <BarChart3 className="h-4 w-4 text-bay" /> Student Prediction Lab
          </Link>
        </div>
      </details>

      <details className="group relative">
        <summary className={`${itemClass(active === "partnerships")} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
          <Handshake className="h-4 w-4" />
          Partnerships
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="absolute right-0 top-full z-50 mt-1 min-w-64 border border-blue-100 bg-white p-1 shadow-lg">
          <Link href="/partnerships?partner=hcpss" className={menuLinkClass}>
            <School className="h-4 w-4 text-bay" /> Howard County Public Schools
          </Link>
          <Link href="/partnerships?partner=capital-weather" className={`${menuLinkClass} border-t border-blue-50`}>
            <CloudSun className="h-4 w-4 text-bay" /> Capital Weather Gang
          </Link>
        </div>
      </details>
    </nav>
  );
}
