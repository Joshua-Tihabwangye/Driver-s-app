import {
Camera,
CheckCircle2,
ChevronLeft,
Eye,
Image as ImageIcon,
Info,
SunMedium,
UploadCloud
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D13 Upload Your Image
// Redesigned UI (green curved header, circular preview, green checkmark badge)
// with FULL original functionality restored:
// - TipRow component (well-lit, easy to recognize, recent)
// - handleUpload toggle with hasImage state
// - Dual action buttons (Upload from gallery / Take a photo) with conditional text
// - "Done, back to Driver Personal" button


function TipRow({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start space-x-2 rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5">
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
    <div className="flex flex-col min-h-full ">

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Identity</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">

        {/* Image preview */}
        <section className="flex flex-col items-center py-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-slate-900 border-[6px] border-[#03cd8c]/20 shadow-2xl transition-transform active:scale-95 cursor-pointer overflow-hidden" onClick={handleUpload}>
            {hasImage ? (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <ImageIcon className="h-20 w-20 text-[#03cd8c]" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Camera className="h-12 w-12 text-slate-500" />
              </div>
            )}

            {hasImage && (
              <div className="absolute bottom-4 inset-x-6 flex items-center justify-center rounded-2xl bg-slate-900/90 backdrop-blur-md px-3 py-2 border border-white/10 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                <span className="flex items-center text-[10px] font-black text-emerald-400 uppercase tracking-tight">
                  <CheckCircle2 className="mr-2 h-3 w-3" /> Ready to Use
                </span>
              </div>
            )}
            
            {/* Visual overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <p className="mt-6 text-[11px] font-medium text-slate-400 text-center max-w-[240px] leading-relaxed">
            Your profile photo helps riders and partners identify you quickly and ensures a safe, personable experience.
          </p>
        </section>

        {/* Tips */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Photo Requirements
             </h2>
          </div>
          <div className="space-y-3">
            <TipRow
              icon={SunMedium}
              title="Perfect Lighting"
              text="Natural light ensures you're easily recognizable."
            />
            <TipRow
              icon={Eye}
              title="Clear View"
              text="Remove masks, sunglasses, and keep face centered."
            />
            <TipRow
              icon={Info}
              title="Recent Profile"
              text="Please use a photo taken within the last 6 months."
            />
          </div>
        </section>

        {/* Actions */}
        <section className="pt-4 pb-12 flex flex-col gap-3">
          <button
            onClick={handleUpload}
            className="w-full rounded-2xl py-4 text-xs font-black bg-[#03cd8c] text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all flex items-center justify-center uppercase tracking-widest"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            {hasImage ? "Change Photo" : "Upload Gallery"}
          </button>
          <button
            onClick={handleUpload}
            className="w-full rounded-2xl py-4 text-xs font-black text-slate-400 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center uppercase tracking-widest"
          >
            <Camera className="h-4 w-4 mr-2" />
            {hasImage ? "Retake Photo" : "Take Photo"}
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/driver/onboarding/profile")}
              className="w-full rounded-2xl bg-[#1c2b4d] py-4 text-sm font-black text-white shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              Confirm & Continue
            </button>
          </div>
          
          <p className="px-6 mt-2 text-[10px] font-medium text-slate-400 text-center leading-relaxed">
            By continuing, you agree that this photo represents you and meets our community guidelines.
          </p>
        </section>
      </main>
    </div>
  );
}
