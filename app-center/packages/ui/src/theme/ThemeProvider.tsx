"use client";

import {
  ThemeProvider as NextThemesProvider,
  useTheme as useThemeNext,
} from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
export function useTheme() {
  return useThemeNext();
}
