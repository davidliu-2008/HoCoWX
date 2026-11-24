import { useEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, TextInput, View, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { appConfig } from "@/config/appConfig";
import { counties, matchCounties } from "@/config/counties";
import { morningBrief, nextDeparture, parseDeparture } from "@/lib/morningBrief";
import type { HcpssStatus, HourlyForecastPoint } from "@/types/api";

const preferenceKey = "hocowx.morningDeparture.v1";
const countyKey = "hocowx.morningCounty.v1";
type County = typeof counties[number];
type BriefData = { hours: HourlyForecastPoint[]; status: Pick<HcpssStatus, "operationStatus" | "sourceUrl"> };
const dateLabel = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York", weekday: "long", month: "short", day: "numeric"
});
const hourLabel = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric" });
const sampleHours: HourlyForecastPoint[] = [
  { time: "2026-11-25T11:00:00Z", shortForecast: "Freezing Rain", temperatureF: 30, precipitationChance: 70, windSpeed: "5 mph", windGust: null },
  { time: "2026-11-25T12:00:00Z", shortForecast: "Rain", temperatureF: 35, precipitationChance: 70, windSpeed: "5 mph", windGust: null },
  { time: "2026-11-25T13:00:00Z", shortForecast: "Cloudy", temperatureF: 39, precipitationChance: 10, windSpeed: "5 mph", windGust: null }
];

function Brief({ demo = false }: { demo?: boolean }) {
  const [departure, setDeparture] = useState("7:00");
  const [draft, setDraft] = useState("7:00");
  const [timeError, setTimeError] = useState(false);
  const [county, setCounty] = useState<County>(counties.find(({ slug }) => slug === "howard")!);
  const [pickingCounty, setPickingCounty] = useState(false);
  const [countyQuery, setCountyQuery] = useState("");
  const [countyError, setCountyError] = useState(false);
  const [ready, setReady] = useState(demo);
  const [requestId, setRequestId] = useState(0);
  const [response, setResponse] = useState<{ county: string; requestId: number; data: BriefData | null }>();
  const dark = useColorScheme() === "dark";
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    let active = true;
    void Promise.all([demo ? Promise.resolve(null) : AsyncStorage.getItem(preferenceKey), AsyncStorage.getItem(demo ? `${countyKey}.demo` : countyKey)]).then(([value, savedCounty]) => {
      const saved = parseDeparture(value ?? "") ?? parseDeparture(`${value}:00`);
      if (active && saved) {
        setDeparture(saved.label);
        setDraft(saved.label);
      }
      const match = counties.find(({ slug }) => slug === savedCounty);
      if (active && match) setCounty(match);
    }).catch(() => {}).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, [demo]);

  useEffect(() => {
    if (!ready || demo) return;
    const controller = new AbortController();
    void fetch(`${appConfig.apiBaseUrl}/api/mobile-brief?county=${encodeURIComponent(county.slug)}`, { signal: controller.signal })
      .then(async (result) => {
        if (!result.ok) throw new Error("Forecast unavailable");
        const data = await result.json() as BriefData;
        if (!controller.signal.aborted) setResponse({ county: county.slug, requestId, data });
      }).catch(() => {
        if (!controller.signal.aborted) setResponse({ county: county.slug, requestId, data: null });
      });
    return () => controller.abort();
  }, [county.slug, demo, ready, requestId]);

  const current = response?.county === county.slug && response.requestId === requestId ? response : undefined;
  const loading = !demo && !current;
  const status = current?.data?.status;
  const hours = demo ? sampleHours : current?.data?.hours ?? [];
  const selectedTime = parseDeparture(departure)!;
  const forecast = nextDeparture(hours, selectedTime, demo ? Date.parse("2026-11-25T10:00:00Z") : undefined);
  const brief = morningBrief(forecast);
  const suggestions = matchCounties(countyQuery);
  function saveCounty(option?: County) {
    if (!option) { setCountyError(true); return; }
    setCounty(option);
    setPickingCounty(false);
    setExpanded(false);
    void AsyncStorage.setItem(demo ? `${countyKey}.demo` : countyKey, option.slug).catch(() => {});
  }
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
    <Screen refreshing={ready && loading} onRefresh={demo ? undefined : () => setRequestId((id) => id + 1)}>
      <View style={styles.header}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} accessibilityIgnoresInvertColors />
        <View style={styles.flex}>
          <AppText variant="caption" muted>{county.county}, Maryland</AppText>
          <AppText variant="heading">HoCo Weather Channel</AppText>
        </View>
      </View>
      {demo && <AppText variant="caption" muted>Demo · Sample weather, not a live alert</AppText>}
      <Card>
        <AppText variant="caption" muted>Morning brief · {departure} AM ET{forecast ? ` · ${dateLabel.format(new Date(forecast.time))}` : ""}</AppText>
        <AppText variant="title" style={styles.headline}>{loading ? "Checking your forecast…" : current?.data === null ? "Forecast unavailable" : brief.title}</AppText>
        {!loading && <AppText muted>{current?.data === null ? "Pull to refresh and try again." : brief.guidance}</AppText>}
        {forecast && <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpanded(!expanded)} style={styles.evidence}>
          <AppText style={styles.action}>{expanded ? "Hide forecast details" : "See why"}</AppText>
        </Pressable>}
        {expanded && forecast && <View style={styles.details}>
          <AppText variant="caption" muted>{demo ? "Sample forecast" : "National Weather Service · County forecast, not road conditions"}</AppText>
          <AppText>{hourLabel.format(new Date(forecast.time))} ET forecast · {forecast.shortForecast} · {forecast.temperatureF}°F</AppText>
        </View>}
      </Card>
      <View style={styles.schedule}>
        <AppText variant="heading">County</AppText>
        {pickingCounty ? <View style={styles.countySearch}>
          <View style={styles.options}>
            <TextInput autoFocus accessibilityLabel="Search Maryland counties" placeholder="Type a county, e.g. Howard" placeholderTextColor={dark ? "#aeb9c8" : "#526079"}
              value={countyQuery} onChangeText={(value) => { setCountyQuery(value); setCountyError(false); }}
              onSubmitEditing={() => saveCounty(suggestions[0])} autoCorrect={false} returnKeyType="done"
              style={[styles.option, styles.flex, { color: dark ? "#fff" : "#14233d" }]} />
            <Pressable accessibilityRole="button" onPress={() => setPickingCounty(false)} style={styles.evidence}><AppText style={styles.action}>Cancel</AppText></Pressable>
          </View>
          {suggestions.map((option) => <Pressable key={option.slug} accessibilityRole="button" style={styles.countyOption}
            onPress={() => saveCounty(option)}><AppText>{option.county}</AppText></Pressable>)}
          {(countyError || (countyQuery.trim().length >= 3 && !suggestions.length)) &&
            <AppText variant="caption" muted>No matching Maryland county. Try a shorter name.</AppText>}
        </View> : <Pressable accessibilityRole="button" accessibilityLabel={`Change county, currently ${county.county}`}
          onPress={() => { setCountyQuery(""); setCountyError(false); setPickingCounty(true); }} style={styles.countyOption}>
          <AppText>{county.county} <AppText variant="caption" muted> · Change</AppText></AppText>
        </Pressable>}
      </View>
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
        <AppText variant="caption" muted>{demo ? "Sample district status" : "Current district status"}</AppText>
        <AppText variant="heading">{demo ? "Normal Operations" : loading ? "Checking status…" : status?.operationStatus ?? "Status unavailable"}</AppText>
        {!demo && status && <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(status.sourceUrl)} style={styles.evidence}>
          <AppText style={styles.action}>Check official district status</AppText>
        </Pressable>}
      </Card>
    </Screen>
  );
}

export default function HomeScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  return <Brief key={demo === "1" ? "demo" : "live"} demo={demo === "1"} />;
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
  countyOption: { minHeight: 44, borderWidth: 1, borderColor: "#8495a9", borderRadius: 8, paddingHorizontal: 10, justifyContent: "center" },
  countySearch: { gap: 6 },
  save: { minHeight: 46, paddingHorizontal: 14, justifyContent: "center", borderRadius: 8, backgroundColor: "#173762" },
  selectedText: { color: "#ffffff", fontWeight: "700" }
});
