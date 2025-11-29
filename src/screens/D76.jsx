import React, { useState } from "react";
import {
  Bell,
  ListFilter,
  Package,
  Utensils,
  Pill,
  Truck,
  ShoppingBag,
  MapPin,
  Clock,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D76 List of Orders – Select Order Type (v1)
// List of orders with a prominent order-type filter (Food, Pharmacy, Parcel, Grocery).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

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
    <button className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex flex-col space-y-2 text-[11px] text-slate-600">
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
    status: "Ready for pickup",
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
    status: "Assigned to you",
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
    status: "Nearby",
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
    status: "Nearby",
  },
];

export default function ListOfOrdersSelectTypeScreen() {
  const [nav] = useState("home");
  const [selectedType, setSelectedType] = useState("all");

  const filtered =
    selectedType === "all"
      ? ORDERS
      : ORDERS.filter((o) => o.kind === selectedType);

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <ListFilter className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                List of orders
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Type filter chips */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Order type
            </h2>
            <div className="flex flex-wrap">
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
          <section className="space-y-2">
            {filtered.map((o) => (
              <OrderCard key={o.id} {...o} />
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
                No orders found for this type right now. Try another filter or
                check again later.
              </div>
            )}
          </section>
        </main>

        {/* Bottom navigation – Home active (orders context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
