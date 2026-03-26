import {
  Bike,
  Car,
  ChevronRight,
  Info,
  Truck,
  FileText,
  ShieldCheck,
  FileBadge2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import VehicleDocumentCard from "../components/VehicleDocumentCard";
import VehicleImageUpload from "../components/VehicleImageUpload";
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
  const { 
    vehicles, 
    updateVehicle, 
    deleteVehicle, 
    addVehicle, 
    draftVehicle, 
    setDraftVehicle,
    getDefaultAccessoriesForType 
  } = useStore();
  
  const isNew = vehicleId === "new";
  const vehicle = isNew 
    ? draftVehicle 
    : (vehicles.find(v => v.id === vehicleId) || vehicles[0]);

  const [form, setForm] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year?.toString() || "",
    color: "", // placeholder
    plate: vehicle?.plate || "",
    batterySize: vehicle?.batterySize || "",
    range: vehicle?.range || "",
    type: (vehicle?.type?.toLowerCase() === "motorcycle" ? "motorcycle" : vehicle?.type?.toLowerCase()) || "car",
    imageUrl: vehicle?.imageUrl || "",
    vehicleDocs: vehicle?.vehicleDocs || {},
  });

  const [showDocs, setShowDocs] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // If new and no draft exists, go back
  useEffect(() => {
    if (isNew && !draftVehicle) {
      navigate("/driver/vehicles");
    }
  }, [isNew, draftVehicle, navigate]);

  // Sync form to draft if new
  useEffect(() => {
    if (isNew && draftVehicle) {
      const updatedType = form.type.charAt(0).toUpperCase() + form.type.slice(1);
      const typeChanged = draftVehicle.type !== updatedType;
      
      setDraftVehicle({
        ...draftVehicle,
        make: form.make,
        model: form.model,
        year: parseInt(form.year) || draftVehicle.year,
        plate: form.plate,
        type: updatedType,
        batterySize: form.batterySize,
        range: form.range,
        imageUrl: form.imageUrl,
        vehicleDocs: form.vehicleDocs,
        // Reset accessories only if type actually changed and we are in draft mode
        ...(typeChanged ? { accessories: getDefaultAccessoriesForType(updatedType) } : {})
      });
    }
  }, [form.make, form.model, form.year, form.plate, form.type, form.batterySize, form.range, form.imageUrl, form.vehicleDocs]);

  useEffect(() => {
    if (!isNew && vehicle) {
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year.toString(),
        color: "", 
        plate: vehicle.plate,
        batterySize: vehicle.batterySize || "",
        range: vehicle.range || "",
        type: (vehicle.type.toLowerCase() === "motorcycle" ? "motorcycle" : vehicle.type.toLowerCase()) || "car",
        imageUrl: vehicle.imageUrl || "",
        vehicleDocs: vehicle.vehicleDocs || {},
      });
    }
  }, [vehicle, isNew]);

  const handleDelete = () => {
    if (isNew) {
      setDraftVehicle(null);
      navigate("/driver/vehicles");
      return;
    }
    if (!vehicleId) return;
    if (window.confirm("Are you sure you want to delete this vehicle from your garage?")) {
      deleteVehicle(vehicleId);
      navigate("/driver/vehicles");
    }
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];
    if (!form.make.trim()) newErrors.push("Manufacturer/Make is required");
    if (!form.model.trim()) newErrors.push("Commercial Model is required");
    if (!form.year.trim()) newErrors.push("Production Year is required");
    if (!form.plate.trim()) newErrors.push("License Plate is required");
    if (!form.batterySize.trim()) newErrors.push("Battery (kWh) is required");
    if (!form.range.trim()) newErrors.push("Est. Range (KM) is required");

    // Check accessories
    const accessories = vehicle?.accessories || {};
    const missingAccessories = Object.values(accessories).some(v => v === "Missing");
    if (missingAccessories) {
      newErrors.push("All mandatory safety inventory must be marked as Available");
    }
    if (Object.keys(accessories).length === 0) {
      newErrors.push("Safety inventory has not been checked");
    }

    // Check docs
    const logbookComplete = Boolean(form.vehicleDocs?.logbook?.front && form.vehicleDocs?.logbook?.back);
    const insuranceComplete = Boolean(form.vehicleDocs?.insurance?.front && form.vehicleDocs?.insurance?.back);
    const inspectionComplete = Boolean(form.vehicleDocs?.inspection?.front && form.vehicleDocs?.inspection?.back);

    if (!logbookComplete) newErrors.push("Vehicle Logbook (Front & Back) is required");
    if (!insuranceComplete) newErrors.push("Proof of Insurance (Front & Back) is required");
    if (!inspectionComplete) newErrors.push("Vehicle Inspection Report (Front & Back) is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (isNew && draftVehicle) {
      addVehicle({
        ...draftVehicle,
        status: "active"
      });
      setDraftVehicle(null);
    } else if (vehicleId) {
      updateVehicle(vehicleId, {
        make: form.make,
        model: form.model,
        year: parseInt(form.year) || 2024,
        plate: form.plate,
        batterySize: form.batterySize,
        range: form.range,
        type: form.type.charAt(0).toUpperCase() + form.type.slice(1),
        imageUrl: form.imageUrl,
        vehicleDocs: form.vehicleDocs,
      });
    }
    navigate("/driver/vehicles");
  };

  const handleGoToAccessories = () => {
    const targetId = isNew ? "new" : vehicleId;
    navigate(`/driver/vehicles/${targetId}/accessories`);
  };

  const handleGoToDocs = () => {
    setShowDocs(prev => !prev);
  };

  const accessoryCount = vehicle?.accessories ? Object.keys(vehicle.accessories).length : 0;
  const availableCount = vehicle?.accessories ? Object.values(vehicle.accessories).filter(v => v === "Available").length : 0;

  const allDocsUploaded = Boolean(
    form.vehicleDocs?.logbook?.front &&
    form.vehicleDocs?.logbook?.back &&
    form.vehicleDocs?.insurance?.front &&
    form.vehicleDocs?.insurance?.back &&
    form.vehicleDocs?.inspection?.front &&
    form.vehicleDocs?.inspection?.back
  );

  return (
    <div className="flex flex-col min-h-full bg-cream/30">
      <PageHeader 
        title={isNew ? "New Vehicle" : "Vehicle"} 
        subtitle={isNew ? "Registration" : "Manage Asset"} 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-8 overflow-y-auto scrollbar-hide">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="rounded-3xl border border-red-100 bg-red-50 p-5 space-y-2">
            <div className="flex items-center space-x-2 text-red-700 font-black text-xs uppercase tracking-tight">
              <span>Validation Required</span>
            </div>
            <ul className="list-disc list-inside text-[11px] text-red-600/80 font-medium space-y-1">
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}

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
             <VehicleImageUpload 
               imageUrl={form.imageUrl} 
               onChange={(val: string) => setForm(f => ({ ...f, imageUrl: val }))} 
             />
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
                onClick={handleGoToAccessories}
                className={`flex items-center justify-between rounded-[2rem] border-2 px-5 py-5 shadow-sm active:scale-[0.98] transition-all group ${
                  availableCount > 0 && availableCount === accessoryCount
                    ? "border-brand-active/20 bg-emerald-50/30"
                    : "border-orange-500/10 bg-cream hover:border-orange-500/30"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                      Safety Inventory {availableCount === accessoryCount && availableCount > 0 && "✓"}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {availableCount}/{accessoryCount} items verified
                    </span>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${availableCount === accessoryCount && availableCount > 0 ? "text-brand-active" : "text-slate-300"}`} />
              </button>

              <div className={`flex flex-col rounded-[2rem] border-2 shadow-sm transition-all overflow-hidden ${
                allDocsUploaded
                  ? "border-blue-500/20 bg-blue-50/30"
                  : "border-blue-500/10 bg-cream"
              }`}>
                <button
                  type="button"
                  onClick={handleGoToDocs}
                  className="flex items-center justify-between px-5 py-5 w-full active:scale-[0.98] hover:bg-blue-500/5 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs font-black uppercase tracking-tight text-slate-900">
                        Ownership Documents {allDocsUploaded && "✓"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {allDocsUploaded ? "Documents Verified" : "Verification Required"}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 transition-transform ${allDocsUploaded ? "text-blue-500" : "text-slate-300"} ${showDocs ? "rotate-90" : ""}`} />
                </button>
                
                {showDocs && (
                  <div className="w-full bg-white border-t border-blue-500/10 p-5 space-y-5">
                    <div className="text-[11px] font-medium text-slate-500 mb-2 text-left">
                      Please upload all required vehicle documents. These must be clear and legible.
                    </div>
                    <VehicleDocumentCard
                      icon={FileText}
                      title="Vehicle Logbook"
                      subtitle="Upload both front and back pages"
                      documentGroup={form.vehicleDocs?.logbook}
                      onChange={(group) => setForm(f => ({ ...f, vehicleDocs: { ...f.vehicleDocs, logbook: group } }))}
                    />
                    <VehicleDocumentCard
                      icon={ShieldCheck}
                      title="Proof of Insurance"
                      subtitle="Upload both front and back copies"
                      documentGroup={form.vehicleDocs?.insurance}
                      onChange={(group) => setForm(f => ({ ...f, vehicleDocs: { ...f.vehicleDocs, insurance: group } }))}
                    />
                    <VehicleDocumentCard
                      icon={FileBadge2}
                      title="Vehicle Inspection Report"
                      subtitle="Upload both front and back copies"
                      documentGroup={form.vehicleDocs?.inspection}
                      onChange={(group) => setForm(f => ({ ...f, vehicleDocs: { ...f.vehicleDocs, inspection: group } }))}
                    />
                  </div>
                )}
              </div>
           </div>
        </section>

        {/* Info card */}
        <section className="space-y-6 pt-2 pb-10">
          <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-5 flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div className="shrink text-[11px] text-blue-900/80 leading-relaxed">
              <p className="font-black text-xs text-blue-900 uppercase tracking-tight mb-1">Onboarding Requirement</p>
              <p className="font-medium">All fields, safety inventory, and documents are mandatory before you can put this vehicle into service.</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-[1.5rem] bg-orange-500 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              {isNew ? "Save Vehicle" : "Update Vehicle"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full rounded-[1.5rem] border-2 border-slate-200 py-4 text-sm font-black text-slate-400 hover:text-red-500 hover:border-red-100 transition-all uppercase tracking-widest"
            >
              {isNew ? "Cancel" : "Delete Vehicle"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
