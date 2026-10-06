// src/app/(tabs)/riwayat.tsx
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import { KotaFavorit } from "../../types/favorit";
export default function TabRiwayat() {
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
    }, []),
  );
  function hapus(id: number, nama: string) {
    const pesan = `Yakin hapus ${nama}?`;
    const deskripsi = `Kota ${nama} akan dihapus dari favorit.`;
    if (Platform.OS === "web") {
      if (window.confirm(`${pesan}\n${deskripsi}`)) {
        eksekusiHapus(id);
      }
      return;
    }
    Alert.alert(pesan, deskripsi, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => eksekusiHapus(id) },
    ]);
  }
  async function eksekusiHapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Kota Favorit</Text>
      <Text style={{ fontSize: 14, color: "#666" }}>
        Tersimpan {daftarFavorit.length} kota
      </Text>
      {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}
      {daftarFavorit.map((kota) => (
        <View
          key={kota.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>{kota.nama}</Text>
          <Button title="Hapus" onPress={() => hapus(kota.id, kota.nama)} />
        </View>
      ))}
    </SafeAreaView>
  );
}
