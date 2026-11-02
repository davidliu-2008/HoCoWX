import Link from "next/link";
import { BarChart3, BookOpen, ChevronDown, CloudSun, GraduationCap, Handshake, Instagram, Mail, MapPinned, Mic2, Podcast, School } from "lucide-react";

type Tab = "dashboard" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships";

export function PageTabs({ active }: { active: Tab }) {
  const itemClass = (isActive: boolean) =>
    [
      "inline-flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition sm:px-4",
      isActive
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");
  const menuLinkClass = "flex min-h-12 items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";
  const operationsActive = active === "maryland" || active === "interview";
  const learningActive = active === "instagram" || active === "student-polls" || active === "literacy";

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap gap-1 overflow-visible border-y border-blue-100 bg-white/95 px-2 shadow-sm backdrop-blur" aria-label="Main sections">
      <Link href="/" className={itemClass(active === "dashboard")}>
        <CloudSun className="h-4 w-4" />
        Dashboard
      </Link>

      <div className="group relative">
        <span className={`${itemClass(operationsActive)} cursor-default`}>
          <School className="h-4 w-4" />
          School Operations
          <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
        </span>
        <div role="menu" className="pointer-events-none invisible absolute left-0 top-full z-50 w-64 translate-y-1 border border-blue-100 bg-white p-1 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
          <GraduationCap className="h-4 w-4" />
          Learn
          <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
        </span>
        <div role="menu" className="pointer-events-none invisible absolute left-0 top-full z-50 w-64 translate-y-1 border border-blue-100 bg-white p-1 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
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
        <Handshake className="h-4 w-4" />
        Partnerships
      </Link>

      <div className="ml-auto flex shrink-0 items-stretch">
        <a
          href="mailto:howardcountyweather@gmail.com"
          className={itemClass(false)}
          aria-label="Email HoCo Weather Channel"
          title="Email"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden xl:inline">Email</span>
        </a>
        <a
          href="https://www.instagram.com/hocoweatherchannel/?hl=en"
          target="_blank"
          rel="noreferrer"
          className={itemClass(false)}
          aria-label="HoCo Weather Channel on Instagram"
          title="Instagram"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden xl:inline">Instagram</span>
        </a>
        <a
          href="https://open.spotify.com/show/1lq3ulTfGtY46EsGSm6VXl?si=fbfb99f380c848d5"
          target="_blank"
          rel="noreferrer"
          className={itemClass(false)}
          aria-label="HoCo Weather Channel podcast"
          title="Podcast"
        >
          <Podcast className="h-4 w-4" />
          <span className="hidden xl:inline">Podcast</span>
        </a>
      </div>
    </nav>
  );
}
