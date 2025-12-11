import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MaintenanceConfig } from "@shared/api";

const DEFAULT_CONFIG: MaintenanceConfig = {
  enabled: false,
  message: "The system is currently under maintenance. Please try again later.",
  lastUpdated: new Date().toISOString(),
};

export function useMaintenanceMode() {
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>(
    DEFAULT_CONFIG
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "appConfig", "maintenance"),
      (doc) => {
        if (doc.exists()) {
          setMaintenanceConfig(doc.data() as MaintenanceConfig);
        } else {
          setMaintenanceConfig(DEFAULT_CONFIG);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error loading maintenance config:", error);
        setMaintenanceConfig(DEFAULT_CONFIG);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    isMaintenanceEnabled: maintenanceConfig.enabled,
    maintenanceMessage: maintenanceConfig.message,
    loading,
  };
}
