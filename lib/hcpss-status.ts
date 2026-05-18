import * as cheerio from "cheerio";
import type { HcpssStatus } from "./types";

const HCPSS_STATUS_URL = "https://status.hcpss.org/";
const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedStatus: { value: HcpssStatus; expiresAt: number } | null = null;

function parseStatusHeading(heading: string) {
  const match = heading.match(/^([A-Z][a-z]+ \d{1,2}, \d{4})\s+(.+)$/);

  return {
    updateDate: match?.[1] ?? null,
    operationStatus: match?.[2]?.trim() ?? heading.trim()
  };
}

function parseStatusFromPlainText(text: string): Omit<HcpssStatus, "sourceUrl" | "fetchedAt"> | null {
  const normalized = text.replace(/\s+/g, " ").trim();
  const headingMatch = normalized.match(
    /([A-Z][a-z]+ \d{1,2}, \d{4})\s+(Normal Operations|Schools Closed|Two-Hour Delay|Early Dismissal|Liberal Leave|Code [A-Z][^\.\n]*)/i
  );

  if (!headingMatch) {
    return null;
  }

  const heading = `${headingMatch[1]} ${headingMatch[2]}`.trim();
  const parsedHeading = parseStatusHeading(heading);
  const messageStart = headingMatch.index ? headingMatch.index + headingMatch[0].length : heading.length;
  const message = normalized
    .slice(messageStart)
    .replace(/View HCPSS Calendar.*$/i, "")
    .replace(/Employee Work Groups.*$/i, "")
    .trim();

  return {
    heading,
    updateDate: parsedHeading.updateDate,
    operationStatus: parsedHeading.operationStatus,
    message
  };
}

export function parseHcpssStatusPage(html: string): Omit<HcpssStatus, "sourceUrl" | "fetchedAt"> {
  const $ = cheerio.load(html);
  const statusBlock = $("#status-block").first();

  // The official page places the current operations heading directly after
  // the "Important Status Message" heading.
  const importantHeading = $("h1, h2, h3")
    .filter((_, element) => $(element).text().trim().toLowerCase() === "important status message")
    .first();

  const currentHeadingElement = statusBlock.find("h1, h2, h3").not(".visually-hidden").first().length
    ? statusBlock.find("h1, h2, h3").not(".visually-hidden").first()
    : importantHeading.nextAll("h1, h2, h3").first();
  const heading = currentHeadingElement
    .find("span")
    .map((_, element) => $(element).text().replace(/\s+/g, " ").trim())
    .get()
    .join(" ")
    .replace(/\s+/g, " ")
    .trim() || currentHeadingElement.text().replace(/\s+/g, " ").trim();

  if (!heading) {
    const textFallback = parseStatusFromPlainText($.text());
    if (textFallback) {
      return textFallback;
    }

    throw new Error("Could not find the HCPSS current status heading.");
  }

  let messageParts = statusBlock.length
    ? statusBlock
        .find("p")
        .filter((_, element) => $(element).find("a[href*='calendar']").length === 0)
        .map((_, element) => $(element).text().replace(/\s+/g, " ").trim())
        .get()
        .filter(Boolean)
    : [];

  if (messageParts.length === 0) {
    messageParts = [];
    let cursor = currentHeadingElement.next();

    while (cursor.length && !["H1", "H2", "H3"].includes(cursor.prop("tagName") ?? "")) {
      const text = cursor.text().replace(/\s+/g, " ").trim();
      const isCalendarLink = cursor.find("a[href*='calendar']").length > 0;
      if (text && !isCalendarLink) {
        messageParts.push(text);
      }
      cursor = cursor.next();
    }
  }

  const parsedHeading = parseStatusHeading(heading);

  return {
    heading,
    updateDate: parsedHeading.updateDate,
    operationStatus: parsedHeading.operationStatus,
    message: messageParts.join(" "),
  };
}

export async function getHcpssStatus(): Promise<HcpssStatus> {
  const now = Date.now();

  if (cachedStatus && cachedStatus.expiresAt > now) {
    return cachedStatus.value;
  }

  const response = await fetch(HCPSS_STATUS_URL, {
    headers: {
      "User-Agent": "HCPSS school operations weather app; educational local project"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`HCPSS status page returned ${response.status}.`);
  }

  const parsed = parseHcpssStatusPage(await response.text());
  const value: HcpssStatus = {
    ...parsed,
    sourceUrl: HCPSS_STATUS_URL,
    fetchedAt: new Date().toISOString()
  };

  cachedStatus = {
    value,
    expiresAt: now + CACHE_TTL_MS
  };

  return value;
}
