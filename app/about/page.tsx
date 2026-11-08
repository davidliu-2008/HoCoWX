import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CloudSun,
  GraduationCap,
  Megaphone,
  Radio,
  UsersRound
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

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
  },
  {
    title: "Design and Social Media Contributors",
    description: "Create clear graphics and help distribute timely updates across platforms.",
    icon: <Megaphone className="h-6 w-6" />
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full pb-8">
      <PageTabs active="about" />

      <header className="page-hero grid gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-bay">About HoCo Weather Channel</p>
          <h1 className="mt-3 max-w-5xl text-5xl font-black leading-tight text-ink sm:text-7xl">Weather information students can understand and use.</h1>
        </div>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          HoCo Weather Channel is a student-led weather service translating complex meteorological information into clear local forecasts, school operation predictions, and weather literacy resources for Maryland students, families, and staff.
        </p>
      </header>

      <section className="grid gap-8 bg-navy px-5 py-12 text-white sm:px-8 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Our mission</p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Make local weather clear, useful, and connected to daily life.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-black text-white">Inform</p>
            <p className="mt-2 text-sm leading-6 text-blue-100">Give students and families timely forecasts focused on the conditions that affect school and travel.</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">Explain</p>
            <p className="mt-2 text-sm leading-6 text-blue-100">Translate weather data and uncertainty into language people can quickly understand.</p>
          </div>
          <div>
            <p className="text-3xl font-black text-white">Teach</p>
            <p className="mt-2 text-sm leading-6 text-blue-100">Help students read trusted sources, question decisions, evaluate evidence, and make informed predictions of their own.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-8 bg-white px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-bay">Our audience</p>
          <h2 className="mt-2 text-4xl font-black leading-tight text-ink sm:text-5xl">Built around the questions students actually ask.</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-4xl font-black text-bay">80,000+</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Students, staff, and parents served through the HCPSS community.</p>
          </div>
          <div>
            <p className="text-4xl font-black text-bay">Nearly 10K</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Student weather and school-operation predictions submitted through polls.</p>
          </div>
          <div>
            <p className="text-4xl font-black text-bay">2M+</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Views, with more than 700,000 accounts reached across platforms.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.72fr_1.28fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-bay">How it started</p>
          <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">A gap between the forecast and the decisions people felt.</h2>
        </div>
        <div className="space-y-6 text-lg leading-8 text-slate-600">
          <p>
            David Liu conceptualized HoCo Weather Channel in December 2024. The project launched in November 2025 after Maryland school districts remained open despite icy roads that sent school buses sliding.
          </p>
          <p>
            That moment revealed a disconnect between available weather information and the decisions affecting students, families, and staff. HoCo Weather Channel was built to bridge that gap by translating meteorological information into digestible forecasts and school operation predictions.
          </p>
          <p>
            The format changed as students became part of the process. School-operation forecasts gave them a reason to examine snowfall totals, ice accretion, timing, and uncertainty. Polls then invited students to research the conditions and make nearly 10,000 predictions of their own.
          </p>
          <p className="border-l-4 border-bay pl-6 text-2xl font-bold leading-9 text-ink">
            The goal is to help a community gain the confidence to understand the evidence and make informed decisions for itself.
          </p>
        </div>
      </section>

      <section className="bg-blue-50/60 px-5 py-14 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Student leadership</p>
            <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">Meet the team</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600">Students bring forecasting, communication, and visual storytelling together in one community weather service.</p>
        </div>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Founder</p>
            <h3 className="mt-3 text-2xl font-black text-ink">David Liu</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Marriotts Ridge High School · Class of 2027</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Leads forecasting, school operation predictions, weather literacy, partnerships, and the overall direction of HoCo Weather Channel. His work brings together environmental science, data, communication, and public service.</p>
          </article>
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Co-founder</p>
            <h3 className="mt-3 text-2xl font-black text-ink">Zia Kapadia</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Reservoir High School · Class of 2030</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Supports the continued development of the channel and its student-centered weather communication work.</p>
          </article>
          <article className="rounded-lg bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Contributing photographer</p>
            <h3 className="mt-3 text-2xl font-black text-ink">Ricky He</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Marriotts Ridge High School · Class of 2029</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">Documents local weather and seasonal conditions through photography used across HoCo Weather Channel.</p>
          </article>
        </div>

        <figure className="mt-10 grid overflow-hidden rounded-lg bg-navy text-white lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
          <img
            src="/photography/winter-wildlife-squirrel.jpg"
            alt="A squirrel standing in fresh snow in Howard County"
            className="h-full min-h-[320px] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="flex flex-col justify-center p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Local conditions, documented</p>
            <h3 className="mt-3 text-3xl font-black leading-tight">Weather is part of the community story.</h3>
            <p className="mt-4 text-base leading-7 text-blue-100">
              Student photography records how winter weather changes local landscapes, wildlife, travel, and daily life across Howard County.
            </p>
          </figcaption>
        </figure>
      </section>

      <section className="grid gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-bay">Our history</p>
          <h2 className="mt-2 text-4xl font-black text-ink">Built one step at a time.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-lg bg-ice p-6">
            <p className="text-4xl font-black text-bay">2024</p>
            <h3 className="mt-4 text-xl font-bold text-ink">Concept developed</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">The idea for a student-led local weather and school operations service began in December.</p>
          </article>
          <article className="rounded-lg bg-blue-50 p-6">
            <p className="text-4xl font-black text-bay">2025</p>
            <h3 className="mt-4 text-xl font-bold text-ink">HoCo Weather Channel launched</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">The channel launched in November with local forecasting and school operation predictions.</p>
          </article>
          <article className="rounded-lg bg-sky-50 p-6">
            <p className="text-4xl font-black text-bay">2026</p>
            <h3 className="mt-4 text-xl font-bold text-ink">Students joined the forecast</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Nearly 10,000 student poll predictions turned weather updates into active learning, and an HCPSS partnership expanded the work into district weather literacy.</p>
          </article>
        </div>
      </section>

      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Expanding this winter</p>
            <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">More students. More perspectives.</h2>
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

      <section className="flex flex-col gap-6 bg-blue-50 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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
