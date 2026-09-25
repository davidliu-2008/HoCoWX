import { CalendarDays, ExternalLink, Eye, Instagram, Mic2, Users } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

const DRIVE_FILE_ID = "170BiQd-TMKI-smsfuNK4Axoefmho0RQ2";
const DRIVE_VIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/view?usp=sharing`;
const DRIVE_PREVIEW_URL = `https://drive.google.com/file/d/${DRIVE_FILE_ID}/preview`;

const questions = [
  "Would it be okay if the host could record this meeting, and would I be allowed to publish portions of it to the page?",
  "What goes into school closures or delays?",
  "Are there certain snowfall thresholds?",
  "How does the amount of ice affect the decision?",
  "Do National Weather Service advisories or warnings factor into the decision?",
  "There are multiple forecast models, national news stations, and local meteorologists, and snowfall estimates can change frequently. What does the district look at specifically, or is it a combination of sources?",
  "Does Howard County coordinate decisions with nearby districts such as Montgomery, Baltimore, or Anne Arundel counties?",
  "How much do neighboring counties influence the final decision?",
  "Why are early dismissals so rare, even when the forecast snowfall is somewhat significant, like what we saw on March 2, 2026?",
  "What determines when operational announcements are released?",
  "Why are teachers sometimes notified ahead of time?",
  "How are make-up days calculated when schools close because of snow?",
  "Counties such as Montgomery sometimes end the school year later even though their calendars begin around the same time and include similar breaks. Why is that?",
  "Is there an independent team or person responsible for forecasting? Do county officials play a role in the final decision, or is it purely data-driven? Are expectations of student reactions ever considered?",
  "Why are virtual learning days not implemented?",
  "Does the Student Member of the Board have input when the district reviews closure and delay policies or makes these decisions?",
  "What is one thing you wish more people understood, or one major misconception, about how school closure decisions are made?",
  "Many Maryland school districts announce closures and delays on Instagram. Would HCPSS consider partnering with HoCo Weather Channel through Instagram collaboration posts to amplify official announcements and help more students see them quickly?"
];

export const metadata = {
  title: "Interview with Superintendent Bill Barnes | HoCo Weather Channel",
  description: "David Liu interviews HCPSS Superintendent Bill Barnes about weather-related school operations decisions."
};

export default function InterviewPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src="/hoco-weather-channel-logo.png"
            alt="HoCo Weather Channel"
            className="h-20 w-20 rounded-lg border border-blue-100 bg-white object-contain p-2 shadow-sm"
          />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
              <Mic2 className="h-4 w-4" />
              HoCo Weather Channel Interview
            </p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Inside HCPSS Weather Decisions</h1>
          </div>
        </div>
        <a
          href="https://www.instagram.com/hocoweatherchannel/?hl=en"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </a>
      </header>

      <PageTabs active="interview" />

      <section className="mb-5 overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
        <div className="border-b border-blue-100 bg-ice/70 p-5 sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Recorded March 4, 2026</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">A conversation with Superintendent Bill Barnes</h2>
          <p className="mt-3 max-w-3xl text-slate-600">
            David Liu, a Marriotts Ridge High School student and founder of HoCo Weather Channel, speaks with Bill Barnes,
            Superintendent of the Howard County Public School System, which serves more than 57,000 students.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-bay" /> March 4, 2026</span>
            <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-bay" /> Howard County, Maryland</span>
            <span className="inline-flex flex-wrap items-center gap-2">
              <Eye className="h-4 w-4 text-bay" />
              15.3K views
              <a
                href="https://www.instagram.com/p/DV7cV7skY_1/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="text-bay hover:underline"
              >
                Part 1
              </a>
              <a
                href="https://www.instagram.com/p/DV7HWXFEXuw/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="text-bay hover:underline"
              >
                Part 2
              </a>
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <div className="aspect-video overflow-hidden rounded-lg bg-slate-950">
            <iframe
              src={DRIVE_PREVIEW_URL}
              title="Interview with HCPSS Superintendent Bill Barnes"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
          <a
            href={DRIVE_VIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-bay hover:underline"
          >
            Open the recording in Google Drive
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.42fr]">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-bold text-ink">Interview Questions</h2>
          <ol className="mt-5 space-y-4">
            {questions.map((question, index) => (
              <li key={question} className="flex gap-3 border-b border-blue-50 pb-4 last:border-0 last:pb-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-bay">
                  {index + 1}
                </span>
                <p className="pt-0.5 leading-6 text-slate-700">{question}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside className="h-fit rounded-lg border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">What&apos;s Next</p>
          <h2 className="mt-2 text-xl font-bold text-ink">Upcoming Collaboration</h2>
          <p className="mt-3 leading-6 text-slate-700">
            HoCo Weather Channel is teaming up with HCPSS to create weather literacy resources for this winter. We&apos;ll
            meet again with Superintendent Bill Barnes on October 1 to work through the details and plan what the
            collaboration will look like.
          </p>
          <div className="my-5 border-t border-blue-200" />
          <h3 className="font-bold text-ink">In Progress</h3>
          <p className="mt-2 leading-6 text-slate-700">
            We&apos;re also exploring possible collaborations with Jason Samenow of Capital Weather Gang and Matthew
            Cappucci, senior meteorologist and storm chaser at MyRadar.
          </p>
        </aside>
      </div>
    </main>
  );
}
