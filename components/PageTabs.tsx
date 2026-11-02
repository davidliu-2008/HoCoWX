import Link from "next/link";
import { BarChart3, BookOpen, ChevronDown, CloudSun, GraduationCap, Handshake, Instagram, MapPinned, Mic2, School } from "lucide-react";

type Tab = "dashboard" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships";

export function PageTabs({ active }: { active: Tab }) {
  const itemClass = (isActive: boolean) =>
    [
      "inline-flex shrink-0 items-center justify-center gap-2.5 border-b-2 px-4 py-4 text-base font-bold transition sm:px-5",
      isActive
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");
  const menuLinkClass = "flex items-center gap-3 px-5 py-4 text-base font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";
  const operationsActive = active === "maryland" || active === "interview";
  const learningActive = active === "instagram" || active === "student-polls" || active === "literacy";

  return (
    <nav className="relative z-40 flex flex-wrap gap-1 overflow-visible border-y border-blue-100 bg-white/90 px-2" aria-label="Main sections">
      <Link href="/" className={itemClass(active === "dashboard")}>
        <CloudSun className="h-5 w-5" />
        Dashboard
      </Link>

      <div className="group relative">
        <span className={`${itemClass(operationsActive)} cursor-default`}>
          <School className="h-5 w-5" />
          School Operations
          <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
        </span>
        <div role="menu" className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-64 translate-y-1 border border-blue-100 bg-white p-1 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <Link href="/maryland-status" className={menuLinkClass}>
            <MapPinned className="h-4 w-4 text-bay" /> Maryland Status
          </Link>
          <Link href="/interview" className={`${menuLinkClass} border-t border-blue-50`}>
            <Mic2 className="h-4 w-4 text-bay" /> Superintendent Interview
          </Link>
        </div>
      </div>

      <div className="group relative">
        <span className={`${itemClass(learningActive)} cursor-default`}>
          <GraduationCap className="h-5 w-5" />
          Learn
          <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" />
        </span>
        <div role="menu" className="pointer-events-none invisible absolute left-0 top-full z-50 min-w-64 translate-y-1 border border-blue-100 bg-white p-1 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
      </div>

      <Link href="/partnerships" className={itemClass(active === "partnerships")}>
        <Handshake className="h-5 w-5" />
        Partnerships
      </Link>
    </nav>
  );
}
