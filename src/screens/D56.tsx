import {
CheckCircle2,
ChevronLeft,
Clock,
MapPin,
Star
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D56 Driver – Arrived / Trip Completion Screen (v3)
// Trip completion screen now accepts an optional initialJobType prop so it can be
// opened directly for a specific job type (e.g. jobType="ambulance" from D100).
// Defaults to "ride" for preview and other generic entry points.
// Job-type aware for Ride / Delivery / Rental / Tour / Ambulance.

const JOB_TYPES = ["ride", "delivery", "rental", "tour", "ambulance"];


export default function TripCompletionScreen({ initialJobType = "ride" }) {
  const [jobType, setJobType] = useState(initialJobType);
  const navigate = useNavigate();

  const jobTypeLabelMap = {
    ride: "Ride",
    delivery: "Delivery",
    rental: "Rental",
    tour: "Tour",
    ambulance: "Ambulance"
};

  const isRental = jobType === "rental";
  const isTour = jobType === "tour";
  const isAmbulance = jobType === "ambulance";

  // Trip summary block values per job type
  let summaryLabel = "Trip summary";
  let routeLine = "Acacia Mall → Bugolobi";
  let rightTop = "7.20";
  let rightBottom = "8.4 km · 19 min";
  let timeRange = "18:10 → 18:29";
  let locationLine = "Residential · usual demand";
  let noteLine = "";

  if (jobType === "delivery") {
    summaryLabel = "Delivery summary";
    routeLine = "Burger Hub, Acacia Mall → Kira Road";
    rightTop = "3.80";
    rightBottom = "3.2 km · 15–20 min";
    timeRange = "17:45 → 18:05";
    locationLine = "Residential · food delivery";
  } else if (isRental) {
    summaryLabel = "Rental summary";
    routeLine = "City Hotel · Rental day completed";
    rightTop = "64.80"; // example rental earnings
    rightBottom = "Duration: 8h 10m";
    timeRange = "09:00 → 17:10";
    locationLine = "Rental window 09:00–18:00";
    noteLine = "Chauffeur rental · multiple stops (hotel, city, airport).";
  } else if (isTour) {
    summaryLabel = "Tour segment summary";
    routeLine = "Day 2 segment completed · City tour";
    rightTop = "45.00"; // example segment earnings
    rightBottom = "Day 2 · 9.1 km · 5 stops";
    timeRange = "08:30 → 16:40";
    locationLine = "Tour continues on following days";
    noteLine = "Today’s segment: Airport pickup, city tour and lodge transfer.";
  } else if (isAmbulance) {
    summaryLabel = "Ambulance run summary";
    routeLine = "Patient location → City Hospital";
    rightTop = "On scene 12 min";
    rightBottom = "Transport 18 min";
    timeRange = "Dispatch 18:10 → Handover 18:40";
    locationLine = "Emergency route completed";
    noteLine = "Times are approximate; billing is handled by your operator or hospital.";
  }

  // Payment block wording for Ambulance vs others
  const paymentTitle = isAmbulance ? "Billing" : "Payment";
  const paymentLine1 = isAmbulance
    ? "Handled outside the app (dispatch / hospital)."
    : "Method: In-app (card)";
  const paymentLine2 = isAmbulance
    ? "Check with your operator for billing details."
    : "Status: Completed";

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 110 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-10 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Review</span>
                <p className="text-lg font-black text-white tracking-tight leading-tight text-center">Trip Completed</p>
              </div>
            </div>
          </div>
          <div className="w-11" />
        </header>
      </div>

      {/* Trip Switcher (Preview) */}
      <section className="px-6 pt-4 pb-2">
        <div className="bg-cream rounded-[2rem] p-4 border-2 border-orange-500/10 shadow-sm space-y-3">
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block ml-1">Trip Preview Control</span>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobType(type)}
                className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                  jobType === type
                    ? "bg-orange-500 text-white border-orange-500 shadow-md"
                    : "bg-white text-slate-400 border-orange-500/5 hover:border-orange-500/20"
                }`}
              >
                {jobTypeLabelMap[type]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        <div className="px-2">
           <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em]">
             Service: {jobTypeLabelMap[jobType]}
           </span>
        </div>

        {/* Trip summary card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-6 shadow-2xl">
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">{summaryLabel}</span>
              <p className="text-sm font-black uppercase tracking-tight">{routeLine}</p>
            </div>
            <div className="flex flex-col items-end space-y-1">
               {!isAmbulance && (
                <span className="text-base font-black text-emerald-400 uppercase tracking-tight">
                  ${rightTop}
                </span>
               )}
               {isAmbulance && (
                <span className="text-sm font-black text-emerald-400 uppercase tracking-tight">
                  {rightTop}
                </span>
               )}
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{rightBottom}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
               <Clock className="h-4 w-4" />
               <span>{timeRange}</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-black uppercase tracking-tight">
               <MapPin className="h-4 w-4" />
               <span>{locationLine}</span>
            </div>
          </div>

          {noteLine && (
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed border-t border-slate-800 pt-4">
              {noteLine}
            </p>
          )}
        </section>

        {/* Payment & rating info */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">{paymentTitle}</span>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">{paymentLine1}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{paymentLine2}</p>
              </div>
              {!isAmbulance && (
                <div className="flex flex-col items-end space-y-1">
                  <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Rider Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-black text-slate-900">5.0</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex flex-col space-y-4 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-orange-50">
                 <Star className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">Rate Your Rider</span>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">How was this trip?</p>
              </div>
            </div>
            {!isAmbulance && (
              <div className="flex items-center justify-center space-x-3 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" className="active:scale-110 transition-transform">
                    <Star className="h-8 w-8 text-amber-400 fill-amber-400" />
                  </button>
                ))}
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
              If there was a safety issue, lost item or dispute, you can report it from the Help & Safety section after this screen.
            </p>
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-4">
          <div className="flex flex-col space-y-3">
             <button
               type="button"
               onClick={() => navigate("/driver/dashboard/online")}
               className="w-full rounded-full py-4.5 text-[11px] font-black uppercase tracking-widest bg-orange-500 text-white shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
             >
               Go back online
             </button>
             <button
               type="button"
               onClick={() => navigate("/driver/history/rides")}
               className="w-full rounded-full py-4.5 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 bg-cream text-slate-500 hover:border-orange-500/30 transition-all flex items-center justify-center space-x-2"
             >
               <span>View Trip Details</span>
             </button>
          </div>
          <div className="bg-slate-100/30 rounded-3xl p-4 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed max-w-[280px] mx-auto">
               {isTour
                 ? "This segment is complete. Tour-related jobs will still appear in your Tour schedule for upcoming days."
                 : isRental
                 ? "This rental is complete. You can view it later in your History along with earnings and route details."
                 : isAmbulance
                 ? "This ambulance run is complete. Check with your operator if you need to follow up on documentation or billing."
                 : "You can find this trip later in your Ride History along with payment and route details."}
             </p>
          </div>
        </section>
      </main>
    </div>
  );
}
