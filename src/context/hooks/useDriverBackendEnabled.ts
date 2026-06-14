import { useEffect, useState } from "react";
import { BACKEND_FLAG_EVENT } from "../../services/api/config";
import { DRIVER_BACKEND_AUTH_EVENT, shouldUseDriverBackendWrites } from "../../services/api/driverApi";

export function useDriverBackendEnabled(): boolean {
  // Read synchronously so the initial value is correct without waiting for
  // a useEffect + event. This prevents the bootstrap hook from running twice
  // (once with enabled=false then again when the auth event fires).
  const [driverBackendEnabled, setDriverBackendEnabled] = useState(
    () => shouldUseDriverBackendWrites()
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncBackendFlag = () => {
      setDriverBackendEnabled(shouldUseDriverBackendWrites());
    };

    window.addEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
    window.addEventListener(DRIVER_BACKEND_AUTH_EVENT, syncBackendFlag as EventListener);

    return () => {
      window.removeEventListener(BACKEND_FLAG_EVENT, syncBackendFlag as EventListener);
      window.removeEventListener(DRIVER_BACKEND_AUTH_EVENT, syncBackendFlag as EventListener);
    };
  }, []);

  return driverBackendEnabled;
}
