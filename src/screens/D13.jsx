import React, { useState } from "react";
import {
  Bell,
  Camera,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Info,
  SunMedium,
  Eye,
  ChevronLeft,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D13 Upload Your Image
// Redesigned UI (green curved header, circular preview, green checkmark badge)
// with FULL original functionality restored:
// - TipRow component (well-lit, easy to recognize, recent)
// - handleUpload toggle with hasImage state
// - Dual action buttons (Upload from gallery / Take a photo) with conditional text
// - "Done, back to Driver Personal" button

function BottomNavItem({ icon: Icon, label, active, onClick }) {
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
  const [hasImage, setHasImage] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    // In the real app, open file picker or camera.
    setHasImage(true);
  };

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
              borderRadius: "0 0 32px 32px",
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
            <h1 className="text-base font-semibold text-white">Preferences</h1>
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <Bell className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-3.5 w-3.5 rounded-full bg-[#f77f00] border-2 border-white" />
            </button>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 flex flex-col overflow-y-auto scrollbar-hide space-y-4">

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
              changes. Once you're happy, continue to Driver Personal.
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-xl bg-[#1c2b4d] py-4 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              Done, back to Driver Personal
            </button>
          </section>
        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
