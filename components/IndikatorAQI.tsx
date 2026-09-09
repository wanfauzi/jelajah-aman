import { View, Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";
export default function IndikatorAQI({ kota, indeksAQI, tingkat, diperbaruiPada }: LaporanUdara) {
  const warna =
    tingkat === "BAIK" ? "#22C55E" : tingkat === "SEDANG" ? "#EAB308" : tingkat === "TIDAK_SEHAT" ? "#F97316" : "#EF4444";
  return (
    <View style={{ padding: 16, borderRadius: 8, backgroundColor: warna }}>
      <Text style={{ fontWeight: "bold", color: "white" }}>{kota}</Text>
      <Text style={{ color: "white" }}>AQI {indeksAQI} — {tingkat}</Text>
      {diperbaruiPada ? <Text style={{ color: "white", fontSize: 12 }}>{diperbaruiPada}</Text> : null}
    </View>
  );
}
