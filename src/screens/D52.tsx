import React, { useState } from "react";
import {
    AlertTriangle,
  Map,
  MapPin,
  Clock,
  MessageCircle,
  Phone,
  XCircle,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D52 Driver App – Cancel Ride (Passenger No-Show Alert) (v1)
// Confirmation alert before cancelling a ride as passenger no-show.
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

export default function CancelRideNoShowAlertScreen() {
  const navigate = useNavigate();
  const [nav] = useState("home");

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="app-header flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffecec]">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Cancel ride as no-show?
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide">
          {/* Map + pickup context */}
          <section className="relative rounded-3xl overflow-hidden border border-slate-100 bg-slate-200 h-[220px] mb-3">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/90 border border-white">
                  <MapPin className="h-3.5 w-3.5 text-[#03cd8c]" />
                </div>
                <span className="mt-0.5 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] text-slate-50">
                  Pickup · Acacia Mall
                </span>
              </div>
            </div>
          </section>

          {/* Alert card */}
          <section className="space-y-3">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-3 flex items-start space-x-2 text-[11px] text-red-700">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs mb-0.5">
                  Passenger no-show?
                </p>
                <p>
                  Only mark this trip as a no-show if you&apos;ve waited at the
                  correct pickup point, checked the pin, and tried to contact
                  the rider.
                </p>
              </div>
            </div>

            {/* Waiting + attempts */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Waiting time: 06:12
                </span>
                <span className="inline-flex items-center">
                  <Map className="h-3.5 w-3.5 mr-1" />
                  Pin confirmed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center">
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                  Messages sent: 1
                </span>
                <span className="inline-flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Calls made: 1
                </span>
              </div>
            </div>

            {/* Where will this appear? */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-3 flex items-start space-x-2 text-[11px] text-slate-600">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e6fff7]">
                <CheckCircle2 className="h-4 w-4 text-[#03cd8c]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-xs text-slate-900 mb-0.5">
                  What happens next
                </p>
                <p>
                  The trip will be cancelled as a passenger no-show. Depending
                  on local policy, you may receive a partial no-show fee.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-1">
              <button type="button" onClick={() => navigate("/driver/trip/demo-trip/waiting")} className="flex-1 rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-700 bg-white flex items-center justify-center">
                Keep waiting
              </button>
              <button className="flex-1 rounded-full py-2.5 text-sm font-semibold bg-red-600 text-slate-50 hover:bg-red-700 flex items-center justify-center">
                <XCircle className="h-4 w-4 mr-1" />
                Confirm no-show
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center max-w-[260px] mx-auto">
              Use this only when you&apos;re sure the passenger won&apos;t arrive.
              Misusing no-show may affect your account health.
            </p>
          </section>
        </main>

        {/* Bottom navigation – Home active (no-show context) */}
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
