import React, { useState } from "react";
import {
    CheckCircle2,
  QrCode,
  Package,
  MapPin,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D96 Pick-Up Confirmed Screen (v1)
// Generic pickup confirmed screen usable for marketing scans or package pickup confirmation.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

export default function PickupConfirmedGenericScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                EVzone
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Pickup confirmed
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Confirmation card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3 flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-300">
              <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            </div>
            <div className="flex flex-col items-center text-[11px] text-slate-100">
              <span className="text-sm font-semibold text-white">
                You&apos;re all set
              </span>
              <span>
                This pickup has been confirmed and linked to your EVzone
                account.
              </span>
            </div>
          </section>

          {/* Details */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <QrCode className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Code details
                </span>
                <span>
                  QR: <span className="font-mono text-slate-800">ABC123</span>
                </span>
                <span>Scanned from EVzone poster / packaging.</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
                <Package className="h-4 w-4 text-slate-700" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Pickup summary
                </span>
                <span>Order ID: #3241</span>
                <span>Location: Burger Hub, Acacia Mall</span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Time: 18:22 · Linked to today&apos;s earnings
                </span>
              </div>
            </div>
          </section>

          {/* Hint / next steps */}
          <section className="space-y-2 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                What&apos;s next?
              </p>
              <p>
                Head to the delivery address following your active route. You
                can view this pickup in your Ride & Delivery History.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (generic pickup confirmation context) */}
        <nav className="app-bottom-nav border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"}  onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"}  onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"}  onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"}  onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
