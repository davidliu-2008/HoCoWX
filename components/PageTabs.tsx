"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Instagram,
  Mail,
  Podcast
} from "lucide-react";

type Tab = "dashboard" | "predictions" | "maryland" | "interview" | "student-polls" | "literacy" | "partnerships" | "about" | "commute" | "accessibility";

const groups = [
  {
    label: "Weather",
    tabs: ["predictions", "commute"],
    links: [
      { href: "/predictions", label: "Predictions" },
      { href: "/commute", label: "Commute Planner" }
    ]
  },
  {
    label: "Schools",
    tabs: ["maryland", "interview"],
    links: [
      { href: "/maryland-status", label: "Maryland Status" },
      { href: "/interview", label: "Superintendent Interview" }
    ]
  },
  {
    label: "Learn",
    tabs: ["literacy", "student-polls"],
    links: [
      { href: "/weather-literacy", label: "Weather Literacy" },
      { href: "/student-polls", label: "Student Prediction Lab" }
    ]
  },
  {
    label: "About",
    tabs: ["about", "partnerships", "accessibility"],
    links: [
      { href: "/about", label: "Mission and Team" },
      { href: "/partnerships", label: "Partnerships" },
      { href: "/accessibility", label: "Accessibility" }
    ]
  }
] as const;

const mobileLinks = [
  { href: "/", label: "Home", tab: "dashboard" },
  { href: "/predictions", label: "Predictions", tab: "predictions" },
  { href: "/maryland-status", label: "School Status", tab: "maryland" },
  { href: "/commute", label: "Commute", tab: "commute" },
  { href: "/weather-literacy", label: "Learn", tab: "literacy" },
  { href: "/about", label: "About", tab: "about" },
  { href: "/partnerships", label: "Partners", tab: "partnerships" },
  { href: "/accessibility", label: "Accessibility", tab: "accessibility" }
] as const;

export function PageTabs({ active }: { active: Tab }) {
  const activeMobileLink = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [county, setCounty] = useState("howard");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const countyHref = (href: string) => county === "howard" ? href : `${href}?county=${encodeURIComponent(county)}`;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    activeMobileLink.current?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [active]);

  useEffect(() => {
    const queryCounty = new URLSearchParams(window.location.search).get("county");
    if (queryCounty) {
      setCounty(queryCounty);
      localStorage.setItem("hocowx-county", queryCounty);
      return;
    }
    const saved = localStorage.getItem("hocowx-county");
    if (saved && saved !== "howard") {
      setCounty(saved);
      router.replace(`${pathname}?county=${encodeURIComponent(saved)}`);
    }
  }, [pathname, router]);

  const desktopItem = (isActive: boolean) =>
    `inline-flex min-h-20 items-center gap-2 border-b-2 px-3 text-sm font-bold transition ${
      isActive ? "border-bay text-bay" : "border-transparent text-slate-600 hover:border-blue-200 hover:text-bay"
    }`;
  const menuLink = "flex min-h-12 items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur" aria-label="Main sections">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:min-h-20">
        <Link href={countyHref("/")} className="flex shrink-0 items-center" aria-label="HoCo Weather Channel home">
          <img src="/hoco-weather-channel-icon.png" alt="" className="h-14 w-14 shrink-0 object-contain lg:h-16 lg:w-16" />
        </Link>

        <div className="hidden items-stretch lg:flex">
          <Link href={countyHref("/")} className={desktopItem(active === "dashboard")} aria-current={active === "dashboard" ? "page" : undefined}>Dashboard</Link>
          {groups.map((group) => {
            const isActive = group.tabs.some((tab) => tab === active);
            const isOpen = openMenu === group.label;
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(group.label)}
                onMouseLeave={() => setOpenMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  className={desktopItem(isActive)}
                  aria-expanded={isOpen}
                  aria-controls={`nav-menu-${group.label.toLowerCase()}`}
                  onClick={(event) => {
                    if (event.detail === 0) {
                      setOpenMenu(isOpen ? null : group.label);
                    } else {
                      setOpenMenu(group.label);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setOpenMenu(null);
                      event.currentTarget.focus();
                    }
                  }}
                >
                  {group.label}
                  <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id={`nav-menu-${group.label.toLowerCase()}`}
                  className={`absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 rounded-lg border border-blue-100 bg-white p-2 shadow-xl transition-opacity duration-150 ${isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
                >
                  {group.links.map((item) => {
                    const itemActive = pathname === item.href;
                    return <Link key={item.href} href={countyHref(item.href)} className={menuLink} aria-current={itemActive ? "page" : undefined} onClick={() => setOpenMenu(null)}>{item.label}</Link>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <a href="mailto:howardcountyweather@gmail.com" className="social-nav-button" aria-label="Email HoCo Weather Channel" title="Email"><Mail aria-hidden="true" className="h-4 w-4" /></a>
          <a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="social-nav-button" aria-label="HoCo Weather Channel on Instagram (opens in a new tab)" title="Instagram"><Instagram aria-hidden="true" className="h-4 w-4" /></a>
          <a href="https://open.spotify.com/show/1lq3ulTfGtY46EsGSm6VXl?si=fbfb99f380c848d5" target="_blank" rel="noreferrer" className="social-nav-button" aria-label="HoCo Weather Channel podcast (opens in a new tab)" title="Podcast"><Podcast aria-hidden="true" className="h-4 w-4" /></a>
        </div>
      </div>

      <div className="no-scrollbar flex w-full gap-1 overflow-x-auto border-t border-blue-50 px-4 lg:hidden">
          {mobileLinks.map((item) => (
            <Link ref={active === item.tab ? activeMobileLink : undefined} key={item.href} href={countyHref(item.href)} aria-current={active === item.tab ? "page" : undefined} className={`min-h-11 shrink-0 border-b-2 px-3 py-3 text-xs font-bold ${active === item.tab ? "border-bay text-bay" : "border-transparent text-slate-600"}`}>
              {item.label}
            </Link>
          ))}
      </div>
    </nav>
  );
}
