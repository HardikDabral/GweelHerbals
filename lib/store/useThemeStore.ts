import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: typeof window !== "undefined" 
    ? (localStorage.getItem("theme") as "light" | "dark") || "dark"
    : "dark",
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    // Update DOM immediately and synchronously
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("dark");
      if (newTheme === "dark") {
        root.classList.add("dark");
      }
      localStorage.setItem("theme", newTheme);
    }
    
    // Update state
    set({ theme: newTheme });
  },
  setTheme: (theme) => {
    // Update DOM immediately and synchronously
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("dark");
      if (theme === "dark") {
        root.classList.add("dark");
      }
      localStorage.setItem("theme", theme);
    }
    set({ theme });
  },
}));
