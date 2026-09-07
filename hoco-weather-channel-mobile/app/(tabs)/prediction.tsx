import { StyleSheet, View } from "react-native";
import { AlertTriangle, Gauge } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ErrorCard, LoadingView } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function PredictionScreen() {
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

  const prediction = data.prediction;

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <AppText variant="title">Prediction</AppText>

      <Card>
        <View style={styles.rowBetween}>
          <View style={styles.flex}>
            <AppText variant="caption" muted>Unofficial forecast</AppText>
            <AppText variant="title">{prediction.label}</AppText>
          </View>
          <StatusBadge label={prediction.riskLevel} kind={prediction.riskLevel} />
        </View>
        <AppText muted style={styles.spacing}>{prediction.explanation}</AppText>
      </Card>

      <Card>
        <Gauge color="#2563eb" size={28} />
        <AppText variant="heading" style={styles.spacing}>Confidence</AppText>
        <AppText variant="title">{prediction.confidence}/100</AppText>
      </Card>

      <Card>
        <AppText variant="heading">Top weather factors</AppText>
        {prediction.topFactors.map((factor) => (
          <View key={factor} style={styles.factor}>
            <AlertTriangle color="#2563eb" size={18} />
            <AppText muted style={styles.factorText}>{factor}</AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText variant="heading">Risk score breakdown</AppText>
        {(prediction.scoreBreakdown ?? []).map((item) => (
          <View key={`${item.label}-${item.points}`} style={styles.scoreRow}>
            <AppText muted style={styles.flex}>{item.label}</AppText>
            <AppText>{item.points > 0 ? `+${item.points}` : item.points}</AppText>
          </View>
        ))}
      </Card>

      <Card>
        <AppText variant="heading">Unofficial disclaimer</AppText>
        <AppText muted style={styles.spacing}>
          This app is unofficial and is not affiliated with HCPSS. Always check the official HCPSS status page for final decisions.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center"
  },
  flex: {
    flex: 1
  },
  spacing: {
    marginTop: 10
  },
  factor: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12
  },
  factorText: {
    flex: 1
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#bfdbfe"
  }
});
