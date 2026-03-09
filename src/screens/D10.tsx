import React, { useState } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  IdCard,
  FileBadge2,
  ClipboardCheck,
  Car,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D10 Driver Personal – All Documents Verified
// Green curved header design. ALL original functionality preserved:
// approved doc list, Continue to training / View dashboard buttons, routing.

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

function ApprovedRow({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <Icon className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-emerald-800">{title}</span>
          <span className="text-[11px] text-emerald-700">{subtitle}</span>
        </div>
      </div>
      <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Approved
      </span>
    </div>
  );
}

export default function DocumentsVerifiedScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    messages: "/driver/ridesharing/notification",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
}}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Driver Personal</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-3 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Celebration card */}
          <section className="rounded-2xl bg-[#f0faf7] border border-[#d6ebe6] p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c]">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 w-fit">
                  Verified
                </span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  Your Document is verified
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Back_Page
            </p>
          </section>

          {/* Approved list */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Verified documents
            </h2>
            <ApprovedRow
              icon={IdCard}
              title="National ID"
              subtitle="Identity confirmed"
            />
            <ApprovedRow
              icon={FileBadge2}
              title="Driver's license"
              subtitle="Valid & in good standing"
            />
            <ApprovedRow
              icon={ClipboardCheck}
              title="Police clearance"
              subtitle="Background check passed"
            />
            <ApprovedRow
              icon={Car}
              title="Vehicle documents"
              subtitle="EV registration & insurance approved"
            />
          </section>

          {/* Next step */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 space-y-2">
            <p className="font-semibold text-xs text-slate-900">
              What happens next?
            </p>
            <p>
              • Complete your driver training modules in Preferences.
              <br />• Once training is done, you'll be able to tap Go Online and
              start receiving ride and delivery requests.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => navigate("/driver/training/intro")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-white hover:bg-[#02b77c]"
            >
              Continue to training
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/offline")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-[#03cd8c] text-[#03cd8c] bg-white hover:bg-[#f0faf7]"
            >
              Edit Document
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate(bottomNavRoutes.home)} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate(bottomNavRoutes.messages)} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate(bottomNavRoutes.wallet)} />
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate(bottomNavRoutes.settings)} />
        </nav>
      </div>
    </div>
  );
}
