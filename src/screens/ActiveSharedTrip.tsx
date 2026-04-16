import {
  ChevronLeft,
  Clock,
  Map,
  MapPin,
  Navigation,
  ShieldCheck,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Share2,
  QrCode
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";

import { useSharedTrips } from "../context/SharedTripsContext";
import { useStore } from "../context/StoreContext";

export default function ActiveSharedTrip() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { 
    activeSharedTrip, 
    hydrateSharedTripById,
    arriveAtCurrentStop, 
    markRiderOnboard, 
    markRiderNoShow, 
    markRiderDroppedOff, 
    toggleAllowMatches,
    simulateNewMatch 
  } = useSharedTrips();
  const { activeTrip, completeActiveSharedTrip } = useStore();

  const [waitTimer, setWaitTimer] = useState<number | null>(null);
  const [verifyingStopId, setVerifyingStopId] = useState<string | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<"otp" | "qr">("otp");
  const [scannerError, setScannerError] = useState("");
  const [isScannerReady, setIsScannerReady] = useState(false);
  const scannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const scannerStreamRef = useRef<MediaStream | null>(null);
  const [showMatchPrompt, setShowMatchPrompt] = useState(false);
  const completedTripRef = useRef<string | null>(null);
  const lastPromptTimeRef = useRef<number>(Date.now());

  // Automated Verification State
  const [otpCode, setOtpCode] = useState(Array(4).fill(""));
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const hasAutoVerifiedRef = useRef(false);
  const isOtpComplete = otpCode.every((c) => c !== "");

  useEffect(() => {
    if (!routeTripId) {
      return;
    }

    if (activeSharedTrip?.id === routeTripId) {
      return;
    }

    if (activeTrip.tripId === routeTripId && activeTrip.status === "completed") {
      navigate(`/driver/trip/${routeTripId}/completed`, {
        replace: true,
        state: {
          jobType: "shared",
          tripId: routeTripId,
        },
      });
      return;
    }

    hydrateSharedTripById(routeTripId);
  }, [
    routeTripId,
    activeSharedTrip?.id,
    activeTrip.tripId,
    activeTrip.status,
    hydrateSharedTripById,
    navigate,
  ]);

  // Sync wait timer state
  useEffect(() => {
    if (!activeSharedTrip) return;
    
    const currentStop = activeSharedTrip.stops[activeSharedTrip.currentStopIndex];
    if (currentStop?.type === "pickup" && currentStop?.status === "current" && currentStop.waitTimerStartedAt) {
      const elapsed = Math.floor((Date.now() - currentStop.waitTimerStartedAt) / 1000);
      const remaining = Math.max(0, 120 - elapsed);
      setWaitTimer(remaining);
      
      if (remaining > 0) {
        const id = setInterval(() => {
          setWaitTimer(prev => {
            if (prev === null || prev <= 0) {
              clearInterval(id);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(id);
      }
    } else {
      setWaitTimer(null);
    }
  }, [activeSharedTrip, activeSharedTrip?.currentStopIndex, activeSharedTrip?.stops]);

  useEffect(() => {
    if (!activeSharedTrip || activeSharedTrip.chainStatus !== "completed") {
      return;
    }
    if (completedTripRef.current === activeSharedTrip.id) {
      return;
    }

    const completedTripId =
      completeActiveSharedTrip() || activeSharedTrip.id || routeTripId || null;
    if (!completedTripId) {
      return;
    }

    completedTripRef.current = completedTripId;
    navigate(`/driver/trip/${completedTripId}/completed`, {
      replace: true,
      state: {
        jobType: "shared",
        tripId: completedTripId,
      },
    });
  }, [activeSharedTrip, completeActiveSharedTrip, navigate, routeTripId]);

  const currentStop = activeSharedTrip?.stops?.[activeSharedTrip?.currentStopIndex];
  const passengerForStop = activeSharedTrip?.passengers?.find(p => p.id === currentStop?.passengerId);
  const isChainCompleted = activeSharedTrip?.chainStatus === "completed";

  // Co-rider Match Simulation logic
  useEffect(() => {
    if (!activeSharedTrip || isChainCompleted || showMatchPrompt) return;
    if (!activeSharedTrip.allowAdditionalMatches) return;
    if (activeSharedTrip.occupiedSeats >= activeSharedTrip.seatCapacity) return;

    // Check every 5 seconds if we should show a match
    const interval = setInterval(() => {
      const now = Date.now();
      // Only prompt if it's been at least 15 seconds since the last prompt/action
      if (now - lastPromptTimeRef.current > 15000) {
        // 40% chance of a match every check
        if (Math.random() > 0.6) {
          setShowMatchPrompt(true);
          lastPromptTimeRef.current = now;
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeSharedTrip, isChainCompleted, showMatchPrompt]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otpCode];
    next[index] = value;
    setOtpCode(next);
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Auto-verify OTP when complete
  useEffect(() => {
    if (isOtpComplete && verifyingStopId && !hasAutoVerifiedRef.current) {
      const currentStop = activeSharedTrip?.stops?.find(s => s.id === verifyingStopId);
      const passengerForStop = activeSharedTrip?.passengers?.find(p => p.id === currentStop?.passengerId);
      
      if (passengerForStop) {
        hasAutoVerifiedRef.current = true;
        markRiderOnboard(passengerForStop.id);
        
        // Reset state
        setVerifyingStopId(null);
        setOtpCode(Array(4).fill(""));
        
        setTimeout(() => {
          hasAutoVerifiedRef.current = false;
        }, 1000);
      }
    }
  }, [isOtpComplete, verifyingStopId, activeSharedTrip, markRiderOnboard]);

  useEffect(() => {
    if (currentStop?.status === 'current' && currentStop?.type === 'pickup' && !verifyingStopId && !hasAutoVerifiedRef.current) {
      setVerifyingStopId(currentStop.id);
      setVerificationMethod("otp");
    }
  }, [currentStop?.status, currentStop?.type, currentStop?.id, verifyingStopId]);

  useEffect(() => {
    if (verifyingStopId && verificationMethod === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [verifyingStopId, verificationMethod]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const stopScanner = useCallback(() => {
    setIsScannerReady(false);
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach((track) => track.stop());
      scannerStreamRef.current = null;
    }
  }, []);

  const startScanner = async () => {
    setScannerError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      scannerStreamRef.current = stream;
      if (scannerVideoRef.current) {
        scannerVideoRef.current.srcObject = stream;
      }
      setIsScannerReady(true);
    } catch (err) {
      setScannerError("Camera access denied. Please allow permissions.");
    }
  };

  useEffect(() => {
    if (verificationMethod !== "qr" || !verifyingStopId) {
      stopScanner();
    }
    return () => stopScanner();
  }, [verificationMethod, verifyingStopId, stopScanner]);

  if (!activeSharedTrip || (routeTripId && activeSharedTrip.id !== routeTripId)) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Shared Trip Unavailable</h2>
        <button
          onClick={() => navigate("/driver/jobs/list")}
          className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  if (!currentStop && !isChainCompleted) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-6 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Route Sync Pending</h2>
        <button
          onClick={() => navigate("/driver/jobs/list")}
          className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Full-width top map */}
      <section className="relative w-full h-[460px] overflow-hidden bg-slate-200 shrink-0">
        <div className="absolute inset-0 bg-slate-200" style={{ backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.3 }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border-2 border-white shadow-xl">
            <Navigation className="h-5 w-5 text-orange-500" />
          </div>
          <div className="w-16 h-16 bg-orange-500/20 rounded-full absolute animate-ping" />
        </div>
        
        <div className="absolute top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-slate-900/65 text-white backdrop-blur-sm active:scale-95 transition-transform" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </div>

        <div className="absolute top-4 right-14 bg-orange-500/90 text-white px-3 py-1.5 rounded-full flex items-center shadow-lg border border-orange-400">
           <Users className="h-3 w-3 mr-1.5" />
           <span className="text-[10px] font-black uppercase tracking-widest">{activeSharedTrip.occupiedSeats}/{activeSharedTrip.seatCapacity} Seats</span>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
            <div className="bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full flex flex-col items-end shadow-lg border border-white/10">
               <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest">Revenue</span>
               <span className="text-[12px] font-black uppercase tracking-widest">${activeSharedTrip.estimatedTotalEarnings.toFixed(2)}</span>
            </div>
            
             <button
                onClick={toggleAllowMatches}
                className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest transition-all shadow-lg ${activeSharedTrip.allowAdditionalMatches ? "bg-orange-500 text-white border border-orange-400" : "bg-slate-100/90 backdrop-blur text-slate-500 border border-white"}`}
              >
                {activeSharedTrip.allowAdditionalMatches ? "Taking Matches" : "Vehicle Full"}
              </button>
            </div>
      </section>

      {/* New Match Modal Overlay */}
      {showMatchPrompt && (
        <div className="absolute inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl space-y-6 border border-white/20 animate-in zoom-in-95 duration-300">
             <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                   <Users className="h-8 w-8 text-orange-600 animate-bounce" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">New Co-Rider Match!</h2>
                <p className="text-sm font-bold text-slate-500">A new passenger is heading in your direction. Add them to your route for +$4.20 earnings.</p>
             </div>

             <div className="bg-slate-50 rounded-3xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center space-x-3">
                   <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="h-5 w-5 text-orange-500" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Stop</span>
                      <span className="text-[12px] font-bold text-slate-800">Kisementi (0.8 km)</span>
                   </div>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Earnings</span>
                   <p className="text-[14px] font-black text-slate-900">+$4.20</p>
                </div>
             </div>

             <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => {
                    simulateNewMatch();
                    setShowMatchPrompt(false);
                    lastPromptTimeRef.current = Date.now();
                  }}
                  className="w-full rounded-full bg-orange-500 py-5 text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                >
                  Accept Match
                </button>
                <button 
                  onClick={() => {
                    setShowMatchPrompt(false);
                    lastPromptTimeRef.current = Date.now();
                  }}
                  className="w-full rounded-full bg-slate-100 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 active:scale-95 transition-all"
                >
                  Decline
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-6 pt-5 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Active Chain
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Shared Ride
          </h1>
        </section>

        {/* Safety Share Integration */}
        <button
          type="button"
          onClick={() => navigate(`/driver/safety/share-my-ride/${activeSharedTrip.id}`)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100/50 shadow-sm active:scale-95 transition-all text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600">
                Safety Protocol
              </span>
              <span className="text-[11px] font-black text-slate-900 uppercase">
                Share Trip Status
              </span>
            </div>
          </div>
          <ChevronLeft className="h-4 w-4 text-slate-400 rotate-180" />
        </button>

        {/* Event Log Banner */}
        {!isChainCompleted && activeSharedTrip.passengers.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-2xl shadow-sm flex items-start space-x-3 animate-in fade-in slide-in-from-top-4">
             <div className="mt-0.5"><AlertCircle className="h-4 w-4 text-blue-500" /></div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Route Updated Live</span>
                <span className="text-[11px] font-bold mt-0.5">New match picked up! Route re-optimized to include {activeSharedTrip.passengers.length} drop-offs.</span>
             </div>
          </div>
        )}

        {/* Operational Metrics */}
        {!isChainCompleted && (
          <section className="grid grid-cols-3 gap-3">
             <div className="bg-white border text-center border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Efficiency</span>
                <span className="text-sm font-black text-emerald-500 mt-1">+45%</span>
             </div>
             <div className="bg-white border text-center border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Matches</span>
                <span className="text-sm font-black text-slate-800 mt-1">{activeSharedTrip.passengers.length}</span>
             </div>
             <div className="bg-white border text-center border-slate-100 rounded-2xl p-3 shadow-sm flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Est. End</span>
                <span className="text-sm font-black text-slate-800 mt-1">{activeSharedTrip.stops[activeSharedTrip.stops.length-1]?.eta}</span>
             </div>
          </section>
        )}

        {/* Action Panel */}
        <section className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-6 space-y-5 relative overflow-hidden">
          {isChainCompleted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Chain Completed</h2>
              <button 
                onClick={() =>
                  navigate(`/driver/trip/${activeSharedTrip.id}/completed`, {
                    state: { jobType: "shared", tripId: activeSharedTrip.id },
                  })
                }
                className="w-full rounded-full bg-slate-900 text-white py-4 font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Open Completion Summary
              </button>
            </div>
          ) : (
            <>
              {/* Stop Info */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${currentStop.type === 'pickup' ? 'text-orange-500' : 'text-blue-500'}`}>
                    Next Action: {currentStop.type}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {currentStop.label}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-1">{currentStop.address}</p>
                </div>
                {waitTimer !== null && (
                  <div className={`flex flex-col items-center justify-center h-14 w-14 rounded-2xl border-2 ${waitTimer === 0 ? "bg-red-50 border-red-500 text-red-600 animate-pulse" : "bg-orange-50 border-orange-500 text-orange-600"}`}>
                    <span className="text-xs font-black clock-nums">{formatTimer(waitTimer)}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100">
                {currentStop.status === "upcoming" && (
                  <button 
                    onClick={arriveAtCurrentStop}
                    className="w-full rounded-[2rem] bg-slate-900 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98]"
                  >
                    Arrive at {currentStop.type === "pickup" ? "Pickup" : "Drop-off"}
                  </button>
                )}
                
                {currentStop.status === "current" && currentStop.type === "pickup" && (
                  <div className="flex flex-col space-y-4">
                    {verifyingStopId === currentStop.id ? (
                      <div className="bg-slate-50 p-6 rounded-[2rem] flex flex-col space-y-4 border border-slate-100 shadow-inner">
                        <div className="flex flex-col items-center text-center space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verify Passenger</span>
                           <span className="text-sm font-black text-slate-900">{passengerForStop?.firstName}</span>
                        </div>

                        <div className="flex p-1 bg-slate-200/50 rounded-2xl mx-auto w-fit">
                          <button
                            onClick={() => setVerificationMethod("otp")}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${verificationMethod === "otp" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            PIN Entry
                          </button>
                          <button
                            onClick={() => {
                              setVerificationMethod("qr");
                              startScanner();
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${verificationMethod === "qr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                          >
                            Scan QR
                          </button>
                        </div>

                        {verificationMethod === "otp" ? (
                          <div className="space-y-4 py-2">
                            <div className="flex items-center justify-center space-x-3">
                              {otpCode.map((digit, index) => (
                                <input
                                  key={index}
                                  ref={(el) => (otpInputsRef.current[index] = el)}
                                  type="text"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                  className="h-14 w-14 rounded-2xl border-2 border-orange-500/10 bg-white text-center text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
                                />
                              ))}
                            </div>
                            <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
                               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
                                 {isOtpComplete ? "Verifying code..." : "Auto-start enabled after full OTP"}
                               </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-100 bg-black h-[240px] shadow-2xl">
                              {scannerError ? (
                                <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                                  <p className="text-[11px] font-bold text-white/90 uppercase tracking-tight leading-relaxed">
                                    {scannerError}
                                  </p>
                                </div>
                              ) : (
                                <video
                                  ref={scannerVideoRef}
                                  className="absolute inset-0 h-full w-full object-cover"
                                  autoPlay
                                  playsInline
                                  muted
                                />
                              )}

                              <div className="absolute inset-0 bg-black/25" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative flex h-48 w-48 items-center justify-center">
                                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-2xl" />
                                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-2xl" />
                                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-2xl" />
                                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-2xl" />
                                  {!isScannerReady && !scannerError && (
                                    <QrCode className="h-14 w-14 text-white/40" />
                                  )}
                                </div>
                              </div>
                              <div className="absolute inset-x-0 top-5 text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                                  Align customer QR in frame
                                </span>
                              </div>
                              <div className="absolute inset-x-0 bottom-4 text-center">
                                <span className="inline-flex rounded-full bg-black/50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white/90">
                                  {scannerError
                                    ? "Camera unavailable"
                                    : isScannerReady
                                    ? "Camera ready"
                                    : "Starting camera..."}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (passengerForStop) {
                                  markRiderOnboard(passengerForStop.id);
                                  setVerifyingStopId(null);
                                  stopScanner();
                                }
                              }}
                              className="w-full rounded-full bg-orange-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                               I Have Scanned Customer QR
                            </button>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => {
                            setVerifyingStopId(null);
                            stopScanner();
                          }}
                          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600"
                        >
                          Cancel Verification
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-3">
                        {waitTimer === 0 && (
                          <button 
                            onClick={() => passengerForStop && markRiderNoShow(passengerForStop.id)}
                            className="w-full rounded-full border-2 border-red-500 text-red-500 px-6 py-4 text-[11px] font-black uppercase tracking-widest hover:bg-red-50 active:scale-95 transition-all"
                          >
                            No Show
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentStop.status === "current" && currentStop.type === "dropoff" && (
                  <button 
                    onClick={() => passengerForStop && markRiderDroppedOff(passengerForStop.id)}
                    className="w-full rounded-[2rem] bg-blue-500 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl active:scale-[0.98]"
                  >
                    End Trip for {passengerForStop?.firstName}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {/* Passenger Stack */}
        {!isChainCompleted && (
          <section className="space-y-3">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Passenger Manifest</h3>
             <div className="grid gap-3">
                {activeSharedTrip.passengers.map(p => {
                  let statusColor = "text-slate-500 bg-slate-100";
                  let statusLabel = p.status.replace("_", " ");
                  
                  if (p.status === "onboard") statusColor = "text-orange-600 bg-orange-100";
                  if (p.status === "dropped_off") statusColor = "text-green-600 bg-green-100";
                  if (p.status === "no_show") statusColor = "text-red-600 bg-red-100";
                  
                  return (
                    <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                             <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900">{p.displayName}</span>
                             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{p.seatCount} Seat(s) · {p.rating} ★</span>
                          </div>
                       </div>
                       <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${statusColor}`}>
                          {statusLabel}
                       </div>
                    </div>
                  );
                })}
             </div>
          </section>
        )}

        {/* Timeline Sequence */}
        {!isChainCompleted && (
          <section className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm">
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Optimized Sequence</h3>
             <div className="relative pl-6 space-y-6">
                {/* Connecting line */}
                <div className="absolute left-[11px] top-2 bottom-6 w-0.5 bg-slate-100" />
                
                {activeSharedTrip.stops.map((stop, idx) => {
                  if (stop.status === "skipped") return null;
                  
                  const isPast = stop.status === "completed";
                  const isCurrent = activeSharedTrip.currentStopIndex === idx;
                  let iconColor = "bg-slate-200 border-slate-300";
                  
                  if (isPast) iconColor = "bg-green-500 border-green-500 text-white";
                  else if (isCurrent) iconColor = "bg-orange-500 border-orange-500 text-white";
                  
                  return (
                    <div key={stop.id} className={`relative flex items-start space-x-4 ${isPast ? 'opacity-50' : ''}`}>
                      <div className={`absolute -left-[30px] w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${iconColor}`}>
                        {isPast && <CheckCircle2 className="w-3 h-3" />}
                        {!isPast && <div className="w-1.5 h-1.5 bg-current rounded-full" />}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className={`text-[11px] font-black uppercase tracking-tight ${isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                          {stop.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          ETA: {stop.eta} · {stop.legDistance}
                        </span>
                      </div>
                    </div>
                  );
                })}
             </div>
          </section>
        )}

        {/* Earnings Breakdown */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm space-y-4 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
             <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Live Revenue Monitor</h3>
             <div className="space-y-3 relative z-10">
               {activeSharedTrip.earningsBreakdown.map((e, index) => (
                 <div key={e.id} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                       <div className="bg-white h-6 w-6 rounded-full shadow-sm flex items-center justify-center font-black text-slate-400 text-[10px]">
                         {index + 1}
                       </div>
                       <span className="text-xs font-black text-slate-700">{e.title}</span>
                    </div>
                    <span className="text-sm font-black text-emerald-600">+${e.amount.toFixed(2)}</span>
                 </div>
               ))}
               <div className="flex justify-between items-center px-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                     <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Projected Total</span>
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base + Matches</span>
                  </div>
                  <span className="text-2xl font-black text-orange-500 drop-shadow-sm">${activeSharedTrip.estimatedTotalEarnings.toFixed(2)}</span>
               </div>
             </div>
          </section>

      </main>
    </div>
  );
}
