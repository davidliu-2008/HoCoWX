import * as cheerio from "cheerio";
import { getHcpssStatus } from "./hcpss-status";
import { marylandDistricts, type MarylandDistrict } from "./maryland-districts";

export type OperationStatusKind = "normal" | "delay" | "closed" | "virtual" | "unknown";

export type MarylandOperationStatus = MarylandDistrict & {
  status: string;
  statusKind: OperationStatusKind;
  lastUpdated: string | null;
  checkedAt: string;
  experimental: boolean;
  parserType: "authoritative" | "county-specific" | "experimental";
  matchedText?: string;
};

const CACHE_TTL_MS = 30 * 60 * 1000;
const FETCH_TIMEOUT_MS = 4500;

let cachedComparison: { value: MarylandOperationStatus[]; expiresAt: number } | null = null;

type ParsedStatus = Pick<MarylandOperationStatus, "status" | "statusKind" | "matchedText">;

const countySpecificSources: Record<string, string[]> = {
  "Montgomery County": ["https://www.montgomeryschoolsmd.org/", "https://www.montgomeryschoolsmd.org/emergency/"],
  "Frederick County": ["https://www.fcps.org/", "https://www.fcps.org/weather"],
  "Carroll County": [
    "https://www.carrollk12.org/",
    "https://www.carrollk12.org/operation/transportation-services/inclement-weather"
  ],
  "Baltimore County": ["https://www.bcps.org/", "https://www.bcps.org/about_us/emergency_notifications_school_closings_and_delays"],
  "Anne Arundel County": ["https://www.aacps.org/"],
  "Prince George's County": ["https://www.pgcps.org/", "https://epi.pgcps.org/about-pgcps/emergency-notifications-school-closings-and-delays"],
  "Cecil County": ["https://www.ccps.org/"],
  "Charles County": ["https://www.ccboe.com/"],
  "Harford County": ["https://www.hcps.org/"],
  "Queen Anne's County": ["https://www.qacps.org/"],
  "St. Mary's County": ["https://www.smcps.org/status"]
};

const normalUnlessPopupCounties = new Set([
  "Anne Arundel County",
  "Baltimore County",
  "Carroll County",
  "Cecil County",
  "Charles County",
  "Frederick County",
  "Harford County",
  "Queen Anne's County",
  "Prince George's County"
]);

const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];

function classifyStatus(text: string): ParsedStatus {
  const normalized = text.replace(/\s+/g, " ").toLowerCase();
  const currentish = normalized.slice(0, 5000);

  if (/\b(virtual|remote|asynchronous|modified operations?|code orange)\b/.test(currentish)) {
    return { status: "Virtual / Modified Operations", statusKind: "virtual", matchedText: text.slice(0, 220) };
  }

  if (/\b(closed|schools are closed|code red|code blue|cancelled|canceled)\b/.test(currentish)) {
    return { status: "Closed", statusKind: "closed", matchedText: text.slice(0, 220) };
  }

  if (/\b(delay|delayed|late opening|open \d[- ]?hours? late|two[- ]hour delay|2[- ]hour delay)\b/.test(currentish)) {
    return { status: "Delay", statusKind: "delay", matchedText: text.slice(0, 220) };
  }

  if (/\b(normal operations|open on time|operating on schedule|open and operating|schools are open)\b/.test(currentish)) {
    return { status: "Normal Operations", statusKind: "normal", matchedText: text.slice(0, 220) };
  }

  return { status: "Unknown", statusKind: "unknown" };
}

function extractUsefulText(html: string, county?: string) {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg").remove();

  if (county === "St. Mary's County") {
    return $("a")
      .filter((_, element) => /^schools\s*:/i.test($(element).text().trim()))
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();
  }

  if (county && normalUnlessPopupCounties.has(county)) {
    const popupText = $(
      [
        "[role='alert']",
        "[role='dialog']",
        "[aria-modal='true']",
        "[aria-live]",
        "[class*='alert']",
        "[id*='alert']",
        "[class*='modal']",
        "[id*='modal']",
        "[class*='popup']",
        "[id*='popup']",
        "[class*='banner']",
        "[id*='banner']",
        "[class*='notification']",
        "[id*='notification']",
        "[class*='emergency']",
        "[id*='emergency']"
      ].join(", ")
    )
      .text()
      .replace(/\s+/g, " ")
      .trim();

    return popupText;
  }

  const selectors = [
    "[role='alert']",
    "[aria-live]",
    "[class*='alert']",
    "[id*='alert']",
    "[class*='emergency']",
    "[id*='emergency']",
    "[class*='status']",
    "[id*='status']",
    "[class*='announcement']",
    "[id*='announcement']",
    "main",
    "body"
  ];

  const alertText = $(selectors.join(", "))
    .first()
    .text();

  const text = (alertText || $.text()).replace(/\s+/g, " ").trim();

  if (county === "Anne Arundel County") {
    const countyPageMatch = text.match(/County Closings, Delays, & Alerts(.{0,900}?)(Weather & Alerts|Emergency Information)/i);
    return countyPageMatch?.[1]?.trim() ?? text;
  }

  return text;
}

function classifyExplicitCurrentStatus(text: string): ParsedStatus {
  const normalized = text.replace(/\s+/g, " ").trim();
  const windows = [
    ...normalized.matchAll(
      /(?:today|this morning|this afternoon|this evening|due to|because of|operating status|school status|all schools|schools and offices|public schools).{0,260}/gi
    )
  ]
    .map((match) => match[0])
    .filter((window) => !referencesAnotherDate(window));

  const currentText = windows.join(" ");
  if (!currentText) {
    return { status: "Unknown", statusKind: "unknown" };
  }

  return classifyStatus(currentText);
}

function referencesAnotherDate(text: string) {
  const dates = [
    ...text.toLowerCase().matchAll(
      /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?\b/g
    )
  ];

  if (dates.length === 0) {
    return false;
  }

  const currentParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "numeric",
    day: "numeric"
  }).formatToParts(new Date());
  const currentMonth = Number(currentParts.find((part) => part.type === "month")?.value);
  const currentDay = Number(currentParts.find((part) => part.type === "day")?.value);

  return !dates.some((date) => monthNames.indexOf(date[1]) + 1 === currentMonth && Number(date[2]) === currentDay);
}

function parseCountySpecificStatus(county: string, url: string, text: string): ParsedStatus {
  if (county === "St. Mary's County") {
    const statusMatch = text.match(/schools\s*:\s*([^|]+?)(?:\s+employees\s*:|$)/i)?.[1]?.trim();
    if (!statusMatch) {
      return { status: "Unknown", statusKind: "unknown" };
    }

    if (/^normal$/i.test(statusMatch)) {
      return { status: "Normal Operations", statusKind: "normal", matchedText: text };
    }

    return classifyStatus(`Schools: ${statusMatch}`);
  }

  if (normalUnlessPopupCounties.has(county) && text.length === 0) {
    return defaultNormalStatus();
  }

  if (normalUnlessPopupCounties.has(county)) {
    const normalized = text.replace(/\s+/g, " ").trim();

    // District homepages often place calendars and policy copy inside elements
    // whose class names contain "alert" or "notification." Only treat compact,
    // current notices as operational changes.
    if (referencesAnotherDate(normalized)) {
      return { status: "Unknown", statusKind: "unknown" };
    }

    const hasCurrentMarker = /\b(today|this morning|this afternoon|this evening|currently)\b/i.test(normalized);
    const isCompactOperationsNotice =
      normalized.length <= 500 &&
      /\b(schools?|offices?)\b/i.test(normalized) &&
      /\b(closed|delay(?:ed)?|late opening|early dismissal|virtual|remote|modified operations?|normal operations)\b/i.test(normalized);

    if (hasCurrentMarker || isCompactOperationsNotice) {
      return classifyStatus(normalized);
    }

    return { status: "Unknown", statusKind: "unknown" };
  }

  if (county === "Anne Arundel County") {
    const normalized = text.replace(/\s+/g, " ").trim();
    const schoolNotice = normalized.match(
      /(?:aacps|anne arundel county public schools|all (?:aacps )?schools|schools and offices).{0,300}/i
    )?.[0];

    if (!schoolNotice) {
      return { status: "Unknown", statusKind: "unknown" };
    }

    return classifyStatus(schoolNotice);
  }

  const explicit = classifyExplicitCurrentStatus(text);

  if (explicit.statusKind !== "unknown") {
    return explicit;
  }

  if (
    county === "Frederick County" &&
    /doesn't usually announce that schools are open or operating on schedule/i.test(text) &&
    /if we haven't announced otherwise, schools are open on time/i.test(text)
  ) {
    return {
      status: "Normal Operations",
      statusKind: "normal",
      matchedText: "FCPS states that if it has not announced otherwise, schools are open on time."
    };
  }

  if (county === "Montgomery County" && /Hello World!/i.test(text)) {
    return { status: "Unknown", statusKind: "unknown", matchedText: "MCPS homepage did not expose a current operating status banner." };
  }

  if (/emergency information|emergency notifications|inclement weather|weather delays & closings/i.test(text)) {
    return { status: "Unknown", statusKind: "unknown", matchedText: "Official page contains policy text, but no current operating status." };
  }

  return { status: "Unknown", statusKind: "unknown" };
}

function defaultNormalStatus(): ParsedStatus {
  return {
    status: "Normal Operations",
    statusKind: "normal",
    matchedText: "Defaulted to Normal Operations because no current closure, delay, or modified-operation notice was found."
  };
}

async function fetchText(url: string, county?: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Maryland school operations comparison app; conservative educational status checker"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Status page returned ${response.status}`);
    }

    return extractUsefulText(await response.text(), county);
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDistrictStatus(district: MarylandDistrict): Promise<MarylandOperationStatus> {
  const checkedAt = new Date().toISOString();

  if (district.statusUrl === "https://status.hcpss.org/") {
    try {
      const hcpss = await getHcpssStatus();
      const classified = classifyStatus(`${hcpss.heading} ${hcpss.message}`);
      return {
        ...district,
        status: hcpss.operationStatus || classified.status,
        statusKind: classified.statusKind,
        lastUpdated: hcpss.fetchedAt,
        checkedAt,
        experimental: false,
        parserType: "authoritative",
        matchedText: classified.matchedText
      };
    } catch {
      return {
        ...district,
        status: "Unknown",
        statusKind: "unknown",
        lastUpdated: null,
        checkedAt,
        experimental: false,
        parserType: "authoritative"
      };
    }
  }

  const countySources = countySpecificSources[district.county];
  if (countySources) {
    let reachedOfficialSource = false;

    for (const source of countySources) {
      try {
        const text = await fetchText(source, district.county);
        reachedOfficialSource = true;
        const parsed = parseCountySpecificStatus(district.county, source, text);
        if (parsed.statusKind !== "unknown") {
          return {
            ...district,
            statusUrl: source,
            ...parsed,
            lastUpdated: checkedAt,
            checkedAt,
            experimental: false,
            parserType: "county-specific"
          };
        }
      } catch {
        continue;
      }
    }

    if (!reachedOfficialSource) {
      return {
        ...district,
        status: "Unknown",
        statusKind: "unknown",
        lastUpdated: null,
        checkedAt,
        experimental: false,
        parserType: "county-specific"
      };
    }

    return {
      ...district,
      ...defaultNormalStatus(),
      lastUpdated: checkedAt,
      checkedAt,
      experimental: false,
      parserType: "county-specific"
    };
  }

  try {
    const classified = classifyExplicitCurrentStatus(await fetchText(district.statusUrl, district.county));

    return {
      ...district,
      ...(classified.statusKind === "unknown" ? defaultNormalStatus() : classified),
      lastUpdated: checkedAt,
      checkedAt,
      experimental: true,
      parserType: "experimental"
    };
  } catch {
    return {
      ...district,
      ...defaultNormalStatus(),
      lastUpdated: checkedAt,
      checkedAt,
      experimental: true,
      parserType: "experimental"
    };
  }
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>) {
  const results: R[] = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

export async function getMarylandOperationsComparison() {
  const now = Date.now();

  if (cachedComparison && cachedComparison.expiresAt > now) {
    return cachedComparison.value;
  }

  const value = await mapWithConcurrency(marylandDistricts, 3, fetchDistrictStatus);
  cachedComparison = {
    value,
    expiresAt: now + CACHE_TTL_MS
  };

  return value;
}

export async function getMarylandDistrictStatus(county: string) {
  const district = marylandDistricts.find((item) => item.slug === county);
  return district ? fetchDistrictStatus(district) : null;
}
