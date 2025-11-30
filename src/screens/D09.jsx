import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  XCircle,
  IdCard,
  FileBadge2,
  Upload,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D09 Driver Personal – Document Rejected (v1)
// Shows rejection reason and prompts driver to re-upload corrected documents.

function BottomNavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
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
  const [nav] = useState("manager");
  const navigate = useNavigate();
  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences",
  };
  const [docs, setDocs] = useState({
    license: { status: "Rejected", fileName: "" },
    id: { status: "Rejected", fileName: "" },
  });

  const handleFileSelected = (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocs((prev) => ({
      ...prev,
      [key]: { status: "Uploaded", fileName: file.name },
    }));
  };

  const triggerFilePick = (key) => {
    const input = document.getElementById(`reupload-${key}`);
    if (input) input.click();
  };

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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver Personal
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Action needed
              </h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/driver/ridesharing/notification")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Rejection summary */}
          <section className="rounded-2xl border border-red-100 bg-red-50 p-4 space-y-2">
            <p className="text-[10px] tracking-[0.18em] uppercase text-red-600">
              Documents rejected
            </p>
            <p className="text-xs font-semibold text-red-700">
              Some of your documents could not be approved.
            </p>
            <p className="text-[11px] text-red-700 leading-snug">
              Please review the reasons below, correct the documents and submit
              new photos. You won’t be able to go online until these are fixed.
            </p>
          </section>

        {/* Rejected docs */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            What needs to be fixed
          </h2>
          <RejectedDocRow
            icon={FileBadge2}
            title="Driver’s license"
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
              <br />• If you’re not sure what to do, contact support from the Help & Support section in Preferences.
            </p>
          </section>

          {/* CTA */}
          <section className="pt-1 pb-4">
            <button
              type="button"
              onClick={() =>
                navigate("/driver/onboarding/profile/documents/review")
              }
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
            >
              I’ve re-uploaded my documents
            </button>
          </section>
        </main>

        {/* Bottom navigation */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem
            icon={Home}
            label="Home"
            active={nav === "home"}
            onClick={() => navigate(bottomNavRoutes.home)}
          />
          <BottomNavItem
            icon={Briefcase}
            label="Manager"
            active={nav === "manager"}
            onClick={() => navigate(bottomNavRoutes.manager)}
          />
          <BottomNavItem
            icon={Wallet}
            label="Wallet"
            active={nav === "wallet"}
            onClick={() => navigate(bottomNavRoutes.wallet)}
          />
          <BottomNavItem
            icon={Settings}
            label="Settings"
            active={nav === "settings"}
            onClick={() => navigate(bottomNavRoutes.settings)}
          />
        </nav>
      </div>
    </div>
  );
}
