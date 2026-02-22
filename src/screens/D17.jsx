import React, { useState } from "react";
import {
  Bell,
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D17 Vehicle Accessories (v1)
// Accessories required / recommended for rides & deliveries (helmet, jackets, delivery box, child seat, etc.).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function AccessoryRow({ icon: Icon, name, detail, status }) {
  const tone =
    status === "Required"
      ? {
        chipBg: "bg-amber-50",
        chipText: "text-amber-700",
        chipDot: "bg-amber-500",
      }
      : status === "Missing"
        ? {
          chipBg: "bg-red-50",
          chipText: "text-red-600",
          chipDot: "bg-red-500",
        }
        : {
          chipBg: "bg-emerald-50",
          chipText: "text-emerald-700",
          chipDot: "bg-emerald-500",
        };

  const IconRight = status === "Available" ? CheckCircle2 : status === "Missing" ? XCircle : Info;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 flex-shrink-0">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start truncate overflow-hidden text-left">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[180px]">{name}</span>
          <span className="text-[11px] text-slate-500 truncate max-w-[200px]">{detail}</span>
          <span
            className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.chipBg} ${tone.chipText}`}
          >
            <span className={`mr-1 h-1.5 w-1.5 rounded-full ${tone.chipDot}`} />
            {status}
          </span>
        </div>
      </div>
      <IconRight
        className={`h-4 w-4 flex-shrink-0 ${status === "Available"
            ? "text-emerald-600"
            : status === "Missing"
              ? "text-red-500"
              : "text-slate-400"
          }`}
      />
    </div>
  );
}

export default function VehicleAccessoriesScreen() {
  const [nav] = useState("manager");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
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
                Driver Personal
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Vehicle accessories
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide text-left">
          {/* Safety banner */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900 flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Safety & equipment
                </span>
                <p className="text-xs font-semibold text-white">
                  Make sure your vehicle has all required accessories.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Some accessories are required by law or by EVzone policy,
              especially for deliveries, night rides and rides with children.
            </p>
          </section>

          {/* Accessories list */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Accessories for your EV
            </h2>
            <AccessoryRow
              icon={ShieldCheck}
              name="Reflective jacket"
              detail="Required for night shifts and roadside stops."
              status="Required"
            />
            <AccessoryRow
              icon={Package}
              name="Delivery box / carrier"
              detail="Food and parcel deliveries must use insulated or secure boxes."
              status="Available"
            />
            <AccessoryRow
              icon={Package}
              name="Child seat (if applicable)"
              detail="Required when transporting children under local regulations."
              status="Missing"
            />
          </section>

          {/* Info + reminder */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Keep this list up to date
                </p>
                <p>
                  If your vehicle accessories change, update them here so your
                  trips remain compliant with EVzone safety standards and local
                  regulations.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/driver/vehicles/demo-vehicle")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] active:scale-[0.98] transition-transform"
            >
              Update accessories
            </button>
          </section>
        </main>

        {/* Bottom navigation */}
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
