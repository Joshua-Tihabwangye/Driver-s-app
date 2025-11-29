import React, { useState } from "react";
import {
  Bell,
  Car,
  Bike,
  Truck,
  Zap,
  ChevronRight,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D15 Vehicles (v1)
// Vehicle detail / add-vehicle screen.
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

function VehicleTypeChip({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors active:scale-[0.97] ${
        active
          ? "border-[#03cd8c] bg-[#e6fff7] text-slate-900"
          : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
      }`}
    >
      <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
        <Icon className="h-4 w-4 text-[#03cd8c]" />
      </div>
      <span>{label}</span>
    </button>
  );
}

function InputRow({ label, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
      />
    </label>
  );
}

export default function VehiclesDetailScreen() {
  const [nav] = useState("manager");
  const [type, setType] = useState("car");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Car className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver Personal
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Vehicle details
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Vehicle type selector */}
          <section className="space-y-2 pt-1">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Select EV type
            </h2>
            <div className="flex items-stretch space-x-2">
              <VehicleTypeChip
                icon={Car}
                label="EV car"
                active={type === "car"}
                onClick={() => setType("car")}
              />
              <VehicleTypeChip
                icon={Bike}
                label="E-bike / scooter"
                active={type === "bike"}
                onClick={() => setType("bike")}
              />
              <VehicleTypeChip
                icon={Truck}
                label="EV van"
                active={type === "van"}
                onClick={() => setType("van")}
              />
            </div>
          </section>

          {/* Key fields */}
          <section className="space-y-3">
            <InputRow label="Make" placeholder="e.g. BYD, Tesla" />
            <InputRow label="Model" placeholder="e.g. Dolphin, Model 3" />
            <div className="flex space-x-2">
              <div className="flex-1">
                <InputRow label="Year" placeholder="e.g. 2024" />
              </div>
              <div className="flex-1">
                <InputRow label="Color" placeholder="e.g. Pearl white" />
              </div>
            </div>
            <InputRow label="License plate" placeholder="e.g. UAX 123Z" />
            <InputRow
              label="Battery size (kWh)"
              placeholder="e.g. 60"
            />
            <InputRow
              label="Approx. range (km)"
              placeholder="e.g. 380"
            />
          </section>

          {/* EV connector + docs links */}
          <section className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => navigate("/driver/vehicles/demo-vehicle")}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <Zap className="h-4 w-4 text-[#03cd8c]" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Charging connector & ports
                  </span>
                  <span className="text-[11px] text-slate-500">
                    e.g. Type 2, CCS, GB/T
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/driver/onboarding/profile/documents/upload")
              }
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-transform"
            >
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                  <Info className="h-4 w-4 text-slate-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    Registration & insurance documents
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Upload clear photos for verification
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </section>

          {/* Info + CTA */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex items-start space-x-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  EV details help us plan better trips
                </p>
                <p>
                  Accurate EV information lets us estimate range, show charging
                  stops, and keep both you and riders informed about longer
                  routes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/driver/vehicles")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
            >
              Save vehicle
            </button>
          </section>
        </main>

        {/* Bottom navigation – Manager active (Driver Personal context) */}
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
