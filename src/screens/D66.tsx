import {
ChevronLeft,
Copy,
Link2,
Mail,
MessageCircle,
QrCode,
Share2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D66 Driver – Share My Ride Screen (v1)
// Screen showing the generated shareable link + options (copy, messaging, QR).
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

export default function ShareMyRideScreen() {
  const [copied, setCopied] = useState(false);
  const shareUrl = "https://evzone.app/follow/ABC123";
  const navigate = useNavigate();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
<div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-slate-400 text-center">
                  Driver · Safety
                </span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                  Share my ride
                </p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/20 backdrop-blur-md">
              <Link2 className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] uppercase font-black text-orange-500">
                Tracking Link
              </span>
              <p className="text-sm font-bold text-white">
                Share this link for this trip only.
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Anyone with this link can see your location and trip status until
            the ride ends, then the link stops working.
          </p>
        </section>

        {/* URL + copy */}
        <section className="space-y-3">
          <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm p-4 flex items-center justify-between">
            <div className="flex flex-col items-start max-w-[180px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1">
                Shareable URL
              </span>
              <span className="truncate text-[11px] font-bold text-slate-900">
                {shareUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm ${copied ? "bg-orange-500 text-white" : "bg-slate-900 text-white"}`}
            >
              <Copy className="h-3.5 w-3.5 mr-2" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </section>

        {/* Share options */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">
            Share via
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-95 transition-all shadow-sm hover:border-orange-500/30"
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
                <MessageCircle className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">SMS / Chat</span>
            </button>

            <button
              type="button"
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-95 transition-all shadow-sm hover:border-orange-500/30"
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
                <Mail className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">Email</span>
            </button>

            <button
              type="button"
              className="group flex flex-col items-center justify-center rounded-[2rem] border-2 border-orange-500/10 bg-cream p-5 active:scale-95 transition-all shadow-sm hover:border-orange-500/30"
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-orange-50 flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
                <QrCode className="h-5 w-5 text-orange-500 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900">QR Code</span>
            </button>
          </div>

          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">
                Privacy Note
              </p>
            </div>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
              The link only shows this trip and stops working when the ride
              ends. Your contacts cannot see your other trips or account
              details.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
