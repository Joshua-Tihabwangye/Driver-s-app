import {
  AlertTriangle,
  BatteryCharging,
  ChevronLeft,
  Compass,
  Layers3,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type MapLayerMode = "default" | "terrain" | "night";

type MarkerTone = "driver" | "danger" | "warning" | "station" | "neutral";

export type DriverMapMarker = {
  id: string;
  positionClass: string;
  label?: string;
  icon?: LucideIcon;
  tone?: MarkerTone;
  content?: ReactNode;
  markerClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
};

type ControlTone = "default" | "accent" | "danger" | "dark";

export type DriverMapControl = {
  id: string;
  icon: LucideIcon;
  ariaLabel: string;
  onClick: () => void;
  tone?: ControlTone;
  active?: boolean;
};

type DriverMapSurfaceProps = {
  heightClass?: string;
  className?: string;
  routePath?: string;
  routeColor?: string;
  routeStrokeWidth?: number;
  routeDasharray?: string;
  onBack?: () => void;
  onSos?: () => void;
  defaultZoom?: number;
  defaultBearing?: number;
  defaultLayer?: MapLayerMode;
  defaultTrafficOn?: boolean;
  defaultAlertsOn?: boolean;
  defaultStationsOn?: boolean;
  floatingHint?: string | null;
  topBadge?: ReactNode;
  topRightSlot?: ReactNode;
  infoCard?: ReactNode;
  bottomRightSlot?: ReactNode;
  markers?: DriverMapMarker[];
  extraControls?: DriverMapControl[];
  compact?: boolean;
  children?: ReactNode;
};

function getToneClasses(tone: MarkerTone) {
  if (tone === "danger") {
    return {
      marker: "bg-[#dc4d46] shadow-[#dc4d46]/30",
      icon: "text-white",
      label: "bg-[#dc4d46] text-white border-red-300/40",
      halo: "bg-red-500/18",
    };
  }
  if (tone === "warning") {
    return {
      marker: "bg-[#f2a72f] shadow-[#f2a72f]/30",
      icon: "text-white",
      label: "bg-[#f2a72f] text-white border-amber-300/40",
      halo: "bg-amber-400/18",
    };
  }
  if (tone === "station") {
    return {
      marker: "bg-[#45556f] shadow-slate-500/20",
      icon: "text-white",
      label: "bg-white text-slate-700 border-slate-200",
      halo: "bg-slate-400/12",
    };
  }
  if (tone === "neutral") {
    return {
      marker: "bg-white shadow-slate-400/20",
      icon: "text-slate-700",
      label: "bg-white text-slate-700 border-slate-200",
      halo: "bg-slate-400/10",
    };
  }
  return {
    marker: "bg-[#14c8a8] shadow-[#14c8a8]/30",
    icon: "text-white",
    label: "bg-white text-slate-700 border-emerald-200",
    halo: "bg-cyan-400/14",
  };
}

function getControlClasses(tone: ControlTone = "default", active = false) {
  if (tone === "danger") {
    return "bg-[#ef3b2d] text-white border-red-300/30 shadow-red-500/20";
  }
  if (tone === "dark") {
    return "bg-[#1d2334] text-white border-slate-700/40 shadow-slate-900/20";
  }
  if (tone === "accent" || active) {
    return "bg-[#b8f0e9] text-[#0f9c88] border-[#63d6c6] shadow-[#63d6c6]/20";
  }
  return "bg-white/96 text-slate-800 border-slate-200/90 shadow-slate-300/30";
}

function MapMarker({
  positionClass,
  label,
  icon: Icon = MapPin,
  tone = "neutral",
  content,
  markerClassName = "",
  labelClassName = "",
  iconClassName = "",
}: DriverMapMarker) {
  const palette = getToneClasses(tone);

  return (
    <div className={`absolute z-20 flex flex-col items-center ${positionClass}`}>
      {content ? (
        content
      ) : (
        <>
          <div className={`absolute inset-0 rounded-full blur-md ${palette.halo}`} />
          <div
            className={`relative flex h-6 w-6 items-center justify-center rounded-full border-4 border-white shadow-xl ${palette.marker} ${markerClassName}`}
          >
            <Icon className={`h-3.5 w-3.5 ${palette.icon} ${iconClassName}`} />
          </div>
          {label ? (
            <span
              className={`mt-2 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] shadow-lg ${palette.label} ${labelClassName}`}
            >
              {label}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

function MapControlButton({
  icon: Icon,
  ariaLabel,
  onClick,
  tone = "default",
  active = false,
}: DriverMapControl) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-lg backdrop-blur-sm transition-all active:scale-95 ${getControlClasses(
        tone,
        active
      )}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </button>
  );
}

function ChipButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-4 py-2 text-[10px] font-black tracking-[0.08em] shadow-md transition-all active:scale-95 ${
        active
          ? "border-[#63d6c6] bg-[#b8f0e9]/95 text-[#126f63]"
          : "border-slate-200 bg-white/95 text-slate-600"
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  );
}

export default function DriverMapSurface({
  heightClass = "h-[460px]",
  className = "",
  routePath = "M16 78 C 30 66, 44 56, 56 46 S 74 30, 86 18",
  routeColor = "#14c8a8",
  routeStrokeWidth = 2.5,
  routeDasharray = "5 4",
  onBack,
  onSos,
  defaultZoom = 13,
  defaultBearing = 0,
  defaultLayer = "default",
  defaultTrafficOn = true,
  defaultAlertsOn = true,
  defaultStationsOn = false,
  floatingHint = null,
  topBadge,
  topRightSlot,
  infoCard,
  bottomRightSlot,
  markers = [],
  extraControls = [],
  compact = false,
  children,
}: DriverMapSurfaceProps) {
  const [zoom, setZoom] = useState(defaultZoom);
  const [bearing, setBearing] = useState(defaultBearing);
  const [layer, setLayer] = useState<MapLayerMode>(defaultLayer);
  const [trafficOn, setTrafficOn] = useState(defaultTrafficOn);
  const [alertsOn, setAlertsOn] = useState(defaultAlertsOn);
  const [stationsOn, setStationsOn] = useState(defaultStationsOn);
  const [isLocating, setIsLocating] = useState(false);
  const [hint, setHint] = useState<string | null>(floatingHint);

  useEffect(() => {
    setHint(floatingHint);
  }, [floatingHint]);

  useEffect(() => {
    if (!hint) return undefined;
    const timeout = window.setTimeout(() => setHint(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [hint]);

  const layerLabel = useMemo(() => {
    if (layer === "terrain") return "terrain";
    if (layer === "night") return "night";
    return "default";
  }, [layer]);

  const cycleLayer = () => {
    setLayer((current) => {
      if (current === "default") return "terrain";
      if (current === "terrain") return "night";
      return "default";
    });
  };

  const handleLocate = () => {
    setZoom((current) => Math.min(current + 1, 18));
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setHint("Location services unavailable.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsLocating(false);
        setHint("Centered on your live location.");
      },
      () => {
        setIsLocating(false);
        setHint("Unable to refresh GPS.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const baseControls: DriverMapControl[] = [
    {
      id: "zoom-in",
      icon: Plus,
      ariaLabel: "Zoom in",
      onClick: () => setZoom((current) => Math.min(current + 1, 18)),
    },
    {
      id: "zoom-out",
      icon: Minus,
      ariaLabel: "Zoom out",
      onClick: () => setZoom((current) => Math.max(current - 1, 8)),
    },
    {
      id: "layer",
      icon: Layers3,
      ariaLabel: "Cycle map layer",
      onClick: cycleLayer,
    },
    {
      id: "traffic",
      icon: Navigation,
      ariaLabel: "Toggle traffic",
      onClick: () => setTrafficOn((current) => !current),
      tone: "accent",
      active: trafficOn,
    },
    {
      id: "alerts",
      icon: AlertTriangle,
      ariaLabel: "Toggle alerts",
      onClick: () => setAlertsOn((current) => !current),
      tone: "accent",
      active: alertsOn,
    },
    {
      id: "bearing",
      icon: Compass,
      ariaLabel: "Reset bearing",
      onClick: () => {
        setBearing(0);
        setHint("Bearing reset to north.");
      },
    },
    {
      id: "locate",
      icon: LocateFixed,
      ariaLabel: "Locate me",
      onClick: handleLocate,
    },
  ];

  const controls = baseControls.concat(extraControls);

  const rightRailClassName = compact
    ? "grid grid-cols-2 gap-2 rounded-2xl border border-white/70 bg-white/40 p-2 backdrop-blur-md"
    : "flex flex-col gap-2 rounded-2xl border border-white/70 bg-white/40 p-2 backdrop-blur-md";

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#eff4fb] shadow-2xl ${heightClass} ${className}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(190,241,230,0.85)_0%,rgba(220,236,248,0.95)_54%,rgba(235,242,250,0.98)_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-0 opacity-[0.22] [background-image:repeating-linear-gradient(55deg,transparent_0_92px,rgba(212,178,152,0.85)_92px_97px,transparent_97px_190px),repeating-linear-gradient(145deg,transparent_0_120px,rgba(224,207,176,0.75)_120px_125px,transparent_125px_220px)]" />
      <div className="absolute left-[10%] top-[16%] h-[44%] w-[38%] rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute right-[10%] top-[18%] h-[28%] w-[24%] rounded-full bg-orange-200/18 blur-3xl" />

      <div
        className="absolute inset-0"
        style={{ transform: `rotate(${bearing}deg)`, transition: "transform 220ms ease" }}
      >
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={routePath}
            fill="none"
            stroke={routeColor}
            strokeWidth={routeStrokeWidth}
            strokeLinecap="round"
            strokeDasharray={routeDasharray}
            opacity={trafficOn ? 0.95 : 0.55}
          />
        </svg>
      </div>

      <div className="absolute left-3 top-3 z-30 flex items-start gap-2 sm:left-4 sm:top-4">
        {onBack ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/96 text-slate-900 shadow-xl backdrop-blur-sm transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        {topBadge ? <div className="min-w-0">{topBadge}</div> : null}
      </div>

      <div className="absolute right-3 top-3 z-30 flex items-start gap-2 sm:right-4 sm:top-4">
        {topRightSlot}
        {onSos ? (
          <button
            type="button"
            onClick={onSos}
            className="inline-flex items-center rounded-full border border-red-300/30 bg-[#ef3b2d] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-red-500/25 transition-all active:scale-95"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            SOS
          </button>
        ) : null}
      </div>

      <div className="absolute right-3 top-[78px] z-30 sm:right-4 sm:top-[86px]">
        <div className={rightRailClassName}>
          {controls.map((control) => (
            <MapControlButton key={control.id} {...control} />
          ))}
        </div>
      </div>

      {markers.map((marker) => (
        <MapMarker key={marker.id} {...marker} />
      ))}

      {children}

      {hint ? (
        <div className="absolute left-1/2 top-[72px] z-30 max-w-[70%] -translate-x-1/2 rounded-full border border-slate-200 bg-white/96 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700 shadow-lg backdrop-blur-sm">
          {isLocating ? "Locating..." : hint}
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3 z-30 flex items-end justify-between gap-3 sm:bottom-4 sm:left-4 sm:right-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {infoCard ? <div className="max-w-full sm:max-w-sm">{infoCard}</div> : null}
          <div className="flex flex-wrap gap-2">
            <ChipButton
              icon={Navigation}
              label="Traffic"
              active={trafficOn}
              onClick={() => setTrafficOn((current) => !current)}
            />
            <ChipButton
              icon={AlertTriangle}
              label="Alerts"
              active={alertsOn}
              onClick={() => setAlertsOn((current) => !current)}
            />
            <ChipButton
              icon={BatteryCharging}
              label="EV Stations"
              active={stationsOn}
              onClick={() => setStationsOn((current) => !current)}
            />
          </div>
        </div>

        {bottomRightSlot || (
          <div className="shrink-0 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 text-right shadow-lg backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">
              Z{zoom} · {layerLabel.toUpperCase()} · T:{trafficOn ? "ON" : "OFF"} · A:{alertsOn ? "ON" : "OFF"} · {bearing}DEG
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
