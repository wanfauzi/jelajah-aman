import { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import { HasilGeocoding } from "../../types/geocoding";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasil, setHasil] = useState<HasilGeocoding[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 800);
  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasil([]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPesanError(null);
      return;
    }
    ambilData(teksTertunda);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teksTertunda]);
  async function ambilData(nama: string) {
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await cariKota(nama);
      setHasil(data);
    } catch {
      setPesanError("Gagal mengambil data. Periksa koneksi internet Anda.");
    } finally {
      setSedangMemuat(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 16 }}>
      <SearchBox onCari={setTeksCari} />
      {sedangMemuat && <ActivityIndicator />}
      {pesanError && (
        <View>
          <Text accessibilityLabel="Pesan error gagal memuat data">
            {pesanError}
          </Text>
          <Button title="Coba Lagi" onPress={() => ambilData(teksTertunda)} />
        </View>
      )}
      {!sedangMemuat && !pesanError && hasil.length > 0 && (
        <Text>Ditemukan {hasil.length} kota</Text>
      )}
      {!sedangMemuat &&
        !pesanError &&
        teksTertunda.length > 0 &&
        hasil.length === 0 && (
          <Text accessibilityLabel="Pesan kota tidak ditemukan">
            Kota tidak ditemukan
          </Text>
        )}
      {hasil.map((kota) => (
        <WeatherCard
          key={kota.id}
          kota={kota.name}
          suhu={29}
          tingkatAQI="BAIK"
        />
      ))}
    </SafeAreaView>
  );
}
