import { useState, useEffect } from "react";
import { AlertCircle, Save } from "lucide-react";
import { getThemeColors } from "@/lib/theme-colors";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserRole, canToggleMaintenance } from "@/lib/auth-utils";

interface MaintenanceConfig {
  enabled: boolean;
  message: string;
  mode: "warning" | "global";
}

interface AdminMaintenanceModeProps {
  theme: string;
  userRole: UserRole;
}

export function AdminMaintenanceMode({
  theme,
  userRole,
}: AdminMaintenanceModeProps) {
  const colors = getThemeColors(theme);
  const [config, setConfig] = useState<MaintenanceConfig>({
    enabled: false,
    message:
      "The system is currently under maintenance. Please try again later.",
    mode: "warning",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const configDoc = await getDoc(doc(db, "appConfig", "maintenance"));
      if (configDoc.exists()) {
        const data = configDoc.data();
        setConfig({
          enabled: data.enabled || false,
          message:
            data.message ||
            "The system is currently under maintenance. Please try again later.",
          mode: data.mode || "warning",
        });
      }
    } catch (error) {
      console.error("Error loading maintenance config:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig: MaintenanceConfig) => {
    try {
      await setDoc(doc(db, "appConfig", "maintenance"), {
        enabled: newConfig.enabled,
        message: newConfig.message,
        mode: newConfig.mode,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving maintenance config:", error);
    }
  };

  const handleToggleMaintenance = () => {
    if (!canToggleMaintenance(userRole)) {
      alert("You don't have permission to toggle maintenance mode");
      return;
    }
    const newConfig = { ...config, enabled: !config.enabled };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleMessageChange = (newMessage: string) => {
    const newConfig = { ...config, message: newMessage };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleModeChange = (newMode: "warning" | "global") => {
    if (!canToggleMaintenance(userRole)) {
      alert("You don't have permission to change maintenance mode");
      return;
    }
    const newConfig = { ...config, mode: newMode };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  if (!canToggleMaintenance(userRole)) {
    return (
      <div
        className="p-6 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-1" style={{ color: "#EF4444" }} />
          <div>
            <h3 className="font-semibold" style={{ color: colors.text }}>
              Access Denied
            </h3>
            <p style={{ color: colors.textSecondary }} className="text-sm mt-1">
              Only founders can manage maintenance mode.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold" style={{ color: colors.text }}>
        Maintenance Mode
      </h3>

      {/* Warning Modal Toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div>
          <h4 className="font-semibold" style={{ color: colors.text }}>
            Warning Modal
          </h4>
          <p style={{ color: colors.textSecondary }} className="text-sm mt-1">
            Shows a popup, users can dismiss it
          </p>
        </div>
        <button
          onClick={() => handleModeChange("warning")}
          className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
          style={{
            backgroundColor:
              config.mode === "warning" ? colors.accent : colors.sidebar,
          }}
        >
          <span
            className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
            style={{
              transform:
                config.mode === "warning"
                  ? "translateX(28px)"
                  : "translateX(2px)",
            }}
          />
        </button>
      </div>

      {/* Global Maintenance Toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div>
          <h4 className="font-semibold" style={{ color: colors.text }}>
            Global Maintenance
          </h4>
          <p style={{ color: colors.textSecondary }} className="text-sm mt-1">
            Full page blackout - entire site becomes inaccessible with
            maintenance screen
          </p>
        </div>
        <button
          onClick={() => handleModeChange("global")}
          className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
          style={{
            backgroundColor:
              config.mode === "global" ? colors.accent : colors.sidebar,
          }}
        >
          <span
            className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
            style={{
              transform:
                config.mode === "global"
                  ? "translateX(28px)"
                  : "translateX(2px)",
            }}
          />
        </button>
      </div>

      {/* Enable Maintenance Toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div>
          <h4 className="font-semibold" style={{ color: colors.text }}>
            Enable Maintenance Mode
          </h4>
          <p style={{ color: colors.textSecondary }} className="text-sm mt-1">
            Activates{" "}
            {config.mode === "warning" ? "warning modal" : "global maintenance"}
          </p>
        </div>
        <button
          onClick={handleToggleMaintenance}
          className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
          style={{
            backgroundColor: config.enabled ? colors.accent : colors.sidebar,
          }}
        >
          <span
            className="inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
            style={{
              transform: config.enabled
                ? "translateX(28px)"
                : "translateX(2px)",
            }}
          />
        </button>
      </div>

      {/* Message Editor */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <label
          className="block font-semibold mb-3"
          style={{ color: colors.text }}
        >
          Maintenance Message
        </label>
        <textarea
          value={config.message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Enter the message users will see during maintenance..."
          className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none resize-none"
          rows={4}
          style={{
            backgroundColor: colors.sidebar,
            borderColor: colors.border,
            color: colors.text,
          }}
        />
        <p style={{ color: colors.textSecondary }} className="text-xs mt-2">
          This message will be displayed to all users when maintenance mode is
          enabled.
        </p>
      </div>

      {/* Admin Bypass Info */}
      {config.enabled && (
        <div
          className="p-4 rounded-lg border flex items-start gap-3"
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "rgba(59, 130, 246, 0.3)",
          }}
        >
          <AlertCircle
            className="w-5 h-5 mt-0.5"
            style={{ color: colors.primary }}
          />
          <div>
            <p className="font-semibold" style={{ color: colors.text }}>
              Admin Bypass
            </p>
            <p style={{ color: colors.textSecondary }} className="text-sm mt-1">
              When maintenance is active, press{" "}
              <kbd
                style={{
                  backgroundColor: colors.sidebar,
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                }}
              >
                F12
              </kbd>{" "}
              to access the admin panel without seeing the maintenance screen.
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {config.enabled && (
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: colors.sidebar,
            borderColor: colors.border,
          }}
        >
          <h4 className="font-semibold mb-3" style={{ color: colors.text }}>
            Preview
          </h4>
          <div
            className="p-4 rounded-lg border text-center"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderColor: "rgba(239, 68, 68, 0.3)",
            }}
          >
            <AlertCircle
              className="w-8 h-8 mx-auto mb-3"
              style={{ color: "#EF4444" }}
            />
            <h3 className="font-bold mb-2" style={{ color: "#EF4444" }}>
              Maintenance Mode
            </h3>
            <p style={{ color: colors.text }}>{config.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
