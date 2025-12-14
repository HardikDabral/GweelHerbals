"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme immediately on mount - no delay
    if (typeof window !== "undefined") {
      let savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "dark";

      // Force light mode on mobile/tablet devices
      if (window.innerWidth < 1024) {
        savedTheme = "light";
        localStorage.setItem("theme", "light");
      }

      const root = document.documentElement;

      // Remove any existing dark class first
      root.classList.remove("dark");

      // Apply theme immediately
      if (savedTheme === "dark") {
        root.classList.add("dark");
      }

      // Sync store
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return <>{children}</>;
}
