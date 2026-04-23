import {
  ChevronLeft,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Package,
  Share2
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import SlideToConfirm from "../components/SlideToConfirm";
import { SAMPLE_IDS } from "../data/constants";
import { MOCK_DELIVERY_ROUTES } from "../data/mockData";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – ActiveDeliveryRoute Active Delivery Route Screen (v2)
// Active delivery route view combining map + next stop card + quick contact.
// Merged with DeliveryStopContact (contact details) explicitly.
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
    <div className="rounded-[2rem] border-2 border-orange-500/20 bg-orange-50/50 px-5 py-4 shadow-sm flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
            <MapPin className="h-5 w-5 text-orange-500" />
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
          <span className="inline-flex items-center text-orange-500 mb-0.5 text-[11px]">
            <Clock className="h-3 w-3 mr-1" />
            {eta}
          </span>
          <span>{contactName}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-orange-500/10 text-slate-600">
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
            className="inline-flex items-center h-8 px-4 rounded-full bg-orange-500 text-[10px] font-black uppercase tracking-widest text-white shadow-md active:scale-95 transition-all hover:bg-orange-600"
          >
            <Phone className="h-3 w-3 mr-1.5" />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActiveDeliveryRoute() {
  const navigate = useNavigate();
  const { routeId } = useParams();
  const { deliveryWorkflow, deliveryStageAtLeast } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("in_delivery")) {
      navigate("/driver/delivery/pickup/confirmed", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);
  
  // Resolve data via mock data
  const route =
    MOCK_DELIVERY_ROUTES[
      (routeId || deliveryWorkflow.routeId) as keyof typeof MOCK_DELIVERY_ROUTES
    ] ||
    MOCK_DELIVERY_ROUTES[SAMPLE_IDS.route as keyof typeof MOCK_DELIVERY_ROUTES];
  const nextStop =
    route?.stops?.find((stop) => /deliver/i.test(stop.detail)) ||
    route?.stops?.find((stop) => stop.status === "current") ||
    route?.stops?.find((stop) => stop.status === "upcoming") ||
    route?.stops?.[0];
  const activeStopId = nextStop?.id || deliveryWorkflow.stopId;

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
      <DriverMapSurface
        heightClass="h-[460px]"
        onBack={() => navigate(-1)}
        routePath="M14 82 C 28 70, 40 64, 52 52 S 72 34, 86 20"
        routeColor="#15b79e"
        routeStrokeWidth={3.2}
        routeDasharray="8 5"
        defaultTrafficOn
        defaultAlertsOn
        topRightSlot={(
          <button
            type="button"
            onClick={() =>
              navigate(
                `/driver/delivery/route/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}/map`
              )
            }
            className="rounded-full border border-slate-200 bg-white/94 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 shadow-lg"
          >
            Open map
          </button>
        )}
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Next Leg
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              Follow the suggested order to reduce backtracking.
            </p>
          </div>
        )}
        markers={[
          { id: "depot", positionClass: "left-[14%] top-[18%]", tone: "station", label: "Depot", icon: Package },
          { id: "driver", positionClass: "left-[18%] bottom-[20%]", tone: "driver", icon: Navigation },
          { id: "stop", positionClass: "right-[16%] top-[20%]", tone: "warning", label: "Next Stop", icon: MapPin },
        ]}
      />

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
            Driver · Deliveries
          </p>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            Active Route
          </h1>
        </section>

        {/* Grouped route context */}
        <div className="rounded-[2.5rem] border border-orange-500/10 bg-slate-900 text-white p-6 shadow-xl flex items-center justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="flex flex-col items-start px-2 relative z-10">
            <span className="text-xs font-black uppercase tracking-[0.1em] text-orange-500 mb-1">
              Grouped Route
            </span>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[240px]">
              You have {route?.stops?.length} stops on this route. Follow the suggested order to
              minimise backtracking.
            </p>
          </div>
        </div>

        {/* Share Trip Status */}
        <button
          type="button"
          onClick={() => navigate(`/driver/safety/share-my-ride/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}`)}
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

        {/* Next stop Contact Details (Merged DeliveryStopContact) */}
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
          
          <SlideToConfirm
            instruction="Slide when arrived at drop-off"
            successLabel="Drop-off reached"
            onConfirm={() => {
              navigate(
                `/driver/delivery/route/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}/stop/${activeStopId}/details`
              );
              return true;
            }}
          />

          <button
            type="button"
            onClick={() =>
              navigate(
                `/driver/delivery/route/${routeId || deliveryWorkflow.routeId || SAMPLE_IDS.route}/details`
              )
            }
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all hover:bg-slate-50 shadow-xl shadow-slate-200/50"
          >
            View Full Manifest
          </button>
        </section>
      </main>
    </div>
  );
}
