import {
  Camera,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import {
  areAllRequiredDocumentsCompliant,
  readStoredDocumentState,
} from "../utils/documentVerificationState";
import {
  canUsePhonebookPicker,
  pickSinglePhonebookContact,
} from "../utils/phonebook";

export default function Profile() {
  const navigate = useNavigate();
  const {
    driverProfilePhoto,
    driverProfile,
    updateDriverProfile,
    onboardingCheckpoints,
  } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isPickingPhone, setIsPickingPhone] = useState(false);
  const [phonebookMessage, setPhonebookMessage] = useState("");
  const [profile, setProfile] = useState(() => ({
    name: driverProfile.fullName,
    phone: driverProfile.phone,
    email: driverProfile.email,
    city: driverProfile.city,
  }));
  const driverDisplayName =
    profile.name.trim().length > 0 ? profile.name.trim() : "Driver";
  const profileInitials =
    driverDisplayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "DR";
  const documentsComplete = areAllRequiredDocumentsCompliant(readStoredDocumentState());
  const identityVerified = onboardingCheckpoints.identityVerified;

  useEffect(() => {
    if (isEditing) {
      return;
    }

    setProfile({
      name: driverProfile.fullName,
      phone: driverProfile.phone,
      email: driverProfile.email,
      city: driverProfile.city,
    });
  }, [driverProfile, isEditing]);

  const handleSave = () => {
    updateDriverProfile({
      fullName: profile.name.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      city: profile.city.trim(),
    });
    setIsEditing(false);
  };

  const handlePickPhoneFromPhonebook = async () => {
    if (!canUsePhonebookPicker()) {
      setPhonebookMessage(
        "Phonebook is unavailable on this browser/device. Enter the number manually."
      );
      return;
    }

    setIsPickingPhone(true);
    setPhonebookMessage("");
    try {
      const picked = await pickSinglePhonebookContact();
      if (!picked?.phone) {
        setPhonebookMessage("No phone number selected from phonebook.");
        return;
      }
      setProfile((prev) => ({ ...prev, phone: picked.phone }));
      setPhonebookMessage("Phone number added from phonebook.");
    } catch {
      setPhonebookMessage("Could not open phonebook. Enter the number manually.");
    } finally {
      setIsPickingPhone(false);
    }
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Account
                </span>
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  Profile
                </h1>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex items-center rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.97] shadow-lg ${
              isEditing ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-orange-50 text-orange-500 border border-orange-100 shadow-orange-500/10"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Done
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                Edit Info
              </>
            )}
          </button>
        </header>
      </div>

      <main className="flex-1 px-4 pt-6 pb-20 space-y-6 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center pt-1 mb-2">
          <div className="relative group">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-slate-900 border-4 border-emerald-500/20 text-4xl font-bold text-white shadow-2xl group-hover:scale-105 transition-all duration-500 overflow-hidden">
              {driverProfilePhoto ? (
                <img
                  src={driverProfilePhoto}
                  alt="Driver profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-orange-500/20" />
                  <span className="relative z-10 font-black text-emerald-500">{profileInitials}</span>
                </>
              )}
            </div>
            <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-lg border border-emerald-100">
              <ShieldCheck className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/upload-image")}
              className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white border-4 border-white shadow-lg active:scale-95 transition-transform"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="mt-5 text-xl font-black text-slate-900 uppercase tracking-tight">{driverDisplayName}</h2>
          <div className="flex items-center space-x-1.5 mt-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100 shadow-sm">
            <Star className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
            <span className="text-xs font-black text-slate-900 tracking-wider">4.92 RATING</span>
            <span className="text-[10px] text-slate-400 font-bold ml-1">324 TRIPS</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total KM", value: "2.4k", icon: Car, color: "#f97316", bg: "bg-orange-50", border: "border-orange-100" },
            { label: "On Time", value: "98%", icon: Check, color: "#10b981", bg: "bg-emerald-50", border: "border-emerald-100" },
            { label: "Level", value: "Gold", icon: Star, color: "#f97316", bg: "bg-orange-50", border: "border-orange-100" },
          ].map((stat) => (
            <div key={stat.label} className={`flex flex-col items-center rounded-2xl border ${stat.border} ${stat.bg} px-1 py-4 shadow-sm transition-transform hover:scale-[1.02]`}>
              <stat.icon className="h-4 w-4 mb-2" style={{ color: stat.color }} />
              <span className="text-xs font-black text-slate-900 tracking-tight uppercase">{stat.value}</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile Details</h3>
             {isEditing && <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Editing Mode</span>}
          </div>
          <div className="space-y-2">
            {[
              { label: "Full Name", value: profile.name, key: "name", icon: User },
              { label: "Primary Phone", value: profile.phone, key: "phone", icon: Phone },
              { label: "Official Email", value: profile.email, key: "email", icon: Mail },
              { label: "Operational City", value: profile.city, key: "city", icon: MapPin },
            ].map((field) => (
              <div
                key={field.key}
                className={`rounded-2xl border transition-all duration-300 ${isEditing ? "bg-white dark:bg-slate-800 border-emerald-500/30 shadow-lg" : "bg-slate-50 dark:bg-slate-900 border-slate-100 shadow-sm"} px-5 py-4`}
              >
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <field.icon className="h-3 w-3 mr-1.5 text-orange-500" />
                    {field.label}
                  </label>
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type={field.key === "phone" ? "tel" : "text"}
                      value={field.value as string}
                      onChange={(e) => setProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full text-[13px] font-bold text-slate-900 bg-transparent outline-none focus:ring-0 placeholder:text-slate-300"
                      autoFocus={field.key === "name"}
                    />
                    {field.key === "phone" ? (
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handlePickPhoneFromPhonebook}
                          className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                          <Smartphone className="h-3 w-3" />
                          {isPickingPhone ? "Opening..." : "Phonebook"}
                        </button>
                        {phonebookMessage ? (
                          <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
                            {phonebookMessage}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-[13px] font-black text-slate-900 tracking-tight">{field.value as string}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 pt-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Verification Hub</h3>
          
          {/* Documents Card */}
          <button
            type="button"
            onClick={() => navigate("/driver/documents")}
            className="w-full rounded-[2.5rem] bg-white border border-slate-100 px-5 py-5 flex items-center justify-between group active:scale-[0.98] hover:border-emerald-500/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                <FileText className="h-6 w-6 text-orange-500 group-hover:text-white" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Compliance</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                  {documentsComplete
                    ? "All required documents are verified"
                    : "Manage legal documents"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
                 <div
                   className={`h-2 w-2 rounded-full ${documentsComplete ? "bg-emerald-500" : "bg-orange-500 animate-pulse"}`}
                 />
                 <span
                   className={`text-[9px] font-black uppercase tracking-widest ${documentsComplete ? "text-emerald-500" : "text-orange-500"}`}
                 >
                   {documentsComplete ? "Verified" : "Update"}
                 </span>
            </div>
          </button>

          {/* Vehicle Card */}
          <button
            type="button"
            onClick={() => navigate("/driver/vehicles/manage")}
            className="w-full rounded-[2.5rem] bg-white border border-slate-100 px-5 py-5 flex items-center justify-between group active:scale-[0.98] hover:border-emerald-500/20 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Car className="h-6 w-6 text-emerald-500 group-hover:text-white" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Vehicle Fleet</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-tight">Toyota Prius • UBB 123X</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </button>

          {/* Identity Card */}
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity/upload-image")}
            className="w-full rounded-[2.5rem] bg-slate-900 border border-slate-800 px-5 py-5 flex items-center justify-between group active:scale-[0.98] hover:border-emerald-500/20 hover:shadow-lg transition-all overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div className="flex flex-col items-start text-left">
                <p className="text-[13px] font-black text-white uppercase tracking-tight">Identity Status</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                  {identityVerified ? "Verified & active profile" : "Profile photo required"}
                </p>
              </div>
            </div>
            <div
              className={`rounded-full px-3 py-1 relative z-10 shadow-lg ${
                identityVerified
                  ? "bg-emerald-500 shadow-emerald-500/20"
                  : "bg-orange-500 shadow-orange-500/20"
              }`}
            >
              <span className="text-[9px] font-black text-white uppercase tracking-widest">
                {identityVerified ? "Secure" : "Pending"}
              </span>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}
