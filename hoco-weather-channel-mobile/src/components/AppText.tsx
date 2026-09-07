import { Text, TextProps, useColorScheme } from "react-native";
import { colors } from "@/theme/colors";

type AppTextProps = TextProps & {
  variant?: "title" | "heading" | "body" | "caption";
  muted?: boolean;
};

export function AppText({ style, variant = "body", muted, ...props }: AppTextProps) {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;

  const variantStyle = {
    title: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const },
    heading: { fontSize: 21, lineHeight: 28, fontWeight: "800" as const },
    body: { fontSize: 16, lineHeight: 23, fontWeight: "500" as const },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: "600" as const }
  }[variant];

  return (
    <Text
      {...props}
      style={[
        {
          color: muted ? palette.muted : palette.text
        },
        variantStyle,
        style
      ]}
    />
  );
}
