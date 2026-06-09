import { useEffect, useState } from "react";
import {
  DRIVER_BACKEND_AUTH_EVENT,
  DRIVER_BACKEND_CAPABILITIES_EVENT,
  getDriverBackendCapabilities,
  loadDriverBackendCapabilities,
} from "../../services/api/driverApi";

export function useDriverSharedRidesEnabled(): boolean {
  const [sharedRidesEnabled, setSharedRidesEnabled] = useState(
    () => getDriverBackendCapabilities().sharedRidesEnabled,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncCapabilities = () => {
      setSharedRidesEnabled(getDriverBackendCapabilities().sharedRidesEnabled);
    };

    void loadDriverBackendCapabilities().then(syncCapabilities).catch(() => undefined);
    window.addEventListener(DRIVER_BACKEND_CAPABILITIES_EVENT, syncCapabilities as EventListener);
    window.addEventListener(DRIVER_BACKEND_AUTH_EVENT, syncCapabilities as EventListener);
    syncCapabilities();

    return () => {
      window.removeEventListener(DRIVER_BACKEND_CAPABILITIES_EVENT, syncCapabilities as EventListener);
      window.removeEventListener(DRIVER_BACKEND_AUTH_EVENT, syncCapabilities as EventListener);
    };
  }, []);

  return sharedRidesEnabled;
}
