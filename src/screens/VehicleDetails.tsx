import {
  Bike,
  Car,
  ChevronRight,
  Info,
  Truck
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – VehicleDetails Vehicles (v1)
// Redesigned with Green curved header and bottom nav.
// Dynamic routing enabled with StoreContext persistence.

function VehicleTypeChip({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 rounded-2xl border px-3 py-3 text-xs font-semibold transition-all active:scale-[0.97] ${active
        ? "border-orange-500 bg-orange-50 text-slate-900 shadow-sm"
        : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
        }`}
    >
      <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-orange-500" : "bg-white border border-slate-100"}`}>
        <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-400"}`} />
      </div>
      <span>{label}</span>
    </button>
  );
}

function InputRow({ label, placeholder, value, onChange }: any) {
  return (
    <label className="flex flex-col space-y-1">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-2 border-slate-100 bg-white px-4 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:border-orange-500/50 focus:outline-none transition-all"
      />
    </label>
  );
}

export default function VehicleDetails() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { vehicles, updateVehicle, deleteVehicle } = useStore();
  
  const vehicle = vehicles.find(v => v.id === vehicleId) || vehicles[0];

  const [form, setForm] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year?.toString() || "",
    color: vehicle?.imageUrl ? "Dynamic" : "", // placeholder
    plate: vehicle?.plate || "",
    batterySize: vehicle?.batterySize || "",
    range: vehicle?.range || "",
    type: (vehicle?.type?.toLowerCase() === "motorcycle" ? "motorcycle" : vehicle?.type?.toLowerCase()) || "car",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        color: "", // would need field in type if real
        plate: vehicle.plate,
        batterySize: vehicle.batterySize || "",
        range: vehicle.range || "",
        type: (vehicle.type.toLowerCase() === "motorcycle" ? "motorcycle" : vehicle.type.toLowerCase()) || "car",
      });
    }
  }, [vehicle]);

  const handleDelete = () => {
    if (!vehicleId) return;
    if (window.confirm("Are you sure you want to delete this vehicle from your garage?")) {
      deleteVehicle(vehicleId);
      navigate("/driver/vehicles");
    }
  };

  const handleSave = () => {
    if (!vehicleId) return;

    // Check if type changed to reset accessories
    const typeChanged = vehicle?.type.toLowerCase() !== form.type.toLowerCase();
    const updatedType = form.type.charAt(0).toUpperCase() + form.type.slice(1);

    updateVehicle(vehicleId, {
      make: form.make,
      model: form.model,
      year: parseInt(form.year) || 2024,
      plate: form.plate,
      batterySize: form.batterySize,
      range: form.range,
      type: updatedType,
      // If type changed, we might want to clear or reset accessories in a real app.
      // For this refined demo, we'll let the Store identify the new defaults if they are empty.
      ...(typeChanged ? { accessories: undefined } : {})
    });
    navigate("/driver/vehicles");
  };

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <PageHeader 
        title="Vehicle" 
        subtitle="Manage Asset" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-8 overflow-y-auto scrollbar-hide">
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
              active={form.type === "car"}
              onClick={() => setForm(f => ({ ...f, type: "car" }))}
            />
            <VehicleTypeChip
              icon={Bike}
              label="E-Motorcycle"
              active={form.type === "motorcycle"}
              onClick={() => setForm(f => ({ ...f, type: "motorcycle" }))}
            />
            <VehicleTypeChip
              icon={Truck}
              label="Heavy Van"
              active={form.type === "van"}
              onClick={() => setForm(f => ({ ...f, type: "van" }))}
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
           <div className="space-y-6 bg-cream rounded-[2.5rem] border-2 border-brand-active/5 p-6 shadow-sm">
             <InputRow 
               label="Manufacturer / Make" 
               placeholder="e.g. BYD, Tesla, Rivian" 
               value={form.make}
               onChange={(val: string) => setForm(f => ({ ...f, make: val }))}
             />
             <InputRow 
               label="Commercial Model" 
               placeholder="e.g. Dolphin, Model 3, R1T" 
               value={form.model}
               onChange={(val: string) => setForm(f => ({ ...f, model: val }))}
             />
             <div className="grid grid-cols-2 gap-4">
               <InputRow 
                 label="Production Year" 
                 placeholder="YYYY" 
                 value={form.year}
                 onChange={(val: string) => setForm(f => ({ ...f, year: val }))}
               />
               <InputRow 
                 label="License Plate" 
                 placeholder="UAX 123Z" 
                 value={form.plate}
                 onChange={(val: string) => setForm(f => ({ ...f, plate: val }))}
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <InputRow 
                 label="Battery (kWh)" 
                 placeholder="e.g. 60" 
                 value={form.batterySize}
                 onChange={(val: string) => setForm(f => ({ ...f, batterySize: val }))}
               />
               <InputRow 
                 label="Est. Range (KM)" 
                 placeholder="e.g. 380" 
                 value={form.range}
                 onChange={(val: string) => setForm(f => ({ ...f, range: val }))}
               />
             </div>
           </div>
        </section>

        {/* EV connector + docs links */}
        <section className="space-y-4">
           <div className="px-1">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                 Asset & Safety
              </h2>
           </div>
           <div className="space-y-3">
              <button
                type="button"
                onClick={() => navigate(`/driver/vehicles/${vehicleId}/accessories`)}
                className="flex items-center justify-between rounded-[2rem] border-2 border-orange-500/10 bg-cream px-5 py-5 shadow-sm active:scale-[0.98] transition-all group hover:border-orange-500/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                      Safety Inventory
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Check mandated on-board equipment
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-orange-500" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
                className="flex items-center justify-between rounded-[2rem] border-2 border-blue-500/10 bg-cream px-5 py-5 shadow-sm active:scale-[0.98] transition-all group hover:border-blue-500/30"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                      Ownership Documents
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Manage insurance & registration active
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500" />
              </button>
           </div>
        </section>

        {/* Info card */}
        <section className="space-y-6 pt-2 pb-10">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/80 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight mb-1">Data Accuracy</p>
              <p className="font-medium">Accurate EV data is critical for route planning and range prediction during active jobs.</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-[1.5rem] bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              {!vehicle?.make && !vehicle?.model ? "Save Vehicle" : "Update Vehicle"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-[1.5rem] border-2 border-slate-200 py-4 text-sm font-black text-slate-400 hover:text-red-500 hover:border-red-100 transition-all uppercase tracking-widest"
            >
              Delete Vehicle
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
