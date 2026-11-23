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
          <p className="font-semibold text-ink">The forecast ends where the decision begins.</p>
          <p>Weather models forecast the atmosphere. We forecast its impact on people.</p>
          <p>A forecast says 53°F. You want to know whether to bring a jacket. A forecast says freezing rain at 6 AM. A family wants to know whether it could affect the morning bus ride. We&apos;re building the layer that connects what&apos;s happening in the atmosphere to what people need to know on the ground.</p>
          <p><strong className="font-semibold text-ink">Schools are where we&apos;re starting.</strong> We combine forecasts, observations, and alerts to explain when weather could affect the school day and why. Families can see our weather-based prediction alongside the district&apos;s official status. We keep a public record of our predictions to see where we got it right and where we need to improve.</p>
          <p>Our ambition is to make that same approach useful wherever weather changes a plan: for commuters deciding when to leave, local governments preparing for storms, and emergency managers anticipating where flooding could disrupt access. People still make the call. They shouldn&apos;t have to decode the forecast first.</p>
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Student leadership</p>
            <h2 className="mt-2 text-3xl font-medium text-ink sm:text-4xl">Meet the team</h2>
          </div>
        </div>

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

        <figure className="mt-8 grid overflow-hidden rounded-lg bg-navy text-white lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <img
            src="/photography/winter-wildlife-squirrel.jpg"
            alt="A squirrel standing in fresh snow in Howard County"
            className="h-full min-h-[320px] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="flex flex-col justify-center p-7 sm:p-10">
            <h3 className="mt-3 text-3xl font-black leading-tight">Weather is part of the community story.</h3>
            <p className="mt-4 text-base leading-7 text-blue-100">
              Student photography records how winter weather changes local landscapes, wildlife, travel, and daily life across Howard County.
            </p>
          </figcaption>
        </figure>
      </section>

      <section className="bg-white page-band">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <h2 className="text-3xl font-medium text-ink sm:text-4xl">Expanding this winter</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">The next phase will create more ways for students to contribute to local weather reporting and education.</p>
            <a href="mailto:howardcountyweather@gmail.com" className="mt-6 inline-flex items-center gap-2 font-bold text-bay hover:underline">
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
