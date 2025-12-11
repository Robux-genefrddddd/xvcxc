import { useState, useEffect } from "react";
import { useMaintenanceMode } from "@/hooks/use-maintenance-mode";
import { getThemeColors } from "@/lib/theme-colors";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserRole } from "@/lib/auth-utils";

const ADMIN_BYPASS_KEY = "F12";

export function MaintenanceScreen() {
  const { isMaintenanceEnabled, maintenanceMessage } = useMaintenanceMode();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          setIsAdmin(role === "admin" || role === "founder");
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isMaintenanceEnabled) {
      setIsVisible(true);
    }
  }, [isMaintenanceEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAdmin && e.key === ADMIN_BYPASS_KEY) {
        e.preventDefault();
        setShowAdminPanel(!showAdminPanel);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin, showAdminPanel]);

  if (!isMaintenanceEnabled || !isVisible) {
    return null;
  }

  if (isAdmin && showAdminPanel) {
    return null;
  }

  const colors = getThemeColors("dark");

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 animate-fade-in"
      style={{
        backgroundColor: colors.background,
        animation: "fadeIn 0.6s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="text-center max-w-2xl">
        <div className="flex justify-center mb-8">
          <div
            className="w-1 h-16 rounded-full"
            style={{
              backgroundColor: "#EF4444",
              animation: "slideDown 0.8s ease-out",
            }}
          />
        </div>

        <h1
          className="text-5xl font-bold mb-6"
          style={{
            color: colors.text,
            animation: "slideUp 0.8s ease-out 0.1s both",
          }}
        >
          Maintenance
        </h1>

        <p
          className="text-xl mb-2"
          style={{
            color: colors.textSecondary,
            animation: "slideUp 0.8s ease-out 0.2s both",
            lineHeight: "1.8",
          }}
        >
          {maintenanceMessage}
        </p>

        {isAdmin && (
          <p
            className="text-xs mt-8"
            style={{
              color: colors.textSecondary,
              animation: "slideUp 0.8s ease-out 0.3s both",
            }}
          >
            Press <kbd style={{
              backgroundColor: "rgba(96, 165, 250, 0.2)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontFamily: "monospace",
              color: colors.accent,
              fontWeight: "600"
            }}>F12</kbd> to access admin
          </p>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
