import React, { useState } from "react";
import {
  Bell,
  Building2,
  Car,
  Truck,
  ShieldCheck,
  AlertTriangle,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D16 Business Vehicles (v1)
// Business-owned / fleet vehicles assigned to the driver (separate from personal vehicles).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function FleetVehicleCard({ icon: Icon, title, subtitle, tag, status, onClick }) {
  const statusTone =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "Maintenance"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-sm active:scale-[0.97] transition-transform flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6fff7]">
          <Icon className="h-5 w-5 text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start text-left">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
          {tag && (
            <span className="mt-1 inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {tag}
            </span>
          )}
        </div>
      </div>
      <span
        className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusTone}`}
      >
        {status}
      </span>
    </button>
  );
}

export default function BusinessVehiclesScreen() {
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
              <Building2 className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver Personal
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Business vehicles
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
        <main className="app-main flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Company banner */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-2 text-left">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Fleet assignment
                </span>
                <p className="text-xs font-semibold text-white">GreenFleet Logistics · Kampala</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              You are driving on behalf of a business or fleet partner. The
              vehicles below are provided and maintained by your company.
            </p>
          </section>

          {/* Assigned vehicles */}
          <section className="space-y-2 text-left">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Assigned business vehicles
            </h2>
            <FleetVehicleCard
              icon={Car}
              title="EV Car · BYD Qin Plus"
              subtitle="Fleet ID: GF-12 · Plate: UBF 234Q"
              tag="Today’s shift vehicle"
              status="Active"
              onClick={() => navigate("/driver/vehicles/demo-vehicle")}
            />
            <FleetVehicleCard
              icon={Truck}
              title="EV Van · Maxus eDeliver 3"
              subtitle="Fleet ID: GF-07 · Plate: UBJ 981T"
              tag="Cargo / delivery"
              status="Maintenance"
              onClick={() => navigate("/driver/vehicles/demo-vehicle")}
            />
          </section>

          {/* Info & actions */}
          <section className="space-y-2 pt-1 pb-4 text-left">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white flex-shrink-0">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  Company safety & maintenance
                </p>
                <p>
                  Your company is responsible for servicing, insurance and EV
                  compliance. Report any issues as soon as you notice unusual
                  sounds, warnings or damage.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/driver/safety/emergency/details")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-white text-red-600 border border-red-200 flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report an issue with this vehicle
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/help/shuttle-link")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white flex items-center justify-center active:scale-[0.98] transition-transform"
            >
              <Info className="h-4 w-4 mr-2" />
              View company vehicle policy
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
