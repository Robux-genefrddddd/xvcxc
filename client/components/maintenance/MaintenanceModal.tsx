import { AlertCircle } from "lucide-react";
import { getThemeColors } from "@/lib/theme-colors";

interface MaintenanceModalProps {
  message: string;
  onDismiss: () => void;
}

export function MaintenanceModal({
  message,
  onDismiss,
}: MaintenanceModalProps) {
  const colors = getThemeColors("dark");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={onDismiss}
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full border shadow-2xl overflow-hidden relative"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          animation: "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)",
          }}
        />

        {/* Icon */}
        <div className="relative mb-6 flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
            }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative text-center space-y-4">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: colors.text }}
          >
            Maintenance
          </h2>

          <p
            className="text-sm leading-relaxed"
            style={{
              color: colors.textSecondary,
            }}
          >
            {message}
          </p>

          {/* Divider */}
          <div
            className="h-px my-6"
            style={{
              backgroundColor: colors.border,
            }}
          />

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#EF4444" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: colors.textSecondary }}
            >
              We'll be back soon
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onDismiss}
          className="relative mt-8 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 group"
          style={{
            backgroundColor: colors.accent,
            color: colors.primary === "#3B82F6" ? "white" : colors.primary,
            boxShadow: `0 8px 24px ${colors.primary}33`,
          }}
        >
          <span className="relative z-10">Got it</span>
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"
            style={{ backgroundColor: "#FFFFFF" }}
          />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
