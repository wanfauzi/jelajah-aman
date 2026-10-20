// src/app/detail/[kota].tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";
import WeatherCard from "../../components/WeatherCard";
import { useTheme } from "../../hooks/use-theme";
export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  return (
    <View style={{ padding: 16, gap: 16, backgroundColor: useTheme().colors.background }}>
      <WeatherCard kota={kota} suhu={29} tingkatAQI="BAIK" />
      <Button
        title="Tambahkan ke Favorit"
        onPress={() => router.push("/tambah-favorit")}
      />
    </View>
  );
}
