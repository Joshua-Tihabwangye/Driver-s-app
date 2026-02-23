import React, { useState } from "react";
import {
    ListFilter,
  Package,
  MapPin,
  Clock,
  DollarSign,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D75 List of Orders (v1)
// List-style view of delivery orders with filters and quick info.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

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
  const [nav] = useState("home");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
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
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Filter row */}
          <section className="rounded-2xl bg-slate-50 px-3 py-2 border border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-900">Showing</span>
              <span>Today · Nearby · All types</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/delivery/orders/filter")}
              className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700"
            >
              <ListFilter className="h-3 w-3 mr-1" />
              Filters
            </button>
          </section>

          {/* Orders list */}
          <section className="space-y-2">
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

        {/* Bottom navigation – Home active (orders context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
