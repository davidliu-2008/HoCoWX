import { useEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, TextInput, View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ErrorCard, LoadingView } from "@/components/StateViews";
import { useDashboardData } from "@/hooks/useDashboardData";
import { morningBrief, nextDeparture, parseDeparture } from "@/lib/morningBrief";
import type { HcpssStatus, HourlyForecastPoint } from "@/types/api";

const preferenceKey = "hocowx.morningDeparture.v1";
const dateLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", weekday: "long", month: "short", day: "numeric"
});
const hourLabel = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric" });
const sampleHours: HourlyForecastPoint[] = [
  { time: "2026-11-25T11:00:00Z", shortForecast: "Freezing Rain", temperatureF: 30, precipitationChance: 70, windSpeed: "5 mph", windGust: null },
  { time: "2026-11-25T12:00:00Z", shortForecast: "Rain", temperatureF: 35, precipitationChance: 70, windSpeed: "5 mph", windGust: null },
  { time: "2026-11-25T13:00:00Z", shortForecast: "Cloudy", temperatureF: 39, precipitationChance: 10, windSpeed: "5 mph", windGust: null }
];

function Brief({ hours, status, demo = false, refreshing, refresh }: {
  hours: HourlyForecastPoint[]; status?: HcpssStatus; demo?: boolean; refreshing?: boolean; refresh?: () => void;
}) {
  const [departure, setDeparture] = useState("7:00");
  const [draft, setDraft] = useState("7:00");
  const [timeError, setTimeError] = useState(false);
  const dark = useColorScheme() === "dark";
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (demo) return;
    let active = true;
    void AsyncStorage.getItem(preferenceKey).then((value) => {
      const saved = parseDeparture(value ?? "") ?? parseDeparture(`${value}:00`);
      if (active && saved) {
        setDeparture(saved.label);
        setDraft(saved.label);
      }
    }).catch(() => {});
    return () => { active = false; };
  }, [demo]);

  const selectedTime = parseDeparture(departure)!;
  const forecast = nextDeparture(hours, selectedTime, demo ? Date.parse("2026-11-25T10:00:00Z") : undefined);
  const brief = morningBrief(forecast);
  function saveTime() {
    const parsed = parseDeparture(draft);
    if (!parsed) { setTimeError(true); return; }
    setTimeError(false);
    setDeparture(parsed.label);
    setDraft(parsed.label);
    setExpanded(false);
    if (!demo) void AsyncStorage.setItem(preferenceKey, parsed.label).catch(() => {});
  }
  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <View style={styles.header}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} accessibilityIgnoresInvertColors />
        <View style={styles.flex}>
          <AppText variant="caption" muted>Howard County, Maryland</AppText>
          <AppText variant="heading">HoCo Weather Channel</AppText>
        </View>
      </View>
      {demo && <AppText variant="caption" muted>Demo · Sample weather, not a live alert</AppText>}
      <Card>
        <AppText variant="caption" muted>Morning brief · {departure} AM ET{forecast ? ` · ${dateLabel.format(new Date(forecast.time))}` : ""}</AppText>
        <AppText variant="title" style={styles.headline}>{brief.title}</AppText>
        <AppText muted>{brief.guidance}</AppText>
        {forecast && <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded(!expanded)} style={styles.evidence}>
          <AppText style={styles.action}>{expanded ? "Hide forecast details" : "See why"}</AppText>
        </Pressable>}
        {expanded && forecast && <View style={styles.details}>
          <AppText variant="caption" muted>{demo ? "Sample forecast" : "National Weather Service · County forecast, not road conditions"}</AppText>
          <AppText>{hourLabel.format(new Date(forecast.time))} ET forecast · {forecast.shortForecast} · {forecast.temperatureF}°F</AppText>
        </View>}
      </Card>
      <View style={styles.schedule}>
        <AppText variant="heading">Morning departure</AppText>
        <View style={styles.options}>
          <TextInput accessibilityLabel="Departure time in hours and minutes" placeholder="7:15" placeholderTextColor={dark ? "#aeb9c8" : "#526079"} value={draft}
            onChangeText={(value) => { setDraft(value); setTimeError(false); }} onSubmitEditing={saveTime} maxLength={5} returnKeyType="done"
            style={[styles.option, { color: dark ? "#ffffff" : "#14233d" }]} />
          <AppText variant="caption">AM ET</AppText>
          <Pressable accessibilityRole="button" onPress={saveTime} style={styles.save}>
            <AppText style={styles.selectedText}>Save time</AppText>
          </Pressable>
        </View>
        {timeError && <AppText accessibilityRole="alert">Enter a morning time like 7:15.</AppText>}
      </View>
      <Card>
        <AppText variant="caption" muted>{demo ? "Sample district status" : "Official HCPSS status · Current"}</AppText>
        <AppText variant="heading">{demo ? "Normal Operations" : status?.operationStatus ?? "Status unavailable"}</AppText>
        {!demo && status && <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(status.sourceUrl)} style={styles.evidence}>
          <AppText style={styles.action}>Check official HCPSS status</AppText>
        </Pressable>}
      </Card>
    </Screen>
  );
}

function LiveHome() {
  const { data, loading, error, refreshing, refresh } = useDashboardData();
  if (loading && !data) return <LoadingView />;
  if (error && !data) return <Screen><ErrorCard message={error} onRetry={refresh} /></Screen>;
  return <Brief hours={data?.weather.hourlyForecast ?? []} status={data?.hcpss} refreshing={refreshing} refresh={refresh} />;
}

export default function HomeScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  return demo === "1" ? <Brief demo hours={sampleHours} /> : <LiveHome />;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 54, height: 54, borderRadius: 10 },
  flex: { flex: 1 },
  headline: { marginVertical: 8 },
  evidence: { minHeight: 44, justifyContent: "center", alignSelf: "flex-start" },
  action: { fontWeight: "700", textDecorationLine: "underline" },
  details: { gap: 5, marginTop: 2 },
  schedule: { gap: 10 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  option: { minWidth: 82, minHeight: 46, borderWidth: 1, borderColor: "#8495a9", borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  save: { minHeight: 46, paddingHorizontal: 14, justifyContent: "center", borderRadius: 8, backgroundColor: "#173762" },
  selectedText: { color: "#ffffff", fontWeight: "700" }
});
