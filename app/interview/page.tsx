import { PageTabs } from "@/components/PageTabs";
import { PageHero } from "@/components/PageHero";
import { interviewAnswers } from "./answers";

export const metadata = {
  title: "Weather Decisions | HoCo Weather Channel",
  description: "David Liu interviews HCPSS Superintendent Bill Barnes about weather-related school operations decisions."
};

export default function InterviewPage() {
  return (
    <main id="main-content" tabIndex={-1} className="integrated-page min-h-screen w-full pb-6">
      <PageTabs active="interview" />

      <PageHero title="Weather Decisions" description="Superintendent Bill Barnes explains how the district makes weather-related school decisions." />

      <section className="page-content pt-8">
        <div className="mx-auto max-w-3xl bg-ice/70 p-5 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">Recorded March 4, 2026</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">A conversation with Superintendent Bill Barnes</h2>
          <div className="mt-3 max-w-3xl space-y-1 text-slate-600">
            <p>
              <span className="font-semibold text-ink">Interviewer:</span> David Liu, a Marriotts Ridge High School
              student and founder of HoCo Weather Channel
            </p>
            <p>
              <span className="font-semibold text-ink">Interviewee:</span> Bill Barnes, Superintendent of the Howard
              County Public School System, which serves more than 57,000 students.
            </p>
          </div>
        </div>
      </section>
      <section aria-labelledby="interview-answers" className="page-content page-section">
        <div className="mx-auto max-w-3xl">
          <h2 id="interview-answers" className="text-2xl font-bold text-ink">Interview questions and answers</h2>
          <p className="mt-2 text-sm text-slate-600">Answers are paraphrased from the March 4, 2026 interview.</p>
          <ol className="mt-6 space-y-6">
            {interviewAnswers.map(({ question, answer }) => (
              <li key={question}>
                <h3 className="text-lg font-bold text-ink">{question}</h3>
                <p className="mt-2 leading-7 text-slate-700">{answer}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

    </main>
  );
}
