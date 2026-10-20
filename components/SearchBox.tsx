// src/components/SearchBox.tsx
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "../hooks/use-theme";
interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilai?: string;
}
export default function SearchBox({ onCari, nilai }: SearchBoxProps) {
  const { colors } = useTheme();
  const [teks, setTeks] = useState("");
  useEffect(() => {
    if (nilai !== undefined) setTeks(nilai);
  }, [nilai]);
  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }
  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={colors.muted}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 8,
          borderRadius: 8,
          color: colors.text,
          backgroundColor: colors.background,
        }}
      />
    </View>
  );
}