export const counties = [
  { slug: "allegany", county: "Allegany County" },
  { slug: "anne-arundel", county: "Anne Arundel County" },
  { slug: "baltimore-city", county: "Baltimore City" },
  { slug: "baltimore-county", county: "Baltimore County" },
  { slug: "calvert", county: "Calvert County" },
  { slug: "caroline", county: "Caroline County" },
  { slug: "carroll", county: "Carroll County" },
  { slug: "cecil", county: "Cecil County" },
  { slug: "charles", county: "Charles County" },
  { slug: "dorchester", county: "Dorchester County" },
  { slug: "frederick", county: "Frederick County" },
  { slug: "garrett", county: "Garrett County" },
  { slug: "harford", county: "Harford County" },
  { slug: "howard", county: "Howard County" },
  { slug: "kent", county: "Kent County" },
  { slug: "montgomery", county: "Montgomery County" },
  { slug: "prince-georges", county: "Prince George's County" },
  { slug: "queen-annes", county: "Queen Anne's County" },
  { slug: "somerset", county: "Somerset County" },
  { slug: "saint-marys", county: "St. Mary's County" },
  { slug: "talbot", county: "Talbot County" },
  { slug: "washington", county: "Washington County" },
  { slug: "wicomico", county: "Wicomico County" },
  { slug: "worcester", county: "Worcester County" },
] as const;

const normalize = (value: string) => value.toLowerCase().replace(/\bcounty\b/g, "").replace(/[^a-z]/g, "");

function distance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + Number(a[i - 1] !== b[j - 1]));
    }
    previous = row;
  }
  return previous[b.length];
}

export function matchCounties(query: string) {
  const term = normalize(query);
  if (!term) return [];
  return counties.map((county) => {
    const name = normalize(county.county);
    const edits = distance(term, name);
    return { county, rank: name === term ? 0 : name.startsWith(term) ? 1 : name.includes(term) ? 2 : 3 + edits, edits };
  }).filter(({ rank, edits }) => rank <= 2 || (term.length >= 3 && edits <= (term.length >= 6 ? 2 : 1)))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 4)
    .map(({ county }) => county);
}
