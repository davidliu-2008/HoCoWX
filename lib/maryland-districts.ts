export type MarylandDistrict = {
  slug: string;
  county: string;
  district: string;
  statusUrl: string;
  latitude: number;
  longitude: number;
  priority?: number;
};

export const marylandDistricts: MarylandDistrict[] = [
  { slug: "howard", county: "Howard County", district: "Howard County Public School System", statusUrl: "https://status.hcpss.org/", latitude: 39.2673, longitude: -76.7983, priority: 1 },
  { slug: "montgomery", county: "Montgomery County", district: "Montgomery County Public Schools", statusUrl: "https://www.montgomeryschoolsmd.org/emergency/", latitude: 39.1547, longitude: -77.2405, priority: 2 },
  { slug: "baltimore-county", county: "Baltimore County", district: "Baltimore County Public Schools", statusUrl: "https://www.bcps.org/about_us/emergency_notifications_school_closings_and_delays", latitude: 39.407, longitude: -76.603, priority: 3 },
  { slug: "anne-arundel", county: "Anne Arundel County", district: "Anne Arundel County Public Schools", statusUrl: "https://www.aacps.org/", latitude: 39.006, longitude: -76.603, priority: 4 },
  { slug: "carroll", county: "Carroll County", district: "Carroll County Public Schools", statusUrl: "https://www.carrollk12.org/operation/transportation-services/inclement-weather", latitude: 39.563, longitude: -77.016, priority: 5 },
  { slug: "frederick", county: "Frederick County", district: "Frederick County Public Schools", statusUrl: "https://www.fcps.org/weather", latitude: 39.472, longitude: -77.397, priority: 6 },
  { slug: "prince-georges", county: "Prince George's County", district: "Prince George's County Public Schools", statusUrl: "https://epi.pgcps.org/about-pgcps/emergency-notifications-school-closings-and-delays", latitude: 38.829, longitude: -76.848, priority: 7 },
  { slug: "allegany", county: "Allegany County", district: "Allegany County Public Schools", statusUrl: "https://www.acpsmd.org/", latitude: 39.625, longitude: -78.611 },
  { slug: "baltimore-city", county: "Baltimore City", district: "Baltimore City Public Schools", statusUrl: "https://www.baltimorecityschools.org/", latitude: 39.29, longitude: -76.612 },
  { slug: "calvert", county: "Calvert County", district: "Calvert County Public Schools", statusUrl: "https://www.calvertnet.k12.md.us/", latitude: 38.539, longitude: -76.568 },
  { slug: "caroline", county: "Caroline County", district: "Caroline County Public Schools", statusUrl: "https://www.carolineschools.org/", latitude: 38.871, longitude: -75.831 },
  { slug: "cecil", county: "Cecil County", district: "Cecil County Public Schools", statusUrl: "https://www.ccps.org/", latitude: 39.573, longitude: -75.947 },
  { slug: "charles", county: "Charles County", district: "Charles County Public Schools", statusUrl: "https://www.ccboe.com/", latitude: 38.473, longitude: -77.015 },
  { slug: "dorchester", county: "Dorchester County", district: "Dorchester County Public Schools", statusUrl: "https://dcps.k12.md.us/", latitude: 38.429, longitude: -76.047 },
  { slug: "garrett", county: "Garrett County", district: "Garrett County Public Schools", statusUrl: "https://www.gcps.net/", latitude: 39.529, longitude: -79.273 },
  { slug: "harford", county: "Harford County", district: "Harford County Public Schools", statusUrl: "https://www.hcps.org/", latitude: 39.536, longitude: -76.298 },
  { slug: "kent", county: "Kent County", district: "Kent County Public Schools", statusUrl: "https://www.kent.k12.md.us/", latitude: 39.235, longitude: -76.095 },
  { slug: "queen-annes", county: "Queen Anne's County", district: "Queen Anne's County Public Schools", statusUrl: "https://www.qacps.org/", latitude: 39.054, longitude: -76.066 },
  { slug: "saint-marys", county: "St. Mary's County", district: "St. Mary's County Public Schools", statusUrl: "https://www.smcps.org/", latitude: 38.299, longitude: -76.636 },
  { slug: "somerset", county: "Somerset County", district: "Somerset County Public Schools", statusUrl: "https://www.somerset.k12.md.us/", latitude: 38.083, longitude: -75.853 },
  { slug: "talbot", county: "Talbot County", district: "Talbot County Public Schools", statusUrl: "https://www.tcps.k12.md.us/", latitude: 38.774, longitude: -76.074 },
  { slug: "washington", county: "Washington County", district: "Washington County Public Schools", statusUrl: "https://www.wcpsmd.com/", latitude: 39.604, longitude: -77.814 },
  { slug: "wicomico", county: "Wicomico County", district: "Wicomico County Public Schools", statusUrl: "https://www.wcboe.org/", latitude: 38.394, longitude: -75.633 },
  { slug: "worcester", county: "Worcester County", district: "Worcester County Public Schools", statusUrl: "https://www.worcesterk12.org/", latitude: 38.222, longitude: -75.309 }
].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99) || a.county.localeCompare(b.county));

export function getMarylandDistrict(slug: string) {
  return marylandDistricts.find((district) => district.slug === slug) ?? null;
}
