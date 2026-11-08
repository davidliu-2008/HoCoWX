import {
  AlertTriangle, ArrowRight, BookOpen, CheckCircle2, Clock3, CloudRain, CloudSnow,
  ExternalLink, Gauge, Layers3, Map, Radar, School, Snowflake, ThermometerSnowflake, Wind
} from "lucide-react";
import { PageTabs } from "@/components/PageTabs";

export const metadata = {
  title: "Weather Literacy Center | HoCo Weather Channel",
  description: "A student guide to forecasts, winter weather, alerts, school impacts, and responsible weather communication."
};

const guideLinks = [
  { href: "#forecast", number: "01", title: "Read a forecast", text: "Turn weather data into a clear picture of what may happen." },
  { href: "#winter", number: "02", title: "Understand winter weather", text: "Compare snow, sleet, freezing rain, and changing roads." },
  { href: "#school", number: "03", title: "Evaluate school impacts", text: "Focus on timing, transportation, ice, and uncertainty." },
  { href: "#briefing", number: "04", title: "Build a briefing", text: "Communicate evidence without exaggerating certainty." },
  { href: "#practice", number: "05", title: "Practice the process", text: "Work through a realistic Howard County scenario." }
];

const alertLevels = [
  { label: "Outlook", action: "Look ahead", text: "A hazardous event may develop in the coming days. Start monitoring, but details may still change." },
  { label: "Watch", action: "Prepare", text: "The ingredients for significant weather are present. Review plans and watch for updates." },
  { label: "Advisory", action: "Use caution", text: "Hazardous weather is expected, usually below warning criteria, but travel may still be disrupted." },
  { label: "Warning", action: "Take action", text: "Dangerous weather is expected, imminent, or occurring. Follow official safety instructions." }
];

const precipitationTypes = [
  { title: "Snow", icon: Snowflake, definition: "Snowflakes remain frozen from the cloud to the ground.", impact: "Accumulation, reduced traction, lower visibility, and difficult untreated roads." },
  { title: "Sleet", icon: CloudSnow, definition: "Partly melted precipitation refreezes into ice pellets before reaching the ground.", impact: "A dense, slippery layer that can be difficult to clear and may reduce snow totals." },
  { title: "Freezing rain", icon: CloudRain, definition: "Liquid rain freezes when it touches a surface at or below freezing.", impact: "Glaze ice on roads, sidewalks, trees, and power lines. Small amounts can create major impacts." },
  { title: "Rain", icon: CloudRain, definition: "Liquid precipitation reaches a surface that is above freezing.", impact: "May create flooding or transition quickly to ice if temperatures fall." }
];

const schoolFactors = [
  { title: "Timing", icon: Clock3, text: "Conditions between 5 AM and 9 AM overlap with road treatment, staff travel, bus staging, and student arrival." },
  { title: "Ice", icon: ThermometerSnowflake, text: "Freezing rain, refreezing, and black ice can create more transportation risk than a larger amount of dry snow." },
  { title: "Road temperature", icon: Gauge, text: "Air temperature is incomplete. Pavement may stay warm after a mild day or freeze faster after prolonged cold." },
  { title: "Intensity", icon: CloudSnow, text: "Roads can deteriorate rapidly when snow falls faster than crews can treat or clear it." },
  { title: "Wind and visibility", icon: Wind, text: "Gusts can produce blowing snow, poor visibility, drifting, falling branches, and power disruptions." },
  { title: "Confidence", icon: Layers3, text: "A high-impact possibility is not the same as a high-confidence forecast. Explain both impact and certainty." }
];

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="max-w-4xl"><p className="text-sm font-bold uppercase tracking-wide text-bay">{eyebrow}</p><h2 className="mt-2 text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{children}</p></div>;
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <li className="grid gap-3 py-4 sm:grid-cols-[3rem_1fr]"><span className="text-2xl font-black text-blue-300">{number}</span><div><h3 className="font-bold text-ink">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{children}</p></div></li>;
}

export default function WeatherLiteracyPage() {
  return (
    <main className="min-h-screen w-full pb-8">
      <PageTabs active="literacy" />

      <header className="page-hero literacy-video-hero px-5 py-12 sm:px-8 sm:py-16">
        <video
          className="literacy-video-hero__media"
          autoPlay
          muted
          loop
          playsInline
          poster="/photography/snowfall-video-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/snowfall-background.m4v" type="video/mp4" />
        </video>
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-bay"><BookOpen className="h-4 w-4" /> Weather Literacy Center</p>
        <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight text-ink sm:text-6xl">Learn to read the weather, not just react to it.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">A practical guide for students who want to understand forecasts, evaluate school-day impacts, and communicate weather responsibly.</p>
        <p className="mt-4 text-lg font-black text-bay">By students. For students.</p>
      </header>

      <section className="bg-white/60 px-5 py-10 sm:px-8 sm:py-12">
        <SectionHeading eyebrow="Choose a guide" title="Start with the question you are trying to answer.">Weather literacy is a process. Use these five guides in order for a complete forecast, or jump directly to the skill you need.</SectionHeading>
        <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {guideLinks.map((guide) => <a key={guide.href} href={guide.href} className="group bg-blue-50/60 p-5 transition duration-300 hover:-translate-y-1 hover:bg-blue-50"><span className="text-sm font-black text-blue-300">{guide.number}</span><h2 className="mt-5 text-xl font-bold text-ink">{guide.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{guide.text}</p><ArrowRight className="mt-5 h-4 w-4 text-bay transition group-hover:translate-x-1" /></a>)}
        </div>

        <figure className="mt-10 grid overflow-hidden rounded-lg bg-ice lg:grid-cols-[0.62fr_0.38fr] lg:items-stretch">
          <img
            src="/photography/winter-wildlife-birds.jpg"
            alt="Two birds moving through fresh snow in Howard County"
            className="h-full min-h-[320px] w-full object-cover"
            loading="lazy"
          />
          <figcaption className="flex flex-col justify-center p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Begin with observation</p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-ink">Look closely at what the weather is doing now.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Fresh snow, changing visibility, wind movement, melting, and refreezing are local clues. Pair what you observe with official measurements before drawing a conclusion.
            </p>
          </figcaption>
        </figure>
      </section>

      <section id="forecast" className="scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Guide 01" title="Read the whole forecast.">A weather icon or snowfall map never tells the full story. Use multiple official products and identify what is known, what is uncertain, and when conditions matter most.</SectionHeading>
        <div className="mt-9 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ol>
            <Step number="1" title="Start with official alerts">Read the full National Weather Service alert for timing, location, hazards, and recommended action.</Step>
            <Step number="2" title="Read the hourly forecast">Track temperature, precipitation chance, wind, and weather type. Watch transitions near 32°F.</Step>
            <Step number="3" title="Check the forecast discussion">The Area Forecast Discussion explains reasoning, model disagreement, confidence, and forecast problems.</Step>
            <Step number="4" title="Compare updates, not isolated runs">Look for trends across several forecasts. One dramatic model image is a possibility, not proof.</Step>
            <Step number="5" title="Write down uncertainty">Use ranges and conditional language: “Most guidance supports 1–3 inches, but a colder track could raise totals.”</Step>
          </ol>
          <div className="bg-blue-50/70 p-6 sm:p-8">
            <Radar className="h-7 w-7 text-bay" /><h3 className="mt-5 text-2xl font-black text-ink">What does a 40% precipitation chance mean?</h3>
            <p className="mt-3 leading-7 text-slate-700">For your forecast point, it means there is a 40% chance of measurable precipitation during the stated period. It does not mean rain will fall for 40% of the day, and it does not describe intensity.</p>
            <div className="mt-6 border-t border-blue-200 pt-5"><h4 className="font-bold text-ink">Ask these four questions</h4><ul className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{["What type of precipitation is expected?", "When will it begin, peak, change type, and end?", "What impacts are likely, and where?", "How confident are forecasters?"].map((question) => <li key={question} className="flex gap-2"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-bay" /> {question}</li>)}</ul></div>
          </div>
        </div>
        <figure className="mt-10 grid items-center gap-8 bg-white/80 p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <img
            src="https://www.weather.gov/images/wrn/Infographics/winter_forecast_challenges.png"
            alt="National Weather Service infographic explaining five things to know about winter weather forecasts"
            className="mx-auto max-h-[650px] w-full object-contain"
            loading="lazy"
          />
          <figcaption className="text-sm leading-6 text-slate-600">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Forecasts evolve</p>
            <h3 className="mt-2 text-2xl font-black text-ink">Focus on the range of outcomes.</h3>
            <p className="mt-4">Winter forecasts can change as new observations enter the models. Follow the trend, consider impacts, and avoid treating one exact snowfall number as a guarantee.</p>
            <a href="https://www.weather.gov/wrn/winter_hazard_infographics" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center font-bold text-bay hover:underline">Source: NOAA National Weather Service <ExternalLink className="ml-1 h-3 w-3" /></a>
          </figcaption>
        </figure>
      </section>

      <section id="winter" className="scroll-mt-24 bg-blue-50/45 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Guide 02" title="Know what is falling and what it will hit.">Winter impacts depend on the temperature profile, pavement temperature, precipitation rate, and previous weather. Snow totals alone do not measure travel risk.</SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {precipitationTypes.map(({ title, icon: Icon, definition, impact }) => <article key={title} className="bg-white/75 p-6"><Icon className="h-6 w-6 text-bay" /><h3 className="mt-4 text-xl font-black text-ink">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{definition}</p><p className="mt-4 pt-2 text-sm font-semibold leading-6 text-slate-700">{impact}</p></article>)}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <figure className="overflow-hidden bg-white/80 p-4">
            <img src="https://www.weather.gov/images/wrn/Infographics/winter_precipitation.png" alt="National Weather Service diagram comparing snow, sleet, freezing rain, and rain" className="aspect-[4/3] w-full object-contain" loading="lazy" />
            <figcaption className="px-2 py-3 text-xs leading-5 text-slate-500">How warm and cold layers determine precipitation type. <a href="https://www.weather.gov/wrn/winter_hazard_infographics" target="_blank" rel="noreferrer" className="font-bold text-bay hover:underline">Source: NOAA National Weather Service</a></figcaption>
          </figure>
          <figure className="overflow-hidden bg-white/80 p-4">
            <img src="https://www.weather.gov/images/wrn/Infographics/2021/ww-winter.png" alt="National Weather Service infographic comparing a Winter Storm Watch and Winter Storm Warning" className="aspect-[4/3] w-full object-contain" loading="lazy" />
            <figcaption className="px-2 py-3 text-xs leading-5 text-slate-500">A watch means prepare; a warning means take action. <a href="https://www.weather.gov/wrn/winter_hazard_infographics" target="_blank" rel="noreferrer" className="font-bold text-bay hover:underline">Source: NOAA National Weather Service</a></figcaption>
          </figure>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><h3 className="text-2xl font-black text-ink">The alert ladder</h3><p className="mt-3 leading-7 text-slate-600">Alert criteria vary by location. Always read the product issued by the local National Weather Service office.</p></div><div className="space-y-3">{alertLevels.map((level) => <div key={level.label} className="grid gap-2 bg-white/70 px-5 py-4 sm:grid-cols-[7rem_7rem_1fr]"><strong className="text-lg text-ink">{level.label}</strong><span className="text-sm font-bold uppercase tracking-wide text-bay">{level.action}</span><p className="text-sm leading-6 text-slate-600">{level.text}</p></div>)}</div></div>
      </section>

      <section id="school" className="scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Guide 03" title="Evaluate the school day, not just the storm total.">A school-operation forecast is a transportation and timing question. Consider buses, walkers, staff travel, neighborhood roads, parking lots, and treatment time.</SectionHeading>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{schoolFactors.map(({ title, icon: Icon, text }) => <article key={title} className="bg-blue-50/55 p-6"><Icon className="h-6 w-6 text-bay" /><h3 className="mt-4 text-xl font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>)}</div>
        <figure className="mt-10 grid overflow-hidden bg-white/80 p-5 sm:p-8 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
          <img src="https://www.weather.gov/images/wrn/Infographics/2020/bridges-freeze-first-2020.png" alt="National Weather Service infographic explaining why bridges freeze before other roads" className="h-full max-h-[620px] w-full object-contain" loading="lazy" />
          <figcaption className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wide text-bay">Road science</p>
            <h3 className="mt-2 text-2xl font-black text-ink">Why do bridges freeze first?</h3>
            <p className="mt-4 leading-7 text-slate-600">Cold air can circulate above and below a bridge deck, allowing it to lose heat faster than a road resting on comparatively warmer ground. Shaded sections can also remain icy after nearby pavement improves.</p>
            <a href="https://www.weather.gov/wrn/winter_hazard_infographics" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-bay hover:underline">Source: NOAA National Weather Service <ExternalLink className="h-3.5 w-3.5" /></a>
          </figcaption>
        </figure>
        <div className="mt-9 grid gap-6 bg-navy p-6 text-white sm:p-8 lg:grid-cols-3">
          <div><p className="text-sm font-bold uppercase tracking-wide text-blue-200">Before 5 AM</p><h3 className="mt-2 text-xl font-black">What happened overnight?</h3><p className="mt-2 text-sm leading-6 text-blue-100">Check observed temperatures, radar, precipitation type, road reports, and whether the forecast verified.</p></div>
          <div><p className="text-sm font-bold uppercase tracking-wide text-blue-200">5–9 AM</p><h3 className="mt-2 text-xl font-black">What will buses encounter?</h3><p className="mt-2 text-sm leading-6 text-blue-100">Focus on active precipitation, refreezing, visibility, wind, and whether treatment can keep up.</p></div>
          <div><p className="text-sm font-bold uppercase tracking-wide text-blue-200">After 9 AM</p><h3 className="mt-2 text-xl font-black">Will conditions improve?</h3><p className="mt-2 text-sm leading-6 text-blue-100">Consider rising temperatures, ending precipitation, melting, additional rounds, and dismissal timing.</p></div>
        </div>
        <aside className="mt-6 flex gap-4 border-l-4 border-warning bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p>A weather-based prediction cannot account for every operational factor or know a school district&apos;s final decision. Separate official status from analysis and update immediately when official information is released.</p></aside>
      </section>

      <section id="briefing" className="scroll-mt-24 bg-blue-50/45 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Guide 04" title="Build a briefing people can trust.">The goal is not to sound certain. Explain the evidence clearly enough that someone understands the likely outcome, important alternatives, and what to monitor next.</SectionHeading>
        <div className="mt-9 grid gap-8 lg:grid-cols-2">
          <div><h3 className="text-2xl font-black text-ink">A five-part briefing</h3><ol className="mt-4"><Step number="1" title="Headline">State the main expected weather and impact in one sentence.</Step><Step number="2" title="Timing">Give start, peak, transition, and end windows. Name the school-day period affected.</Step><Step number="3" title="Hazards">Describe snow, ice, wind, cold, flooding, or visibility. Do not focus on totals alone.</Step><Step number="4" title="Confidence">Explain what guidance agrees on and what could still change.</Step><Step number="5" title="Next update">Tell readers when new data or an updated forecast will be available.</Step></ol></div>
          <div className="bg-white/85 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-wide text-bay">Sample student briefing</p><h3 className="mt-3 text-2xl font-black text-ink">Light snow may affect Tuesday morning travel.</h3><p className="mt-4 leading-7 text-slate-700">Snow is most likely between 4 AM and 9 AM. Forecast totals remain in the 1–3 inch range, but temperatures near freezing create uncertainty about road accumulation.</p><dl className="mt-6 space-y-2 text-sm"><div className="grid gap-1 bg-blue-50/60 px-4 py-3 sm:grid-cols-[8rem_1fr]"><dt className="font-bold text-ink">Main concern</dt><dd className="text-slate-600">Untreated roads during the early commute</dd></div><div className="grid gap-1 bg-blue-50/60 px-4 py-3 sm:grid-cols-[8rem_1fr]"><dt className="font-bold text-ink">Confidence</dt><dd className="text-slate-600">Medium; timing is clearer than accumulation</dd></div><div className="grid gap-1 bg-blue-50/60 px-4 py-3 sm:grid-cols-[8rem_1fr]"><dt className="font-bold text-ink">Watch next</dt><dd className="text-slate-600">Overnight temperatures and the 9 PM update</dd></div></dl></div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2"><div className="border-t-4 border-emerald-500 bg-emerald-50 p-6"><h3 className="font-black text-emerald-950">Use</h3><p className="mt-2 text-sm leading-6 text-emerald-900">Likely, possible, confidence, range, timing window, main concern, current evidence, next update.</p></div><div className="border-t-4 border-red-500 bg-red-50 p-6"><h3 className="font-black text-red-950">Avoid</h3><p className="mt-2 text-sm leading-6 text-red-900">Guaranteed, confirmed before an official announcement, worst-case maps without context, and old forecasts presented as current.</p></div></div>
      </section>

      <section id="practice" className="scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Guide 05" title="Practice: make the call, then explain it.">Use this fictional scenario to practice evidence-based reasoning. There is no perfect answer; your explanation should match the evidence and acknowledge uncertainty.</SectionHeading>
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-blue-50 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-wide text-bay">Scenario</p><h3 className="mt-2 text-2xl font-black text-ink">A winter system approaches Howard County.</h3><ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700"><li><strong>3 AM:</strong> Rain changes to freezing rain.</li><li><strong>5 AM:</strong> Temperature falls from 33°F to 30°F.</li><li><strong>6–9 AM:</strong> Light freezing rain continues before changing to snow.</li><li><strong>Forecast:</strong> Trace to 0.10 inch of ice, followed by less than one inch of snow.</li><li><strong>Confidence:</strong> Medium; the transition could occur one to two hours later.</li></ul></div>
          <div><h3 className="text-2xl font-black text-ink">Your forecast worksheet</h3><ol className="mt-4"><Step number="1" title="Identify the primary hazard">Which matters more: snow total, ice, or temperature trend? Explain why.</Step><Step number="2" title="Connect weather to timing">Which part of the school day overlaps with the worst conditions?</Step><Step number="3" title="Choose a prediction">Would you select normal operations likely, delay possible, closure possible, or monitor conditions?</Step><Step number="4" title="State confidence">What supports your choice, and what forecast change could alter it?</Step><Step number="5" title="Write the update">Summarize your reasoning in three sentences without claiming to know the official decision.</Step></ol></div>
        </div>
      </section>

      <section className="bg-white/60 px-5 py-12 sm:px-8 sm:py-16">
        <SectionHeading eyebrow="Official resources" title="Go to the source.">Use official observations, forecasts, alerts, and discussions as the foundation of your analysis. Social media can help you discover information, but it should not replace the original source.</SectionHeading>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Resource href="https://www.weather.gov/lwx/" icon={<Map className="h-5 w-5 text-bay" />} title="NWS Baltimore/Washington">Local forecasts, alerts, discussions, and climate information.</Resource>
          <Resource href="https://radar.weather.gov/" icon={<Radar className="h-5 w-5 text-bay" />} title="NWS Radar">Observe precipitation location, movement, and intensity.</Resource>
          <Resource href="https://www.wpc.ncep.noaa.gov/" icon={<CloudRain className="h-5 w-5 text-bay" />} title="Weather Prediction Center">National precipitation, winter weather, and rainfall guidance.</Resource>
          <Resource href="https://www.weather.gov/safety/winter" icon={<School className="h-5 w-5 text-bay" />} title="Winter Weather Safety">Official definitions, preparation guidance, and safety actions.</Resource>
        </div>
      </section>

      <aside className="flex gap-4 border-l-4 border-bay bg-white px-5 py-5 text-sm leading-6 text-slate-600"><CloudSnow className="mt-0.5 h-5 w-5 shrink-0 text-bay" /><p>This guide is educational and does not replace official alerts, emergency instructions, or school-operation announcements. Follow the National Weather Service, local authorities, and the applicable school district during hazardous weather.</p></aside>
    </main>
  );
}

function Resource({ href, icon, title, children }: { href: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="group bg-blue-50/60 p-5 transition duration-300 hover:-translate-y-1 hover:bg-blue-50">{icon}<h3 className="mt-4 font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{children}</p><ExternalLink className="mt-4 h-4 w-4 text-bay" /></a>;
}
