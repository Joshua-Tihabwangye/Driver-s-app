import {
AlertCircle,
Camera,
Car,
ChevronLeft,
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D05 Driver Personnel
// New design with green curved header. Original functionality fully preserved:
// document rows with status chips, training progress ring, Go Online button,
// all navigation/routing intact.


function StatusChip({ label, tone = "pending" }) {
  const tones = {
    missing: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" }
}[tone];

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tones.bg} ${tones.text}`}>
      <span className={`mr-1 h-1.5 w-1.5 rounded-full ${tones.dot}`} />
      {label}
    </span>
  );
}

function DocRow({ icon: Icon, title, description, statusTone, statusLabel, color, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center space-x-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color || "#03cd8c"}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: color || "#03cd8c" }} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{description}</span>
        </div>
      </div>
      <StatusChip label={statusLabel} tone={statusTone} />
    </button>
  );
}


export default function DriverPersonalScreen() {
  const [canGoOnline] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-base font-black text-white tracking-tight">Driver Personnel</h1>
          <div className="w-10" /> {/* Spacer */}
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">

        {/* Top profile card */}
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0faf7] border-2 border-[#03cd8c]">
              <User className="h-7 w-7 text-[#03cd8c]" />
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-lg bg-[#03cd8c] px-1.5 py-0.5 text-[8px] font-black text-white shadow-lg uppercase tracking-tighter">
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
              <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 border border-emerald-100/50">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-700 uppercase">Verified</span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-slate-900 px-2 py-1">
                <Car className="h-3 w-3 text-emerald-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-tighter">EV PRO</span>
              </div>
            </div>
          </div>
        </section>

        {/* Take Selfie section */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 text-center space-y-4 shadow-sm group">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Identity Check</h3>
            <p className="text-[11px] text-slate-500 font-medium">
               Verify your presence before starting your shift
            </p>
          </div>
          
          <div className="flex justify-center">
            <button className="h-20 w-20 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:bg-[#03cd8c]/5 group-hover:border-[#03cd8c]/30 transition-all active:scale-95">
              <Camera className="h-8 w-8 text-slate-300 group-hover:text-[#03cd8c]" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
             <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Take Selfie</span>
             <StatusChip label="Approved" tone="approved" />
          </div>
        </section>

        {/* Variables section */}
        <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
              <Link2 className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          <div>
             <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase mb-1">Social Variables</h4>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
               Link your social media to enhance your driver profile visibility.
             </p>
          </div>
          <p className="text-[11px] font-black text-[#03cd8c] tracking-tight">vehicles.evzone@driver.com</p>
        </section>

        {/* Go to verification link */}
        <div className="text-center px-4 pt-2">
          <button 
            onClick={() => navigate("/driver/preferences/identity")}
            className="text-xs font-black text-[#03cd8c] uppercase tracking-widest border-b-2 border-[#03cd8c]/20 pb-1"
          >
            Go to Verification Page
          </button>
        </div>

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
        <section className="rounded-[2.5rem] bg-[#03cd8c] p-8 space-y-6 text-white text-center shadow-xl shadow-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <p className="text-xs font-black leading-relaxed opacity-90 relative z-10 px-2 tracking-tight">
            Complete your KYC verification to unlock income transfers and premium features.
          </p>
          <button
            type="button"
            onClick={() => navigate("/driver/preferences/identity")}
            className="relative z-10 w-full rounded-2xl bg-white px-6 py-4 text-xs font-black text-[#03cd8c] shadow-lg hover:shadow-xl active:scale-95 transition-all uppercase tracking-widest"
          >
            Update Your KYC
          </button>
        </section>

        {/* Documents & checks */}
        <section className="space-y-5">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-3">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <FileText className="h-7 w-7 text-blue-600" />
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
              statusTone="pending"
              statusLabel="Review"
              color="#f77f00"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
            <DocRow
              icon={CreditCard}
              title="National ID"
              description="Identity verification"
              statusTone="approved"
              statusLabel="Verified"
              color="#03cd8c"
              onClick={() => navigate("/driver/preferences/identity")}
            />
            <DocRow
              icon={FileBadge2}
              title="Conduct Cert"
              description="Good conduct clearance"
              statusTone="pending"
              statusLabel="Pending"
              color="#f77f00"
              onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            />
          </div>
        </section>

        {/* Upload Signed Documents */}
        <div className="text-center px-4 pt-2 pb-2">
          <button 
            onClick={() => navigate("/driver/onboarding/profile/documents/upload")}
            className="text-xs font-black text-amber-600 uppercase tracking-widest border-b-2 border-amber-600/20 pb-1"
          >
            Upload Signed Papers
          </button>
        </div>

        {/* Training progress */}
        <section className="rounded-[2.5rem] bg-slate-900 p-6 flex items-center justify-between text-white shadow-2xl">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-black uppercase text-[#03cd8c] tracking-[0.2em]">Training Hub</span>
              <h4 className="text-base font-black tracking-tight mt-1">2 of 4 Completed</h4>
            </div>
            <button
              type="button"
              onClick={() => navigate("/driver/training/intro")}
              className="inline-flex items-center rounded-xl bg-[#03cd8c] px-4 py-2.5 text-[11px] font-black text-white hover:bg-[#02b77c] transition-colors uppercase tracking-widest"
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
                className="text-[#03cd8c]"
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
          <button onClick={() => navigate("/driver/preferences")} className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left group active:scale-95 transition-all">
             <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <SettingsIcon className="h-6 w-6 text-[#03cd8c]" />
             </div>
             <div>
                <span className="block text-sm font-black text-slate-900 tracking-tight">Preferences</span>
                <span className="text-[11px] text-slate-400 font-medium">Configure your driving profile</span>
             </div>
          </button>

          <button onClick={() => navigate("/driver/onboarding/profile")} className="flex items-center gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm text-left group active:scale-95 transition-all">
             <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
             </div>
             <div>
                <span className="block text-sm font-black text-slate-900 tracking-tight">Info Breakdowns</span>
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
                ? "bg-[#03cd8c] text-white shadow-emerald-500/20 hover:bg-[#02b77c]"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
          >
            Go Online
          </button>
          <p className="mt-2 text-center text-[10px] text-slate-400 font-medium">
            Requirements pending approval for live tracking.
          </p>
        </section>
      </main>
    </div>
  );
}
