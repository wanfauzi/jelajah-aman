// app/(tabs)/riwayat.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/use-theme";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
} from "../../services/searchHistoryStorage";
import {
  daftarKotaTersimpan,
  hapusCache,
} from "../../services/cacheRepository";
import { KotaFavorit } from "../../types/favorit";
import { RingkasanKotaTersimpan } from "../../types/cache";

export default function TabRiwayat() {
  const { colors } = useTheme();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayatCari, setDaftarRiwayatCari] = useState<string[]>([]);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );

  // Muat ulang semua data setiap kali tab difokus
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit).catch(() => {});
      ambilRiwayatPencarian().then(setDaftarRiwayatCari).catch(() => {});
      daftarKotaTersimpan().then(setKotaTersimpan).catch(() => {});
    }, []),
  );

  // ── Riwayat Pencarian ──────────────────────────────────────────
  function klikRiwayat(keyword: string) {
    router.navigate({ pathname: "/(tabs)/", params: { cari: keyword } } as never);
  }

  function hapusSatuRiwayat(teks: string) {
    const lanjutkan = () => {
      hapusRiwayatPencarian(teks)
        .then(() =>
          setDaftarRiwayatCari((prev) => prev.filter((k) => k !== teks)),
        )
        .catch(() => {});
    };
    if (Platform.OS === "web") {
      if (window.confirm(`Hapus riwayat pencarian "${teks}"?`)) lanjutkan();
      return;
    }
    Alert.alert(
      "Hapus Riwayat",
      `Hapus riwayat pencarian "${teks}"?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: lanjutkan },
      ],
    );
  }

  function hapusSemuaRiwayat() {
    const lanjutkan = () => {
      hapusSemuaRiwayatPencarian()
        .then(() => setDaftarRiwayatCari([]))
        .catch(() => {});
    };
    if (Platform.OS === "web") {
      if (window.confirm("Hapus semua riwayat pencarian?")) lanjutkan();
      return;
    }
    Alert.alert(
      "Bersihkan Riwayat",
      "Semua riwayat pencarian akan dihapus. Lanjutkan?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus Semua", style: "destructive", onPress: lanjutkan },
      ],
    );
  }

  // ── Favorit ────────────────────────────────────────────────────
  function hapusFavoritKonfirmasi(id: number, nama: string) {
    const lanjutkan = () => {
      hapusFavorit(id)
        .then(() =>
          setDaftarFavorit((prev) => prev.filter((k) => k.id !== id)),
        )
        .catch(() => {});
    };
    if (Platform.OS === "web") {
      if (window.confirm(`Hapus ${nama} dari favorit?`)) lanjutkan();
      return;
    }
    Alert.alert(
      "Hapus Favorit",
      `Yakin hapus "${nama}" dari daftar favorit?`,
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: lanjutkan },
      ],
    );
  }

  // ── Cache Kota ─────────────────────────────────────────────────
  function hapusCacheKota(k: RingkasanKotaTersimpan) {
    const lanjutkan = () => {
      hapusCache(k.kunci)
        .then(() =>
          setKotaTersimpan((prev) =>
            prev.filter((c) => c.kunci !== k.kunci),
          ),
        )
        .catch(() => {});
    };
    const pesan = `Hapus cache offline "${k.nama}"?`;
    const deskripsi =
      `Data cuaca "${k.nama}" yang tersimpan di perangkat akan dihapus. ` +
      `Kota ini tidak bisa dibuka offline sebelum dicari ulang saat online.`;
    if (Platform.OS === "web") {
      if (window.confirm(`${pesan}\n${deskripsi}`)) lanjutkan();
      return;
    }
    Alert.alert(pesan, deskripsi, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus Cache", style: "destructive", onPress: lanjutkan },
    ]);
  }

  function formatWaktu(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ── Dinamis style ──────────────────────────────────────────────
  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 16, gap: 20 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
    },
    hapusSemua: {
      fontSize: 12,
      color: colors.danger,
      fontWeight: "600",
    },
    emptyText: {
      fontSize: 14,
      color: colors.muted,
      fontStyle: "italic",
      textAlign: "center",
      paddingVertical: 12,
    },
    // Riwayat item
    riwayatItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 6,
      gap: 10,
    },
    riwayatTeks: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    // Favorit item
    favoritItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 6,
      gap: 10,
    },
    favoritNama: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    // Cache item
    cacheItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 6,
      gap: 10,
    },
    cacheInfo: { flex: 1 },
    cacheNama: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    cacheWaktu: {
      fontSize: 11,
      color: colors.muted,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
  });

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scrollContent}>

        {/* ── SECTION: Riwayat Pencarian ── */}
        <View>
          <View style={s.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="time-outline" size={18} color={colors.active} />
              <Text style={s.sectionTitle}>Riwayat Pencarian</Text>
              {daftarRiwayatCari.length > 0 && (
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  ({daftarRiwayatCari.length})
                </Text>
              )}
            </View>
            {daftarRiwayatCari.length > 0 && (
              <TouchableOpacity
                accessibilityLabel="Hapus semua riwayat pencarian"
                onPress={hapusSemuaRiwayat}
              >
                <Text style={s.hapusSemua}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          {daftarRiwayatCari.length === 0 ? (
            <Text style={s.emptyText}>Belum ada riwayat pencarian</Text>
          ) : (
            daftarRiwayatCari.map((keyword, idx) => (
              <TouchableOpacity
                key={`riwayat-${idx}`}
                style={s.riwayatItem}
                onPress={() => klikRiwayat(keyword)}
                accessibilityLabel={`Cari kembali ${keyword}`}
              >
                <Ionicons name="search-outline" size={16} color={colors.muted} />
                <Text style={s.riwayatTeks}>{keyword}</Text>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => hapusSatuRiwayat(keyword)}
                  accessibilityLabel={`Hapus riwayat ${keyword}`}
                >
                  <Ionicons name="close-circle" size={18} color={colors.muted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={s.divider} />

        {/* ── SECTION: Kota Favorit ── */}
        <View>
          <View style={s.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="star-outline" size={18} color={colors.active} />
              <Text style={s.sectionTitle}>Kota Favorit</Text>
              {daftarFavorit.length > 0 && (
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  ({daftarFavorit.length})
                </Text>
              )}
            </View>
          </View>

          {daftarFavorit.length === 0 ? (
            <Text style={s.emptyText}>Belum ada kota favorit</Text>
          ) : (
            daftarFavorit.map((kota) => (
              <TouchableOpacity
                key={`favorit-${kota.id}`}
                style={s.favoritItem}
                onPress={() => klikRiwayat(kota.nama)}
                accessibilityLabel={`Cari cuaca ${kota.nama}`}
              >
                <Ionicons name="location-outline" size={16} color={colors.active} />
                <Text style={s.favoritNama}>{kota.nama}</Text>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => hapusFavoritKonfirmasi(kota.id, kota.nama)}
                  accessibilityLabel={`Hapus favorit ${kota.nama}`}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={s.divider} />

        {/* ── SECTION: Kota Tersimpan (Cache Offline) ── */}
        <View>
          <View style={s.sectionHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Ionicons name="cloud-offline-outline" size={18} color={colors.active} />
              <Text style={s.sectionTitle}>Tersimpan Offline</Text>
              {kotaTersimpan.length > 0 && (
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  ({kotaTersimpan.length})
                </Text>
              )}
            </View>
          </View>
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8 }}>
            Kota-kota ini bisa dibuka tanpa koneksi internet.
          </Text>

          {kotaTersimpan.length === 0 ? (
            <Text style={s.emptyText}>Belum ada data cuaca tersimpan</Text>
          ) : (
            kotaTersimpan.map((k) => (
              <View key={`cache-${k.kunci}`} style={s.cacheItem}>
                <TouchableOpacity
                  style={s.cacheInfo}
                  onPress={() => klikRiwayat(k.nama)}
                  accessibilityLabel={`Lihat cuaca ${k.nama}`}
                >
                  <Text style={s.cacheNama}>{k.nama}</Text>
                  <Text style={s.cacheWaktu}>
                    Diperbarui: {formatWaktu(k.disimpanPada)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => hapusCacheKota(k)}
                  accessibilityLabel={`Hapus cache ${k.nama}`}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
