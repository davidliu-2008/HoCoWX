import Link from "next/link";

type Partnership = {
  id: string;
  category: string;
  name: string;
  summary: string;
  logo: string;
  logoAlt: string;
  panelClass: string;
  logoFrameClass: string;
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
    summary: "Student weather communication connected directly with the district community.",
    logo: "/partners/hcpss-logo-cropped.png",
    logoAlt: "Howard County Public School System",
    panelClass: "bg-[#b9d7ff] text-slate-950",
    logoFrameClass: "h-16 w-52 max-w-full",
    logoClass: "h-full w-full object-contain object-left mix-blend-multiply",
    description: "Developing weather literacy resources, contributing student analysis to operations conversations, and distributing environmental news through district channels.",
    details: [
      { label: "Community", value: "80,000 students, staff, and parents" },
      { label: "Work", value: "Weather literacy and school-impact communication" },
      { label: "Distribution", value: "HCPSS student and community channels" }
    ]
  },
  {
    id: "capital-weather",
    category: "Weather company",
    name: "Capital Weather",
    summary: "Detailed forecasts translated into clear school and community impacts.",
    logo: "/partners/capital-weather-logo.png",
    logoAlt: "Capital Weather",
    panelClass: "bg-[#d7ebff] text-slate-950",
    logoFrameClass: "h-20 w-32",
    logoClass: "h-full w-full object-contain mix-blend-multiply",
    description: "Translating detailed forecasts into school impacts and expanding severe-weather communication across both audiences.",
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
    summary: "Professional weather data for research, analysis, and model development.",
    logo: "/attribution/visual-crossing-weather.png",
    logoAlt: "Powered by Visual Crossing Weather",
    panelClass: "bg-[#edf6ff] text-slate-950",
    logoFrameClass: "h-14 w-52 max-w-full",
    logoClass: "h-full w-full object-contain",
    description: "Providing historical, current, and forecast data for research, model development, validation, and weather-risk analysis.",
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
    <div className={homepage ? "space-y-4" : "page-content space-y-4 py-8 sm:py-10"}>
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
    <article id={partner.id} className="mx-auto grid w-full max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-xl border border-slate-200 bg-white sm:max-w-[calc(100vw-4rem)] min-[900px]:min-h-[300px] min-[900px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1fr)] lg:max-w-[min(1500px,calc(100vw-6rem))]">
      <div className={`min-w-0 flex flex-col justify-between p-6 xl:p-8 ${partner.panelClass}`}>
        <div>
          <h2 className="text-2xl font-normal leading-tight">{partner.category}</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 opacity-80 sm:text-base">{partner.summary}</p>
        </div>
        <div className="mt-8">
          <p className="mb-3 text-sm font-semibold opacity-65">In partnership with</p>
          <div className={`flex items-center justify-start ${partner.logoFrameClass}`}>
            <img src={partner.logo} alt={partner.logoAlt} className={partner.logoClass} />
          </div>
        </div>
      </div>

      <div className="min-w-0 flex flex-col justify-between border-slate-200 p-6 min-[900px]:border-r xl:p-8">
        <div>
          <h3 className="text-2xl font-medium leading-tight text-ink">{partner.name}</h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{partner.description}</p>
        </div>
        {partner.href ? (
          <a href={partner.href} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-10 w-fit items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">
            {partner.linkLabel}
          </a>
        ) : null}
      </div>

      <dl className="min-w-0 divide-y divide-slate-200 p-6 xl:p-8">
        {partner.details.map((detail) => (
          <div key={detail.label} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-sm font-semibold text-slate-500">{detail.label}</dt>
            <dd className="mt-1.5 break-words text-base font-semibold leading-snug text-ink">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
