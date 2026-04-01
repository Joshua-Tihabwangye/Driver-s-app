import {
  MapPin,
  Navigation,
  Target,
  Wifi
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import OfflineConfirmModal from "../components/OfflineConfirmModal";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – OnlineMapView Driver App – Online Map View
// Map-centric view for active drivers scanning for requests.

export default function OnlineMapView() {
  const [zoom, setZoom] = useState(12);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const navigate = useNavigate();
  const { driverPresenceStatus, setDriverOffline } = useStore();

  useEffect(() => {
    if (driverPresenceStatus !== "online") {
      navigate("/driver/dashboard/offline", { replace: true });
    }
  }, [driverPresenceStatus, navigate]);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader 
        title="Map Explorer" 
        subtitle="Navigation" 
        onBack={() => navigate(-1)}
        rightAction={
          <div className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest shrink-0 shadow-sm">
            <Wifi className="h-3 w-3 mr-1.5 animate-pulse text-brand-active" />
            LIVE
          </div>
        }
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Map container */}
        <section className="relative rounded-[2.5rem] overflow-hidden border-2 border-orange-500/10 bg-slate-200 dark:bg-slate-900 h-[380px] shadow-2xl">
          {/* Fake map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 opacity-50" />

          <div className="absolute top-4 right-4 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-brand-active border border-white dark:border-slate-700 shadow-lg">
            {zoom}x Zoom
          </div>

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/10 animate-ping" />
              <div className="absolute h-10 w-10 rounded-full bg-orange-500/20" />
              <div className="absolute h-4 w-4 rounded-full bg-orange-500 border-4 border-white dark:border-slate-900 shadow-lg" />
            </div>
          </div>

          {/* Nearby hotspot marker example */}
          <div className="absolute left-12 top-16 flex flex-col items-center group">
            <span className="mt-2 rounded-lg bg-slate-900/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
              High Demand Zone
            </span>
          </div>

          {/* Floating controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 1, 18))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all text-slate-900 dark:text-white font-black text-lg"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 1, 8))}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 active:scale-90 transition-all text-slate-900 dark:text-white font-black text-lg"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/map/settings")}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-orange-500 shadow-2xl border border-orange-500/20 active:scale-90 transition-all"
            >
              <Navigation className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Status strip */}
        <section className="rounded-[2.5rem] bg-cream dark:bg-slate-800 p-5 border-2 border-orange-500/10 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 border border-orange-100 dark:border-orange-500/20 text-orange-500 shadow-sm">
              <Target className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
            <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Active Online</p>
            <button 
              onClick={() => navigate("/driver/map/searching")}
              className="text-[11px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest hover:underline"
            >
              Find Riders →
            </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOfflineModal(true)}
            className="rounded-lg border border-[var(--evz-brand-green-border)] px-4 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:border-amber-500/30 hover:text-amber-500 transition-all flex items-center gap-2"
          >
            <Wifi className="h-3.5 w-3.5" />
            Go Offline
          </button>
        </section>

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
