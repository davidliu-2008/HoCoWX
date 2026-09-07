import { useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, TextInput, View, useColorScheme } from "react-native";
import { ExternalLink, Search } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { ErrorCard, LoadingView } from "@/components/StateViews";
import { StatusBadge } from "@/components/StatusBadge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatTimestamp } from "@/lib/format";
import { colors } from "@/theme/colors";

export default function MarylandScreen() {
  const { data, loading, error, refreshing, refresh } = useDashboardData();
  const [query, setQuery] = useState("");
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;

  const filtered = useMemo(() => {
    const lower = query.toLowerCase();
    return (data?.maryland ?? []).filter(
      (item) => item.county.toLowerCase().includes(lower) || item.district.toLowerCase().includes(lower)
    );
  }, [data?.maryland, query]);

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

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <AppText variant="title">Maryland Status</AppText>

      <View style={[styles.searchBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Search color={palette.muted} size={18} />
        <TextInput
          placeholder="Search county or district"
          placeholderTextColor={palette.muted}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, { color: palette.text }]}
        />
      </View>

      {filtered.map((item) => (
        <Card key={item.county}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <AppText variant="heading">{item.county}</AppText>
              <AppText muted>{item.district}</AppText>
            </View>
            <StatusBadge label={item.status} kind={item.statusKind} />
          </View>
          <AppText variant="caption" muted style={styles.updated}>
            Updated {formatTimestamp(item.lastUpdated ?? item.checkedAt)}
          </AppText>
          <Pressable onPress={() => Linking.openURL(item.statusUrl)} style={styles.sourceButton}>
            <ExternalLink color="#2563eb" size={16} />
            <AppText style={styles.sourceText}>Open source</AppText>
          </Pressable>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600"
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12
  },
  flex: {
    flex: 1
  },
  updated: {
    marginTop: 12
  },
  sourceButton: {
    marginTop: 14,
    flexDirection: "row",
    gap: 6,
    alignItems: "center"
  },
  sourceText: {
    color: "#2563eb",
    fontWeight: "800"
  }
});
