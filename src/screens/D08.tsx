import React, { useState } from "react";
import {
  ChevronLeft,
  Hourglass,
  IdCard,
  FileBadge2,
  ClipboardCheck,
  Clock3,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D08 Driver Personal – Document Under Review
// Green curved header design. ALL original functionality preserved:
// document status display, navigation buttons, routing.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function DocReviewRow({ icon: Icon, title, status, eta }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{status}</span>
        </div>
      </div>
      <div className="flex items-center space-x-1 text-[10px] text-slate-500">
        <Clock3 className="h-3 w-3" />
        <span>{eta}</span>
      </div>
    </div>
  );
}

export default function DocumentUnderReviewScreen() {
  const [nav] = useState("manager");
  const navigate = useNavigate();
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
          {/* Status card */}
          <section className="rounded-2xl bg-[#f0faf7] border border-[#d6ebe6] p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                <Hourglass className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex flex-col">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 w-fit">
                  In Review
                </span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5">
                  We're currently reviewing your document.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              The process typically takes less than a day to complete.
            </p>
          </section>

          {/* Document statuses */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Document status
            </h2>
            <DocReviewRow
              icon={IdCard}
              title="National ID"
              status="Submitted · Awaiting review"
              eta="Typically < 2 hrs"
            />
            <DocReviewRow
              icon={FileBadge2}
              title="Driver's license"
              status="Submitted · Awaiting review"
              eta="Typically < 4 hrs"
            />
            <DocReviewRow
              icon={ClipboardCheck}
              title="Police clearance"
              status="Submitted · Awaiting review"
              eta="Typically < 24 hrs"
            />
          </section>

          {/* Info block */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-xs text-slate-900">
              While you wait
            </p>
            <p>
              • You can continue exploring the app, but you won't be able to go online yet.
              <br />• If we need clearer photos, we'll send you a message and you'll be able to re-upload.
            </p>
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              type="button"
              onClick={() =>
                navigate("/driver/onboarding/profile/documents/rejected")
              }
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-slate-200 text-slate-600 hover:bg-slate-300"
            >
              I need to fix a document
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white"
            >
              Back to Driver Personal
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate(bottomNavRoutes.home)} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate(bottomNavRoutes.messages)} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate(bottomNavRoutes.wallet)} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate(bottomNavRoutes.settings)} />
        </nav>
      </div>
    </div>
  );
}
