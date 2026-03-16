import {
ChevronLeft,
Clock,
Map,
MapPin,
MessageCircle,
Navigation,
Package,
Phone
} from "lucide-react";
import { useNavigate,useParams } from "react-router-dom";

// EVzone Driver App – D81 Active Route with Stop Contact Screen (v1)
// Active route view with per-stop contact details and quick actions.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function StopContactRow({
  index,
  label,
  detail,
  eta,
  contactName,
  contactPhone,
  onMessage = () => {},
  onCall = () => {}
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm text-[11px] text-slate-600 flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
            <MapPin className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-slate-900">
              Stop {index} · {label}
            </span>
            <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
              {detail}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end text-[10px] text-slate-500">
          <span className="inline-flex items-center mb-0.5">
            <Clock className="h-3 w-3 mr-1" />
            {eta}
          </span>
          <span>Recipient: {contactName}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center text-[10px] text-slate-500">
          <Phone className="h-3 w-3 mr-1" />
          {contactPhone}
        </span>
        <div className="inline-flex items-center space-x-1">
          <button
            type="button"
            onClick={onMessage}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Message
          </button>
          <button
            type="button"
            onClick={onCall}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700"
          >
            <Phone className="h-3 w-3 mr-1" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActiveRouteWithStopContactScreen() {
  const navigate = useNavigate();
  const { stopId } = useParams();

  const stopsById = {
    "alpha-stop": {
      index: 1,
      label: "FreshMart, Lugogo",
      detail: "Deliver order #3235 · Groceries",
      eta: "18:40",
      contactName: "Sarah",
      contactPhone: "+256 700 000 333"
    },
    "beta-stop": {
      index: 2,
      label: "Ntinda (Main Road)",
      detail: "Deliver order #3230 · Pharmacy",
      eta: "18:55",
      contactName: "Michael",
      contactPhone: "+256 700 000 444"
    }
  };

  const selectedStop = stopsById[stopId] || stopsById["alpha-stop"];

  const sanitizePhone = (phone) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone) => {
    const target = sanitizePhone(phone);
    if (!target) return;
    window.open(`tel:${target}`);
  };
  const handleMessage = (phone) => {
    const target = sanitizePhone(phone);
    if (!target) return;
    window.open(`sms:${target}`);
  };

  return (
    <div className="flex flex-col min-h-full ">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-900 dark:text-white/70 text-center">
                  Driver · Deliveries
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-tight text-center">
                  Stop Contacts
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Map preview */}
        <button
          type="button"
          onClick={() => navigate("/driver/delivery/route/demo-route/map")}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[220px] w-full text-left active:scale-[0.99] transition-transform shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#03cd8c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
</div>

          {/* Pickup marker */}
          <div className="absolute left-10 top-18 flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white border-2 border-[#03cd8c] shadow-lg">
              <Package className="h-4 w-4 text-[#03cd8c]" />
            </div>
          </div>
        </button>

        {/* Stop with contact details */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Stop & Contact Details
          </h2>
          <StopContactRow
            {...selectedStop}
            onMessage={() => handleMessage(selectedStop.contactPhone)}
            onCall={() => handleCall(selectedStop.contactPhone)}
          />
          <button
            type="button"
            onClick={() => navigate("/driver/delivery/route/demo-route/active")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50 shadow-xl shadow-slate-200/50"
          >
            Back to Active Route
          </button>
        </section>
      </main>
    </div>
  );
}
