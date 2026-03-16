import {
ChevronLeft,
DollarSign,
ListFilter,
MapPin,
Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D75 List of Orders (v1)
// List-style view of delivery orders with filters and quick info.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function OrderCard({
  id,
  type,
  pickup,
  dropoff,
  distance,
  eta,
  amount,
  status,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
          #{id} · {type}
        </span>
        <span className="inline-flex items-center text-sm font-semibold text-slate-900">
          <DollarSign className="h-3 w-3 mr-0.5" />
          {amount}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center truncate max-w-[220px]">
          <Package className="h-3 w-3 mr-1" />
          {pickup} → {dropoff}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {distance} · {eta}
        </span>
        <span className="text-[10px] text-slate-500">{status}</span>
      </div>
    </button>
  );
}

export default function ListOfOrdersScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
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
                  List of Orders
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Filter row */}
        <section className="sticky top-0 bg-[#f8fafc]/80 backdrop-blur-md z-10 py-2 -mx-6 px-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex flex-col items-start px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#03cd8c]">Active Filters</span>
              <span className="text-[11px] font-medium text-slate-500">Today · Nearby · All Types</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/delivery/orders/filter")}
              className="rounded-2xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all shadow-md flex items-center"
            >
              <ListFilter className="h-3.5 w-3.5 mr-2" />
              Filters
            </button>
          </div>
        </section>

        {/* Orders list */}
        <section className="space-y-4 pb-12">
          <OrderCard
            id="3241"
            type="Food"
            pickup="Burger Hub, Acacia Mall"
            dropoff="Kira Road"
            distance="3.2 km"
            eta="15–20 min"
            amount="3.80"
            status="Ready for pickup"
            onClick={() => navigate("/driver/delivery/orders/picked-up")}
          />
          <OrderCard
            id="3242"
            type="Pharmacy"
            pickup="PharmaPlus, City Centre"
            dropoff="Ntinda"
            distance="5.4 km"
            eta="20–25 min"
            amount="4.50"
            status="Assigned to you"
            onClick={() => navigate("/driver/delivery/route/demo-route/active")}
          />
          <OrderCard
            id="3243"
            type="Parcel"
            pickup="Logistics Hub, Industrial Area"
            dropoff="Bugolobi"
            distance="4.1 km"
            eta="25–30 min"
            amount="5.20"
            status="Nearby"
            onClick={() => navigate("/driver/delivery/route/demo-route/details")}
          />
          <OrderCard
            id="3244"
            type="Grocery"
            pickup="FreshMart, Lugogo"
            dropoff="Naguru"
            distance="2.7 km"
            eta="10–15 min"
            amount="3.40"
            status="Nearby"
            onClick={() => navigate("/driver/delivery/route/demo-route/stop/alpha-stop/details")}
          />
        </section>
      </main>
    </div>
  );
}
