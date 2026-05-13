import {
  AlertTriangle,
  BatteryCharging,
  ChevronLeft,
  Layers3,
  Minus,
  Navigation,
  Plus,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GoogleMap, MarkerF, OverlayViewF, TrafficLayer, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useStore } from "../context/StoreContext";

type MapLayerMode = "default" | "terrain" | "night";
type MarkerTone = "driver" | "danger" | "warning" | "station" | "neutral";
type LatLng = { lat: number; lng: number };

export type DriverMapMarker = {
  id: string;
  positionClass?: string;
  position?: LatLng;
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
  stationMarkers?: DriverMapMarker[];
  compact?: boolean;
  children?: ReactNode;
};

type MarkerTonePalette = {
  marker: string;
  label: string;
  color: string;
};

const DEFAULT_CENTER: LatLng = { lat: 0.3476, lng: 32.5825 };
const LATITUDE_SPAN = 0.26;
const LONGITUDE_SPAN = 0.3;
const rawGoogleMapsKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "").trim();
const googleMapsApiKey =
  rawGoogleMapsKey && !/^https?:\/\//i.test(rawGoogleMapsKey) ? rawGoogleMapsKey : "";

const NIGHT_MAP_STYLES: any[] = [
  { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#304a7d" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1f365f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1626" }] },
];

const MARKER_STYLES: Record<MarkerTone, MarkerTonePalette> = {
  danger: {
    marker: "bg-[#dc4d46] shadow-[#dc4d46]/30 text-white",
    label: "bg-[#dc4d46] text-white border-red-300/40",
    color: "#dc4d46",
  },
  warning: {
    marker: "bg-[#f2a72f] shadow-[#f2a72f]/30 text-white",
    label: "bg-[#f2a72f] text-white border-amber-300/40",
    color: "#f2a72f",
  },
  station: {
    marker: "bg-[#45556f] shadow-slate-500/20 text-white",
    label: "bg-white text-slate-700 border-slate-200",
    color: "#45556f",
  },
  neutral: {
    marker: "bg-white shadow-slate-400/20 text-slate-700",
    label: "bg-white text-slate-700 border-slate-200",
    color: "#64748b",
  },
  driver: {
    marker: "bg-[#14c8a8] shadow-[#14c8a8]/30 text-white",
    label: "bg-white text-slate-700 border-emerald-200",
    color: "#14c8a8",
  },
};

function getControlClasses(tone: ControlTone = "default", active = false) {
  if (tone === "danger") return "bg-[#ef3b2d] text-white border-red-300/30 shadow-red-500/20";
  if (tone === "dark") return "bg-[#1d2334] text-white border-slate-700/40 shadow-slate-900/20";
  if (tone === "accent" || active) {
    return "bg-[#b8f0e9] text-[#0f9c88] border-[#63d6c6] shadow-[#63d6c6]/20";
  }
  return "bg-white/96 text-slate-800 border-slate-200/90 shadow-slate-300/30";
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
      className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-lg backdrop-blur-sm transition-all active:scale-95 ${getControlClasses(
        tone,
        active
      )}`}
    >
      <Icon className="h-4 w-4" />
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
      className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-[9px] font-black tracking-[0.08em] shadow-md transition-all active:scale-95 ${
        active
          ? "border-[#63d6c6] bg-[#b8f0e9]/95 text-[#126f63]"
          : "border-slate-200 bg-white/95 text-slate-600"
      }`}
    >
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function readPercent(className: string, edge: "left" | "right" | "top" | "bottom") {
  const match = className.match(new RegExp(`${edge}-\\[(\\d+(?:\\.\\d+)?)%\\]`));
  return match ? Number(match[1]) : null;
}

function clamp(value: number) {
  return Math.min(0.98, Math.max(0.02, value));
}

function positionClassToLatLng(positionClass: string | undefined, center: LatLng): LatLng {
  if (!positionClass) return center;

  let x = 0.5;
  let y = 0.5;

  const left = readPercent(positionClass, "left");
  const right = readPercent(positionClass, "right");
  const top = readPercent(positionClass, "top");
  const bottom = readPercent(positionClass, "bottom");

  if (left !== null) x = left / 100;
  if (right !== null) x = 1 - right / 100;
  if (top !== null) y = top / 100;
  if (bottom !== null) y = 1 - bottom / 100;
  if (positionClass.includes("left-1/2") || positionClass.includes("-translate-x-1/2")) x = 0.5;
  if (positionClass.includes("top-1/2") || positionClass.includes("-translate-y-1/2")) y = 0.5;

  return {
    lat: center.lat + (0.5 - clamp(y)) * LATITUDE_SPAN,
    lng: center.lng + (clamp(x) - 0.5) * LONGITUDE_SPAN,
  };
}

function toMapMarker(marker: DriverMapMarker, center: LatLng) {
  const tone = marker.tone || "neutral";
  return {
    ...marker,
    tone,
    position: marker.position || positionClassToLatLng(marker.positionClass, center),
  };
}

const DEFAULT_EV_STATION_MARKERS: DriverMapMarker[] = [
  {
    id: "evzone-hub-west",
    position: { lat: 0.351, lng: 32.536 },
    tone: "station",
    label: "EVzone Hub",
    icon: BatteryCharging,
  },
  {
    id: "evzone-fastcharge-north",
    position: { lat: 0.387, lng: 32.575 },
    tone: "station",
    label: "Fast Charge",
    icon: BatteryCharging,
  },
  {
    id: "evzone-central",
    position: { lat: 0.329, lng: 32.59 },
    tone: "station",
    label: "EVzone Central",
    icon: BatteryCharging,
  },
  {
    id: "evzone-east",
    position: { lat: 0.36, lng: 32.635 },
    tone: "station",
    label: "EVzone East",
    icon: BatteryCharging,
  },
  {
    id: "evzone-south",
    position: { lat: 0.302, lng: 32.623 },
    tone: "station",
    label: "Charge Point",
    icon: BatteryCharging,
  },
];

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
  defaultStationsOn = true,
  floatingHint = null,
  topBadge,
  topRightSlot,
  infoCard,
  bottomRightSlot,
  markers = [],
  stationMarkers = DEFAULT_EV_STATION_MARKERS,
  children,
}: DriverMapSurfaceProps) {
  const { driverMapPreferences, setMapAlertsEnabled, setMapStationsEnabled } = useStore();
  const [zoom, setZoom] = useState(defaultZoom);
  const [bearing, setBearing] = useState(defaultBearing);
  const [layer, setLayer] = useState<MapLayerMode>(defaultLayer);
  const [trafficOn, setTrafficOn] = useState(defaultTrafficOn);
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [mapRef, setMapRef] = useState<any>(null);
  const alertsOn = driverMapPreferences.alertsOn ?? defaultAlertsOn;
  const stationsOn = driverMapPreferences.stationsOn ?? defaultStationsOn;
  const [alertCardVisible, setAlertCardVisible] = useState(alertsOn);
  const [isLocating, setIsLocating] = useState(false);
  const [hint, setHint] = useState<string | null>(floatingHint);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "evzone-driver-google-map-script",
    googleMapsApiKey,
  });

  useEffect(() => {
    setHint(floatingHint);
  }, [floatingHint]);

  useEffect(() => {
    if (!hint) return undefined;
    const timeout = window.setTimeout(() => setHint(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [hint]);

  useEffect(() => {
    if (alertsOn) setAlertCardVisible(true);
  }, [alertsOn]);

  useEffect(() => {
    if (!mapRef) return;
    mapRef.setZoom(zoom);
  }, [mapRef, zoom]);

  useEffect(() => {
    if (!mapRef) return;
    const mapTypeId = layer === "terrain" ? "terrain" : "roadmap";
    mapRef.setMapTypeId(mapTypeId);
    mapRef.setOptions({
      styles: layer === "night" ? NIGHT_MAP_STYLES : [],
      heading: bearing,
    });
  }, [mapRef, layer, bearing]);

  const cycleLayer = () => {
    setLayer((current) => {
      if (current === "default") return "terrain";
      if (current === "terrain") return "night";
      return "default";
    });
  };

  const recenterToDevice = () => {
    if (!navigator.geolocation) {
      setHint("Location unavailable");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(nextCenter);
        if (mapRef) mapRef.panTo(nextCenter);
        setHint("Centered on your location");
        setIsLocating(false);
      },
      () => {
        setHint("Location permission blocked");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  const controls: DriverMapControl[] = [
    {
      id: "zoom-in",
      icon: Plus,
      ariaLabel: "Zoom in",
      onClick: () => setZoom((current) => Math.min(current + 1, 20)),
    },
    {
      id: "zoom-out",
      icon: Minus,
      ariaLabel: "Zoom out",
      onClick: () => setZoom((current) => Math.max(current - 1, 4)),
    },
    {
      id: "layer",
      icon: Layers3,
      ariaLabel: "Cycle map layer",
      onClick: cycleLayer,
    },
    {
      id: "locate",
      icon: Navigation,
      ariaLabel: "Center map on my location",
      onClick: recenterToDevice,
      tone: "accent",
    },
  ];

  const mergedMarkers = useMemo(
    () => (stationsOn ? [...markers, ...stationMarkers] : markers),
    [markers, stationMarkers, stationsOn]
  );

  const visibleMarkers = useMemo(
    () => mergedMarkers.map((marker) => toMapMarker(marker, center)),
    [center, mergedMarkers]
  );

  const layerLabel = useMemo(() => {
    if (layer === "terrain") return "terrain";
    if (layer === "night") return "night";
    return "default";
  }, [layer]);

  const hasUsableMapsKey = Boolean(googleMapsApiKey);
  const canRenderGoogleMap = hasUsableMapsKey && isLoaded && !loadError;

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[#eff4fb] shadow-2xl ${heightClass} ${className}`}
    >
      <div className="absolute inset-0">
        {canRenderGoogleMap ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={center}
            zoom={zoom}
            onLoad={(map) => setMapRef(map)}
            onUnmount={() => setMapRef(null)}
            onZoomChanged={() => {
              if (!mapRef) return;
              const nextZoom = mapRef.getZoom();
              if (typeof nextZoom === "number") setZoom(nextZoom);
            }}
            onCenterChanged={() => {
              if (!mapRef) return;
              const nextCenter = mapRef.getCenter();
              if (!nextCenter) return;
              setCenter({ lat: nextCenter.lat(), lng: nextCenter.lng() });
            }}
            options={{
              disableDefaultUI: true,
              clickableIcons: false,
              gestureHandling: "greedy",
              mapTypeControl: false,
              fullscreenControl: false,
              zoomControl: false,
              streetViewControl: false,
              mapTypeId: layer === "terrain" ? "terrain" : "roadmap",
              styles: layer === "night" ? NIGHT_MAP_STYLES : [],
            }}
          >
            {trafficOn ? <TrafficLayer /> : null}
            {visibleMarkers.map((marker) => {
              const palette = MARKER_STYLES[marker.tone || "neutral"];
              const googleMaps = (window as any).google?.maps;
              if (marker.content) {
                return (
                  <OverlayViewF
                    key={marker.id}
                    position={marker.position as LatLng}
                    mapPaneName="overlayMouseTarget"
                    getPixelPositionOffset={(width, height) => ({
                      x: Math.round(-width / 2),
                      y: Math.round(-height / 2),
                    })}
                  >
                    <div>{marker.content}</div>
                  </OverlayViewF>
                );
              }
              return (
                <MarkerF
                  key={marker.id}
                  position={marker.position as LatLng}
                  label={
                    marker.label
                      ? {
                          text: marker.label,
                          color: "#1f2937",
                          fontSize: "10px",
                          fontWeight: "700",
                        }
                      : undefined
                  }
                  icon={
                    googleMaps
                      ? {
                          path: googleMaps.SymbolPath.CIRCLE,
                          scale: 8,
                          fillColor: palette.color,
                          fillOpacity: 1,
                          strokeColor: "#ffffff",
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }
                      : undefined
                  }
                />
              );
            })}
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(130deg,rgba(190,241,230,0.85)_0%,rgba(220,236,248,0.95)_54%,rgba(235,242,250,0.98)_100%)] p-4 text-center">
            <p className="rounded-2xl border border-amber-300/70 bg-white/90 px-4 py-3 text-xs font-semibold text-slate-700 shadow-lg">
              Google Maps is not loaded. Set a valid `VITE_GOOGLE_MAPS_API_KEY` to render live maps.
            </p>
          </div>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
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
            className="inline-flex items-center rounded-full border border-red-300/30 bg-[#ef3b2d] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-xl shadow-red-500/25 transition-all active:scale-95"
          >
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
            SOS
          </button>
        ) : null}
      </div>

      <div className="absolute right-3 top-[78px] z-30 flex flex-col gap-2 sm:right-4 sm:top-[86px]">
        {controls.map((control) => (
          <MapControlButton key={control.id} {...control} />
        ))}
      </div>

      {children}

      {hint ? (
        <div className="absolute left-1/2 top-[72px] z-30 max-w-[70%] -translate-x-1/2 rounded-full border border-slate-200 bg-white/96 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700 shadow-lg backdrop-blur-sm">
          {isLocating ? "Locating..." : hint}
        </div>
      ) : null}

      <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col items-start gap-3 sm:bottom-4 sm:left-4 sm:right-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {infoCard && alertsOn && alertCardVisible ? (
            <div className="relative max-w-full sm:max-w-sm">
              <div className="pr-8">{infoCard}</div>
              <button
                type="button"
                aria-label="Close alert"
                onClick={() => setAlertCardVisible(false)}
                className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200/80 bg-white/92 text-slate-500 shadow-sm transition-all active:scale-95"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : null}
          <div className="flex w-full flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-auto">
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
              onClick={() => {
                const next = !alertsOn;
                if (next) setAlertCardVisible(true);
                setMapAlertsEnabled(next);
              }}
            />
            <ChipButton
              icon={BatteryCharging}
              label="EVzone"
              active={stationsOn}
              onClick={() => setMapStationsEnabled(!stationsOn)}
            />
          </div>
        </div>

        {bottomRightSlot || (
          <div className="shrink-0 self-start rounded-xl border border-slate-200 bg-white/95 px-3 py-2.5 text-right shadow-lg backdrop-blur-sm sm:self-auto">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-600">
              Z{zoom} · {layerLabel.toUpperCase()} · T:{trafficOn ? "ON" : "OFF"} · A:{alertsOn ? "ON" : "OFF"} · {bearing}DEG
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
