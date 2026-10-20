// db/database.web.ts
// Di web, expo-sqlite menggunakan Web Worker yang tidak selalu kompatibel dengan Metro.
// Kita sediakan stub kosong agar import tidak error — cacheRepository.web.ts
// yang akan menangani semua operasi tanpa SQLite.

export function ambilDatabase(): never {
  throw new Error("SQLite tidak tersedia di web. Gunakan cacheRepository.web.ts");
}
