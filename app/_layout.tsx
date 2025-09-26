import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import ToastManager from "toastify-react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { NotificationProvider } from "@/context/NotificationContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <NotificationProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastManager />
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: true }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />=
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NotificationProvider>
  );
}
