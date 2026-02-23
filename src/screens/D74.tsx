import React, { useState } from "react";
import {
    Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D74 Orders to Delivery (v1)
// Dashboard-style view for orders transitioning from "to pick up" to "to deliver" for the driver.
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
              <Package className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Orders to delivery
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Stats row */}
          <section className="space-y-2">
            <div className="flex space-x-2">
              <OrdersStat label="To pick up" value="3" sub="ready now" />
              <OrdersStat label="In delivery" value="2" sub="on route" />
            </div>
            <div className="flex space-x-2">
              <OrdersStat label="Completed today" value="7" sub="deliveries" />
              <OrdersStat label="Late risk" value="1" sub="watch ETA" />
            </div>
          </section>

          {/* Orders lists */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Ready for pickup
            </h2>
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
          </section>

          <section className="space-y-2 pt-1 pb-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              In delivery
            </h2>
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

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 mt-1 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertTriangle className="h-4 w-4 text-[#f97316]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Group pickups and deliveries
                </p>
                <p>
                  When possible, pick up orders from the same area together and
                  deliver in a logical sequence to reduce backtracking and
                  delays.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (delivery orders context) */}
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
