import {
AlertTriangle,
CheckCircle2,
ChevronLeft,
Clock,
MapPin,
Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D74 Orders to Delivery (v1)
// Dashboard-style view for orders transitioning from "to pick up" to "to deliver" for the driver.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function OrdersStat({ label, value, sub }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white px-3 py-3 shadow-sm border border-slate-100 flex-1 min-w-[0]">
      <span className="text-[11px] text-slate-500 truncate">{label}</span>
      <span className="text-sm font-semibold text-slate-900 truncate">{value}</span>
      {sub && <span className="mt-0.5 text-[10px] text-slate-500 truncate">{sub}</span>}
    </div>
  );
}

function OrderRow({ id, pickup, dropoff, eta, status, onClick }) {
  const isReady = status === "Ready for pickup";
  const isEnRoute = status === "En route";

  const toneClasses = isReady
    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
    : isEnRoute
    ? "border-amber-100 bg-amber-50 text-amber-700"
    : "border-slate-100 bg-white text-slate-700";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-2.5 text-[11px] shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between ${toneClasses}`}
    >
      <div className="flex flex-col items-start max-w-[190px]">
        <span className="text-xs font-semibold text-slate-900 truncate">
          Order #{id}
        </span>
        <span className="text-[10px] text-slate-600 truncate">
          {pickup} → {dropoff}
        </span>
        <span className="mt-0.5 inline-flex items-center text-[10px]">
          <MapPin className="h-3 w-3 mr-1" />
          {status}
        </span>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-600">
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
        {isReady && (
          <span className="mt-0.5 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Pick up now
          </span>
        )}
      </div>
    </button>
  );
}

export default function OrdersToDeliveryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full ">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-inner">
                <Package className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-900 dark:text-white/70">
                  Driver · Deliveries
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  Delivery Manager
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Stats row */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <OrdersStat label="To Pick Up" value="3" sub="Ready now" />
            <OrdersStat label="In Delivery" value="2" sub="On route" />
            <OrdersStat label="Today" value="7" sub="Completed" />
            <OrdersStat label="Late Risk" value="1" sub="Watch ETA" />
          </div>
        </section>

        {/* Orders lists */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Ready for Pickup
          </h2>
          <div className="space-y-3">
            <OrderRow
              id="3241"
              pickup="Burger Hub, Acacia Mall"
              dropoff="Kira Road"
              eta="Pick up by 18:20"
              status="Ready for pickup"
              onClick={() => navigate("/driver/delivery/orders/picked-up")}
            />
            <OrderRow
              id="3242"
              pickup="PharmaPlus, City Centre"
              dropoff="Ntinda"
              eta="Pick up by 18:30"
              status="Ready for pickup"
              onClick={() => navigate("/driver/delivery/orders/picked-up")}
            />
          </div>
        </section>

        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            In Delivery
          </h2>
          <div className="space-y-3">
            <OrderRow
              id="3235"
              pickup="FreshMart, Lugogo"
              dropoff="Naguru"
              eta="Deliver by 18:40"
              status="En route"
              onClick={() => navigate("/driver/delivery/route/demo-route/active")}
            />
            <OrderRow
              id="3230"
              pickup="Taco Hub, Acacia"
              dropoff="Kansanga"
              eta="Deliver by 18:55"
              status="En route"
              onClick={() => navigate("/driver/delivery/route/demo-route/stop/alpha-stop/details")}
            />
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-black text-[11px] uppercase tracking-widest text-slate-900">
                  Group optimizations
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                   Pick up orders from the same area together to reduce delays.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
