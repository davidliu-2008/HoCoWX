import { PropsWithChildren } from "react";
import { RefreshControl, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";

type ScreenProps = PropsWithChildren<{
  refreshing?: boolean;
  onRefresh?: () => void;
}>;

export function Screen({ children, refreshing, onRefresh }: ScreenProps) {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} /> : undefined
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  content: {
    padding: 18,
    paddingBottom: 34,
    gap: 16
  }
});
