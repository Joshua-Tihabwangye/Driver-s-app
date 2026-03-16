import {
ChevronLeft,
DollarSign,
ListFilter,
MapPin,
Package,
Pill,
ShoppingBag,
Truck,
Utensils
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D76 List of Orders – Select Order Type (v1)
// List of orders with a prominent order-type filter (Food, Pharmacy, Parcel, Grocery).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function TypeChip({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium mr-1.5 mb-1.5 active:scale-[0.97] transition-transform ${
        active
          ? "bg-[#03cd8c] text-slate-900 border-[#03cd8c]"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      <Icon className="h-3.5 w-3.5 mr-1" />
      {label}
    </button>
  );
}

function OrderCard({ id, type, pickup, dropoff, distance, eta, amount, status }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">
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

const ORDER_TYPES = [
  { key: "all", label: "All", icon: ListFilter },
  { key: "food", label: "Food", icon: Utensils },
  { key: "pharmacy", label: "Pharmacy", icon: Pill },
  { key: "parcel", label: "Parcel", icon: Truck },
  { key: "grocery", label: "Grocery", icon: ShoppingBag },
];

const ORDERS = [
  {
    id: "3241",
    type: "Food",
    kind: "food",
    pickup: "Burger Hub, Acacia Mall",
    dropoff: "Kira Road",
    distance: "3.2 km",
    eta: "15–20 min",
    amount: "3.80",
    status: "Ready for pickup"
},
  {
    id: "3242",
    type: "Pharmacy",
    kind: "pharmacy",
    pickup: "PharmaPlus, City Centre",
    dropoff: "Ntinda",
    distance: "5.4 km",
    eta: "20–25 min",
    amount: "4.50",
    status: "Assigned to you"
},
  {
    id: "3243",
    type: "Parcel",
    kind: "parcel",
    pickup: "Logistics Hub, Industrial Area",
    dropoff: "Bugolobi",
    distance: "4.1 km",
    eta: "25–30 min",
    amount: "5.20",
    status: "Nearby"
},
  {
    id: "3244",
    type: "Grocery",
    kind: "grocery",
    pickup: "FreshMart, Lugogo",
    dropoff: "Naguru",
    distance: "2.7 km",
    eta: "10–15 min",
    amount: "3.40",
    status: "Nearby"
},
];

export default function ListOfOrdersSelectTypeScreen() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("all");

  const filtered =
    selectedType === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.kind === selectedType);

  return (
    <div className="flex flex-col min-h-full ">
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
                <ListFilter className="h-6 w-6 text-slate-900 dark:text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-900 dark:text-white/70">
                  Driver · Deliveries
                </span>
                <h1 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  Select Order Type
                </h1>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Type filter chips */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Order Type
          </h2>
          <div className="flex flex-wrap gap-2">
            {ORDER_TYPES.map((t) => (
              <TypeChip
                key={t.key}
                icon={t.icon}
                label={t.label}
                active={selectedType === t.key}
                onClick={() => setSelectedType(t.key)}
              />
            ))}
          </div>
        </section>

        {/* Orders list */}
        <section className="space-y-4 pb-12">
          {filtered.map((o) => (
            <OrderCard key={o.id} {...o} />
          ))}

          {filtered.length === 0 && (
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 text-[11px] text-slate-500 font-medium text-center">
              No orders found for this type right now. Try another filter or
              check again later.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
