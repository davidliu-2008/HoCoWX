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
          <div className="audience-stats mt-4 grid gap-3 sm:grid-cols-3 sm:gap-6">
            <div className="min-w-0">
              <AnimatedStat target={80000} className="text-white" />
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-blue-100">Students, staff, and parents served through the HCPSS community.</p>
            </div>
            <div className="min-w-0 sm:px-3 lg:px-6">
              <AnimatedStat target={700000} className="text-white" />
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-blue-100">People impacted nationwide</p>
            </div>
            <div className="min-w-0">
              <AnimatedStat target={2.2} suffix="M+" decimals={1} className="text-white" />
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-blue-100">Views across weather updates, forecasts, and educational content.</p>
            </div>
          </div>
        </div>
      </PageHero>

      <section className="page-band bg-white text-ink">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">How it started</h2>
          <div className="mx-auto mt-5 max-w-3xl bg-ice px-5 py-5 sm:px-8">
            <p className="text-lg font-semibold leading-7">
              <strong className="text-bay">110 people</strong> died in school-transportation-related traffic crashes nationwide in 2024.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              This national total covers crashes from all causes, not just severe weather, and includes people outside school buses.
              {" "}<a href="https://www.nhtsa.gov/road-safety/school-bus-safety" className="font-semibold text-bay underline underline-offset-4">Source: NHTSA</a>
            </p>
            <p className="mt-4 text-lg font-semibold leading-7">
              A 30-ton school bus can take <span className="text-bay">12 times as long</span> to stop on a road covered in ice or snow.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              That figure comes from a <a href="https://safetyvideos.org/wp-content/uploads/2015/07/Winter-Driving-Guide-and-Test.pdf" className="font-semibold text-bay underline underline-offset-4">winter bus driving guide</a>; actual stopping time varies with road and driving conditions.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-7 text-slate-700">
          <p>
            Weather information has long been technical and delivered through a top-down system led by experts. {" "}
            <a href="https://repository.library.noaa.gov/view/noaa/67719" target="_blank" rel="noreferrer" className="font-semibold text-bay underline underline-offset-4">
              Older audiences still tend to rely on television, while younger audiences increasingly turn to websites, apps, social media, family, and friends for forecasts
            </a>
            . Students still feel the consequences of weather every day through bus rides, school schedules, outdoor activities, and decisions that affect their families.
          </p>
          <p>
            David Liu built HoCo Weather Channel in his computer science class and launched it in November 2025 after Maryland school districts stayed open on icy roads that sent school buses sliding. On winter roads, snow and ice can cause buses to lose traction, skid, crash, or overturn. The risk is not limited to winter: heavy rain can reduce visibility or flood roads, and severe thunderstorms can bring strong winds and downed trees across bus routes.
          </p>
          <p>
            HoCo Weather Channel translates forecasts into what students and families need to know: which hazards are expected, when they could affect the trip to school, and where to check the district&apos;s official decision.
          </p>
        </div>
      </section>

      <section className="bg-blue-50/60 page-band">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Student leadership</p>
            <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Meet the team</h2>
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
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Expanding this winter</p>
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
      <section aria-labelledby="our-perspective" className="page-content page-section">
        <h2 id="our-perspective" className="mb-7 text-center text-3xl font-semibold text-ink">Our perspective</h2>
        <figure className="mx-auto max-w-3xl rounded-lg bg-ice p-6 sm:p-9">
          <blockquote className="max-w-2xl text-2xl font-medium leading-snug text-ink">Weather models forecast the atmosphere. We forecast its impact on people.</blockquote>
          <figcaption className="mt-6 text-sm font-semibold text-slate-700">HoCo Weather Channel</figcaption>
        </figure>
      </section>
    </main>
  );
}
