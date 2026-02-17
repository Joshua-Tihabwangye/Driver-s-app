import React, { useState } from "react";
import {
  Bell,
  Camera,
  Pencil,
  ChevronDown,
  Home,
  CalendarDays,
  ClipboardList,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D03 Registration (base profile, v3)
// 375x812 phone frame. Content scrolls by swipe inside <main>.
// Scrollbars are visually hidden using a local <style> and the `scrollbar-hide` utility.

function BottomNavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
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

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
      />
    </label>
  );
}

function Accordion({ title, description, cta, path, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-3 py-3"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">
            {title}
          </span>
          <span className="text-[11px] text-slate-500">{description}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-100 px-3 pb-3 pt-2 text-[11px] text-slate-600 space-y-2">
          <p>{cta}</p>
          <button
            type="button"
            onClick={() => onNavigate(path)}
            className="inline-flex items-center rounded-full border border-[#03cd8c] px-3 py-1 text-[11px] font-semibold text-[#03cd8c]"
          >
            Open
          </button>
        </div>
      )}
    </div>
  );
}

export default function RegistrationScreen() {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isValid =
    fullName.trim().length > 0 &&
    country.trim().length > 0 &&
    dob.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0;

  const navigate = useNavigate();

  const handleNext = () => {
    if (!isValid) return;
    navigate("/driver/register");
  };

  const handleAccordionNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#0f172a] py-4">
      {/* Local style to hide scrollbars for this canvas */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="w-[375px] h-[812px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-base font-semibold text-slate-900">Registration</h1>
          <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[#f77f00]" />
          </button>
        </header>

        {/* Content – swipe scroll, scrollbar hidden */}
        <main className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Profile block */}
          <section className="rounded-2xl bg-slate-50 px-3 py-3 flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e6fff7] border border-[#03cd8c]">
                <Camera className="h-5 w-5 text-[#03cd8c]" />
              </div>
              <button
                type="button"
                onClick={() => navigate("/driver/preferences/identity/upload-image")}
                className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#03cd8c] border border-white"
              >
                <Pencil className="h-3 w-3 text-white" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 truncate max-w-[180px]">
                  {fullName || "Your Name"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Upload a clear profile photo so riders and partners can
                recognize you.
              </span>
            </div>
          </section>

          {/* Personal info */}
          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Personal Information
              </h2>
              <p className="text-[11px] text-slate-500">
                Let’s get started by setting up your profile.
              </p>
            </div>

            <Input
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="e.g. John Doe"
            />

            <Input
              label="Country"
              value={country}
              onChange={setCountry}
              placeholder="e.g. Uganda"
            />

            <label className="flex flex-col space-y-1">
              <span className="text-[11px] font-medium text-slate-600">
                Date of Birth
              </span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-1 focus:ring-[#03cd8c]"
              />
            </label>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@example.com"
            />

            <Input
              label="Mobile Number"
              value={phone}
              onChange={setPhone}
              placeholder="e.g. +256 700 000000"
            />
          </section>

          {/* Expandable sections */}
          <section className="space-y-2 pt-2">
            <Accordion
              title="General ID"
              description="Upload your national ID or passport."
              cta="Upload or update an official ID document so we can verify your identity and protect your account."
              path="/driver/preferences/identity"
              onNavigate={handleAccordionNavigate}
            />
            <Accordion
              title="Addresses"
              description="Add your home or work address."
              cta="Add at least one valid address so we can personalize your experience and show you the right cities and services."
              path="/driver/onboarding/profile"
              onNavigate={handleAccordionNavigate}
            />
          </section>

          {/* Next button */}
          <section className="pt-2 pb-4">
            <button
              type="button"
              disabled={!isValid}
              onClick={handleNext}
              className={`w-full rounded-full py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                isValid
                  ? "bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </section>
        </main>

        {/* Bottom navigation – Bookings tab active */}
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
          <BottomNavItem icon={Home} label="Home" />
          <BottomNavItem icon={CalendarDays} label="Bookings" active />
          <BottomNavItem icon={ClipboardList} label="Tasks" />
          <BottomNavItem icon={Settings} label="Settings" />
        </nav>
      </div>
    </div>
  );
}
