import { Image, Pressable, StyleSheet, View } from "react-native";
import { RefreshCw, Snowflake } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ErrorCard, LoadingView } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTimestamp } from "@/lib/format";

export default function HomeScreen() {
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

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={styles.header}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <View style={styles.headerText}>
          <AppText variant="caption" muted>Howard County, Maryland</AppText>
          <AppText variant="title">HoCo Weather Channel</AppText>
        </View>
      </View>

      <Card>
        <AppText variant="caption" muted>Official HCPSS Status</AppText>
        <AppText variant="title" style={styles.statusTitle}>{data.hcpss.operationStatus}</AppText>
        <AppText muted>{data.hcpss.message}</AppText>
        <AppText variant="caption" muted style={styles.updated}>
          Last updated {formatTimestamp(data.hcpss.fetchedAt)}
        </AppText>
      </Card>

      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <AppText variant="caption" muted>Unofficial prediction</AppText>
            <AppText variant="heading">{data.prediction.label}</AppText>
          </View>
          <StatusBadge label={data.prediction.riskLevel} kind={data.prediction.riskLevel} />
        </View>
        <AppText muted style={styles.updated}>
          Confidence {data.prediction.confidence}% - {data.prediction.explanation}
        </AppText>
      </Card>

      <Card>
        <View style={styles.rowBetween}>
          <View>
            <AppText variant="caption" muted>Quick weather</AppText>
            <AppText variant="title">{data.weather.currentTemperatureF ?? "--"} F</AppText>
          </View>
          <Snowflake color="#2563eb" size={34} />
        </View>
        <AppText muted>
          {data.weather.shortForecast ?? "Forecast unavailable"} - Precip {data.weather.precipitationChance ?? 0}%
        </AppText>
      </Card>

      <Pressable onPress={refresh} style={styles.refreshButton}>
        <RefreshCw color="#ffffff" size={18} />
        <AppText style={styles.refreshText}>Refresh</AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center"
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18
  },
  headerText: {
    flex: 1
  },
  statusTitle: {
    marginVertical: 8
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center"
  },
  flex: {
    flex: 1
  },
  updated: {
    marginTop: 12
  },
  refreshButton: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#2563eb",
    paddingVertical: 15
  },
  refreshText: {
    color: "#ffffff",
    fontWeight: "800"
  }
});
