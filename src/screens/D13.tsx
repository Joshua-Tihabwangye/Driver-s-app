import React, { useState } from "react";
import {
  Bell,
  Camera,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Info,
  Home,
  Briefcase,
  Wallet,
  Settings,
  SunMedium,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D13 Upload Your Image – Preferences (v1, fixed SunMedium & Eye imports)
// Face/profile image upload & confirmation inside Preferences.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active }) {
  return (
    <button
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function TipRow({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start space-x-2 rounded-2xl border border-slate-100 bg-white px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-50">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs font-semibold text-slate-900">{title}</span>
        <span className="text-[11px] text-slate-600">{text}</span>
      </div>
    </div>
  );
}

export default function UploadImagePreferencesScreen() {
  const [nav] = useState("settings");
  const [hasImage, setHasImage] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    // In the real app, open file picker or camera.
    setHasImage(true);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Camera className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Preferences · Identity
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Upload your image
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Image preview */}
          <section className="flex flex-col items-center pt-2 pb-1">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-slate-900/95 border-4 border-[#03cd8c] shadow-inner">
              {hasImage ? (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-800/80">
                  <ImageIcon className="h-16 w-16 text-[#03cd8c]" />
                </div>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-800/80">
                  <Camera className="h-10 w-10 text-slate-400" />
                </div>
              )}

              {hasImage && (
                <div className="absolute bottom-3 inset-x-8 flex items-center justify-center rounded-full bg-slate-900/80 px-3 py-1">
                  <span className="flex items-center text-[10px] font-medium text-emerald-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Looks clear and ready to use
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] text-slate-500 text-center max-w-[260px]">
              This photo will appear on your driver profile and on trips, so
              riders and partners can recognize you quickly and safely.
            </p>
          </section>

          {/* Tips */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Make sure your photo is:
            </h2>
            <TipRow
              icon={SunMedium}
              title="Well lit"
              text="Use natural light and avoid strong shadows or backlight."
            />
            <TipRow
              icon={Eye}
              title="Easy to recognize"
              text="Face the camera, no sunglasses or masks, and keep your face centered."
            />
            <TipRow
              icon={Info}
              title="Recent"
              text="Use a recent photo that looks like you do today."
            />
          </section>

          {/* Actions */}
          <section className="pt-1 pb-4 flex flex-col space-y-2">
            <button
              onClick={handleUpload}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] flex items-center justify-center"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              {hasImage ? "Upload a different photo" : "Upload from gallery"}
            </button>
            <button
              onClick={handleUpload}
              className="w-full rounded-full py-2.5 text-sm font-semibold border border-slate-200 text-slate-800 bg-white flex items-center justify-center"
            >
              <Camera className="h-4 w-4 mr-2" />
              {hasImage ? "Retake photo" : "Take a photo"}
            </button>
            <p className="text-[10px] text-slate-500 text-center">
              You can update this image later from Preferences if your appearance
              changes. Once you’re happy, continue to Driver Personal.
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-full py-2.5 text-sm font-semibold shadow-sm bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
            >
              Done, back to Driver Personal
            </button>
          </section>
        </main>

        {/* Bottom navigation – Settings active (Preferences context) */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" active={nav === "home"} />
          <BottomNavItem icon={Briefcase} label="Manager" active={nav === "manager"} />
          <BottomNavItem icon={Wallet} label="Wallet" active={nav === "wallet"} />
          <BottomNavItem icon={Settings} label="Settings" active={nav === "settings"} />
        </nav>
      </div>
    </div>
  );
}
