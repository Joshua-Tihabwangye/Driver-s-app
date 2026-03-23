import { buildPrivateTripRoute } from "../data/constants";
import {
ChevronLeft,
MessageCircle,
Phone,
ShieldCheck,
User
} from "lucide-react";
import { useRef,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – RiderVerification Rider Verification Code Entry (v1)
// Screen for entering a 4-digit rider verification code at pickup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


const CODE_LENGTH = 4;

export default function RiderVerification() {
  const navigate = useNavigate();
  const { tripId: routeTripId } = useParams();
  const { activeTrip, transitionActiveTripStage } = useStore();
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const tripId = routeTripId || activeTrip.tripId;

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isComplete = code.every((c) => c !== "");

  const handleVerifyAndContinue = () => {
    if (!isComplete) {
      return;
    }

    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    if (activeTrip.tripId === tripId && activeTrip.jobType === "ride") {
      transitionActiveTripStage("rider_verified");
    }

    navigate(buildPrivateTripRoute("start_drive", tripId));
  };

  const handleCancel = () => {
    if (!tripId) {
      navigate("/driver/jobs/list");
      return;
    }

    navigate(buildPrivateTripRoute("cancel_reason", tripId));
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Customer Verification" 
        subtitle="Safety" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Info block */}
        <section className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
              <User className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">ACTION REQUIRED</span>
              <p className="text-sm font-black uppercase tracking-tight text-slate-900">Verification</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed">
            Please ask the customer for their 4-digit verification code and enter it below to begin the trip.
          </p>
        </section>

        {/* Code entry */}
        <section className="space-y-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="h-14 w-14 rounded-2xl border-2 border-orange-500/10 bg-white text-center text-xl font-black text-slate-900 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
              />
            ))}
          </div>
          <div className="bg-[#f0fff4]/50 rounded-3xl p-4 text-center border-2 border-orange-500/10">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed max-w-[240px] mx-auto">
               Ensure you are at the correct pickup point before verifying the code.
             </p>
          </div>
        </section>

        {/* Contact & help */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 flex flex-col space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
             <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                   <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Support</span>
                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight leading-tight">Code not working?</p>
                </div>
                <div className="flex items-center space-x-2">
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm hover:bg-orange-50 transition-colors">
                     <MessageCircle className="h-4 w-4" />
                   </button>
                   <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-110 transition-all">
                     <Phone className="h-4 w-4" />
                   </button>
                </div>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
               If the code doesn't match, ask the customer to check their app. Contact support if the issue persists.
             </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <button
              disabled={!isComplete}
              onClick={handleVerifyAndContinue}
              className={`w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                isComplete
                  ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50"
              }`}
            >
              Verify & Start Trip
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-full py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-400 hover:bg-white hover:border-orange-500/30 transition-all"
            >
              Cancel Trip
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
