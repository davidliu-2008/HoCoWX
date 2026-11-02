import { BellRing, CheckCircle2, CloudSun, Handshake, Instagram, Mail, School, Snowflake, Users } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

export const metadata = {
  title: "Partnerships | HoCo Weather Channel",
  description: "HoCo Weather Channel partnerships supporting student weather literacy and communication."
};

export default function PartnershipsPage() {
  return (
    <main className="min-h-screen w-full px-3 pb-6 sm:px-5 lg:px-6">
      <PageTabs active="partnerships" />

      <header className="flex flex-col gap-4 border-b border-blue-100 py-5 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src="/hoco-weather-channel-logo.png" alt="HoCo Weather Channel" className="h-20 w-20 border border-blue-100 bg-white object-contain p-2" />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><Handshake className="h-4 w-4" /> Working Together</p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Partnerships</h1>
            <p className="mt-2 text-lg text-slate-600">Building stronger weather communication and literacy for students.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="mailto:howardcountyweather@gmail.com" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Mail className="h-4 w-4" /> Email</a>
          <a href="https://www.instagram.com/hocoweatherchannel/?hl=en" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay"><Instagram className="h-4 w-4" /> Instagram</a>
        </div>
      </header>

      <section className="border-y border-blue-200 bg-blue-50/55 px-1 py-6 sm:px-5 lg:px-7 lg:py-8">
        <div className="grid items-start gap-6 xl:grid-cols-[0.82fr_1.18fr] xl:gap-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><School className="h-4 w-4" /> Formal HCPSS Partnership</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Weather information inside the HCPSS experience</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">HoCo Weather Channel will be integrated into the official HCPSS structure, bringing timely environmental news and weather literacy resources to approximately 66,000 students and staff.</p>

            <div className="mt-6 divide-y divide-blue-100 border-y border-blue-100">
              <div className="flex gap-3 py-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bay" /><div><h3 className="font-bold text-ink">Working with the HCPSS weather team</h3><p className="mt-1 text-sm leading-6 text-slate-600">Developing useful weather information and literacy resources for the school community.</p></div></div>
              <div className="flex gap-3 py-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bay" /><div><h3 className="font-bold text-ink">Contributing to weather-related discussions</h3><p className="mt-1 text-sm leading-6 text-slate-600">Sitting in on operational decision discussions and contributing weather analysis to help determine those decisions.</p></div></div>
              <div className="flex gap-3 py-4"><Users className="mt-0.5 h-5 w-5 shrink-0 text-bay" /><div><h3 className="font-bold text-ink">Reaching the full HCPSS community</h3><p className="mt-1 text-sm leading-6 text-slate-600">Serving environmental news through familiar district platforms used by students and staff.</p></div></div>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-bay">Proof of concept</p><h3 className="mt-1 font-bold text-ink">Sample Canvas homepage announcement</h3></div><span className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-bay">Concept preview</span></div>
            <div className="overflow-hidden border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3"><div className="flex items-center gap-3"><div className="h-8 w-8 bg-red-700" aria-hidden="true" /><div><p className="text-xs text-slate-500">HCPSS Canvas</p><p className="text-sm font-bold text-slate-800">Student Homepage</p></div></div><BellRing className="h-5 w-5 text-slate-500" /></div>
              <div className="grid md:grid-cols-[0.28fr_0.72fr]">
                <div className="hidden border-r border-slate-200 bg-slate-50/70 p-4 md:block"><div className="space-y-3 text-sm text-slate-500"><p className="font-semibold text-slate-800">Home</p><p>Courses</p><p>Calendar</p><p>Resources</p></div></div>
                <div className="p-4 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Special Weather Announcement</p>
                  <div className="mt-3 border-l-4 border-bay bg-blue-50 p-5"><div className="flex flex-col gap-4 sm:flex-row"><div className="flex h-12 w-12 shrink-0 items-center justify-center bg-bay text-white"><Snowflake className="h-7 w-7" /></div><div><div className="flex flex-wrap items-center gap-2"><h4 className="text-xl font-bold text-ink">Winter weather update</h4><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-bay">HoCoWX</span></div><p className="mt-2 text-sm leading-6 text-slate-700">A period of winter weather may affect Howard County. Review the latest timing, impacts, and safety information before travel.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"><span>Timing: Overnight into morning</span><span>Primary concern: Icy roads</span></div><span className="mt-4 inline-block bg-bay px-4 py-2 text-sm font-bold text-white">View weather update</span></div></div></div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">Sample layout for discussion purposes. Final placement and language will be developed with HCPSS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 border-b border-blue-100 py-8 lg:grid-cols-[0.38fr_0.62fr]">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><CloudSun className="h-4 w-4" /> Capital Weather Partnership</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Connecting students with regional weather expertise</h2>
        </div>
        <div className="border-l-4 border-bay bg-white px-5 py-5">
          <h3 className="text-xl font-bold text-ink">Capital Weather Gang</h3>
          <p className="mt-3 leading-7 text-slate-700">HoCo Weather Channel is developing a partnership with Jason Samenow and Capital Weather Gang to expand student weather literacy, strengthen regional weather communication, and explore opportunities for collaboration.</p>
          <p className="mt-3 text-sm font-semibold text-bay">Collaboration details are currently in development.</p>
        </div>
      </section>
    </main>
  );
}
