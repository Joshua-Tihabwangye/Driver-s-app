import {
CheckCircle2,
MapPin,
Package,
Phone,
ShieldCheck,
Wallet
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SlideToConfirm from "../components/SlideToConfirm";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – PickupConfirmed Pick-Up Confirmed Screen (v1)
// Generic pickup confirmed screen usable for marketing scans or package pickup confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function PickupConfirmed() {
  const navigate = useNavigate();
  const {
    deliveryStageAtLeast,
    startDeliveryRoute,
    deliveryWorkflow,
    activeDeliveryJob,
  } = useStore();

  useEffect(() => {
    if (!deliveryStageAtLeast("qr_verified")) {
      navigate("/driver/qr/scanner", { replace: true });
    }
  }, [deliveryStageAtLeast, navigate]);

  const netWeightByType: Record<string, string> = {
    groceries: "4.6 kg",
    food: "1.3 kg",
    parcel: "2.4 kg",
    medicine: "0.7 kg",
  };
  const packageType = (activeDeliveryJob?.itemType || "Parcel").toLowerCase();
  const resolvedWeight = netWeightByType[packageType] || "2.4 kg";
  const orderId = activeDeliveryJob?.id || "3241";
  const pickupPoint = activeDeliveryJob?.from || "Burger Hub, Acacia Mall";
  const destination = activeDeliveryJob?.to || "Naguru (Block B)";
  const etaWindow = activeDeliveryJob?.duration
    ? `ETA ${activeDeliveryJob.duration}`
    : "ETA 18-25 min";
  const routeDistance = activeDeliveryJob?.distance || "3.1 km";

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Delivery Details" 
        subtitle="Driver · Deliveries" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Verified header */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl flex flex-col items-center text-center space-y-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-500/10 border border-orange-500/20 shadow-inner">
            <CheckCircle2 className="h-10 w-10 text-orange-500" />
          </div>
          <div className="relative space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">
              QR Verified
            </h2>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed max-w-[220px]">
              Pickup has been authenticated. Review these delivery details before departure.
            </p>
          </div>
        </section>

        {/* Order details */}
        <section className="space-y-4">
          <div className="rounded-[2rem] bg-white border border-slate-100 p-5 shadow-xl shadow-slate-200/50 flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                 Shipment
               </span>
               <p className="text-sm font-black text-slate-900 truncate">
                 Order #{orderId} · {activeDeliveryJob?.itemType || "Parcel"}
               </p>
               <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                 <span className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1">
                   Net Weight: <span className="text-slate-900">{resolvedWeight}</span>
                 </span>
                 <span className="rounded-xl bg-slate-50 border border-slate-100 px-2 py-1">
                   Pieces: <span className="text-slate-900">1</span>
                 </span>
               </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-100 p-5 shadow-xl shadow-slate-200/50 flex items-start space-x-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                 Route
               </span>
               <p className="text-sm font-black text-slate-900 truncate uppercase">
                 {pickupPoint}
               </p>
               <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                 To: {destination}
               </p>
               <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mt-2">
                 {etaWindow} · {routeDistance}
               </p>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white border border-slate-100 p-5 shadow-xl shadow-slate-200/50">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">
              Recipient & Handover
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Recipient
                </span>
                <span className="text-[11px] font-black text-slate-900">
                  Sarah K.
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-orange-500" />
                  Contact
                </span>
                <span className="text-[11px] font-black text-slate-900">
                  +256 700 000 333
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Wallet className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
                    Payment
                  </span>
                  <p className="mt-1 text-[11px] font-black text-slate-900 uppercase">
                    Cash on delivery
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                  <span className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                    Proof
                  </span>
                  <p className="mt-1 text-[11px] font-black text-slate-900 uppercase">
                    Signature + photo
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">
                  Delivery note
                </p>
                <p className="mt-1 text-[11px] font-medium text-slate-700">
                  Call on arrival and meet at main gate security desk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Next step info */}
        <section className="space-y-4">
          <div className="rounded-[2rem] bg-orange-50/50 border border-orange-100/50 p-6 flex items-start space-x-4">
             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <MapPin className="h-5 w-5" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">
                  What's Next?
                </p>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                  Start navigation to drop-off and complete handover with recipient signature proof.
                </p>
             </div>
          </div>

          <SlideToConfirm
            instruction="Slide to start delivery route"
            successLabel="Route started"
            onConfirm={() => {
              startDeliveryRoute();
              navigate(`/driver/delivery/route/${deliveryWorkflow.routeId}/active`);
              return true;
            }}
          />
        </section>
      </main>
    </div>
  );
}
