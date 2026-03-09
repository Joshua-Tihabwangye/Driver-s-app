import React, { useState } from "react";
import {
  ChevronLeft,
  AlertTriangle,
  XCircle,
  IdCard,
  FileBadge2,
  Upload,
  Info,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D09 Driver Personal – Document Rejected
// Green curved header design. ALL original functionality preserved:
// re-upload via hidden file inputs, document status tracking, routing.

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

function RejectedDocRow({ icon: Icon, title, reason, onClick, status = "Rejected", fileName }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5 flex items-start space-x-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon className="h-4 w-4 text-red-500" />
      </div>
      <div className="flex-1 flex flex-col items-start space-y-1">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-semibold text-red-700">{title}</span>
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 border border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            {status}
          </span>
        </div>
        <span className="text-[11px] text-red-700">{reason}</span>
        <button
          type="button"
          onClick={onClick}
          className="mt-1 inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-600"
        >
          <Upload className="mr-1 h-3 w-3" />
          Re-upload document
        </button>
        {fileName && (
          <span className="text-[10px] text-slate-500">Selected: {fileName}</span>
        )}
      </div>
    </div>
  );
}

export default function DocumentRejectedScreen() {
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
  const [docs, setDocs] = useState({
    license: { status: "Rejected", fileName: "" },
    id: { status: "Rejected", fileName: "" }
});

  const handleFileSelected = (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocs((prev) => ({
      ...prev,
      [key]: { status: "Uploaded", fileName: file.name }
}));
  };

  const triggerFilePick = (key) => {
    const input = document.getElementById(`reupload-${key}`);
    if (input) input.click();
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
          {/* Rejection summary */}
          <section className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                Rejected
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              The image does not display the document.
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Your photo does not include the requested document.
              Please capture a new photo of your EVZone Vehicle
              Inspection Report.
            </p>
          </section>

          {/* Rejected docs */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              What needs to be fixed
            </h2>
            <RejectedDocRow
              icon={FileBadge2}
              title="Driver's license"
              reason="The image is blurry and the expiry date is not readable. Please retake the photo in good light and upload again."
              status={docs.license.status}
              fileName={docs.license.fileName}
              onClick={() => triggerFilePick("license")}
            />
            <RejectedDocRow
              icon={IdCard}
              title="National ID"
              reason="The back side is missing. Please upload both front and back of your ID."
              status={docs.id.status}
              fileName={docs.id.fileName}
              onClick={() => triggerFilePick("id")}
            />
          </section>

          {/* Hidden file pickers */}
          <div className="hidden">
            <input
              id="reupload-license"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelected("license", e)}
            />
            <input
              id="reupload-id"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelected("id", e)}
            />
          </div>

          {/* Help text */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-xs text-slate-900">
              Need help?
            </p>
            <p>
              • Make sure the entire document is inside the frame.
              <br />• Avoid reflections on plastic cards.
              <br />• If you're not sure what to do, contact support from the Help & Support section in Preferences.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-1 pb-4">
            <button
              type="button"
              onClick={() =>
                navigate("/driver/onboarding/profile/documents/review")
              }
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#f77f00] text-white hover:bg-[#e06f00]"
            >
              Upload Again
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
