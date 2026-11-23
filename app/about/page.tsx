import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CloudSun,
  GraduationCap,
  Radio,
  UsersRound
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";
import { AnimatedStat } from "@/components/AnimatedStat";

export const metadata: Metadata = {
  title: "About | HoCo Weather Channel",
  description: "Meet the student team behind HoCo Weather Channel and learn about its mission, history, and community impact."
};

const openRoles = [
  {
    title: "Student Forecasters",
    description: "Review official weather data and help prepare clear local forecasts.",
    icon: <CloudSun className="h-6 w-6" />
  },
  {
    title: "School Correspondents",
    description: "Share verified conditions and weather impacts from schools across the county.",
    icon: <Radio className="h-6 w-6" />
  },
  {
    title: "Photo and Video Contributors",
    description: "Document local weather and help tell visual stories safely and responsibly.",
    icon: <Camera className="h-6 w-6" />
  },
  {
    title: "Weather Literacy Contributors",
    description: "Turn trusted sources into guides that help other students understand the forecast.",
    icon: <GraduationCap className="h-6 w-6" />
  }
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-8">
      <PageTabs active="about" />

      <PageHero title="Weather insights built for students.">
        <div className="mx-auto mt-6 max-w-5xl">
          <h2 className="text-sm font-bold uppercase text-blue-200">Our audience</h2>
          <div className="audience-stats mt-5 grid gap-5 sm:grid-cols-3 sm:gap-6">
            <div className="min-w-0">
              <AnimatedStat target={80000} className="text-white" />
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-blue-100">Students, staff, and parents served through the HCPSS community.</p>
            </div>
            <div className="min-w-0">
              <AnimatedStat target={700000} className="text-white" />
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-blue-100">People impacted nationwide</p>
            </div>
            <div className="min-w-0">
              <AnimatedStat target={2.2} suffix="M+" decimals={1} className="text-white" />
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-blue-100">Views across weather updates, forecasts, and educational content.</p>
            </div>
          </div>
        </div>
      </PageHero>

      <section aria-labelledby="mission-title" className="page-band bg-white">
        <h2 id="mission-title" className="mx-auto max-w-3xl text-balance text-3xl font-medium leading-tight text-ink sm:text-4xl">Building the decision layer for weather</h2>
        <div className="mx-auto mt-5 max-w-3xl space-y-4 text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
          <p>We started HoCo Weather Channel after watching school buses slide on icy Maryland roads. We could look up the forecast, but we wanted to know something more specific: would the roads freeze before buses picked us up?</p>
          <p>Most people already have a weather app. The work they still have to do is figure out which part of the forecast matters for their plans. Freezing rain at 6 AM matters differently to a district sending buses out at 6:30 than it does to someone whose commute starts at nine.</p>
          <p className="font-semibold text-ink">We&apos;re building the layer that turns a weather forecast into an assessment of what it could disrupt, where, and when.</p>
          <p>We started with school mornings because we know them firsthand. We look at when rain or snow is expected, what temperatures are doing around pickup time, and whether there are active weather alerts. Families can see our prediction and why we made it alongside the district&apos;s official status. We publish a record of our calls so people can see how they held up.</p>
          <p>Schools are the first place we&apos;re putting this to work. We want to do the same for commuters deciding when to leave, public works crews deciding where to check for flooding, and emergency managers figuring out which roads might become impassable. Those decisions belong to the people making them. Our job is to give them a clearer picture of what they&apos;re deciding on.</p>
        </div>
      </section>

      <section aria-labelledby="founding-title" className="page-band bg-white text-ink">
        <h2 id="founding-title" className="text-3xl font-medium sm:text-4xl">How it started</h2>
        <div className="mt-6 rounded-lg bg-slate-50 px-5 py-7 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-8 text-slate-700">
          <p className="font-semibold text-ink">
            A 30-ton school bus can take <strong className="text-bay">12 times as long</strong> to stop on ice or snow.
          </p>
          <p>
            Weather information has long been technical and delivered through a top-down system led by experts. {" "}
            <a href="https://repository.library.noaa.gov/view/noaa/67719" target="_blank" rel="noreferrer" className="font-semibold text-bay underline underline-offset-4">
              Older audiences still tend to rely on television, while younger audiences increasingly turn to websites, apps, social media, family, and friends for forecasts
            </a>
            . Students still feel the consequences of weather every day through bus rides, school schedules, outdoor activities, and decisions that affect their families.
          </p>
          <p>
            David Liu built HoCo Weather Channel in his computer science class and launched it in November 2025 after Maryland school districts remained open despite icy roads that sent school buses sliding. It brings complex meteorological information to younger audiences through clear local forecasts, school operation predictions, and weather literacy resources built around the decisions students experience.
          </p>
        </div>
        </div>
      </section>

      <section className="bg-blue-50/60 page-band">
        <h2 className="text-3xl font-medium text-ink sm:text-4xl">Meet the team</h2>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Founder</p>
            <h3 className="mt-3 text-2xl font-black text-ink">David Liu</h3>
            <p className="mt-1 text-sm font-bold text-bay">Class of 2027</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Leads forecasting, school operation predictions, weather literacy, partnerships, and the overall direction of HoCo Weather Channel.</p>
          </article>
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Co-founder</p>
            <h3 className="mt-3 text-2xl font-black text-ink">Zia Kapadia</h3>
            <p className="mt-1 text-sm font-bold text-bay">Class of 2030</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Supports the continued development of the channel and its student-centered weather communication work.</p>
          </article>
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Photographer</p>
            <h3 className="mt-3 text-2xl font-black text-ink">Ricky He</h3>
            <p className="mt-1 text-sm font-bold text-bay">Class of 2029</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Documents local weather and seasonal conditions through photography used across HoCo Weather Channel.</p>
          </article>
        </div>

      </section>

      <section aria-labelledby="winter-expansion" className="page-band relative isolate overflow-hidden bg-navy">
        <img
          src="/photography/winter-wildlife-squirrel.jpg"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-navy/75" />
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-10">
          <div>
            <h2 id="winter-expansion" className="text-3xl font-medium text-white sm:text-4xl">Expanding this winter</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-white">The next phase will create more ways for students to contribute to local weather reporting and education.</p>
            <a href="mailto:howardcountyweather@gmail.com" className="mt-6 inline-flex items-center gap-2 font-bold text-white underline underline-offset-4 hover:text-blue-100">
              Ask about joining the team <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {openRoles.map((role) => (
              <article key={role.title} className="rounded-lg bg-ice p-5">
                <span className="text-bay">{role.icon}</span>
                <h3 className="mt-4 text-lg font-bold text-ink">{role.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 bg-blue-50 page-band sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UsersRound className="h-9 w-9 text-bay" />
          <div>
            <h2 className="text-2xl font-black text-ink">Serving Maryland&apos;s school community</h2>
            <p className="mt-1 text-sm text-slate-600">Explore the partnerships helping this student-led work reach more people.</p>
          </div>
        </div>
        <Link href="/partnerships" className="inline-flex items-center gap-2 font-bold text-bay hover:underline">View partnerships <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </main>
  );
}
