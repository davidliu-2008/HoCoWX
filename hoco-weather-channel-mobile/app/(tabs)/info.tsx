import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { ExternalLink, Instagram } from "lucide-react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { appConfig } from "@/config/appConfig";

export default function InfoScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <View style={styles.flex}>
          <AppText variant="title">Info</AppText>
          <AppText muted>Simple school operations guidance for Howard County mornings.</AppText>
        </View>
      </View>

      <Card>
        <AppText variant="heading">How predictions work</AppText>
        <AppText muted style={styles.paragraph}>
          The app uses a transparent rule-based model. It checks official weather data for snow, ice, freezing rain, temperature, wind, timing, and National Weather Service alerts.
        </AppText>
        <AppText muted style={styles.paragraph}>
          Ice and freezing rain are weighted heavily because they can create dangerous road and sidewalk conditions. Weather during the 5 AM-9 AM commute window also matters more than weather later in the day.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Disclaimer</AppText>
        <AppText muted style={styles.paragraph}>
          This app is unofficial and is not affiliated with HCPSS. Always check the official HCPSS status page for final decisions.
        </AppText>
      </Card>

      <Card>
        <AppText variant="heading">Privacy summary</AppText>
        <AppText muted style={styles.paragraph}>{appConfig.privacySummary}</AppText>
      </Card>

      <Pressable onPress={() => Linking.openURL(appConfig.officialHcpssUrl)} style={styles.button}>
        <ExternalLink color="#ffffff" size={18} />
        <AppText style={styles.buttonText}>Official HCPSS Status</AppText>
      </Pressable>

      <Pressable onPress={() => Linking.openURL(appConfig.instagramUrl)} style={[styles.button, styles.instagram]}>
        <Instagram color="#ffffff" size={18} />
        <AppText style={styles.buttonText}>HoCo Weather Instagram</AppText>
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
    width: 70,
    height: 70,
    borderRadius: 18
  },
  flex: {
    flex: 1
  },
  paragraph: {
    marginTop: 10
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#2563eb",
    paddingVertical: 15
  },
  instagram: {
    backgroundColor: "#1d4ed8"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "800"
  }
});
