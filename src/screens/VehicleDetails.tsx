import {
Bike,
Car,
ChevronRight,
Info,
Truck,
Zap
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – VehicleDetails Vehicles (v1)
// Redesigned with Green curved header and bottom nav.
// Preserving all functionality: type selection, input fields, navigation to accessories.


function VehicleTypeChip({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 rounded-2xl border px-3 py-3 text-xs font-semibold transition-colors active:scale-[0.97] ${active
        ? "border-orange-500 bg-orange-50 text-slate-900"
        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
        }`}
    >
      <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white">
        <Icon className={`h-4 w-4 ${active ? "text-orange-500" : "text-slate-400"}`} />
      </div>
      <span>{label}</span>
    </button>
  );
}

function InputRow({ label, placeholder }) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-medium text-slate-600">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
    </label>
  );
}

export default function VehicleDetails() {
  const [type, setType] = useState("car");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Vehicle" 
        subtitle="General Details" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Vehicle type selector */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Select EV Category
             </h2>
          </div>
          <div className="flex items-stretch space-x-3">
            <VehicleTypeChip
              icon={Car}
              label="Standard Car"
              active={type === "car"}
              onClick={() => setType("car")}
            />
            <VehicleTypeChip
              icon={Bike}
              label="E-Motorcycle"
              active={type === "bike"}
              onClick={() => setType("bike")}
            />
            <VehicleTypeChip
              icon={Truck}
              label="Heavy Van"
              active={type === "van"}
              onClick={() => setType("van")}
            />
          </div>
        </section>

        {/* Key fields */}
        <section className="space-y-4">
           <div className="px-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                 General Information
              </h2>
           </div>
           <div className="space-y-4 bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm">
             <InputRow label="Manufacturer / Make" placeholder="e.g. BYD, Tesla, Rivian" />
             <InputRow label="Commercial Model" placeholder="e.g. Dolphin, Model 3, R1T" />
             <div className="grid grid-cols-2 gap-4">
               <InputRow label="Production Year" placeholder="YYYY" />
               <InputRow label="Exterior Color" placeholder="Color" />
             </div>
             <InputRow label="Authorized License Plate" placeholder="e.g. UAX 123Z" />
             <div className="grid grid-cols-2 gap-4">
               <InputRow label="Battery Size (kWh)" placeholder="e.g. 60" />
               <InputRow label="Est. Range (KM)" placeholder="e.g. 380" />
             </div>
           </div>
        </section>

        {/* EV connector + docs links */}
        <section className="space-y-4">
           <div className="px-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                 Linked Assets
              </h2>
           </div>
           <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate("/driver/vehicles/accessories")}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-4">
<div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                      Charging Connector
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Type 2, CCS2, GB/T DC
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
                className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white px-4 py-4 shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center space-x-4">
<div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                      Verification Documents
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Registration & Insurance photos
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </button>
           </div>
        </section>

        {/* Info card */}
        <section className="space-y-4 pt-1">
          <div className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/70 space-y-1.5 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight">System Notice</p>
              <p className="font-medium">Accurate EV data is critical for route planning, range prediction, and charging station allocation.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/driver/vehicles")}
            className="w-full rounded-2xl bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Save Vehicle Details
          </button>
        </section>
      </main>
    </div>
  );
}
