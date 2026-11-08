"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  BarChart3,
  BookOpen,
  BusFront,
  ChevronDown,
  CloudSun,
  Instagram,
  Mail,
  MapPinned,
  Mic2,
  Newspaper,
  Podcast,
  School,
  UsersRound
} from "lucide-react";

type Tab = "dashboard" | "predictions" | "maryland" | "interview" | "instagram" | "student-polls" | "literacy" | "partnerships" | "about" | "commute";

const groups = [
  {
    label: "Weather",
    tabs: ["predictions", "commute"],
    links: [
      { href: "/predictions", label: "Predictions", icon: CloudSun },
      { href: "/commute", label: "Commute Planner", icon: BusFront }
    ]
  },
  {
    label: "Schools",
    tabs: ["maryland", "interview"],
    links: [
      { href: "/maryland-status", label: "Maryland Status", icon: MapPinned },
      { href: "/interview", label: "Superintendent Interview", icon: Mic2 }
    ]
  },
  {
    label: "Learn",
    tabs: ["literacy", "student-polls", "instagram"],
    links: [
      { href: "/weather-literacy", label: "Weather Literacy", icon: BookOpen },
      { href: "/student-polls", label: "Student Prediction Lab", icon: BarChart3 },
      { href: "/instagram", label: "Weather Insights", icon: Newspaper }
    ]
  },
  {
    label: "About",
    tabs: ["about", "partnerships"],
    links: [
      { href: "/about", label: "Mission and Team", icon: UsersRound },
      { href: "/partnerships", label: "Partnerships", icon: School }
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
  { href: "/partnerships", label: "Partners", tab: "partnerships" }
] as const;

export function PageTabs({ active }: { active: Tab }) {
  const activeMobileLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeMobileLink.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const desktopItem = (isActive: boolean) =>
    `inline-flex min-h-20 items-center gap-2 border-b-2 px-3 text-sm font-bold transition ${
      isActive ? "border-bay text-bay" : "border-transparent text-slate-600 hover:border-blue-200 hover:text-bay"
    }`;
  const menuLink = "flex min-h-12 items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-bay";

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur" aria-label="Main sections">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:min-h-20">
        <Link href="/" className="mr-auto flex shrink-0 items-center gap-3" aria-label="HoCo Weather Channel home">
          <img src="/hoco-weather-channel-icon.png" alt="" className="h-14 w-14 shrink-0 object-contain lg:h-16 lg:w-16" />
          <span className="hidden text-base font-black leading-tight text-ink sm:block">HoCo Weather<br />Channel</span>
        </Link>

        <div className="hidden items-stretch lg:flex">
          <Link href="/" className={desktopItem(active === "dashboard")}>Dashboard</Link>
          {groups.map((group) => {
            const isActive = group.tabs.some((tab) => tab === active);
            return (
              <div key={group.label} className="group relative">
                <span className={`${desktopItem(isActive)} cursor-default`}>
                  {group.label}
                  <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                </span>
                <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 rounded-lg border border-blue-100 bg-white p-2 opacity-0 shadow-xl transition-opacity duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                  {group.links.map((item) => {
                    const Icon = item.icon;
                    return <Link key={item.href} href={item.href} className={menuLink}><Icon className="h-4 w-4 text-bay" />{item.label}</Link>;
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a href="mailto:howardcountyweather@gmail.com" className="social-nav-button" aria-label="Email HoCo Weather Channel" title="Email"><Mail className="h-4 w-4" /></a>
          <a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="social-nav-button" aria-label="HoCo Weather Channel on Instagram" title="Instagram"><Instagram className="h-4 w-4" /></a>
          <a href="https://open.spotify.com/show/1lq3ulTfGtY46EsGSm6VXl?si=fbfb99f380c848d5" target="_blank" rel="noreferrer" className="social-nav-button" aria-label="HoCo Weather Channel podcast" title="Podcast"><Podcast className="h-4 w-4" /></a>
        </div>
      </div>

      <div className="no-scrollbar flex w-full gap-1 overflow-x-auto border-t border-blue-50 px-4 lg:hidden" aria-label="Mobile sections">
        {mobileLinks.map((item) => (
          <Link ref={active === item.tab ? activeMobileLink : undefined} key={item.href} href={item.href} className={`shrink-0 border-b-2 px-3 py-3 text-xs font-bold ${active === item.tab ? "border-bay text-bay" : "border-transparent text-slate-600"}`}>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
