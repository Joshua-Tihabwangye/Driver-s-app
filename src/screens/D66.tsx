import React, { useState } from "react";
import {
  Bell,
  Share2,
  Link2,
  Copy,
  MessageCircle,
  Mail,
  QrCode,
  Home,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

// EVzone Driver App – D66 Driver – Share My Ride Screen (v1)
// Screen showing the generated shareable link + options (copy, messaging, QR).
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

export default function ShareMyRideScreen() {
  const [nav] = useState("home");
  const [copied, setCopied] = useState(false);

  const shareUrl = "https://evzone.app/follow/ABC123";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Share2 className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Share my ride
              </h1>
            </div>
          </div>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Link preview */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-slate-900">
                <Link2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Follow-ride link
                </span>
                <p className="text-sm font-semibold">
                  Share this link for this trip only.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug">
              Anyone with this link can see your location and trip status until
              the ride ends, then the link stops working.
            </p>
          </section>

          {/* URL + copy */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-white px-3 py-3 flex items-center justify-between text-[11px] text-slate-600">
              <div className="flex flex-col items-start max-w-[220px]">
                <span className="text-xs font-semibold text-slate-900 mb-0.5">
                  Link
                </span>
                <span className="truncate text-[11px] text-slate-600">
                  {shareUrl}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-medium text-slate-700 active:scale-[0.97]"
              >
                <Copy className="h-3 w-3 mr-1" />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </section>

          {/* Share options */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">
              Share via
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
              <button className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-2 py-3 active:scale-[0.97]">
                <MessageCircle className="h-4 w-4 mb-1" />
                <span className="text-[10px]">SMS / chat</span>
              </button>
              <button className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-2 py-3 active:scale-[0.97]">
                <Mail className="h-4 w-4 mb-1" />
                <span className="text-[10px]">Email</span>
              </button>
              <button className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white px-2 py-3 active:scale-[0.97]">
                <QrCode className="h-4 w-4 mb-1" />
                <span className="text-[10px]">QR code</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                Privacy note
              </p>
              <p>
                The link only shows this trip and stops working when the ride
                ends. Your contacts cannot see your other trips or account
                details.
              </p>
            </div>
          </section>
        </main>

        {/* Bottom navigation – Home active (safety context) */}
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
