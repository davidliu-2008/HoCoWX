import { StyleSheet, View } from "react-native";
import { CloudRain, Snowflake, Thermometer, Wind } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ErrorCard, LoadingView } from "@/components/StateViews";
import { useDashboardData } from "@/hooks/useDashboardData";
import { compactHour } from "@/lib/format";
import { estimateIceRisk, snowRiskLabel } from "@/lib/prediction";

export default function WeatherScreen() {
  const { data, loading, error, refreshing, refresh } = useDashboardData();

  if (loading && !data) {
    return <LoadingView />;
  }

  if (error && !data) {
    return (
      <Screen>
        <ErrorCard message={error} onRetry={refresh} />
      </Screen>
    );
  }

  if (!data) {
    return null;
  }

  const weather = data.weather;

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <AppText variant="title">Weather</AppText>

      <View style={styles.grid}>
        <Card style={styles.tile}>
          <Thermometer color="#2563eb" />
          <AppText variant="caption" muted>Temperature</AppText>
          <AppText variant="heading">{weather.currentTemperatureF ?? "--"} F</AppText>
        </Card>
        <Card style={styles.tile}>
          <CloudRain color="#2563eb" />
          <AppText variant="caption" muted>Precipitation</AppText>
          <AppText variant="heading">{weather.precipitationChance ?? 0}%</AppText>
        </Card>
        <Card style={styles.tile}>
          <Snowflake color="#2563eb" />
          <AppText variant="caption" muted>Snow risk</AppText>
          <AppText variant="heading">{snowRiskLabel(weather.expectedSnowfallInches)}</AppText>
        </Card>
        <Card style={styles.tile}>
          <Wind color="#2563eb" />
          <AppText variant="caption" muted>Wind</AppText>
          <AppText variant="heading">{weather.windSpeed ?? "--"}</AppText>
        </Card>
      </View>

      <Card>
        <AppText variant="heading">Ice / freezing rain risk</AppText>
        <AppText muted style={styles.spacing}>{estimateIceRisk(weather)}</AppText>
      </Card>

      <Card>
        <AppText variant="heading">Alerts</AppText>
        {weather.alerts.length ? (
          weather.alerts.map((alert) => (
            <View key={`${alert.event}-${alert.headline}`} style={styles.alert}>
              <AppText>{alert.event}</AppText>
              <AppText muted>{alert.headline}</AppText>
            </View>
          ))
        ) : (
          <AppText muted style={styles.spacing}>No active weather alerts for this point.</AppText>
        )}
      </Card>

      <Card>
        <AppText variant="heading">Hourly timeline</AppText>
        <View style={styles.timeline}>
          {(weather.hourlyForecast ?? []).slice(0, 8).map((hour) => (
            <View key={hour.time} style={styles.hour}>
              <AppText variant="caption" muted>{compactHour(hour.time)}</AppText>
              <AppText variant="heading">{hour.temperatureF} F</AppText>
              <AppText variant="caption" muted>{hour.shortForecast}</AppText>
            </View>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  tile: {
    width: "48%",
    gap: 6
  },
  spacing: {
    marginTop: 8
  },
  alert: {
    marginTop: 10,
    gap: 4
  },
  timeline: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12
  },
  hour: {
    width: "47%",
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    padding: 12,
    gap: 5
  }
});
