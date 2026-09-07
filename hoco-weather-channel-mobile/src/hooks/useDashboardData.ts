import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { HcpssStatus, MarylandOperationStatus, PredictionResult, WeatherSummary } from "@/types/api";

export type DashboardData = {
  hcpss: HcpssStatus;
  weather: WeatherSummary;
  prediction: PredictionResult;
  maryland: MarylandOperationStatus[];
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (asRefresh = false) => {
    if (asRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      setError(null);
      setData(await api.getDashboardData());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load app data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    error,
    loading,
    refreshing,
    refresh: () => load(true)
  };
}
