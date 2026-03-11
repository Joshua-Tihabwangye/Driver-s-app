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
import { useNavigate , useLocation } from "react-router-dom";

// EVzone Driver App – D07 Driver Personal – Document Verification
// Green curved header design. ALL original functionality preserved:
// document upload via hidden file inputs, status tracking, file selection.

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
  const navigate = useNavigate();
  
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
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">Personal Verification</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Intro banner */}
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 space-y-3 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#03cd8c]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-50 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#03cd8c] font-black">
              Verify Account
            </p>
          </div>
          <p className="text-sm font-black text-slate-900 tracking-tight leading-snug">
            Upload clear photos of your documents to start driving.
          </p>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Ensure your name, photo and expiry dates are visible. Blurry or
            cropped images can cause delays in your activation.
          </p>
        </section>

        {/* Document list */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Required Documents
            </h2>
          </div>
          <div className="space-y-3">
            <DocItem
              icon={IdCard}
              title="National ID"
              subtitle="Front and back, all corners"
              status={docs.id.status}
              emphasise={docs.id.emphasise}
              fileName={docs.id.fileName}
              onClick={() => triggerFilePick("id")}
            />
            <DocItem
              icon={FileBadge2}
              title="Driver's License"
              subtitle="Valid and not expired"
              status={docs.license.status}
              emphasise={docs.license.emphasise}
              fileName={docs.license.fileName}
              onClick={() => triggerFilePick("license")}
            />
            <DocItem
              icon={ClipboardCheck}
              title="Conduct Clearance"
              subtitle="Issued within 6 months"
              status={docs.police.status}
              emphasise={docs.police.emphasise}
              fileName={docs.police.fileName}
              onClick={() => triggerFilePick("police")}
            />
          </div>
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
        <section className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
          <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 text-[11px] text-blue-900/70 space-y-1.5">
            <p className="font-black text-xs text-blue-900 uppercase tracking-tight">
              Speed Up Approval
            </p>
            <div className="font-medium space-y-1">
              <p>• Use natural light, avoid strong glare.</p>
              <p>• Place the document on a dark flat surface.</p>
              <p>• Ensure all 4 corners are clearly visible.</p>
            </div>
          </div>
        </section>

        {/* Continue button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() =>
              navigate("/driver/onboarding/profile/documents/review")
            }
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Submit for Review
          </button>
        </section>
      </main>
    </div>
  );
}
