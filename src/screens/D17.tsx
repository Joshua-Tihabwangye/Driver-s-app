import React from "react";
import {
  Bell,
  Package,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhoneFrame from "../components/PhoneFrame";
import BottomNav from "../components/BottomNav";

// EVzone Driver App – D17 Vehicle Accessories
// Accessories required / recommended for rides & deliveries.

function AccessoryRow({ icon: Icon, name, detail, status }: { icon: any, name: string, detail: string, status: string }) {
  const tone =
    status === "Required"
      ? {
          chipBg: "bg-amber-50",
          chipText: "text-amber-700",
          chipDot: "bg-amber-500",
        }
      : status === "Missing"
      ? {
          chipBg: "bg-red-50",
          chipText: "text-red-600",
          chipDot: "bg-red-500",
        }
      : {
          chipBg: "bg-emerald-50",
          chipText: "text-emerald-700",
          chipDot: "bg-emerald-500",
        };

  const IconRight = status === "Available" ? CheckCircle2 : status === "Missing" ? XCircle : Info;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm group hover:border-[#03cd8c]/20 transition-all">
      <div className="flex items-center space-x-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-colors">
          <Icon className="h-5 w-5 text-slate-700 group-hover:text-[#03cd8c]" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold text-slate-900 leading-tight">{name}</span>
          <span className="text-[11px] text-slate-500 mt-0.5">{detail}</span>
          <span
            className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${tone.chipBg} ${tone.chipText}`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${tone.chipDot}`} />
            {status}
          </span>
        </div>
      </div>
      <IconRight
        className={`h-5 w-5 ${
          status === "Available"
            ? "text-emerald-600"
            : status === "Missing"
            ? "text-red-500"
            : "text-slate-400"
        }`}
      />
    </div>
  );
}

export default function VehicleAccessoriesScreen() {
  const navigate = useNavigate();

  return (
    <PhoneFrame>
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6fff7]">
            <Package className="h-4 w-4 text-[#03cd8c]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
              Fleet Partners
            </span>
            <h1 className="text-base font-semibold text-slate-900">
              Vehicle accessories
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/driver/ridesharing/notification")}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-0 right-0 inline-flex h-2.5 w-2.5 rounded-full bg-[#03cd8c] border-2 border-white" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-20 space-y-5 overflow-y-auto no-scrollbar">
        {/* Safety banner */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#03cd8c]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center space-x-4 relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-[#03cd8c]/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#03cd8c]">
                Compliance Center
              </span>
              <p className="text-sm font-bold tracking-tight">Equipment Checklist</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed relative">
            Ensure your EV has all required equipment to remain compliant with local regulations and company safety standards.
          </p>
        </section>

        {/* Accessories list */}
        <section className="space-y-3">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
             Safety & Support Assets
          </h2>
          <AccessoryRow
            icon={ShieldCheck}
            name="Reflective jacket"
            detail="Required for night shifts and mechanical stops."
            status="Required"
          />
          <AccessoryRow
            icon={Package}
            name="Insulated Delivery Box"
            detail="Required for high-quality food and parcel delivery."
            status="Available"
          />
          <AccessoryRow
            icon={Package}
            name="ISOFIX Child Seat"
            detail="Mandatory for family ride requests under policy."
            status="Missing"
          />
        </section>

        {/* Info + reminder */}
        <section className="space-y-3 pt-1 pb-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 flex items-start space-x-4 shadow-sm group">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm shrink-0">
              <Info className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-xs text-slate-900 mb-1">
                Policy Compliance
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Maintaining these accessories ensures you are eligible for premium job types and high-value logistics orders.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/vehicles/demo-vehicle")}
            className="w-full rounded-2xl py-4 text-xs font-black uppercase tracking-wider shadow-lg shadow-[#03cd8c]/20 bg-[#03cd8c] text-slate-900 hover:bg-[#02b77c] active:scale-[0.98] transition-all"
          >
            Update Accessory List
          </button>
        </section>
      </main>

      <BottomNav active="more" />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </PhoneFrame>
  );
}
