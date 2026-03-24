import {
BatteryCharging,
Car,
ChevronLeft,
Church,
GraduationCap,
Handshake,
Store,
Wallet2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – RegisterServices Register Services
// Matches screenshot: green curved header, 3x2 service grid with colored icons,
// Business Partner card at bottom, green bottom nav.

const services = [
  { key: "school", label: "School", icon: GraduationCap, color: "#2196F3" },
  { key: "seller", label: "Seller", icon: Store, color: "#f77f00" },
  { key: "driver", label: "EVzone Driver", icon: Car, color: "#f77f00" },
  { key: "faith", label: "FaithHub", icon: Church, color: "#2196F3" },
  { key: "charging", label: "EVzone Charging", icon: BatteryCharging, color: "#f77f00" },
  { key: "wallet", label: "Wallet Agent", icon: Wallet2, color: "#2196F3" },
];

const DRIVER_SERVICE_KEY = "driver";

function GoogleLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M9 3.48c1.69 0 2.84.73 3.49 1.34l2.54-2.54C13.46.83 11.42 0 9 0 5.48 0 2.44 2.02.96 4.96l2.95 2.29C4.62 5.16 6.64 3.48 9 3.48z"
      />
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.8 2.71v2.25h2.92c1.71-1.57 2.68-3.89 2.68-6.6z"
      />
      <path
        fill="#FBBC05"
        d="M3.91 10.75a5.41 5.41 0 0 1 0-3.5V4.96H.96a9 9 0 0 0 0 8.08l2.95-2.29z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.42 0 4.46-.8 5.95-2.2l-2.92-2.25c-.81.54-1.84.86-3.03.86-2.36 0-4.38-1.59-5.09-3.73H.96v2.29A9 9 0 0 0 9 18z"
      />
    </svg>
  );
}

function AppleLogo({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.365 1.43c0 1.14-.42 2.24-1.1 3.04-.7.84-1.84 1.5-2.99 1.4-.15-1.12.4-2.3 1.09-3.09.76-.89 2.01-1.51 3-1.35zM20.54 17.02c-.52 1.18-.77 1.7-1.44 2.78-.94 1.51-2.26 3.4-3.9 3.42-1.45.02-1.82-.93-3.78-.92-1.96.01-2.36.94-3.8.93-1.64-.02-2.89-1.72-3.83-3.22C1.14 15.74.88 10.76 2.5 8.28c1.16-1.77 2.98-2.81 4.69-2.81 1.75 0 2.85.95 4.29.95 1.4 0 2.25-.96 4.28-.96 1.52 0 3.13.83 4.28 2.25-3.76 2.06-3.15 7.42.5 9.31z"
      />
    </svg>
  );
}


function ServiceTile({ icon: Icon, label, color, onClick, selected }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-2xl py-4 px-2 active:scale-[0.97] transition-transform border-2 ${
        selected
          ? "bg-orange-50 border-orange-500 shadow-[0_6px_18px_rgba(249,115,22,0.2)]"
          : "bg-white border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div
        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl ${
          selected ? "ring-2 ring-orange-200" : ""
        }`}
        style={{ backgroundColor: selected ? "#fff7ed" : `${color}15` }}
      >
        <Icon className="h-6 w-6" style={{ color: selected ? "#f97316" : color }} />
      </div>
      <span className={`text-xs font-semibold ${selected ? "text-orange-600" : "text-slate-800"}`}>
        {label}
      </span>
    </button>
  );
}

export default function RegisterServices() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const isDriverSelected = selectedService === DRIVER_SERVICE_KEY;

  const handleRegisterNow = () => {
    if (!isDriverSelected) return;
    navigate("/auth/register", { state: { selectedService } });
  };

  const handleSignUp = (provider: "evzone" | "google" | "apple") => {
    if (!isDriverSelected) return;
    navigate("/driver/register", { state: { selectedService, signUpProvider: provider } });
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Register Services" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Services grid – 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceTile
              key={service.key}
              icon={service.icon}
              label={service.label}
              color={service.color}
              selected={selectedService === service.key}
              onClick={() => setSelectedService(service.key)}
            />
          ))}
        </div>
        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
          Select one service, then register
        </p>

        {/* Business Partner card */}
        <section className="rounded-[2.5rem] bg-[#f0faf7] border border-[#d6ebe6] p-8 text-center space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#03cd8c]/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
          
          <div className="flex justify-center relative z-10">
            <div className="h-16 w-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-lg border border-orange-50">
              <Handshake className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Business Partner</h2>
            <p className="text-sm font-black text-[#f77f00] leading-tight mt-1">
              Empower Your Business: Register for EVzone Wallet Payment
            </p>
          </div>

          <button
            type="button"
            onClick={handleRegisterNow}
            disabled={!isDriverSelected}
            className={`relative z-10 w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest transition-all ${
              isDriverSelected
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98]"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Register Now
          </button>

          <div className="relative z-10 space-y-3">
            <button
              type="button"
              onClick={() => handleSignUp("evzone")}
              disabled={!isDriverSelected}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all ${
                isDriverSelected
                  ? "bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/25 hover:bg-[#02ba7f] active:scale-[0.98]"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Car className="h-4 w-4" />
              Sign up with EVzone Account
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSignUp("google")}
                disabled={!isDriverSelected}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black transition-all ${
                  isDriverSelected
                    ? "border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] active:scale-[0.98]"
                    : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                }`}
              >
                <GoogleLogo className="h-4 w-4" />
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSignUp("apple")}
                disabled={!isDriverSelected}
                className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-xs font-black transition-all ${
                  isDriverSelected
                    ? "border-black bg-black text-white hover:bg-[#1a1a1a] active:scale-[0.98]"
                    : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                }`}
              >
                <AppleLogo className="h-4 w-4" />
                Apple
              </button>
            </div>
          </div>
          
          <p className="relative z-10 text-[11px] text-slate-500 leading-relaxed font-medium px-2">
            Unlock the full potential of your business by registering with us to
            become a partner and start receiving payments through EVzone
            Wallet. Seamlessly integrate with our platform.
          </p>
        </section>
      </main>
    </div>
  );
}
