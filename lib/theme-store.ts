import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
}

interface ThemeState {
  currentTheme: string
  customColors: ThemeColors
  setTheme: (theme: string) => void
  setCustomColors: (colors: ThemeColors) => void
  resetTheme: () => void
}

const defaultColors: ThemeColors = {
  primary: "#374151",
  secondary: "#6B7280",
  accent: "#3B82F6",
  background: "#FAFAFA",
  surface: "#FFFFFF",
}

const themePresets = {
  default: defaultColors,
  purple: {
    primary: "#7C3AED",
    secondary: "#A78BFA",
    accent: "#8B5CF6",
    background: "#FAF5FF",
    surface: "#FFFFFF",
  },
  pink: {
    primary: "#EC4899",
    secondary: "#F472B6",
    accent: "#F97316",
    background: "#FDF2F8",
    surface: "#FFFFFF",
  },
  green: {
    primary: "#059669",
    secondary: "#34D399",
    accent: "#10B981",
    background: "#F0FDF4",
    surface: "#FFFFFF",
  },
  blue: {
    primary: "#2563EB",
    secondary: "#60A5FA",
    accent: "#3B82F6",
    background: "#EFF6FF",
    surface: "#FFFFFF",
  },
  orange: {
    primary: "#EA580C",
    secondary: "#FB923C",
    accent: "#F97316",
    background: "#FFF7ED",
    surface: "#FFFFFF",
  },
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: "default",
      customColors: defaultColors,
      setTheme: (theme: string) => {
        const colors = themePresets[theme as keyof typeof themePresets] || defaultColors
        set({ currentTheme: theme, customColors: colors })
        applyThemeToDOM(colors)
      },
      setCustomColors: (colors: ThemeColors) => {
        set({ currentTheme: "custom", customColors: colors })
        applyThemeToDOM(colors)
      },
      resetTheme: () => {
        set({ currentTheme: "default", customColors: defaultColors })
        applyThemeToDOM(defaultColors)
      },
    }),
    {
      name: "diary-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToDOM(state.customColors)
        }
      },
    },
  ),
)

function applyThemeToDOM(colors: ThemeColors) {
  if (typeof document !== "undefined") {
    const root = document.documentElement
    root.style.setProperty("--theme-primary", colors.primary)
    root.style.setProperty("--theme-secondary", colors.secondary)
    root.style.setProperty("--theme-accent", colors.accent)
    root.style.setProperty("--theme-background", colors.background)
    root.style.setProperty("--theme-surface", colors.surface)
  }
}

export { themePresets, type ThemeColors }
