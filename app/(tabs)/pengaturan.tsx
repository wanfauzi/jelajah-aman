// app/(tabs)/pengaturan.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TemaPreferensi, useThemeContext } from "../../hooks/theme-context";
import { useTheme } from "../../hooks/use-theme";
import { hapusSemuaCache } from "../../services/cacheRepository";

type PilihanTema = {
  nilai: TemaPreferensi;
  label: string;
  ikon: keyof typeof Ionicons.glyphMap;
};

const PILIHAN_TEMA: PilihanTema[] = [
  { nilai: "terang", label: "Terang", ikon: "sunny-outline" },
  { nilai: "sistem", label: "Sistem", ikon: "phone-portrait-outline" },
  { nilai: "gelap", label: "Gelap", ikon: "moon-outline" },
];

export default function TabPengaturan() {
  const { colors } = useTheme();
  const { temaPreferensi, setTemaPreferensi } = useThemeContext();
  const [pesanHapus, setPesanHapus] = useState<string | null>(null);

  async function konfirmasiHapusCache() {
    const lanjutkan = async () => {
      await hapusSemuaCache();
      setPesanHapus("✓ Semua data cuaca tersimpan telah dihapus.");
      setTimeout(() => setPesanHapus(null), 3000);
    };

    if (Platform.OS === "web") {
      if (window.confirm("Hapus semua data cuaca tersimpan?\nKota-kota tidak bisa dibuka offline sebelum dicari ulang."))
        await lanjutkan();
      return;
    }

    Alert.alert(
      "Hapus Cache Cuaca",
      "Semua data cuaca tersimpan akan dihapus. Kota-kota tidak bisa dibuka offline sebelum dicari ulang saat online.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus Semua", style: "destructive", onPress: lanjutkan },
      ],
    );
  }

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: 20, gap: 24 },
    // App info card
    appCard: {
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 20,
      alignItems: "center",
      gap: 6,
    },
    appNama: {
      fontSize: 22,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: 0.3,
    },
    appVersi: {
      fontSize: 13,
      color: colors.muted,
    },
    // Section
    sectionLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.muted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    // Theme selector
    temaWrapper: {
      flexDirection: "row",
      backgroundColor: colors.backgroundElement,
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    temaPilihan: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      paddingVertical: 10,
      borderRadius: 9,
    },
    temaLabel: {
      fontSize: 13,
      fontWeight: "600",
    },
    // Action button
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    actionLabel: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "600",
      color: colors.text,
    },
    actionSub: {
      fontSize: 12,
      color: colors.muted,
      marginTop: 2,
    },
    // Pesan sukses
    pesanSukses: {
      backgroundColor: colors.okBg,
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
      alignItems: 'center',
    },
    teksPersan: {
      color: colors.okText,
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  const temaAktif = PILIHAN_TEMA.find((p) => p.nilai === temaPreferensi);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.scroll}>

        {/* ── App Info ── */}
        <View style={s.appCard}>
          <Ionicons name="compass" size={40} color={colors.active} />
          <Text style={s.appNama}>Jelajah Aman</Text>
          <Text style={s.appVersi}>Versi 1.0.0</Text>
        </View>

        {/* ── Tema ── */}
        <View>
          <Text style={s.sectionLabel}>Tampilan</Text>
          <View style={s.temaWrapper}>
            {PILIHAN_TEMA.map((pilihan) => {
              const aktif = temaPreferensi === pilihan.nilai;
              return (
                <TouchableOpacity
                  key={pilihan.nilai}
                  style={[
                    s.temaPilihan,
                    aktif && {
                      backgroundColor: colors.active,
                    },
                  ]}
                  onPress={() => setTemaPreferensi(pilihan.nilai)}
                  accessibilityLabel={`Pilih tema ${pilihan.label}`}
                  accessibilityState={{ selected: aktif }}
                >
                  <Ionicons
                    name={pilihan.ikon}
                    size={16}
                    color={aktif ? "#ffffff" : colors.muted}
                  />
                  <Text
                    style={[
                      s.temaLabel,
                      { color: aktif ? "#ffffff" : colors.muted },
                    ]}
                  >
                    {pilihan.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={{ fontSize: 12, color: colors.muted, marginTop: 6, textAlign: "center" }}
          >
            Mode aktif:{" "}
            <Text style={{ color: colors.text, fontWeight: "600" }}>
              {temaAktif?.label ?? "Sistem"}
            </Text>
          </Text>
        </View>

        {/* ── Data & Cache ── */}
        <View style={{ gap: 10 }}>
          <Text style={s.sectionLabel}>Data & Cache</Text>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={konfirmasiHapusCache}
            accessibilityLabel="Hapus semua data cuaca tersimpan"
          >
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
            <View style={{ flexShrink: 1 }}>
              <Text style={[s.actionLabel, { color: colors.danger }]}>
                Hapus Semua Cache
              </Text>
              <Text style={s.actionSub}>
                Hapus seluruh data cuaca yang tersimpan di perangkat
              </Text>
            </View>
          </TouchableOpacity>
          {pesanHapus && (
            <View style={s.pesanSukses}>
              <Text style={s.teksPersan}>{pesanHapus}</Text>
            </View>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
