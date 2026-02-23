import React, { useState } from "react";
import {
  ChevronLeft,
  Camera,
  Pencil,
  ChevronDown,
  User,
  Plus,
  Home,
  MessageSquare,
  Wallet,
  Settings,
  MapPin,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D03 Registration (profile page)
// New design: green curved header, profile photo, info rows, accordions, green bottom nav.
// Original functionality preserved: form inputs, validation, accordion expand/collapse, routing.

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

function AccordionCard({ icon: Icon, title, description, cta, iconColor, borderColor, path, onNavigate }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: borderColor || "#e2e8f0" }}
    >
      <button
        className="flex w-full items-center justify-between px-4 py-3"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: `${iconColor}15` }}
          >
            <Icon className="h-4 w-4" style={{ color: iconColor }} />
          </div>
          <span className="text-xs font-semibold text-slate-900">{title}</span>
        </div>
        <Plus
          className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-45" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-50 space-y-2">
          <p className="pt-2">{description}</p>
          <p className="text-[11px] text-slate-600">{cta}</p>
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
            <h1 className="text-base font-semibold text-white">Registration</h1>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-5 pt-4 pb-4 space-y-4 overflow-y-auto scrollbar-hide">
          {/* Profile photo + name */}
          <section className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="h-20 w-20 rounded-full bg-slate-100 border-[3px] border-[#03cd8c] flex items-center justify-center overflow-hidden">
                <User className="h-10 w-10 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => navigate("/driver/preferences/identity/upload-image")}
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#03cd8c] border-2 border-white shadow-sm"
              >
                <Pencil className="h-3 w-3 text-white" />
              </button>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {fullName || "John Doe"} ✏️
            </h2>
          </section>

          {/* Info display rows (read-only summary) */}
          <section>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-xs text-slate-500">Country</span>
              <span className="text-xs font-medium text-slate-900">{country || "Uganda"}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-xs text-slate-500">Date of Birth</span>
              <span className="text-xs font-medium text-slate-900">{dob || "19.05.1989"}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <span className="text-xs text-slate-500">Email</span>
              <span className="text-xs font-medium text-slate-900">{email || "johndoe45@gmail.com"}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-xs text-slate-500">Mobile</span>
              <span className="text-xs font-medium text-slate-900">{phone || "+258 8868564885"}</span>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-[#03cd8c]/20" />

          {/* Personal Info heading + form fields */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-[#03cd8c] mb-1">Personal Info</h3>
              <p className="text-[11px] text-slate-500">
                Let's get started by setting up your profile
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
              <span className="text-[11px] font-medium text-slate-600">Date of Birth</span>
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
          <section className="space-y-3">
            <AccordionCard
              icon={Shield}
              title="General ID"
              description="Adding your identification Documents helps us ensure the security of our platform and verify your identity."
              cta="Upload or update an official ID document so we can verify your identity and protect your account."
              iconColor="#03cd8c"
              borderColor="#d6ebe6"
              path="/driver/preferences/identity"
              onNavigate={handleAccordionNavigate}
            />
            <AccordionCard
              icon={MapPin}
              title="Addresses"
              description="Your address is important for personalizing your experience and ensuring that you receive relevant information and opportunities tailored to your location."
              cta="Add at least one valid address so we can personalize your experience and show you the right cities and services."
              iconColor="#f77f00"
              borderColor="#ffe0b2"
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
              className={`w-full rounded-full py-3 text-sm font-semibold shadow-sm transition-colors ${isValid
                  ? "bg-[#03cd8c] text-white hover:bg-[#02b77c]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
              Next
            </button>
          </section>
        </main>

        {/* Bottom navigation – green */}
        <nav className="app-bottom-nav border-t border-white/20 flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={MessageSquare} label="Messages" onClick={() => navigate("/driver/ridesharing/notification")} />
          <BottomNavItem icon={Wallet} label="Wallet" onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
