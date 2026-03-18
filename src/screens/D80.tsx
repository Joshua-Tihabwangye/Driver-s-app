import {
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { MOCK_DELIVERY_ROUTES } from "../data/mockData";

// EVzone Driver App – D80 Active Delivery Route Screen (v2)
// Active delivery route view combining map + next stop card + quick contact.
// Merged with D81 (contact details) explicitly.
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
}: any) {
  return (
    <div className="rounded-[2rem] border-2 border-brand-active/20 bg-brand-active/5 px-5 py-4 shadow-sm flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-active/20">
            <MapPin className="h-5 w-5 text-brand-active" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
              Stop {index} · {label}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight truncate max-w-[180px]">
              {detail}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed text-right">
          <span className="inline-flex items-center text-brand-active mb-0.5 text-[11px]">
            <Clock className="h-3 w-3 mr-1" />
            {eta}
          </span>
          <span>{contactName}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-brand-active/10 text-slate-600">
        <span className="inline-flex items-center text-[12px] font-black tracking-widest">
          <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
          {contactPhone}
        </span>
        <div className="inline-flex items-center space-x-2">
          <button
            type="button"
            onClick={onMessage}
            className="inline-flex items-center h-8 px-4 rounded-full border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm active:scale-95 transition-all hover:bg-slate-50"
          >
            <MessageCircle className="h-3 w-3 mr-1.5" />
            Msg
          </button>
          <button
            type="button"
            onClick={onCall}
            className="inline-flex items-center h-8 px-4 rounded-full bg-brand-active text-[10px] font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all hover:bg-brand-active/90"
          >
            <Phone className="h-3 w-3 mr-1.5" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActiveDeliveryRouteScreen() {
  const navigate = useNavigate();
  const { routeId } = useParams();
  
  // Resolve data via mock data
  const route = MOCK_DELIVERY_ROUTES[routeId as keyof typeof MOCK_DELIVERY_ROUTES] || MOCK_DELIVERY_ROUTES["demo-route"];
  const nextStop = route?.stops[0];

  const sanitizePhone = (phone: string) => (phone || "").replace(/[^\d+]/g, "");
  const handleCall = (phone: string) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`tel:${target}`);
  };
  const handleMessage = (phone: string) => {
    const target = sanitizePhone(phone);
    if (target) window.open(`sms:${target}`);
  };

  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <PageHeader 
        title="Active Route" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Map container */}
        <button
          type="button"
          onClick={() => navigate(`/driver/delivery/route/${routeId || "demo-route"}/map`)}
          className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[260px] w-full text-left active:scale-[0.99] transition-transform shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Route polyline (simplified SVG) */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
                fill="none"
                stroke="#12c98c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8 5"
              />
            </svg>
          </div>

          {/* Driver marker */}
          <div className="absolute left-14 bottom-14 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border-2 border-white shadow-2xl">
              <Navigation className="h-6 w-6 text-brand-active" />
            </div>
          </div>

          {/* Next stop marker */}
          <div className="absolute right-12 top-16 flex flex-col items-center">
            <span className="mt-2 rounded-full bg-slate-900 px-3 py-1 text-[9px] font-black text-white uppercase tracking-widest border border-brand-active/50 shadow-lg shadow-brand-active/20">
              Next Stop
            </span>
          </div>
        </button>

        {/* Grouped route context */}
        <div className="rounded-[2.5rem] border border-slate-100 bg-slate-900 text-white p-6 shadow-xl flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-active/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex flex-col items-start px-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.1em] text-brand-active mb-1">
              Grouped Route
            </span>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
              You have {route?.stops?.length} stops on this route. Follow the suggested order to
              minimise backtracking.
            </p>
          </div>
        </div>

        {/* Next stop Contact Details (Merged D81) */}
        <section className="space-y-4 pb-12">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
               Current Destination
             </h2>
          </div>
          {nextStop ? (
            <StopContactRow
              {...nextStop}
              onMessage={() => handleMessage(nextStop.contactPhone)}
              onCall={() => handleCall(nextStop.contactPhone)}
            />
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center text-slate-500 text-[11px]">
              No pending stops found.
            </div>
          )}
          
          <button
            type="button"
            onClick={() => navigate(`/driver/delivery/route/${routeId || "demo-route"}/details`)}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50 shadow-xl shadow-slate-200/50"
          >
            View Full Manifest
          </button>
        </section>
      </main>
    </div>
  );
}
