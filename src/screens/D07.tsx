import React, { useState } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  IdCard,
  FileBadge2,
  ClipboardCheck,
  Upload,
  Info,
  Home,
  MessageSquare,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D07 Driver Personal – Document Verification
// Green curved header design. ALL original functionality preserved:
// document upload via hidden file inputs, status tracking, file selection.

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

function DocItem({
  icon: Icon,
  title,
  subtitle,
  status,
  emphasise,
  onClick,
  fileName
}) {
  const tone =
    status === "Missing"
      ? "bg-red-50 text-red-600 border-red-100"
      : status === "Uploaded"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border bg-white px-3 py-2.5 shadow-sm active:scale-[0.97] transition-transform ${emphasise ? "border-[#03cd8c]" : "border-slate-100"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Icon className="h-4 w-4 text-slate-700" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
          {emphasise && (
            <span className="mt-1 inline-flex items-center text-[10px] text-slate-500">
              <Info className="mr-1 h-3 w-3 text-[#f77f00]" />
              Make sure all text is clear and not cut off.
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
          {status}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </span>
        {fileName && (
          <span className="text-[10px] text-slate-400">Selected: {fileName}</span>
        )}
      </div>
    </button>
  );
}

export default function DocumentVerificationScreen() {
  const [nav] = useState("manager");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    messages: "/driver/ridesharing/notification",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};
  const [docs, setDocs] = useState({
    id: { status: "Uploaded", emphasise: false, fileName: "national-id.pdf" },
    license: { status: "Missing", emphasise: true, fileName: "" },
    police: { status: "Missing", emphasise: false, fileName: "" }
});

  const handleFileSelected = (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocs((prev) => ({
      ...prev,
      [key]: { ...prev[key], status: "Uploaded", emphasise: false, fileName: file.name }
}));
  };

  const triggerFilePick = (key) => {
    const input = document.getElementById(`doc-upload-${key}`);
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
          {/* Intro banner */}
          <section className="rounded-2xl bg-[#f0faf7] border border-[#d6ebe6] p-4 space-y-2">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#03cd8c] font-semibold">
              Verify your account
            </p>
            <p className="text-xs font-semibold text-slate-900">
              Upload clear photos of your documents to start driving.
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Make sure your name, photo and expiry dates are visible. Blurry or
              cropped images can cause delays.
            </p>
          </section>

          {/* Document list */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Required documents
            </h2>
            <DocItem
              icon={IdCard}
              title="National ID"
              subtitle="Front and back, all corners visible."
              status={docs.id.status}
              emphasise={docs.id.emphasise}
              fileName={docs.id.fileName}
              onClick={() => triggerFilePick("id")}
            />
            <DocItem
              icon={FileBadge2}
              title="Driver's license"
              subtitle="Valid and not expired."
              status={docs.license.status}
              emphasise={docs.license.emphasise}
              fileName={docs.license.fileName}
              onClick={() => triggerFilePick("license")}
            />
            <DocItem
              icon={ClipboardCheck}
              title="Police clearance"
              subtitle="Issued within the last 6–12 months."
              status={docs.police.status}
              emphasise={docs.police.emphasise}
              fileName={docs.police.fileName}
              onClick={() => triggerFilePick("police")}
            />
          </section>

          {/* Hidden file pickers */}
          <div className="hidden">
            <input
              id="doc-upload-id"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelected("id", e)}
            />
            <input
              id="doc-upload-license"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelected("license", e)}
            />
            <input
              id="doc-upload-police"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileSelected("police", e)}
            />
          </div>

          {/* Helper text */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 flex items-start space-x-2">
            <div className="mt-0.5">
              <Info className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex-1 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-xs text-slate-900">
                Tips for faster approval
              </p>
              <p>
                • Use natural light and avoid strong shadows.
                <br />• Place the document on a flat surface.
                <br />• Check that all edges are inside the frame.
              </p>
            </div>
          </section>

          {/* Continue button */}
          <section className="pt-1 pb-4">
            <button
              type="button"
              onClick={() =>
                navigate("/driver/onboarding/profile/documents/review")
              }
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-white hover:bg-[#02b77c]"
            >
              Submit documents for review
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
