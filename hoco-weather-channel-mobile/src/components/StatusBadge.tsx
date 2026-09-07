import { StyleSheet, View } from "react-native";
import { colors } from "@/theme/colors";
import { AppText } from "./AppText";

type BadgeKind = "normal" | "delay" | "closed" | "virtual" | "unknown" | "Low" | "Medium" | "High";

const badgeColors: Record<BadgeKind, string> = {
  normal: colors.status.normal,
  delay: colors.status.delay,
  closed: colors.status.closed,
  virtual: colors.status.virtual,
  unknown: colors.status.unknown,
  Low: colors.status.normal,
  Medium: colors.status.delay,
  High: colors.status.closed
};

export function StatusBadge({ label, kind }: { label: string; kind: BadgeKind }) {
  const color = badgeColors[kind] ?? colors.status.unknown;

  return (
    <View style={[styles.badge, { backgroundColor: `${color}1A`, borderColor: `${color}55` }]}>
      <AppText variant="caption" style={{ color }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6
  }
});
