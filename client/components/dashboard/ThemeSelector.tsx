import { Moon, Sun, Palette, Zap, Leaf, Sparkles } from "lucide-react";

interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  {
    id: "dark",
    name: "Dark Mode",
    icon: Moon,
    description: "Professional dark theme for night viewing",
  },
  {
    id: "light",
    name: "Light Mode",
    icon: Sun,
    description: "Soft light theme with pastel tones",
  },
  {
    id: "blue",
    name: "Ocean Blue",
    icon: Palette,
    description: "Cool blue accent theme",
  },
  {
    id: "purple",
    name: "Purple Dream",
    icon: Sparkles,
    description: "Modern purple accent theme",
  },
  {
    id: "green",
    name: "Forest Green",
    icon: Leaf,
    description: "Nature-inspired green theme",
  },
  {
    id: "amber",
    name: "Warm Amber",
    icon: Zap,
    description: "Warm and energetic theme",
  },
];

export function ThemeSelector({ theme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-6">
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: theme === "dark" ? "#111214" : "#F9FAFB",
          borderColor: theme === "dark" ? "#1F2124" : "#E5E7EB",
        }}
      >
        <h3
          className="text-lg font-bold mb-6"
          style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
        >
          Customize Your Theme
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;

            return (
              <button
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className="p-6 rounded-lg border-2 transition-all text-left hover:opacity-80"
                style={{
                  backgroundColor: theme === "dark" ? "#141518" : "#FFFFFF",
                  borderColor: isActive
                    ? "#3B82F6"
                    : theme === "dark"
                      ? "#1F2124"
                      : "#E5E7EB",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon
                    className="w-6 h-6"
                    style={{
                      color: isActive
                        ? "#3B82F6"
                        : theme === "dark"
                          ? "#9CA3AF"
                          : "#6B7280",
                    }}
                  />
                  {isActive && (
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded"
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        color: "#3B82F6",
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>

                <p
                  className="font-medium"
                  style={{ color: theme === "dark" ? "#FFFFFF" : "#111827" }}
                >
                  {t.name}
                </p>
                <p
                  className="text-sm mt-2"
                  style={{ color: theme === "dark" ? "#9CA3AF" : "#6B7280" }}
                >
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
