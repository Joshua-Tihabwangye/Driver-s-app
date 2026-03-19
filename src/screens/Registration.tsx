import {
ChevronLeft,
MapPin,
Pencil,
Plus,
Shield,
User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – Registration Registration (profile page)
// New design: green curved header, profile photo, info rows, accordions, green bottom nav.
// Original functionality preserved: form inputs, validation, accordion expand/collapse, routing.


function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
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
            className="inline-flex items-center rounded-full border border-orange-500 px-3 py-1 text-[11px] font-semibold text-orange-500"
          >
            Open
          </button>
        </div>
      )}
    </div>
  );
}

export default function Registration() {
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
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Registration" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Profile photo + name */}
        <section className="flex flex-col items-center">
          <div className="relative mb-3 group">
            <div className="h-24 w-24 rounded-[2rem] bg-slate-100 border-[4px] border-orange-500 flex items-center justify-center overflow-hidden shadow-xl shadow-orange-100 group-hover:scale-105 transition-transform duration-300">
              <User className="h-12 w-12 text-slate-400" />
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border-2 border-white shadow-lg active:scale-90 transition-all"
            >
              <Pencil className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center">
            {fullName || "John Doe"} <span className="ml-1.5 opacity-40">✏️</span>
          </h2>
        </section>

        {/* Info display rows (read-only summary) */}
        <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Country</span>
            <span className="text-xs font-black text-slate-800 tracking-tight">{country || "Uganda"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Birth</span>
            <span className="text-xs font-black text-slate-800 tracking-tight">{dob || "19.05.1989"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Email</span>
            <span className="text-xs font-black text-slate-800 tracking-tight">{email || "johndoe45@gmail.com"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-widest">Mobile</span>
            <span className="text-xs font-black text-slate-800 tracking-tight">{phone || "+256 8868564885"}</span>
          </div>
        </section>

        {/* Divider */}
        <div className="h-1 w-12 bg-orange-500/20 mx-auto rounded-full" />

        {/* Personal Info heading + form fields */}
        <section className="space-y-4">
          <div className="px-1">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest">Personal Info</h3>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-0.5">
              Let's get started by setting up your profile
            </p>
          </div>

          <div className="space-y-3">
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
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1 ml-1">Date of Birth</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 rounded-2xl border border-slate-100 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#03cd8c] focus:outline-none focus:ring-4 focus:ring-[#03cd8c]/5 transition-all"
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
          </div>
        </section>

        {/* Expandable sections */}
        <section className="space-y-4">
          <div className="px-1">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Verification</h3>
          </div>
          <AccordionCard
            icon={Shield}
            title="General ID"
            description="Adding your identification Documents helps us ensure the security of our platform and verify your identity."
            cta="Upload or update an official ID document so we can verify your identity and protect your account."
            iconColor="#f97316"
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
        <section className="pt-2 pb-12">
          <button
            type="button"
            disabled={!isValid}
            onClick={handleNext}
            className={`w-full rounded-2xl py-4 text-sm font-black tracking-tight shadow-lg transition-all active:scale-[0.98] ${isValid
                ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
              }`}
          >
            CONTINUE
          </button>
        </section>
      </main>
    </div>
  );
}
