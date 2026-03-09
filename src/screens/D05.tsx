import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Star,
  ShieldCheck,
  FileBadge2,
  IdCard,
  ClipboardCheck,
  Car,
  AlertCircle,
  Camera,
  Link2,
  FileText,
  CreditCard,
  Settings as SettingsIcon,
  MapPin,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D05 Driver Personnel
// New design with green curved header. Original functionality fully preserved:
// document rows with status chips, training progress ring, Go Online button,
// all navigation/routing intact.

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

function StatusChip({ label, tone = "pending" }) {
  const tones = {
    missing: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" }
}[tone];

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tones.bg} ${tones.text}`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${tones.dot}`} />
      {label}
    </span>
  );
}

function DocRow({ icon: Icon, title, description, statusTone, statusLabel, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color || "#03cd8c"}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: color || "#03cd8c" }} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{description}</span>
        </div>
      </div>
      <StatusChip label={statusLabel} tone={statusTone} />
    </button>
  );
}

function SectionLink({ label, color, onClick }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-semibold transition-colors" style={{ color }}>
      {label}
    </button>
  );
}

export default function DriverPersonalScreen() {
  const [canGoOnline] = useState(false);
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
            <h1 className="text-base font-semibold text-white">Driver Personnel</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">

          {/* Top profile card */}
          <section className="rounded-2xl bg-[#f0faf7] border border-[#d6ebe6] px-3 py-3 flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white border-2 border-[#03cd8c]">
                <User className="h-6 w-6 text-[#03cd8c]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 inline-flex items-center rounded-full bg-white px-1 py-[1px] text-[9px] font-semibold text-[#03cd8c] shadow">
                EV
              </span>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">John Doe</span>
                <div className="flex items-center text-[11px] text-slate-600">
                  <Star className="mr-1 h-3.5 w-3.5 text-amber-400" />
                  <span>4.92</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500">EV Driver · Kampala · Since 2025</span>
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex items-center space-x-1 rounded-full bg-emerald-50 px-2 py-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span className="text-[10px] font-medium text-emerald-700">Identity Verified</span>
                </div>
                <div className="flex items-center space-x-1 rounded-full bg-slate-900 px-2 py-0.5">
                  <Car className="h-3 w-3 text-emerald-400" />
                  <span className="text-[10px] font-medium text-slate-50">EV Only</span>
                </div>
              </div>
            </div>
          </section>

          {/* Take Selfie section */}
          <section className="text-center space-y-2">
            <p className="text-[11px] text-slate-500">
              Take a selfie with your front camera to verify that it's you
            </p>
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Camera className="h-6 w-6 text-slate-400" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-900">Take Selfie</p>
            <StatusChip label="Approved" tone="approved" />
          </section>

          {/* Variables section */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 text-center space-y-2">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-[#f77f0015] flex items-center justify-center">
                <Link2 className="h-6 w-6 text-[#f77f00]" />
              </div>
            </div>
            <h4 className="text-xs font-semibold text-slate-900">Variables</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              If you have some Personal website, please add the link to personal social media
            </p>
            <p className="text-[11px] text-slate-400">vehicles.evzone@driver.com</p>
          </section>

          {/* Go to verification link */}
          <div className="text-center">
            <SectionLink label="Go to Verification Page" color="#03cd8c" onClick={() => navigate("/driver/preferences/identity")} />
          </div>

          {/* Status alert */}
          <section className="rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2.5 flex items-start space-x-2">
            <div className="mt-0.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex-1 text-[11px] text-amber-800">
              <p className="font-semibold text-xs mb-0.5">Complete your setup before going online</p>
              <p>Upload all required documents and finish the training quiz to unlock the Go Online button.</p>
            </div>
          </section>

          {/* KYC Verification */}
          <section className="rounded-2xl border border-slate-100 bg-[#f0faf7] p-4 space-y-2">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Complete your KYC verification to unlock income to your bank account and access more features.
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/driver/preferences/identity")}
                className="rounded-full bg-[#03cd8c] px-6 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#02b77c] transition-colors"
              >
                Update Your KYC
              </button>
            </div>
          </section>

          {/* Documents & checks */}
          <section className="space-y-2">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-xl bg-[#2196F315] flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#2196F3]" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 text-center">Personal Documents</h3>
            <p className="text-[11px] text-slate-500 text-center leading-relaxed mb-2">
              If you have any documents like national IDs, passport, driving permit, upload them here
            </p>

            <DocRow
              icon={IdCard}
              title="Driving Permit"
              description="Must be valid and not expired."
              statusTone="pending"
              statusLabel="Under review"
              color="#f77f00"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={CreditCard}
              title="National ID"
              description="Used to verify your identity."
              statusTone="approved"
              statusLabel="Approved"
              color="#03cd8c"
              onClick={() => navigate("/driver/preferences/identity")}
            />
            <DocRow
              icon={FileBadge2}
              title="Annual Certificate of GoodConduct"
              description="Required by local regulations."
              statusTone="pending"
              statusLabel="Pending"
              color="#f77f00"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={ClipboardCheck}
              title="ID Card"
              description="Uploaded"
              statusTone="approved"
              statusLabel="Approved"
              color="#2196F3"
              onClick={() => navigate("/driver/preferences/identity")}
            />
          </section>

          {/* Upload Signed Documents */}
          <div className="text-center">
            <SectionLink label="Upload Signed Documents" color="#f77f00" onClick={() => navigate("/driver/onboarding/profile/documents/upload")} />
          </div>

          {/* Training progress */}
          <section className="rounded-2xl border border-slate-100 bg-[#f0faf7] px-3 py-3 flex items-center justify-between">
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-slate-900 mb-0.5">Training progress</span>
              <span className="text-[11px] text-slate-500 mb-1">2 of 4 modules completed</span>
              <button
                type="button"
                onClick={() => navigate("/driver/training/intro")}
                className="inline-flex items-center rounded-full bg-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[#02b77c]"
              >
                Continue training
              </button>
            </div>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#03cd8c]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="50, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-slate-900">50%</span>
              </div>
            </div>
          </section>

          {/* Preferences link */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-[#03cd8c15] flex items-center justify-center">
                <SettingsIcon className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">Preferences</h4>
                <p className="text-[11px] text-slate-500">Configure your driving preferences and settings</p>
              </div>
            </div>
            <div className="text-center">
              <SectionLink label="Go to Preferences Page" color="#03cd8c" onClick={() => navigate("/driver/preferences")} />
            </div>
          </section>

          {/* Info Breakdowns link */}
          <section className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-[#2196F315] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#2196F3]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">Info Breakdowns</h4>
                <p className="text-[11px] text-slate-500">Any info necessary to get the account's setup process</p>
              </div>
            </div>
            <div className="text-center">
              <SectionLink label="Go to Info Breakdowns Page" color="#03cd8c" onClick={() => navigate("/driver/onboarding/profile")} />
            </div>
          </section>

          {/* Go Online button */}
          <section className="pt-1 pb-4">
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              disabled={!canGoOnline}
              className={`w-full rounded-full py-3 text-sm font-semibold shadow-sm transition-colors ${canGoOnline
                  ? "bg-[#03cd8c] text-white hover:bg-[#02b77c]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              Go Online
            </button>
            <p className="mt-1 text-center text-[10px] text-slate-500">
              You'll be able to go online once all required documents are approved and training is complete.
            </p>
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
