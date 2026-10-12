import { BarChart3, BookOpen, Brain, Instagram, Mail, Search, Users } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

type PollOption = {
  label: string;
  votes: number;
  percent: number;
};

type StudentPoll = {
  question: string;
  category: "School Operations" | "Seasonal Weather" | "Community Weather";
  options: PollOption[];
};

const polls: StudentPoll[] = [
  {
    question: "Do you think we will have school on Monday?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 218, percent: 46 },
      { label: "Maybe", votes: 124, percent: 26 },
      { label: "No", votes: 133, percent: 28 }
    ]
  },
  {
    question: "Will we be in school until July?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 133, percent: 29 },
      { label: "No", votes: 211, percent: 46 },
      { label: "Until the very end of June", votes: 113, percent: 25 }
    ]
  },
  {
    question: "Will school be closed tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 361, percent: 57 },
      { label: "No", votes: 277, percent: 43 }
    ]
  },
  {
    question: "Do you think we will have school Friday?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 126, percent: 17 },
      { label: "I hope not", votes: 326, percent: 43 },
      { label: "No", votes: 303, percent: 40 }
    ]
  },
  {
    question: "Do you think school will close tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 49, percent: 42 },
      { label: "No", votes: 30, percent: 25 },
      { label: "I hope", votes: 39, percent: 33 }
    ]
  },
  {
    question: "Snow next week?",
    category: "Seasonal Weather",
    options: [
      { label: "Yes", votes: 171, percent: 36 },
      { label: "No", votes: 240, percent: 51 },
      { label: "Maybe", votes: 58, percent: 12 }
    ]
  },
  {
    question: "Delay tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 438, percent: 43 },
      { label: "No", votes: 317, percent: 31 },
      { label: "I hope so", votes: 255, percent: 25 }
    ]
  },
  {
    question: "Will we have school tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 524, percent: 52 },
      { label: "Maybe", votes: 252, percent: 25 },
      { label: "No", votes: 238, percent: 23 }
    ]
  },
  {
    question: "Will we have school tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 176, percent: 23 },
      { label: "No", votes: 384, percent: 50 },
      { label: "I hope not", votes: 213, percent: 28 }
    ]
  },
  {
    question: "Do you think we will have school on Wednesday?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 31, percent: 13 },
      { label: "I hope not", votes: 104, percent: 42 },
      { label: "No", votes: 112, percent: 45 }
    ]
  },
  {
    question: "Do you think we will have school on Monday?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 145, percent: 27 },
      { label: "Maybe", votes: 152, percent: 28 },
      { label: "No", votes: 242, percent: 45 }
    ]
  },
  {
    question: "Do you think we will get Tuesday off?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 108, percent: 81 },
      { label: "No", votes: 6, percent: 4 },
      { label: "I hope", votes: 20, percent: 15 }
    ]
  },
  {
    question: "Delay tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 683, percent: 70 },
      { label: "No", votes: 113, percent: 12 },
      { label: "I hope so", votes: 177, percent: 18 }
    ]
  },
  {
    question: "Was the DMV's rapidly changing weather surprising?",
    category: "Seasonal Weather",
    options: [
      { label: "Yes", votes: 139, percent: 33 },
      { label: "No", votes: 286, percent: 67 }
    ]
  },
  {
    question: "Will you be attending the Cherry Blossom Festival?",
    category: "Community Weather",
    options: [
      { label: "Yes", votes: 84, percent: 28 },
      { label: "No", votes: 122, percent: 40 },
      { label: "I hope so", votes: 96, percent: 32 }
    ]
  },
  {
    question: "School tomorrow?",
    category: "School Operations",
    options: [
      { label: "Yes", votes: 393, percent: 36 },
      { label: "No", votes: 329, percent: 30 },
      { label: "I hope not", votes: 360, percent: 33 }
    ]
  }
];

const totalVotes = polls.reduce(
  (pollTotal, poll) => pollTotal + poll.options.reduce((optionTotal, option) => optionTotal + option.votes, 0),
  0
);

function PollCard({ poll, index }: { poll: StudentPoll; index: number }) {
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const leadingOption = poll.options.reduce((leader, option) => option.votes > leader.votes ? option : leader);

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-bay">Poll {index + 1} · {poll.category}</p>
          <h2 className="mt-2 text-xl font-bold text-ink">{poll.question}</h2>
        </div>
        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-bay">
          {total.toLocaleString()} votes
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {poll.options.map((option) => (
          <div key={option.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-700">{option.label}</span>
              <span className="text-slate-500">{option.votes.toLocaleString()} votes · {option.percent}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-blue-50">
              <div
                className={option === leadingOption ? "h-full rounded-full bg-bay" : "h-full rounded-full bg-blue-300"}
                style={{ width: `${option.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export const metadata = {
  title: "Student Prediction Lab | HoCo Weather Channel",
  description: "Archived student weather and school-operation prediction polls from HoCo Weather Channel."
};

export default function StudentPollsPage() {
  return (
    <main className="min-h-screen w-full px-3 py-6 sm:px-5 lg:px-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-blue-100 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img
            src="/hoco-weather-channel-logo.png"
            alt="HoCo Weather Channel"
            className="h-20 w-20 rounded-lg border border-blue-100 bg-white object-contain p-2 shadow-sm"
          />
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
              <BarChart3 className="h-4 w-4" /> Weather Literacy in Action
            </p>
            <h1 className="text-3xl font-bold text-ink md:text-5xl">Student Prediction Lab</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href="mailto:howardcountyweather@gmail.com"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
          <a
            href="https://www.instagram.com/hocoweatherchannel/?hl=en"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-bay shadow-sm hover:border-bay"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </header>

      <PageTabs active="student-polls" />

      <section className="mb-5 grid overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm lg:grid-cols-[1.25fr_0.75fr]">
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">2025–26 Student Poll Archive</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Students became the forecasters</h2>
          <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-700">
            These polls invited students to make their own school-operation and weather predictions after researching
            HoCo Weather Channel resources, official forecasts, and other trusted weather sources.
          </p>
        </div>
        <div className="grid grid-cols-3 border-t border-blue-100 bg-ice/70 lg:grid-cols-1 lg:border-l lg:border-t-0">
          <div className="flex flex-col justify-center border-r border-blue-100 p-5 lg:border-b lg:border-r-0">
            <span className="text-3xl font-bold text-ink">{polls.length}</span>
            <span className="text-sm text-slate-600">Archived polls</span>
          </div>
          <div className="flex flex-col justify-center border-r border-blue-100 p-5 lg:border-b lg:border-r-0">
            <span className="text-3xl font-bold text-ink">{totalVotes.toLocaleString()}</span>
            <span className="text-sm text-slate-600">Student votes</span>
          </div>
          <div className="flex flex-col justify-center p-5">
            <span className="text-3xl font-bold text-ink">1,082</span>
            <span className="text-sm text-slate-600">Largest poll</span>
          </div>
        </div>
      </section>

      <section className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="flex gap-3 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <Search className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
          <div><h2 className="font-bold text-ink">Research</h2><p className="mt-1 text-sm leading-6 text-slate-600">Review forecasts, alerts, models, and timing.</p></div>
        </div>
        <div className="flex gap-3 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
          <div><h2 className="font-bold text-ink">Compare</h2><p className="mt-1 text-sm leading-6 text-slate-600">Use multiple sources and weigh conflicting information.</p></div>
        </div>
        <div className="flex gap-3 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <Brain className="mt-0.5 h-5 w-5 shrink-0 text-bay" />
          <div><h2 className="font-bold text-ink">Predict</h2><p className="mt-1 text-sm leading-6 text-slate-600">Make an evidence-based call and see how classmates reasoned.</p></div>
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay"><Users className="h-4 w-4" /> Poll Tracker</p>
          <h2 className="mt-1 text-2xl font-bold text-ink">Student predictions</h2>
        </div>
        <p className="max-w-lg text-right text-sm text-slate-500">Percentages are reproduced from the archived Instagram results and may not total exactly 100% because of rounding.</p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {polls.map((poll, index) => <PollCard key={`${poll.question}-${index}`} poll={poll} index={index} />)}
      </section>
    </main>
  );
}
