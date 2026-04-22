import {
ChevronLeft,
ChevronRight,
MapPin,
MicOff,
PhoneOff,
Volume2
} from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { User } from "lucide-react";

// EVzone Driver App – EmergencyCall Driver – Emergency Calling Screen (v4)
// Redesigned to match the high-fidelity orbit animation with avatars and swipe-to-cancel slider.
// + Restored: formatCallTime(), call timer, mute/speaker controls, end call button

function formatCallTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function EmergencyCall() {
  const navigate = useNavigate();
  const {
    emergencyContacts,
    activeRideRuntime,
    reportActiveRideMovementSample,
    updateEmergencyDispatch,
  } = useStore();
  const [isSwiped, setIsSwiped] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"locating" | "live" | "unavailable">("locating");
  const watchIdRef = useRef<number | null>(null);

  // Call timer (restored from original)
  useEffect(() => {
    if (callEnded) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [callEnded]);

  useEffect(() => {
    try {
      window.location.href = "tel:112";
      updateEmergencyDispatch({
        emergencyNumberDialed: "112",
        supportNotified: true,
      });
    } catch {
      // Ignore browser call handling issues.
    }
  }, [updateEmergencyDispatch]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const next = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setLocationStatus("live");
        reportActiveRideMovementSample(next);
        updateEmergencyDispatch({
          location: next,
          trackingUrl: `https://maps.google.com/?q=${next.latitude},${next.longitude}`,
          supportNotified: true,
        });
      },
      () => setLocationStatus("unavailable"),
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [reportActiveRideMovementSample, updateEmergencyDispatch]);

  const callTime = formatCallTime(seconds);
  const dispatch = activeRideRuntime.lastEmergencyDispatch;
  const locationLabel =
    locationStatus === "locating"
      ? "Updating live location..."
      : locationStatus === "live" && dispatch?.location
      ? `${dispatch.location.latitude.toFixed(5)}, ${dispatch.location.longitude.toFixed(5)}`
      : "Live location unavailable.";
  const helpMessage = dispatch?.helpMessage || "SOS help request is active. Emergency services and support are being notified.";

  // Orbiting Avatars Data - Use real contacts if available
  const avatars = useMemo(() => {
    const basePositions = [
      'top-0 left-1/2 -translate-x-1/2',
      'top-1/4 right-0',
      'bottom-1/4 right-0',
      'bottom-0 left-1/2 -translate-x-1/2',
      'bottom-1/4 left-0',
      'top-1/4 left-0'
    ];

    const realAvatars = emergencyContacts.slice(0, 6).map((contact, i) => ({
      name: contact.name,
      pos: basePositions[i],
      initial: contact.name.charAt(0)
    }));

    // Fallback if no contacts
    if (realAvatars.length === 0) {
      return [
        { name: '112', pos: basePositions[0], initial: '1' },
        { name: 'Support', pos: basePositions[1], initial: 'S' }
      ];
    }
    return realAvatars;
  }, [emergencyContacts]);

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Emergency SOS" 
        subtitle="Secure" 
        onBack={() => navigate(-1)} 
      />

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-8 relative items-center text-center overflow-y-auto scrollbar-hide">

        <div className="space-y-3 mb-8">
          <h3 className="text-[24px] font-black text-slate-900 leading-tight uppercase tracking-tight">Emergency Calling...</h3>
          <p className="text-[11px] text-slate-400 font-bold px-6 leading-relaxed uppercase tracking-tight">
            Assistance request shared with emergency contacts and closest help centers.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
             <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
             <span>{callEnded ? `Call ended at ${callTime}` : `Call time: ${callTime}`}</span>
          </div>
        </div>

        <div className="w-full space-y-2 mb-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left">
            <p className="text-[11px] font-black text-red-800 uppercase tracking-wide">Help Message Sent</p>
            <p className="text-[11px] text-red-700 mt-1 leading-relaxed">{helpMessage}</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2.5 text-left text-[11px] text-sky-800 font-semibold inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Live location: {locationLabel}</span>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-left text-[11px] text-emerald-800 font-semibold">
            Shared: ride details, driver details, vehicle details, and emergency contact alerts.
          </div>
        </div>

        {/* Orbit Animation */}
        <div className="flex-1 flex items-center justify-center relative w-full mb-8 min-h-[320px]">
          <div className="relative h-72 w-72 flex items-center justify-center">

            {/* Dashed Orbiting Circles */}
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-200 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-10 rounded-full border border-dashed border-slate-200 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-20 rounded-full border border-dashed border-slate-200 animate-[spin_10s_linear_infinite]" />

            {/* Orbiting Avatars */}
            {avatars.map((avatar, i) => (
              <div
                key={i}
                className={`absolute h-14 w-14 rounded-full border-4 border-white shadow-2xl overflow-hidden ${avatar.pos} z-20 flex items-center justify-center bg-slate-100`}
                style={{
                  animation: `bounce ${2 + i * 0.5}s ease-in-out infinite alternate`
                }}
              >
                <span className="text-lg font-black text-slate-400">{avatar.initial}</span>
              </div>
            ))}

            {/* Central SOS Button */}
            <div className="h-36 w-36 rounded-full bg-[#ff3b30] flex items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-30 border-8 border-white outline outline-1 outline-slate-100">
              <span className="text-[36px] font-black italic tracking-tighter leading-none">SOS</span>
            </div>

            {/* Pulsing Outer Rings */}
            <div className="absolute inset-12 rounded-full bg-red-500/5 animate-ping duration-1000 z-0" />
          </div>
        </div>

        {/* Call controls */}
        <div className="w-full max-w-[280px] grid grid-cols-3 gap-4 mb-10">
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl transition-all shadow-sm ${muted ? "bg-orange-500 text-white" : "bg-white border-2 border-orange-500/10 text-slate-400 group-active:scale-95"}`}>
              <MicOff className="h-5 w-5" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${muted ? "text-orange-500" : "text-slate-400"}`}>{muted ? "Muted" : "Mute"}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setSpeaker((v) => !v)}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl transition-all shadow-sm ${speaker ? "bg-orange-500 text-white" : "bg-white border-2 border-orange-500/10 text-slate-400 group-active:scale-95"}`}>
              <Volume2 className="h-5 w-5" />
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${speaker ? "text-orange-500" : "text-slate-400"}`}>{speaker ? "Speaker On" : "Speaker"}</span>
          </button>

          <button
            type="button"
            onClick={() => setCallEnded(true)}
            className="flex flex-col items-center space-y-2 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-600 text-white shadow-2xl shadow-red-900/20 group-active:scale-95 transition-all">
              <PhoneOff className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-red-500">End Call</span>
          </button>
        </div>

        {/* Swipe Slider */}
        <div className="w-full pb-12">
          <div className="relative h-20 bg-orange-50 rounded-full p-2 border-2 border-slate-100 overflow-hidden group">
            <div
              className={`flex items-center justify-center w-full h-full text-orange-800 font-extrabold text-[12px] uppercase tracking-[0.2em] transition-opacity duration-300 ${isSwiped ? 'opacity-0' : 'opacity-100'}`}
            >
              Swipe if safe now
            </div>

            <button
              onMouseDown={() => { }}
              draggable
              onDragEnd={() => { setIsSwiped(true); setTimeout(() => navigate('/driver/dashboard/online'), 500); }}
              className="absolute left-2 top-2 bottom-2 aspect-square bg-orange-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all cursor-grab active:cursor-grabbing hover:bg-orange-600"
            >
              <ChevronRight className="h-6 w-6 stroke-[3px]" />
            </button>

            {/* Background Fill on Swipe */}
            {isSwiped && (
              <div className="absolute inset-0 bg-orange-500 flex items-center justify-center text-white font-black text-[13px] uppercase tracking-[0.3em] animate-in fade-in duration-300">
                LATCH SECURED
              </div>
            )}
          </div>
        </div>

      </main>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-5px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
}
