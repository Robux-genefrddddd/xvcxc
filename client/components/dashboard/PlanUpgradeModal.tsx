import { X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { getThemeColors } from "@/lib/theme-colors";
import { db } from "@/lib/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import Confetti from "react-confetti-boom";

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
  userId: string;
  onUpgradePlan: (plan: any) => void;
}

export function PlanUpgradeModal({
  isOpen,
  onClose,
  theme,
  userId,
  onUpgradePlan,
}: PlanUpgradeModalProps) {
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const colors = getThemeColors(theme);

  const handleValidateKey = async () => {
    if (!keyInput.trim()) {
      setError("Please enter a premium key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Validate key format (example: PINPIN-XXXX-XXXX-XXXX)
      if (!/^PINPIN-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(keyInput)) {
        setError("Invalid key format. Expected: PINPIN-XXXX-XXXX-XXXX");
        setLoading(false);
        return;
      }

      // Check if key exists and is not used
      const keysRef = doc(db, "premiumKeys", keyInput);
      const keyDoc = await getDoc(keysRef);

      if (!keyDoc.exists()) {
        setError("Premium key not found");
        setLoading(false);
        return;
      }

      const keyData = keyDoc.data();
      if (keyData.used) {
        setError("This key has already been used");
        setLoading(false);
        return;
      }

      // Update user plan to premium
      const userPlanRef = doc(db, "userPlans", userId);
      const userPlanDoc = await getDoc(userPlanRef);

      if (userPlanDoc.exists()) {
        await updateDoc(userPlanRef, {
          type: "premium",
          storageLimit: 1000 * 1024 * 1024, // 1GB for premium
          validatedAt: new Date().toISOString(),
        });
      }

      // Mark key as used
      await updateDoc(keysRef, {
        used: true,
        usedBy: userId,
        usedAt: new Date().toISOString(),
      });

      onUpgradePlan({
        type: "premium",
        storageLimit: 1000 * 1024 * 1024,
        storageUsed: 0,
        validatedAt: new Date().toISOString(),
      });

      setSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setTimeout(() => {
        onClose();
        setKeyInput("");
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error validating key:", err);
      setError("Error validating key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      {showConfetti && <Confetti particleCount={50} />}

      <div
        className="w-full max-w-md rounded-xl border shadow-2xl"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderColor: colors.border,
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: colors.text }}>
            {success ? "Plan Upgraded!" : "Upgrade to Premium"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:opacity-60 transition-opacity"
            style={{
              color: colors.textSecondary,
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!success ? (
            <>
              <div>
                <p
                  className="text-sm mb-4"
                  style={{
                    color: colors.textSecondary,
                  }}
                >
                  Enter your premium activation key to unlock unlimited storage
                  and advanced features.
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{
                    color: colors.text,
                  }}
                >
                  Premium Key
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                  placeholder="PINPIN-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-lg border text-sm font-mono"
                  style={{
                    backgroundColor: colors.accentLight,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                  disabled={loading}
                />
              </div>

              {error && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    color: "#EF4444",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <h3
                  className="font-semibold text-sm"
                  style={{ color: colors.text }}
                >
                  Premium Benefits:
                </h3>
                <ul
                  className="space-y-2 text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>1 GB Storage (vs 100 MB free)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Priority Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Advanced File Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Unlimited Share Links</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto animate-bounce"
                style={{
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                }}
              >
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: colors.text }}>
                  Premium Activated!
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{
                    color: colors.textSecondary,
                  }}
                >
                  Your account has been upgraded to premium.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div
            className="px-6 py-4 border-t"
            style={{
              borderColor: colors.border,
            }}
          >
            <button
              onClick={handleValidateKey}
              disabled={loading}
              className="w-full py-2 px-4 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: colors.accentLight,
                color: colors.primary,
              }}
            >
              {loading ? "Validating..." : "Activate Key"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
