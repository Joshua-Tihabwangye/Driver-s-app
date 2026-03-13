import { FileText, ChevronLeft, CheckCircle2, AlertCircle, Clock, Upload, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";

const DOCUMENTS = [
  {
    id: 1,
    name: "Driving License",
    status: "verified",
    expiry: "Expires: 12 Oct 2026",
    statusColor: "text-emerald-500",
    statusBg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  {
    id: 2,
    name: "Vehicle Registration",
    status: "verified",
    expiry: "Expires: 05 Jun 2026",
    statusColor: "text-emerald-500",
    statusBg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  {
    id: 3,
    name: "Police Clearance",
    status: "expiring soon",
    expiry: "Expires: 15 Apr 2024",
    statusColor: "text-amber-500",
    statusBg: "bg-amber-50",
    icon: Clock,
  },
  {
    id: 4,
    name: "Vehicle Insurance",
    status: "rejected",
    expiry: "Rejected: Quality issue",
    statusColor: "text-red-500",
    statusBg: "bg-red-50",
    icon: AlertCircle,
  },
];

export default function DocumentCenter() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState(DOCUMENTS);

  const handleUpload = (docId: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "uploaded",
              expiry: `Uploaded: ${file.name}`,
              statusColor: "text-emerald-500",
              statusBg: "bg-emerald-50",
              icon: CheckCircle2,
            }
          : doc
      )
    );
  };

  const triggerUpload = (docId: number) => {
    const input = document.getElementById(`doc-upload-${docId}`) as HTMLInputElement | null;
    if (input) input.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70 text-center">Compliance</span>
                <p className="text-base font-black text-white tracking-tight leading-tight text-center">Document Center</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-8">
        {/* Status Summary */}
        <section className="bg-slate-900 rounded-[2.5rem] p-6 text-white flex items-center space-x-6 shadow-2xl">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeDasharray="100, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-[#03cd8c]"
                strokeDasharray="75, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black tracking-tight">75%</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-black uppercase tracking-tight mb-1">Verify Your Account</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-tight">
              3 of 4 required documents verified. Complete the rest to stay online.
            </p>
          </div>
        </section>

        {/* Document List */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Required Documents</h2>
          </div>
          <div className="space-y-3">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-cream rounded-[2.5rem] border-2 border-orange-500/10 p-6 flex items-center space-x-4 shadow-sm active:scale-[0.98] hover:scale-[1.01] hover:border-orange-500/30 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 border border-orange-50">
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{doc.name}</h3>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-0.5 rounded-full ${doc.statusBg} flex items-center space-x-1`}>
                      <doc.icon className={`h-3 w-3 ${doc.statusColor}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${doc.statusColor}`}>{doc.status}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{doc.expiry}</p>
                </div>
                {doc.status !== "verified" ? (
                  <>
                    <input
                      id={`doc-upload-${doc.id}`}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(event) => handleUpload(doc.id, event)}
                    />
                    <button
                      type="button"
                      onClick={() => triggerUpload(doc.id)}
                      className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 active:scale-95 transition-all group"
                    >
                    <Upload className="h-4 w-4 text-[#03cd8c] group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="pt-2 pb-10">
            <div className="rounded-[2.5rem] bg-cream border-2 border-orange-500/10 p-6 flex flex-col items-center text-center space-y-3 shadow-md">
                <div className="h-10 w-10 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-orange-50">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-[11px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed max-w-[200px]">
                    Need help with your documents? Contact our support team.
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#03cd8c] bg-white border border-[#03cd8c]/20 px-6 py-2 rounded-full active:scale-95 transition-all hover:bg-emerald-50">Get help</button>
            </div>
        </section>
      </main>
    </div>
  );
}
