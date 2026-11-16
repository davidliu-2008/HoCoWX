import Link from "next/link";

type Partnership = {
  id: string;
  category: string;
  name: string;
  summary: string;
  logo: string;
  logoAlt: string;
  panelClass: string;
  logoClass: string;
  description: string;
  details: Array<{ label: string; value: string }>;
  href?: string;
  linkLabel?: string;
};

const partnerships: Partnership[] = [
  {
    id: "hcpss",
    category: "School system",
    name: "Howard County Public School System",
    summary: "A multi-year collaboration connecting student weather communication with the district community.",
    logo: "/partners/hcpss-logo.png",
    logoAlt: "Howard County Public School System",
    panelClass: "bg-[#d8ebff] text-slate-950",
    logoClass: "max-h-16 w-full object-contain mix-blend-multiply",
    description: "HoCo Weather Channel works with HCPSS to develop weather information and literacy resources, contribute student analysis to weather-related discussions, and distribute useful environmental news through district channels.",
    details: [
      { label: "Community", value: "80,000 students, staff, and parents" },
      { label: "Work", value: "Weather literacy and school-impact communication" }
    ]
  },
  {
    id: "capital-weather",
    category: "Weather company",
    name: "Capital Weather",
    summary: "Detailed forecasting translated into clearer school and community impacts.",
    logo: "/partners/capital-weather-logo.png",
    logoAlt: "Capital Weather",
    panelClass: "bg-[#cfe8ff] text-slate-950",
    logoClass: "max-h-20 w-full object-contain mix-blend-multiply",
    description: "The collaboration expands the reach of both weather communities, translates detailed forecasts into direct explanations of timing and school impacts, and strengthens communication during severe weather events.",
    details: [
      { label: "Focus", value: "Severe-weather communication" },
      { label: "Translation", value: "Forecast detail into school impacts" },
      { label: "Development", value: "A stronger prediction model system" }
    ]
  },
  {
    id: "visual-crossing",
    category: "Weather data provider",
    name: "Visual Crossing Weather",
    summary: "Professional weather data infrastructure supporting research, analysis, and model development.",
    logo: "/attribution/visual-crossing-weather.png",
    logoAlt: "Powered by Visual Crossing Weather",
    panelClass: "bg-[#e7f3ff] text-slate-950",
    logoClass: "max-h-14 w-full object-contain",
    description: "Visual Crossing supports HoCo Weather Channel with unrestricted access to its professional weather-data platform, including historical records, current conditions, forecasts, downloadable datasets, API tools, and weather-risk monitoring.",
    details: [
      { label: "Coverage", value: "Historical, current, and forecast weather" },
      { label: "Tools", value: "API, query builder, and downloadable datasets" },
      { label: "Use", value: "Forecast research and model validation" }
    ],
    href: "https://www.visualcrossing.com/",
    linkLabel: "Visit Visual Crossing"
  }
];

export function PartnershipSelector({ homepage = false }: { homepage?: boolean }) {
  const visiblePartners = partnerships;

  return (
    <div className={homepage ? "space-y-4" : "space-y-4 px-5 py-8 sm:px-8 lg:px-12 lg:py-10"}>
      {visiblePartners.map((partner) => <PartnershipRow key={partner.id} partner={partner} />)}
      {homepage ? (
        <div className="pt-3 text-center">
          <Link href="/partnerships" className="inline-flex min-h-12 items-center bg-navy px-6 py-3 font-bold text-white transition hover:bg-blue-900">
            Explore all partnerships
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function PartnershipRow({ partner }: { partner: Partnership }) {
  return (
    <article id={partner.id} className="mx-auto grid max-w-[1500px] overflow-hidden rounded-lg border border-slate-200 bg-white lg:min-h-[300px] lg:grid-cols-[0.82fr_1.18fr_1fr]">
      <div className={`flex flex-col justify-between p-6 sm:p-8 ${partner.panelClass}`}>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide opacity-70">{partner.category}</p>
          <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{partner.name}</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 opacity-80 sm:text-base">{partner.summary}</p>
        </div>
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold opacity-65">In partnership with</p>
          <div className="flex min-h-16 items-center justify-start">
            <img src={partner.logo} alt={partner.logoAlt} className={partner.logoClass} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between border-slate-200 p-6 sm:p-8 lg:border-r">
        <div>
          <h3 className="text-2xl font-black leading-tight text-ink sm:text-3xl">{partner.name}</h3>
          <p className="mt-4 text-base leading-7 text-slate-600">{partner.description}</p>
        </div>
        {partner.href ? (
          <a href={partner.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-10 w-fit items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">
            {partner.linkLabel}
          </a>
        ) : null}
      </div>

      <dl className="divide-y divide-slate-200 p-6 sm:p-8">
        {partner.details.map((detail) => (
          <div key={detail.label} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-semibold text-slate-500">{detail.label}</dt>
            <dd className="mt-1.5 text-lg font-black leading-snug text-ink">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
