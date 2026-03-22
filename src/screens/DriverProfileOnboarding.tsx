import {
  AlertCircle,
  Camera,
  Car,
  CreditCard,
  FileBadge2,
  FileText,
  IdCard,
  Link2,
  MapPin,
  Settings as SettingsIcon,
  ShieldCheck,
  Star,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import { useStore } from "../context/StoreContext";

// EVzone Driver App – DriverProfileOnboarding Driver Personnel
// Standardized Driver Personnel / Onboarding dashboard.

function DocRow({ icon: Icon, title, description, statusLabel, color, onClick }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.97] hover:scale-[1.01] transition-all ${statusLabel === "Verified" ? "border-brand-active/10 hover:border-brand-active/30" : "border-brand-secondary/10 hover:border-brand-secondary/30"}`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${statusLabel === "Verified" ? "bg-brand-active/10" : "bg-brand-secondary/10"}`}
        >
          <Icon className={`h-5 w-5 ${statusLabel === "Verified" ? "text-brand-active" : "text-brand-secondary"}`} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 dark:text-white">{title}</span>
          <span className="text-[11px] text-brand-inactive">{description}</span>
        </div>
      </div>
      <StatusChip status={statusLabel.toLowerCase() as any} />
    </button>
  );
}

export default function DriverProfileOnboarding() {
  const navigate = useNavigate();
  const { driverRoleConfig } = useStore();
  const canGoOnline = driverRoleConfig.onboardingComplete;

  return (
    <div className="flex flex-col min-h-full bg-transparent">
      <PageHeader 
        title="Driver Personnel" 
        subtitle="Onboarding" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">

        {/* Top profile card */}
        <section className={`rounded-[2.5rem] bg-cream border-2 border-brand-active/10 p-5 flex items-center space-x-4 shadow-sm hover:shadow-md hover:border-brand-active/30 transition-all dark:bg-slate-900`}>
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-brand-active/20">
              <User className="h-7 w-7 text-brand-active" />
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-lg bg-brand-active px-1.5 py-0.5 text-[8px] font-black text-white shadow-lg uppercase tracking-tighter">
              EV Zone
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-sm font-black text-slate-900 tracking-tight">John Doe</span>
              <div className="flex items-center text-[11px] font-black text-slate-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Star className="mr-1 h-3 w-3 text-amber-500 fill-amber-500" />
                <span>4.92</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Kampala · Since 2025</span>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 border border-blue-100/50">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                <span className="text-[9px] font-black text-blue-700 uppercase">Verified</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-1">
                <Car className="h-3 w-3 text-orange-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">EV PRO</span>
              </div>
            </div>
          </div>
        </section>

        {/* Take Selfie section */}
        <section className="bg-cream rounded-[2.5rem] border-2 border-orange-500/10 p-8 text-center space-y-4 shadow-sm group hover:border-orange-500/30 transition-all">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Identity Check</h3>
            <p className="text-[11px] text-slate-500 font-medium">
               Verify your presence before starting your shift
            </p>
          </div>
          
          <div className="flex justify-center">
            <button className="h-20 w-20 rounded-[2rem] bg-white border-2 border-dashed border-orange-200 flex items-center justify-center group-hover:bg-orange-50/50 group-hover:border-orange-500/30 transition-all active:scale-95 shadow-sm">
              <Camera className="h-8 w-8 text-slate-300 group-hover:text-orange-500" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
             <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Take Selfie</span>
             <StatusChip status="online" />
          </div>
        </section>

        {/* Variables section */}
        <section className="rounded-3xl border-2 border-orange-500/10 bg-cream p-6 text-center space-y-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-orange-50 shadow-sm">
              <Link2 className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div>
             <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase mb-1">Social Variables</h4>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
               Link your social media to enhance your driver profile visibility.
             </p>
          </div>
          <p className="text-[11px] font-black text-orange-500 tracking-tight">vehicles.evzone@driver.com</p>
        </section>

        {/* Status alert */}
        <section className="rounded-3xl bg-amber-50/50 border border-amber-100/50 p-5 flex items-start space-x-3">
          <div className="mt-0.5 bg-amber-100 p-1.5 rounded-xl">
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
          <div className="shrink text-[11px] text-amber-900">
            <p className="font-black text-xs mb-1 uppercase tracking-tight">Setup Incomplete</p>
            <p className="font-medium opacity-70">Upload all required documents and finish the training quiz to unlock shifts.</p>
          </div>
        </section>

        {/* KYC Verification */}
        <section className="rounded-[2.5rem] bg-slate-900 border-2 border-orange-500/20 p-8 space-y-6 text-white text-center shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <p className="text-xs font-black leading-relaxed opacity-95 relative z-10 px-2 tracking-tight">
            Complete your KYC verification to unlock income transfers and premium features.
          </p>
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity")}
            className="relative z-10 w-full rounded-2xl bg-orange-500 px-6 py-4 text-xs font-black text-white shadow-lg hover:shadow-xl active:scale-95 transition-all uppercase tracking-widest border border-orange-400"
          >
            Update Your KYC
          </button>
        </section>

        {/* Documents & checks */}
        <section className="space-y-5">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center border-2 border-orange-500/10 shadow-sm">
                <FileText className="h-7 w-7 text-orange-500" />
              </div>
            </div>
            <h3 className="text-base font-black text-slate-900 tracking-tight uppercase">Personal Documents</h3>
            <p className="text-[11px] text-slate-400 font-medium px-8 leading-relaxed">
              Upload National IDs, Passport, or Driving Permits for verification.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <DocRow
              icon={IdCard}
              title="Driving Permit"
              description="Valid primary document"
              statusLabel="Review"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={CreditCard}
              title="National ID"
              description="Identity verification"
              statusLabel="Verified"
              onClick={() => navigate("/driver/preferences/identity")}
            />
            <DocRow
              icon={FileBadge2}
              title="Conduct Cert"
              description="Good conduct clearance"
              statusLabel="Pending"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
          </div>
        </section>

        {/* Training progress */}
        <section className="rounded-[2.5rem] bg-slate-900 p-6 flex items-center justify-between text-white shadow-2xl">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-active tracking-[0.2em]">Training Hub</span>
              <h4 className="text-base font-black tracking-tight mt-1">2 of 4 Completed</h4>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/training/intro")}
              className="inline-flex items-center rounded-xl bg-brand-active px-4 py-2.5 text-[11px] font-black text-white hover:bg-brand-active/90 transition-colors uppercase tracking-widest"
            >
              Resume Track
            </button>
          </div>
          <div className="relative h-20 w-20">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-white/10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />
              <circle
                className="text-brand-active"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="50, 100"
                cx="18"
                cy="18"
                r="16"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black">50%</span>
            </div>
          </div>
        </section>

        {/* Navigation Blocks */}
        <section className="grid grid-cols-1 gap-3">
          <button onClick={() => navigate("/driver/preferences")} className="flex items-center gap-4 bg-cream p-5 rounded-3xl border-2 border-orange-500/10 shadow-sm text-left group active:scale-95 hover:scale-[1.01] hover:border-orange-500/30 transition-all">
             <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-orange-50 shadow-sm">
                <SettingsIcon className="h-6 w-6 text-orange-500" />
             </div>
             <div>
                <span className="block text-sm font-black text-slate-900 tracking-tight uppercase">Preferences</span>
                <span className="text-[11px] text-slate-400 font-medium">Configure your driving profile</span>
             </div>
          </button>
  
          <button onClick={() => navigate("/driver/onboarding/profile")} className="flex items-center gap-4 bg-cream p-5 rounded-3xl border-2 border-orange-500/10 shadow-sm text-left group active:scale-95 hover:scale-[1.01] hover:border-orange-500/30 transition-all">
             <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-orange-50 shadow-sm">
                <MapPin className="h-6 w-6 text-orange-500" />
             </div>
             <div>
                <span className="block text-sm font-black text-slate-900 tracking-tight uppercase">Info Breakdowns</span>
                <span className="text-[11px] text-slate-400 font-medium">Account setup details</span>
             </div>
          </button>
        </section>

        {/* Go Online button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() => navigate("/driver/dashboard/online")}
            disabled={!canGoOnline}
            className={`w-full rounded-2xl py-4 text-sm font-black shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest ${canGoOnline
                ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
          >
            Go Online
          </button>
          <p className="mt-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            Requirements pending approval for live tracking.
          </p>
        </section>
      </main>
    </div>
  );
}
