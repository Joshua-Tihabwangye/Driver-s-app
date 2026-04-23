import { Activity, MapPin, Navigation, Wifi } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – OnlineMapVariant Driver App – Map View (Online State, v2)
// Map-centric "I'm online" view.
// Optional enhancement: a small pill showing current mode, e.g. "All jobs" or
// "Ride + Delivery". Job-type logic still handled later by RideRequestIncoming / RideRequestRich.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

export default function OnlineMapVariant() {
  const navigate = useNavigate();
  const [mode] = useState("all-jobs"); // preview-only; backend can drive this

  const modeLabel =
    mode === "ride-delivery"
      ? "Ride + Delivery"
      : mode === "ride-only"
      ? "Ride only"
      : "All jobs"; // default

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Active Online" 
        subtitle="Map View" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-4">
        {/* Mode pill + status */}
        <section className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-1.5 border border-slate-700 text-[10px] text-slate-400 uppercase tracking-widest font-black shadow-lg">
            <Wifi className="h-3 w-3 mr-2 text-orange-500 animate-pulse" />
            <span className="text-orange-500 mr-2">LIVE</span>
            <span>{modeLabel}</span>
          </div>
          <div className="inline-flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Activity className="h-3 w-3 mr-2" />
            <span>Scanning...</span>
          </div>
        </section>

        <DriverMapSurface
          heightClass="h-[520px]"
          routePath="M16 82 C 30 74, 40 66, 54 54 S 76 34, 86 22"
          routeColor="#15b79e"
          routeStrokeWidth={2.6}
          routeDasharray="5 3"
          defaultZoom={13}
          defaultTrafficOn
          defaultAlertsOn
          infoCard={(
            <div className="rounded-[1.6rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-[#15b79e] animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0f766e]">
                  Live Navigation Active
                </span>
              </div>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-slate-600">
                Stay within high-demand areas. Incoming requests will appear instantly on your screen.
              </p>
            </div>
          )}
          markers={[
            {
              id: "driver",
              positionClass: "left-[24%] bottom-[24%]",
              tone: "driver",
              label: "Location",
              icon: Navigation,
            },
            {
              id: "hotspot",
              positionClass: "right-[24%] top-[24%]",
              tone: "warning",
              label: "Hotspot",
              icon: MapPin,
            },
          ]}
        />
      </main>
    </div>
  );
}
