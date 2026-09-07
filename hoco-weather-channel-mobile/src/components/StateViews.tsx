import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { Card } from "./Card";

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <AppText muted>Loading HoCo weather...</AppText>
    </View>
  );
}

export function ErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <Card>
      <AppText variant="heading">Could not load data</AppText>
      <AppText muted style={styles.message}>
        {message}
      </AppText>
      <Pressable onPress={onRetry} style={styles.button}>
        <AppText style={styles.buttonText}>Try again</AppText>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 320
  },
  message: {
    marginTop: 8
  },
  button: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800"
  }
});
