import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps, useColorScheme } from "react-native";
import { colors } from "@/theme/colors";

export function Card({ children, style, ...props }: PropsWithChildren<ViewProps>) {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;

  return (
    <View
      {...props}
      style={[
        styles.card,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          shadowColor: palette.shadow
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 3
  }
});
