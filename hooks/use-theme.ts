// hooks/use-theme.ts
import { useThemeContext } from "./theme-context";
import { Colors } from "../constants/theme";

export function useTheme() {
  const { colors, skema } = useThemeContext();
  return {
    colors: colors as (typeof Colors)["light"],
    skema,
  };
}