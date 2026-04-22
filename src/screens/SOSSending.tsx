import {
MapPin,
Phone,
TriangleAlert,
X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

function sanitizePhone(phone: string | undefined): string {
  return (phone || "").replace(/[^\d+]/g, "");
}

export default function SOSSending() {
  const navigate = useNavigate();
  const {
    emergencyContacts,
    activeTrip,
    driverProfile,
    vehicles,
    selectedVehicleIndex,
    respondToSafetyCheck,
    reportActiveRideMovementSample,
    updateEmergencyDispatch,
  } = useStore();

  const [sosTimer, setSosTimer] = useState(10);
  const [liveLocation, setLiveLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy?: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"locating" | "live" | "unavailable">("locating");
  const [callStatus, setCallStatus] = useState<"idle" | "dialing" | "active" | "failed">("idle");
  const [messageStatus, setMessageStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [messageSummary, setMessageSummary] = useState("");
  const watchIdRef = useRef<number | null>(null);
  const protocolStartedRef = useRef(false);
  const selectedVehicle = useMemo(() => {
    if (selectedVehicleIndex !== null && selectedVehicleIndex >= 0 && selectedVehicleIndex < vehicles.length) {
      return vehicles[selectedVehicleIndex];
    }
    return vehicles[0] || null;
  }, [selectedVehicleIndex, vehicles]);

  const helpMessage = useMemo(() => {
    const base = `EVzone SOS ALERT: Driver needs urgent help.${
      activeTrip.tripId ? ` Trip ID: ${activeTrip.tripId}.` : ""
    }`;
    const driverSummary = ` Driver: ${driverProfile.fullName || "EVzone Driver"}${driverProfile.phone ? ` (${driverProfile.phone})` : ""}.`;
    const vehicleSummary = selectedVehicle
      ? ` Vehicle: ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate}).`
      : " Vehicle details are being resolved.";

    if (!liveLocation && locationStatus === "unavailable") {
      return `${base}${driverSummary}${vehicleSummary} Live location is currently unavailable. Please call emergency services and EVzone support immediately.`;
    }

    if (!liveLocation) {
      return `${base}${driverSummary}${vehicleSummary} Live location is being acquired.`;
    }

    const mapsUrl = `https://maps.google.com/?q=${liveLocation.latitude},${liveLocation.longitude}`;
    return `${base}${driverSummary}${vehicleSummary} Live location: ${mapsUrl}. Please call emergency services and EVzone support immediately.`;
  }, [activeTrip.tripId, driverProfile.fullName, driverProfile.phone, selectedVehicle, liveLocation, locationStatus]);

  const callEmergencyNow = () => {
    const emergencyNumber = "112";
    const target = sanitizePhone(emergencyNumber);
    if (!target) {
      setCallStatus("failed");
      return;
    }

    setCallStatus("dialing");
    try {
      window.location.href = `tel:${target}`;
      setCallStatus("active");
      updateEmergencyDispatch({
        emergencyNumberDialed: target,
        supportNotified: true,
        rideDetailsShared: true,
        driverDetailsShared: true,
        vehicleDetailsShared: true,
      });
    } catch {
      setCallStatus("failed");
    }
  };

  const dispatchHelpMessage = () => {
    if (messageStatus === "sending") return;

    const recipients = emergencyContacts
      .map((contact) => ({
        name: contact.name,
        phone: sanitizePhone(contact.phone),
      }))
      .filter((entry) => entry.phone.length > 0);

    if (recipients.length === 0) {
      setMessageStatus("failed");
      setMessageSummary("No emergency contacts with valid phone numbers were found.");
      return;
    }

    setMessageStatus("sending");

    const payload = {
      ts: Date.now(),
      tripId: activeTrip.tripId,
      ride: {
        stage: activeTrip.stage,
        status: activeTrip.status,
        startedAt: activeTrip.timestamps.startedAt,
      },
      driver: {
        name: driverProfile.fullName || null,
        phone: driverProfile.phone || null,
      },
      vehicle: selectedVehicle
        ? {
            make: selectedVehicle.make,
            model: selectedVehicle.model,
            plate: selectedVehicle.plate,
            type: selectedVehicle.type,
          }
        : null,
      recipients,
      helpMessage,
      location: liveLocation,
      trackingUrl: liveLocation
        ? `https://maps.google.com/?q=${liveLocation.latitude},${liveLocation.longitude}`
        : null,
    };

    window.localStorage.setItem("evzone_sos_help_message_payload", JSON.stringify(payload));
    updateEmergencyDispatch({
      contactsNotified: recipients.map((entry) => entry.phone),
      helpMessage,
      trackingUrl: payload.trackingUrl || undefined,
      supportNotified: true,
      rideDetailsShared: true,
      driverDetailsShared: true,
      vehicleDetailsShared: true,
    });

    // Open SMS composer for primary contact; others are simulated as sent.
    const primary = recipients[0];
    const smsBody = encodeURIComponent(helpMessage);
    try {
      window.open(`sms:${primary.phone}?body=${smsBody}`, "_self");
    } catch {
      // Ignore browser handling errors and continue simulation status.
    }

    setMessageStatus("sent");
    if (recipients.length === 1) {
      setMessageSummary(`Help message prepared for ${primary.name}. Live tracking link attached.`);
    } else {
      setMessageSummary(
        `Help message prepared for ${primary.name} and ${recipients.length - 1} more contact(s), with live tracking.`
      );
    }
  };

  useEffect(() => {
    respondToSafetyCheck("driver", "sos");
  }, [respondToSafetyCheck]);

  useEffect(() => {
    if (protocolStartedRef.current) return;
    protocolStartedRef.current = true;

    callEmergencyNow();

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
        setLiveLocation(next);
        setLocationStatus("live");
        reportActiveRideMovementSample(next);
        updateEmergencyDispatch({
          location: next,
          trackingUrl: `https://maps.google.com/?q=${next.latitude},${next.longitude}`,
          supportNotified: true,
          rideDetailsShared: true,
          driverDetailsShared: true,
          vehicleDetailsShared: true,
        });
      },
      () => {
        setLocationStatus("unavailable");
      },
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

  useEffect(() => {
    if (locationStatus === "locating") return;
    if (messageStatus !== "idle") return;
    dispatchHelpMessage();
  }, [locationStatus, messageStatus]);

  // SOS Countdown Timer
  useEffect(() => {
    if (sosTimer > 0) {
      const timer = setInterval(() => setSosTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }

    navigate("/driver/safety/emergency/call");
  }, [sosTimer, navigate]);

  const locationLabel =
    locationStatus === "locating"
      ? "Acquiring live GPS location..."
      : locationStatus === "live" && liveLocation
      ? `Live: ${liveLocation.latitude.toFixed(5)}, ${liveLocation.longitude.toFixed(5)}${
          liveLocation.accuracy ? ` (±${Math.round(liveLocation.accuracy)}m)` : ""
        }`
      : "Location unavailable. Emergency alert will continue without GPS.";

  const callLabel =
    callStatus === "dialing"
      ? "Calling emergency services (112)..."
      : callStatus === "active"
      ? "Emergency call initiated."
      : callStatus === "failed"
      ? "Automatic call could not be started. Tap Call 112 Now."
      : "Preparing emergency call...";

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Driver App" 
        subtitle="Protocol" 
        onBack={() => navigate(-1)} 
      />

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-8 relative items-center text-center overflow-y-auto scrollbar-hide">

        {/* Section Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex flex-col items-start text-left">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Emergency Hub</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">SOS</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <h3 className="text-[24px] font-black text-slate-900 leading-tight uppercase tracking-tight">Sending<br />Emergency Alert</h3>
          <p className="text-[11px] text-slate-400 font-bold px-4 leading-relaxed tracking-tight uppercase">
            Sharing your trip details and live location with {emergencyContacts.length > 0 ? emergencyContacts.map(c => c.name).join(', ') : 'emergency contacts'} and help centers.
          </p>
        </div>

        <div className="w-full space-y-2 mb-6">
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-left">
            <p className="text-[11px] font-black text-red-800 uppercase tracking-wide">Help Message</p>
            <p className="text-[11px] text-red-700 mt-1 leading-relaxed">{helpMessage}</p>
          </div>
          <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-2.5 text-left text-[11px] text-orange-800 font-semibold">
            {callLabel}
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-2.5 text-left text-[11px] text-sky-800 font-semibold inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{locationLabel}</span>
          </div>
          {messageSummary && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-left text-[11px] text-emerald-800 font-semibold">
              {messageSummary}
            </div>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Shared By SOS</p>
            <ul className="mt-2 space-y-1.5 text-[11px] text-slate-700">
              <li>Ride details: trip ID, ride stage, and emergency timestamp.</li>
              <li>Driver details: name and contact phone from profile.</li>
              <li>Vehicle details: make, model, plate, and vehicle type.</li>
              <li>Live location: continuously updated GPS coordinates and map link.</li>
              <li>Emergency contact alerts: help message with live-tracking link.</li>
            </ul>
          </div>
        </div>

        {/* SOS Pulsing Circle */}
        <div className="flex-1 flex items-center justify-center relative w-full mb-8">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full bg-red-500/10 animate-ping duration-1000" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-64 w-64 rounded-full border-2 border-slate-50 opacity-50" />
          </div>

          <div className="h-48 w-48 rounded-full bg-[#ff3b30] flex flex-col items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-10 active:scale-95 transition-all outline outline-8 outline-white border-8 border-slate-50">
            <span className="text-[48px] font-black italic tracking-tighter mb-0 leading-none">SOS</span>
            <span className="text-[12px] font-black uppercase tracking-widest opacity-90">{sosTimer}s</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="w-full space-y-6 pb-8">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
            SOS continues while calling and sharing live location
          </p>

          <div className="bg-slate-900 p-6 rounded-[2.5rem] flex items-start space-x-4 border border-slate-800 shadow-2xl">
            <div className="h-12 w-12 bg-red-500/20 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 animate-pulse">
              <TriangleAlert className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-[11px] font-bold text-slate-100 text-left leading-relaxed uppercase tracking-tight py-1">
              Emergency call, support escalation, and live location sharing are active. Keep this screen open until responders confirm.
            </p>
          </div>

          <button
            type="button"
            onClick={callEmergencyNow}
            className="w-full py-5 rounded-full bg-red-600 text-white font-black text-[13px] flex items-center justify-center space-x-3 shadow-2xl shadow-red-900/30 active:scale-95 transition-all uppercase tracking-[0.2em]"
          >
            <Phone className="h-5 w-5 fill-current" />
            <span>Call 112 Now</span>
          </button>
        </div>

      </main>
    </div>
  );
}
