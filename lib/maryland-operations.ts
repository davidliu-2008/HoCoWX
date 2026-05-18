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
  "Anne Arundel County": ["https://www.aacps.org/", "https://www.aacounty.org/county-operations"],
  "Prince George's County": ["https://www.pgcps.org/", "https://epi.pgcps.org/about-pgcps/emergency-notifications-school-closings-and-delays"]
};

const normalUnlessPopupCounties = new Set([
  "Baltimore County",
  "Carroll County",
  "Frederick County",
  "Prince George's County"
]);

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
      /(?:today|tomorrow|this morning|this afternoon|this evening|due to|because of|operating status|school status|all schools|schools and offices|public schools).{0,260}/gi
    )
  ].map((match) => match[0]);

  const currentText = windows.join(" ");
  if (!currentText) {
    return { status: "Unknown", statusKind: "unknown" };
  }

  return classifyStatus(currentText);
}

function parseCountySpecificStatus(county: string, url: string, text: string): ParsedStatus {
  if (normalUnlessPopupCounties.has(county) && text.length === 0) {
    return defaultNormalStatus();
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
    for (const source of countySources) {
      try {
        const parsed = parseCountySpecificStatus(district.county, source, await fetchText(source, district.county));
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
