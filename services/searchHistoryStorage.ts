// services/searchHistoryStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KUNCI_PENYIMPANAN = "@jelajah_aman:riwayat_cari";
const BATAS_JUMLAH = 10;

export async function ambilRiwayatPencarian(): Promise<string[]> {
  const json = await AsyncStorage.getItem(KUNCI_PENYIMPANAN);
  return json ? JSON.parse(json) : [];
}

export async function tambahRiwayatPencarian(teks: string): Promise<void> {
  const kata = teks.trim();
  if (!kata) return;
  const daftar = await ambilRiwayatPencarian();
  const daftarBaru = [kata, ...daftar.filter((k) => k !== kata)].slice(
    0,
    BATAS_JUMLAH,
  );
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusRiwayatPencarian(teks: string): Promise<void> {
  const daftar = await ambilRiwayatPencarian();
  const daftarBaru = daftar.filter((k) => k !== teks);
  await AsyncStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(daftarBaru));
}

export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_PENYIMPANAN);
}