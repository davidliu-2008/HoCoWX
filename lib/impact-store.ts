import type { ImpactPredictionRun } from "./impact-intelligence";

function configuration() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  return url && secretKey
    ? {
        url,
        secretKey,
        usesLegacyJwt: !process.env.SUPABASE_SECRET_KEY
      }
    : null;
}

function requestHeaders(config: NonNullable<ReturnType<typeof configuration>>) {
  return {
    apikey: config.secretKey,
    ...(config.usesLegacyJwt ? { Authorization: `Bearer ${config.secretKey}` } : {}),
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates,return=minimal"
  };
}

export function impactStoreIsConfigured() {
  return configuration() !== null;
}

export async function saveImpactPredictionRun(run: ImpactPredictionRun) {
  const config = configuration();

  if (!config) {
    return { stored: false as const, reason: "not_configured" as const };
  }

  const response = await fetch(
    `${config.url}/rest/v1/impact_prediction_runs?on_conflict=run_key`,
    {
      method: "POST",
      headers: requestHeaders(config),
      body: JSON.stringify({
        run_key: run.runKey,
        model_version: run.modelVersion,
        district_slug: run.districtSlug,
        county: run.county,
        target_date: run.targetDate,
        generated_at: run.generatedAt,
        sources: run.sources,
        weather_snapshot: run.weatherSnapshot,
        prediction: run.prediction
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Impact prediction storage failed with ${response.status}.`);
  }

  return { stored: true as const };
}

export type ImpactOutcome = {
  districtSlug: string;
  targetDate: string;
  officialOutcome: "normal" | "delay" | "closure" | "early_dismissal" | "modified" | "unknown";
  sourceUrl?: string;
  notes?: string;
};

export async function saveImpactOutcome(outcome: ImpactOutcome) {
  const config = configuration();

  if (!config) {
    throw new Error("Impact storage is not configured.");
  }

  const response = await fetch(
    `${config.url}/rest/v1/impact_outcomes?on_conflict=district_slug,target_date`,
    {
      method: "POST",
      headers: requestHeaders(config),
      body: JSON.stringify({
        district_slug: outcome.districtSlug,
        target_date: outcome.targetDate,
        official_outcome: outcome.officialOutcome,
        source_url: outcome.sourceUrl ?? null,
        notes: outcome.notes ?? null,
        verified_at: new Date().toISOString()
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Impact outcome storage failed with ${response.status}.`);
  }
}

