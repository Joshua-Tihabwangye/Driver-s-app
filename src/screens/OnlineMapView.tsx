import {
  Activity,
  AlertTriangle,
  MapPin,
  Navigation,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import { useStore } from "../context/StoreContext";

const DriverMapSurface = lazy(() => import("../components/DriverMapSurface"));

function QuickAction({
  icon: Icon,
  label,
  sub,
  onClick,
  tone = "default",
}: any) {
  const isDanger = tone === "danger";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border-2 bg-cream shadow-sm px-3 py-3 active:scale-[0.97] hover:scale-[1.02] hover:shadow-md transition-all duration-300 ${
        isDanger
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-orange-500/10 hover:border-orange-500/30"
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full mb-1 ${
          isDanger ? "bg-red-50" : "bg-orange-50"
        }`}
      >
        <Icon className={`h-4 w-4 ${isDanger ? "text-red-600" : "text-orange-500"}`} />
      </div>
      <span
        className={`text-xs font-semibold mb-0.5 truncate w-full text-left ${
          isDanger ? "text-red-700" : "text-slate-900"
        }`}
      >
        {label}
      </span>
      <span className={`text-[11px] truncate w-full text-left ${isDanger ? "text-red-500" : "text-slate-500"}`}>
        {sub}
      </span>
    </button>
  );
}

export default function OnlineMapView({
  homeMode = false,
  showQuickActions = false,
}: {
  homeMode?: boolean;
  showQuickActions?: boolean;
}) {
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const navigate = useNavigate();
  const { driverPresenceStatus, driverBootstrapReady, setDriverOffline, respondToSafetyCheck } = useStore();

  useEffect(() => {
    // Do not redirect until the bootstrap has resolved — on a hard refresh the
    // presence status starts as "offline" even when the driver is actually online.
    if (!driverBootstrapReady) return;
    if (driverPresenceStatus !== "online") {
      navigate("/driver/dashboard/offline", { replace: true });
    }
  }, [driverBootstrapReady, driverPresenceStatus, navigate]);

  const handleEmergencySos = () => {
    respondToSafetyCheck("driver", "sos");
    navigate("/driver/safety/sos/sending");
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Suspense
        fallback={
          <div
            className={`flex items-center justify-center rounded-[2rem] border border-slate-200 bg-[linear-gradient(130deg,rgba(235,242,250,0.96)_0%,rgba(226,244,239,0.96)_100%)] shadow-2xl ${showQuickActions ? "h-[460px]" : "h-[540px]"}`}
          >
            <div className="rounded-3xl border border-white/70 bg-white/90 px-5 py-4 text-center shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Loading map
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-700">
                Preparing online view...
              </p>
            </div>
          </div>
        }
      >
        <DriverMapSurface
          heightClass={showQuickActions ? "h-[460px]" : "h-[540px]"}
          onBack={!homeMode ? () => navigate(-1) : undefined}
          onSos={handleEmergencySos}
          defaultZoom={12}
          defaultTrafficOn
          defaultAlertsOn={false}
          defaultStationsOn={false}
          stationMarkers={[]}
          topBadge={(
            <button
              type="button"
              onClick={() => setShowOfflineModal(true)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white/96 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-800 shadow-lg backdrop-blur-sm"
            >
              <Wifi className="mr-2 h-3.5 w-3.5 animate-pulse text-[#15b79e]" />
              Online
            </button>
          )}
          markers={[]}
        >
          {!homeMode && (
            <div className="absolute left-4 top-[96px] z-20 rounded-full border border-emerald-200 bg-white/92 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 shadow-lg backdrop-blur-sm">
              Requests scanning active
            </div>
          )}
        </DriverMapSurface>
      </Suspense>

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            {homeMode ? "Driver Dashboard" : "Navigation Explorer"}
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            {homeMode ? "Active Driver Operations" : "Real-time Map Navigation"}
          </h1>
        </section>

        {showQuickActions && (
          <section className="mt-4 space-y-3 pb-2 px-4">
            <div className="px-1">
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                icon={MapPin}
                label="Map Settings"
                sub="Layers & Alerts"
                onClick={() => navigate("/driver/map/settings")}
              />
              <QuickAction
                icon={Activity}
                label="Performance"
                sub="Insights"
                onClick={() => navigate("/driver/dashboard/active")}
              />
              <QuickAction
                icon={Navigation}
                label="Scan Riders"
                sub="Find Jobs"
                onClick={() => navigate("/driver/map/searching")}
              />
              <QuickAction
                icon={AlertTriangle}
                label="SOS"
                sub="Emergency"
                tone="danger"
                onClick={handleEmergencySos}
              />
              <QuickAction
                icon={ShieldCheck}
                label="Safety"
                sub="Hub"
                onClick={() => navigate("/driver/safety/hub")}
              />
            </div>
          </section>
        )}

        <OfflineConfirmModal
          isOpen={showOfflineModal}
          onConfirm={() => {
            setShowOfflineModal(false);
            setDriverOffline();
            navigate("/driver/dashboard/offline");
          }}
          onCancel={() => setShowOfflineModal(false)}
        />
      </main>
    </div>
  );
}
