export function PartnershipSelector() {
  return (
    <div className="px-5 py-8 sm:px-8 sm:py-12">
      <HcpssPartnership />
      <CapitalWeatherPartnership />
      <VisualCrossingSponsorship />
    </div>
  );
}

function HcpssPartnership() {
  return (
    <section>
      <div className="py-8 text-center sm:py-10">
        <p className="text-lg font-bold text-bay sm:text-xl">Howard County Public School System Partnership</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-4xl">Weather information inside the HCPSS experience</h2>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">Through a multi-year agreement with HCPSS, HoCo Weather Channel will be integrated into the district&apos;s official structure, bringing timely environmental news and weather literacy resources to approximately 80,000 students, staff, and parents.</p>
      </div>

      <div className="grid items-start gap-10 py-8 xl:grid-cols-[0.82fr_1.18fr] xl:py-10">
        <div>
          <div className="space-y-7 py-2">
            <PartnershipPoint title="Working with the HCPSS weather team">Developing useful weather information and literacy resources for the school community.</PartnershipPoint>
            <PartnershipPoint title="Contributing to weather-related discussions">Sitting in on operational decision discussions and contributing weather analysis to help determine those decisions.</PartnershipPoint>
            <PartnershipPoint title="Reaching the full HCPSS community">Serving environmental news through familiar district platforms used by students, staff, and parents.</PartnershipPoint>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-bay">Proof of concept</p><h3 className="mt-1 font-bold text-ink">Sample Canvas homepage announcement</h3></div>
            <span className="text-xs font-semibold text-bay">Concept preview</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-white shadow-panel">
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3"><div className="h-8 w-8 bg-red-700" aria-hidden="true" /><div><p className="text-xs text-slate-500">HCPSS Canvas</p><p className="text-sm font-bold text-slate-800">Student Homepage</p></div></div>
            </div>
            <div className="grid md:grid-cols-[0.28fr_0.72fr]">
              <div className="hidden bg-slate-50/70 p-4 md:block"><div className="space-y-3 text-sm text-slate-500"><p className="font-semibold text-slate-800">Home</p><p>Courses</p><p>Calendar</p><p>Resources</p></div></div>
              <div className="p-4 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Special Weather Announcement</p>
                <div className="mt-3 bg-blue-50 p-5">
                  <div><div className="flex flex-wrap items-center gap-2"><h4 className="text-xl font-bold text-ink">Winter weather update</h4><span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-bay">HoCoWX</span></div><p className="mt-2 text-sm leading-6 text-slate-700">A period of winter weather may affect Howard County. Review the latest timing, impacts, and safety information before travel.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-600"><span>Timing: Overnight into morning</span><span>Primary concern: Icy roads</span></div><span className="mt-4 inline-block bg-bay px-4 py-2 text-sm font-bold text-white">View weather update</span></div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Sample layout for discussion purposes. Final placement and language will be developed with HCPSS.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapitalWeatherPartnership() {
  return (
    <section className="py-12 sm:py-16">
      <div className="text-center">
        <p className="text-lg font-bold text-bay sm:text-xl">Capital Weather Partnership</p>
        <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-4xl">Connecting detailed forecasts to the decisions students feel.</h2>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          HoCo Weather Channel and Capital Weather are working together to expand both audiences, translate detailed forecasts into clear school impacts, and strengthen severe-weather communication.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <CapitalWeatherPoint title="Growing both audiences">
          Sharing trusted weather information across both communities so more students and families can reach useful local forecasts.
        </CapitalWeatherPoint>
        <CapitalWeatherPoint title="Clear school impact communication">
          Turning detailed forecasts into direct explanations of timing, travel conditions, and possible effects on the school day during severe weather.
        </CapitalWeatherPoint>
        <CapitalWeatherPoint title="Stronger prediction models">
          Combining forecasting experience and school-impact analysis to continue improving the prediction model system.
        </CapitalWeatherPoint>
      </div>
    </section>
  );
}

function VisualCrossingSponsorship() {
  return (
    <section className="py-12 text-center sm:py-16">
      <p className="text-lg font-bold text-bay sm:text-xl">Visual Crossing Weather Data Sponsorship</p>
      <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-ink sm:text-4xl">More weather data for deeper student analysis.</h2>
      <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
        Visual Crossing sponsors HoCo Weather Channel by providing complimentary access to its paid professional weather-data platform. Its current conditions, forecasts, and historical weather records support forecast research, model development, and clearer explanations of how past and upcoming conditions may affect schools and communities.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        <CapitalWeatherPoint title="Historical weather research">
          Comparing past storms, temperatures, snowfall, and school-day impacts to identify useful patterns.
        </CapitalWeatherPoint>
        <CapitalWeatherPoint title="Forecast development">
          Using broader weather datasets to test assumptions and strengthen school-operation predictions.
        </CapitalWeatherPoint>
        <CapitalWeatherPoint title="Student weather literacy">
          Giving students more evidence to explore trends, compare forecasts, and understand local weather risk.
        </CapitalWeatherPoint>
      </div>

    </section>
  );
}

function CapitalWeatherPoint({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="text-center">
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
    </article>
  );
}

function PartnershipPoint({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}
