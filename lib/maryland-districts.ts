export type MarylandDistrict = {
  county: string;
  district: string;
  statusUrl: string;
  priority?: number;
};

export const marylandDistricts: MarylandDistrict[] = [
  {
    county: "Howard County",
    district: "Howard County Public School System",
    statusUrl: "https://status.hcpss.org/",
    priority: 1
  },
  {
    county: "Montgomery County",
    district: "Montgomery County Public Schools",
    statusUrl: "https://www.montgomeryschoolsmd.org/emergency/",
    priority: 2
  },
  {
    county: "Baltimore County",
    district: "Baltimore County Public Schools",
    statusUrl: "https://www.bcps.org/about_us/emergency_notifications_school_closings_and_delays",
    priority: 3
  },
  {
    county: "Anne Arundel County",
    district: "Anne Arundel County Public Schools",
    statusUrl: "https://www.aacounty.org/county-operations",
    priority: 4
  },
  {
    county: "Carroll County",
    district: "Carroll County Public Schools",
    statusUrl: "https://www.carrollk12.org/operation/transportation-services/inclement-weather",
    priority: 5
  },
  {
    county: "Frederick County",
    district: "Frederick County Public Schools",
    statusUrl: "https://www.fcps.org/weather",
    priority: 6
  },
  {
    county: "Prince George's County",
    district: "Prince George's County Public Schools",
    statusUrl: "https://epi.pgcps.org/about-pgcps/emergency-notifications-school-closings-and-delays",
    priority: 7
  }
].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || a.county.localeCompare(b.county));
