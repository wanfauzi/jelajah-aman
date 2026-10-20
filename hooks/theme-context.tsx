// hooks/theme-context.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

export type TemaPreferensi = "terang" | "gelap" | "sistem";

const KUNCI_TEMA = "@jelajah_aman:tema";

interface KonteksTema {
  colors: Record<string, string>;
  skema: "light" | "dark";
  temaPreferensi: TemaPreferensi;
  setTemaPreferensi: (tema: TemaPreferensi) => void;
}

const KonteksTema = createContext<KonteksTema | null>(null);

const TEMA_TERTULIS: Record<TemaPreferensi, "light" | "dark"> = {
  terang: "light",
  gelap: "dark",
  sistem: "light", // fallback: tidak pernah diakses (kondisi 'sistem' ditangani sebelumnya)
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const sistem = useColorScheme();
  const [temaPreferensi, setTema] = useState<TemaPreferensi>("sistem");

  useEffect(() => {
    (async () => {
      try {
        const tersimpan = await AsyncStorage.getItem(KUNCI_TEMA);
        if (tersimpan && tersimpan in TEMA_TERTULIS) {
          setTema(tersimpan as TemaPreferensi);
        }
      } catch {
        // Abaikan gagal baca tema, pakai default sistem
      }
    })();
  }, []);

  const skema: "light" | "dark" =
    temaPreferensi === "sistem"
      ? sistem === "dark"
        ? "dark"
        : "light"
      : TEMA_TERTULIS[temaPreferensi];

  const nilai = useMemo<KonteksTema>(
    () => ({
      colors: Colors[skema],
      skema,
      temaPreferensi,
      setTemaPreferensi: (tema) => {
        setTema(tema);
        AsyncStorage.setItem(KUNCI_TEMA, tema).catch(() => {});
      },
    }),
    [skema, temaPreferensi],
  );

  return (
    <KonteksTema.Provider value={nilai}>{children}</KonteksTema.Provider>
  );
}

export function useThemeContext(): KonteksTema {
  const ctx = useContext(KonteksTema);
  if (!ctx) throw new Error("useThemeContext harus dipakai di dalam ThemeProvider");
  return ctx;
}