import React, { useState } from "react";
import {
    QrCode,
  Package,
  MapPin,
  Info,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D87 QR Code – Package Pickup Verification (v1)
// Screen showing a QR code used to verify package pickup at a location.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function QrCodePackagePickupVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
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
              <QrCode className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Deliveries
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Package pickup verification
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* QR code card */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm px-4 py-4 flex flex-col items-center space-y-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6fff7]">
                <Package className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div className="flex flex-col items-center text-[11px] text-slate-600">
                <span className="text-xs font-semibold text-slate-900">
                  Show this code at pickup
                </span>
                <span>Merchant scans to confirm package handover.</span>
              </div>
            </div>

            {/* Placeholder QR block */}
            <div className="mt-1 flex h-40 w-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <QrCode className="h-16 w-16 text-slate-700" />
            </div>

            <div className="text-[10px] text-slate-500 text-center max-w-[260px]">
              Order ID: <span className="font-mono text-slate-700">#3241</span> ·
              Pickup: Burger Hub, Acacia Mall
            </div>
          </section>

          {/* Info & confirmation */}
          <section className="space-y-2 pt-1 pb-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <Info className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  How this works
                </p>
                <p>
                  The merchant or staff member scans this code in their system.
                  Once verified, the order is marked as picked up and you can
                  start the delivery leg.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-emerald-700">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-emerald-800 mb-0.5">
                  After scanning
                </p>
                <p>
                  You&apos;ll see a confirmation in the app that the package has
                  been verified. If the code doesn&apos;t scan, ask the merchant to
                  confirm the order ID.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (pickup verification context) */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")}/>
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")}/>
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")}/>
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")}/>
        </nav>
      </div>
    </div>
  );
}
