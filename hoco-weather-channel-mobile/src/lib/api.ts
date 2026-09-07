import { appConfig } from "@/config/appConfig";
import type { HcpssStatus, MarylandOperationStatus, PredictionResult, WeatherSummary } from "@/types/api";

type MarylandResponse = {
  statuses: MarylandOperationStatus[];
  note?: string;
};

const requiredMarylandCounties: MarylandOperationStatus[] = [
  {
    county: "Howard County",
    district: "Howard County Public School System",
    statusUrl: "https://status.hcpss.org/",
    status: "Unknown",
    statusKind: "unknown",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "authoritative"
  },
  {
    county: "Montgomery County",
    district: "Montgomery County Public Schools",
    statusUrl: "https://www.montgomeryschoolsmd.org/emergency/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Baltimore County",
    district: "Baltimore County Public Schools",
    statusUrl: "https://www.bcps.org/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Anne Arundel County",
    district: "Anne Arundel County Public Schools",
    statusUrl: "https://www.aacps.org/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Carroll County",
    district: "Carroll County Public Schools",
    statusUrl: "https://www.carrollk12.org/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Frederick County",
    district: "Frederick County Public Schools",
    statusUrl: "https://www.fcps.org/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Prince George's County",
    district: "Prince George's County Public Schools",
    statusUrl: "https://www.pgcps.org/",
    status: "Normal Operations",
    statusKind: "normal",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "county-specific"
  },
  {
    county: "Baltimore City",
    district: "Baltimore City Public Schools",
    statusUrl: "https://www.baltimorecityschools.org/",
    status: "Unknown",
    statusKind: "unknown",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "experimental"
  },
  {
    county: "Harford County",
    district: "Harford County Public Schools",
    statusUrl: "https://www.hcps.org/",
    status: "Unknown",
    statusKind: "unknown",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "experimental"
  },
  {
    county: "Cecil County",
    district: "Cecil County Public Schools",
    statusUrl: "https://www.ccps.org/",
    status: "Unknown",
    statusKind: "unknown",
    lastUpdated: null,
    checkedAt: new Date().toISOString(),
    parserType: "experimental"
  }
];

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function mergeMarylandStatuses(statuses: MarylandOperationStatus[]) {
  const liveByCounty = new Map(statuses.map((status) => [status.county, status]));

  return requiredMarylandCounties.map((fallback) => liveByCounty.get(fallback.county) ?? fallback);
}

export const api = {
  getHcpssStatus: () => fetchJson<HcpssStatus>("/api/hcpss-status"),
  getWeather: () => fetchJson<WeatherSummary>("/api/weather"),
  getPrediction: () => fetchJson<PredictionResult>("/api/prediction"),
  async getMarylandStatuses() {
    const response = await fetchJson<MarylandResponse>("/api/maryland-operations");
    return mergeMarylandStatuses(response.statuses);
  },
  async getDashboardData() {
    const [hcpss, weather, prediction, maryland] = await Promise.all([
      api.getHcpssStatus(),
      api.getWeather(),
      api.getPrediction(),
      api.getMarylandStatuses()
    ]);

    return { hcpss, weather, prediction, maryland };
  }
};
