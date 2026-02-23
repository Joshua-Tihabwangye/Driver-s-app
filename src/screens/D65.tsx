import React, { useState } from "react";
import {
    MapPin,
  Users,
  Phone,
  Mail,
  Share2,
  CheckCircle2,
  Home,
  Briefcase,
  Wallet,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D65 Driver – Follow My Ride Screen (v1)
// Screen for selecting contacts who can follow the driver’s live trip.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-[#03cd8c]" : "text-slate-500 hover:text-slate-700"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function ContactRow({ name, detail, channel, selected, onToggle }) {
  const Icon = channel === "sms" ? Phone : Mail;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-[11px] shadow-sm active:scale-[0.98] transition-transform w-full ${selected
          ? "border-[#03cd8c] bg-[#e6fff7] text-slate-900"
          : "border-slate-100 bg-white text-slate-700"
        }`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Icon className="h-4 w-4 text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start truncate overflow-hidden">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">
            {name}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
            {detail}
          </span>
        </div>
      </div>
      {selected && (
        <CheckCircle2 className="h-4 w-4 text-[#03cd8c] flex-shrink-0" />
      )}
    </button>
  );
}

export default function FollowMyRideScreen() {
  const [nav] = useState("home");
  const [selectedIds, setSelectedIds] = useState(["c1"]);
  const navigate = useNavigate();

  const bottomNavRoutes = {
    home: "/driver/dashboard/online",
    manager: "/driver/jobs/list",
    wallet: "/driver/earnings/overview",
    settings: "/driver/preferences"
};

  const contacts = [
    { id: "c1", name: "Sarah (sister)", detail: "+256 700 000 111", channel: "sms" },
    { id: "c2", name: "Michael (friend)", detail: "michael@example.com", channel: "email" },
    { id: "c3", name: "Home contact", detail: "+256 700 000 222", channel: "sms" },
  ];

  const toggleContact = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      {/* Local style: hide scrollbars but keep swipe scrolling */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Phone frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center space-x-2 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
              <Users className="h-4 w-4 text-[#03cd8c]" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Driver · Safety
              </span>
              <h1 className="text-base font-semibold text-slate-900">
                Follow my ride
              </h1>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-3 pb-4 overflow-y-auto scrollbar-hide space-y-4">
          {/* Intro card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-4 space-y-3">
            <div className="flex items-center space-x-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#03cd8c] text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase text-[#a5f3fc]">
                  Live trip sharing
                </span>
                <p className="text-sm font-semibold">
                  Let trusted contacts follow this ride.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-100 leading-snug text-left">
              We&apos;ll send a secure link for this trip only. They can see your
              location and trip status until the ride ends.
            </p>
          </section>

          {/* Contacts list */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-1 text-left">
              Choose who can follow
            </h2>
            <div className="space-y-2">
              {contacts.map((c) => (
                <ContactRow
                  key={c.id}
                  name={c.name}
                  detail={c.detail}
                  channel={c.channel}
                  selected={selectedIds.includes(c.id)}
                  onToggle={() => toggleContact(c.id)}
                />
              ))}
            </div>
          </section>

          {/* Info */}
          <section className="space-y-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-[11px] text-slate-600 text-left">
              <p className="font-semibold text-xs text-slate-900 mb-0.5">
                How it works
              </p>
              <p>
                Your contacts receive a link via SMS or email. They cannot
                control your trip – they can only see status and location.
              </p>
            </div>
          </section>
        </main>

        {/* Actions */}
        <footer className="px-4 pb-4 pt-1 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => navigate("/driver/safety/share-my-ride")}
            className={`w-full rounded-full py-2.5 text-sm font-semibold flex items-center justify-center shadow-sm transition-all ${hasSelection
                ? "bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] active:scale-[0.98] transition-transform"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            <Share2 className="h-4 w-4 mr-1" />
            {hasSelection ? "Send follow-ride link" : "Select at least one contact"}
          </button>
        </footer>

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
