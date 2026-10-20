// app/(tabs)/tentang.tsx
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../hooks/use-theme";

type InfoRow = {
  ikon: keyof typeof Ionicons.glyphMap;
  label: string;
  nilai: string;
  tautan?: string;
};

const INFO: InfoRow[] = [
  { ikon: "code-slash-outline", label: "Versi", nilai: "1.0.0" },
  { ikon: "school-outline", label: "Mata Kuliah", nilai: "Pemrograman Platform" },
  { ikon: "calendar-outline", label: "Semester", nilai: "5 – 2026" },
  {
    ikon: "cloud-outline",
    label: "Data Cuaca",
    nilai: "Open-Meteo API",
    tautan: "https://open-meteo.com",
  },
  {
    ikon: "earth-outline",
    label: "Geocoding",
    nilai: "Open-Meteo Geocoding",
    tautan: "https://geocoding-api.open-meteo.com",
  },
];

export default function TabTentang() {
  const { colors } = useTheme();

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, gap: 20 },
    // Hero card
    heroCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: "center",
      gap: 8,
    },
    heroJudul: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: 0.4,
    },
    heroSub: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
    },
    // Info rows
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      overflow: "hidden",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 13,
      paddingHorizontal: 16,
      gap: 12,
    },
    infoDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 52,
    },
    infoLabel: {
      flex: 1,
      fontSize: 13,
      color: colors.muted,
    },
    infoNilai: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    infoTautan: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.active,
    },
    // Disclaimer
    disclaimer: {
      fontSize: 12,
      color: colors.muted,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  return (
    <SafeAreaView style={s.container}>
      <View style={s.scroll}>

        {/* ── Hero ── */}
        <View style={s.heroCard}>
          <Ionicons name="compass" size={52} color={colors.active} />
          <Text
            style={s.heroJudul}
            accessibilityLabel="Judul halaman Tentang"
          >
            Jelajah Aman
          </Text>
          <Text style={s.heroSub}>
            Aplikasi informasi cuaca &amp; kualitas udara{"\n"}berbasis data real-time Open-Meteo
          </Text>
        </View>

        {/* ── Info Rows ── */}
        <View style={s.infoCard}>
          {INFO.map((item, idx) => (
            <View key={item.label}>
              <View style={s.infoRow}>
                <Ionicons name={item.ikon} size={20} color={colors.active} />
                <Text style={s.infoLabel}>{item.label}</Text>
                {item.tautan ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.tautan!)}
                    accessibilityLabel={`Buka ${item.nilai}`}
                  >
                    <Text style={s.infoTautan}>{item.nilai}</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={s.infoNilai}>{item.nilai}</Text>
                )}
              </View>
              {idx < INFO.length - 1 && <View style={s.infoDivider} />}
            </View>
          ))}
        </View>

        {/* ── Disclaimer ── */}
        <Text style={s.disclaimer}>
          Data cuaca bersumber dari Open-Meteo (open-source).{"\n"}
          Gunakan hanya sebagai referensi, bukan keputusan darurat.
        </Text>

      </View>
    </SafeAreaView>
  );
}
