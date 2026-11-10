import { BarChart3 } from "lucide-react";
import { AnimatedStat } from "@/components/AnimatedStat";
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

const getPollTotal = (poll: StudentPoll) => poll.options.reduce((total, option) => total + option.votes, 0);
const sortedPolls = [...polls].sort((first, second) => getPollTotal(second) - getPollTotal(first));
const totalVotes = polls.reduce((total, poll) => total + getPollTotal(poll), 0);
const largestPoll = getPollTotal(sortedPolls[0]);

function PollCard({ poll, index }: { poll: StudentPoll; index: number }) {
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const leadingOption = poll.options.reduce((leader, option) => option.votes > leader.votes ? option : leader);

  return (
    <article className="rounded-lg bg-white p-5 shadow-panel transition duration-200 hover:-translate-y-1">
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
    <main className="integrated-page min-h-screen w-full pb-6">
      <PageTabs active="student-polls" />

      <header className="page-hero px-5 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-bay">
            <BarChart3 className="h-4 w-4" /> Weather Literacy in Action
          </p>
          <h1 className="text-4xl font-black text-ink md:text-6xl">Student Prediction Lab</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8">A record of students researching conditions, weighing uncertainty, and making weather-based school operation predictions.</p>
        </div>
      </header>

      <section className="mb-6 mt-6 overflow-hidden rounded-lg bg-white p-6 text-center shadow-panel sm:p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-bay">2025–26 Student Poll Archive</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">Students became the forecasters</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            These polls invited students to make their own school-operation and weather predictions after researching
            HoCo Weather Channel resources, official forecasts, and other trusted weather sources.
          </p>
        </div>
        <div className="mt-8 grid gap-6 border-t border-blue-100 pt-7 sm:grid-cols-3">
          <div>
            <AnimatedStat target={polls.length} suffix="" />
            <span className="mt-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Archived polls</span>
          </div>
          <div>
            <AnimatedStat target={totalVotes} suffix="" />
            <span className="mt-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Student votes</span>
          </div>
          <div>
            <AnimatedStat target={largestPoll} suffix="" />
            <span className="mt-2 block text-sm font-bold uppercase tracking-wide text-slate-600">Largest poll</span>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {sortedPolls.map((poll, index) => <PollCard key={`${poll.question}-${index}`} poll={poll} index={index} />)}
      </section>
    </main>
  );
}
