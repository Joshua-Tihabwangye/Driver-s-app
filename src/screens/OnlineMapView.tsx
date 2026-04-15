import {
  Activity,
  AlertTriangle,
  Compass,
  Layers,
  MapPin,
  Navigation,
  Settings2,
  ShieldCheck,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import { useStore } from "../context/StoreContext";

type MapLayerMode = "standard" | "traffic";

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
  const [zoom, setZoom] = useState(12);
  const [mapLayer, setMapLayer] = useState<MapLayerMode>("standard");
  const [bearing, setBearing] = useState(18);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showTip, setShowTip] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.sessionStorage.getItem("driver_online_map_tip_hidden") !== "1";
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationHint, setLocationHint] = useState<string | null>(null);
  const navigate = useNavigate();
  const { driverPresenceStatus, setDriverOffline } = useStore();

  useEffect(() => {
    if (driverPresenceStatus !== "online") {
      navigate("/driver/dashboard/offline", { replace: true });
    }
  }, [driverPresenceStatus, navigate]);

  useEffect(() => {
    if (!locationHint) {
      return;
    }
    const timer = window.setTimeout(() => setLocationHint(null), 3200);
    return () => window.clearTimeout(timer);
  }, [locationHint]);

  const handleDismissTip = () => {
    setShowTip(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("driver_online_map_tip_hidden", "1");
    }
  };

  const handleRecenterMap = () => {
    setBearing(0);
    setZoom((current) => Math.max(current, 14));

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationHint("Location services unavailable. Map centered to default view.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setLocationHint("Centered on your current location.");
      },
      () => {
        setIsLocating(false);
        setLocationHint("Unable to fetch location. Check GPS permission.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleZoomIn = () => {
    setZoom((value) => Math.min(value + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((value) => Math.max(value - 1, 8));
  };

  const handleToggleLayer = () => {
    setMapLayer((prev) => (prev === "standard" ? "traffic" : "standard"));
  };

  const handleResetBearing = () => {
    setBearing(0);
    setLocationHint("Map orientation reset to north.");
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader
        title={homeMode ? "Dashboard" : "Map Explorer"}
        subtitle={homeMode ? "Online" : "Navigation"}
        hideBack={homeMode}
        onBack={!homeMode ? () => navigate(-1) : undefined}
        rightAction={
          <button
            type="button"
            onClick={() => setShowOfflineModal(true)}
            className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest shrink-0 shadow-sm active:scale-95 transition-transform"
          >
            <Wifi className="h-3 w-3 mr-1.5 animate-pulse text-brand-active" />
            Online
          </button>
        }
      />

      <main className="flex-1 pt-3 pb-16">
        <section className={`relative w-full overflow-hidden bg-slate-200 dark:bg-slate-900 shadow-2xl ${
          showQuickActions
            ? "h-[calc(100dvh-320px)] min-h-[420px]"
            : "h-[calc(100dvh-180px)] min-h-[520px]"
        }`}>
          <div
            className={`absolute inset-0 ${
              mapLayer === "traffic"
                ? "bg-gradient-to-br from-slate-300 via-slate-200 to-orange-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800"
                : "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800"
            } opacity-70`}
          />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                mapLayer === "traffic"
                  ? "radial-gradient(#f97316 1px, transparent 1px)"
                  : "radial-gradient(#334155 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div
            className="absolute inset-0"
            style={{ transform: `rotate(${bearing}deg)`, transition: "transform 250ms ease" }}
          >
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M12 78 C 28 62, 38 58, 48 45 S 69 25, 84 18"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          <div className="absolute left-12 top-20 flex flex-col items-center">
            <div className="rounded-full border border-white/20 bg-slate-900/90 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-sm">
              High Demand
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 animate-ping" />
              <div className="absolute h-10 w-10 rounded-full bg-orange-500/20" />
              <div className="absolute flex h-4 w-4 items-center justify-center rounded-full border-4 border-white bg-orange-500 shadow-lg dark:border-slate-900">
                <Navigation className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brand-active border border-white dark:border-slate-700 shadow-lg space-y-0.5">
            <p>{isLocating ? "Locating..." : `${zoom}x Zoom`}</p>
            <p>{mapLayer === "traffic" ? "Traffic Layer" : "Standard Layer"}</p>
          </div>

          {showTip && (
            <div className="absolute left-4 right-20 top-4 rounded-2xl border border-emerald-200 bg-emerald-50/95 p-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-tight text-emerald-800 leading-relaxed">
                  <span className="mr-1">Tip:</span>
                  Move toward highlighted demand zones to increase request frequency.
                </p>
                <button
                  type="button"
                  onClick={handleDismissTip}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 active:scale-95"
                  aria-label="Dismiss tip"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={handleZoomIn}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all text-slate-900 dark:text-white font-black text-lg"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all text-slate-900 dark:text-white font-black text-lg"
              aria-label="Zoom out"
            >
              -
            </button>
            <button
              type="button"
              onClick={handleRecenterMap}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-orange-500 shadow-2xl border border-orange-500/20 active:scale-90 transition-all"
              aria-label="Center map on my location"
            >
              <Navigation className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleResetBearing}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
              aria-label="Reset map bearing"
            >
              <Compass className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleToggleLayer}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
              aria-label="Toggle map layer"
            >
              <Layers className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/map/settings")}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all"
              aria-label="Open map settings"
            >
              <Settings2 className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute left-4 bottom-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate("/driver/map/searching")}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50/95 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-orange-700 shadow-lg active:scale-95"
            >
              <MapPin className="h-3.5 w-3.5" />
              Find Riders
            </button>
          </div>

          {locationHint && (
            <div className="absolute bottom-20 left-1/2 max-w-[80%] -translate-x-1/2 rounded-xl border border-white/30 bg-slate-900/85 px-3 py-2 text-[10px] font-black uppercase tracking-tight text-white shadow-lg backdrop-blur">
              {locationHint}
            </div>
          )}
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
                onClick={() => navigate("/driver/safety/sos/sending")}
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
