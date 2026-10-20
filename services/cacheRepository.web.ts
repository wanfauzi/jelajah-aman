// services/cacheRepository.web.ts
// Versi web dari cacheRepository — menggunakan AsyncStorage (bukan SQLite)
// karena expo-sqlite Web Worker tidak kompatibel dengan Metro bundler.
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DataTersimpan,
  KotaUntukCache,
  RingkasanKotaTersimpan,
} from "../types/cache";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";

const PREFIX = "@jelajah_aman:cache:";
const INDEX_KEY = "@jelajah_aman:cache_index";
const MAX_ITEMS = 5;

export function buatKunci(latitude: number, longitude: number): string {
  return latitude.toFixed(2) + "," + longitude.toFixed(2);
}

// ── Index helper ──────────────────────────────────────────────────────────────
interface IndexEntry {
  kunci: string;
  kota_id: number;
  nama_kota: string;
  latitude: number;
  longitude: number;
  disimpan_pada: number;
}

async function bacaIndex(): Promise<IndexEntry[]> {
  try {
    const json = await AsyncStorage.getItem(INDEX_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

async function simpanIndex(entries: IndexEntry[]): Promise<void> {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(entries));
}

// ── Public API (identik dengan cacheRepository.ts) ────────────────────────────
export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara,
): Promise<void> {
  const kunci = buatKunci(kota.latitude, kota.longitude);
  const sekarang = Date.now();

  // Simpan data utama
  const data: DataTersimpan = {
    cuaca,
    kualitasUdara,
    disimpanPada: sekarang,
  };
  await AsyncStorage.setItem(PREFIX + kunci, JSON.stringify(data));

  // Update index
  let index = await bacaIndex();
  index = index.filter((e) => e.kunci !== kunci); // hapus entri lama jika ada
  index.unshift({
    kunci,
    kota_id: kota.id,
    nama_kota: kota.nama,
    latitude: kota.latitude,
    longitude: kota.longitude,
    disimpan_pada: sekarang,
  });
  // Batasi MAX_ITEMS — hapus yang paling lama
  const terbuang = index.splice(MAX_ITEMS);
  for (const e of terbuang) {
    await AsyncStorage.removeItem(PREFIX + e.kunci).catch(() => {});
  }
  await simpanIndex(index);
}

export async function ambilCache(
  latitude: number,
  longitude: number,
): Promise<DataTersimpan | null> {
  try {
    const kunci = buatKunci(latitude, longitude);
    const json = await AsyncStorage.getItem(PREFIX + kunci);
    if (!json) return null;
    return JSON.parse(json) as DataTersimpan;
  } catch {
    return null;
  }
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  const index = await bacaIndex();
  return index.map((e) => ({
    kunci: e.kunci,
    id: e.kota_id,
    nama: e.nama_kota,
    latitude: e.latitude,
    longitude: e.longitude,
    disimpanPada: e.disimpan_pada,
  }));
}

export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const batas = Date.now() - batasUmurMs;
  const index = await bacaIndex();
  const terbuang = index.filter((e) => e.disimpan_pada < batas);
  const tersisa = index.filter((e) => e.disimpan_pada >= batas);
  for (const e of terbuang) {
    await AsyncStorage.removeItem(PREFIX + e.kunci).catch(() => {});
  }
  if (terbuang.length > 0) await simpanIndex(tersisa);
}

export async function hapusSemuaCache(): Promise<void> {
  const index = await bacaIndex();
  for (const e of index) {
    await AsyncStorage.removeItem(PREFIX + e.kunci).catch(() => {});
  }
  await AsyncStorage.removeItem(INDEX_KEY);
}

export async function hapusCache(kunci: string): Promise<void> {
  await AsyncStorage.removeItem(PREFIX + kunci);
  const index = await bacaIndex();
  await simpanIndex(index.filter((e) => e.kunci !== kunci));
}
