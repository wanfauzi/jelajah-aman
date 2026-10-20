// app/_layout.tsx (root layout)
import { Stack } from "expo-router";
import { useThemeContext, ThemeProvider } from "../hooks/theme-context";

function NavigasiPokok() {
  const { colors, skema } = useThemeContext();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundElement },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
      <Stack.Screen
        name="tambah-favorit"
        options={{ presentation: "modal", title: "Tambah Favorit" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NavigasiPokok />
    </ThemeProvider>
  );
}