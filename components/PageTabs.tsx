import Link from "next/link";
import { BarChart3, BookOpen, ChevronDown, Instagram, Mail, MapPinned, Mic2, Podcast, UsersRound } from "lucide-react";

type Tab = "dashboard" | "predictions" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships" | "about";

export function PageTabs({ active }: { active: Tab }) {
  const itemClass = (isActive: boolean) =>
    [
      "inline-flex min-h-20 shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition sm:px-4",
      isActive
        ? "border-bay text-bay"
        : "border-transparent text-slate-500 hover:border-blue-200 hover:text-bay"
    ].join(" ");
  const menuLinkClass = "flex min-h-12 items-center gap-2.5 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";
  const operationsActive = active === "maryland" || active === "interview";
  const learningActive = active === "instagram" || active === "student-polls" || active === "literacy" || active === "about";

  return (
    <nav className="sticky top-0 z-50 flex flex-wrap items-stretch overflow-visible border-b border-blue-100 bg-white/95 px-4 shadow-sm backdrop-blur sm:px-6" aria-label="Main sections">
      <Link href="/" className="mr-auto flex min-h-20 shrink-0 items-center gap-3 pr-5" aria-label="HoCo Weather Channel home">
        <img src="/hoco-weather-channel-icon.png" alt="" className="h-14 w-14 shrink-0 object-contain" />
        <span className="hidden text-base font-bold leading-tight text-ink sm:block">
          HoCo Weather<br />Channel
        </span>
      </Link>

      <div className="flex flex-wrap items-stretch justify-end">
        <Link href="/" className={itemClass(active === "dashboard")}>
          Dashboard
        </Link>

        <Link href="/predictions" className={itemClass(active === "predictions")}>
          Predictions
        </Link>

        <div className="group relative">
          <span className={`${itemClass(operationsActive)} cursor-default`}>
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
            Learn
            <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" />
          </span>
          <div role="menu" className="pointer-events-none invisible absolute left-0 top-full z-50 w-64 translate-y-1 border border-blue-100 bg-white p-1 opacity-0 shadow-lg transition duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <Link href="/about" className={menuLinkClass}>
              <UsersRound className="h-4 w-4 text-bay" /> About
            </Link>
            <Link href="/instagram" className={`${menuLinkClass} border-t border-blue-50`}>
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
          Partnerships
        </Link>

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
