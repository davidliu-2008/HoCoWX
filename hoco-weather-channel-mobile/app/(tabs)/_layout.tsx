import { Tabs } from "expo-router";
import { CloudSun, Home, Info, MapPinned, School } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { colors } from "@/theme/colors";

export default function TabLayout() {
  const scheme = useColorScheme();
  const palette = scheme === "dark" ? colors.dark : colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          tabBarIcon: ({ color, size }) => <CloudSun color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="prediction"
        options={{
          title: "Prediction",
          tabBarIcon: ({ color, size }) => <School color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="maryland"
        options={{
          title: "Maryland",
          tabBarIcon: ({ color, size }) => <MapPinned color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "Info",
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />
        }}
      />
    </Tabs>
  );
}
