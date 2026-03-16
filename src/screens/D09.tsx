import {
ChevronLeft,
FileBadge2,
IdCard,
Info,
Upload,
XCircle
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D09 Driver Personal – Document Rejected
// Green curved header design. ALL original functionality preserved:
// re-upload via hidden file inputs, document status tracking, routing.


function RejectedDocRow({ icon: Icon, title, reason, onClick, status = "Rejected", fileName }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2.5 flex items-start space-x-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
        <Icon className="h-4 w-4 text-red-500" />
      </div>
      <div className="flex-1 flex flex-col items-start space-y-1">
        <div className="flex items-center space-x-1">
          <span className="text-xs font-semibold text-red-700">{title}</span>
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 border border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            {status}
          </span>
        </div>
        <span className="text-[11px] text-red-700">{reason}</span>
        <button
          type="button"
          onClick={onClick}
          className="mt-1 inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-600"
        >
          <Upload className="mr-1 h-3 w-3" />
          Re-upload document
        </button>
        {fileName && (
          <span className="text-[10px] text-slate-500">Selected: {fileName}</span>
        )}
      </div>
    </div>
  );
}

export default function DocumentRejectedScreen() {
  const navigate = useNavigate();

  const [docs, setDocs] = useState({
    license: { status: "Rejected", fileName: "" },
    id: { status: "Rejected", fileName: "" }
});

  const handleFileSelected = (key, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setDocs((prev) => ({
      ...prev,
      [key]: { status: "Uploaded", fileName: file.name }
}));
  };

  const triggerFilePick = (key) => {
    const input = document.getElementById(`reupload-${key}`);
    if (input) input.click();
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc]">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-90 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
            <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight text-center">Personal Verification</h1>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6">
        {/* Rejection summary */}
        <section className="rounded-[2.5rem] bg-rose-50/50 border border-rose-100 p-6 space-y-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 border border-rose-200 shadow-inner">
               <XCircle className="h-5 w-5 text-rose-500" />
            </div>
            <div className="flex flex-col">
              <span className="inline-flex items-center rounded-lg bg-rose-100 px-2 py-0.5 text-[9px] font-black text-rose-700 w-fit uppercase tracking-wider">
                Action Required
              </span>
              <p className="text-sm font-black text-slate-900 mt-1 tracking-tight">
                Document issue detected
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            The image provided does not display the document clearly. Please follow the instructions below to fix and re-submit.
          </p>
        </section>

        {/* Rejected docs */}
        <section className="space-y-4">
          <div className="px-1">
             <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Fix These Items
             </h2>
          </div>
          <div className="space-y-4">
            <RejectedDocRow
              icon={FileBadge2}
              title="Driver's License"
              reason="The image is blurry and the expiry date is not readable. Please retake the photo in good light."
              status={docs.license.status}
              fileName={docs.license.fileName}
              onClick={() => triggerFilePick("license")}
            />
            <RejectedDocRow
              icon={IdCard}
              title="National ID"
              reason="The back side is missing. Please upload both front and back images for full verification."
              status={docs.id.status}
              fileName={docs.id.fileName}
              onClick={() => triggerFilePick("id")}
            />
          </div>
        </section>

        {/* Hidden file pickers */}
        <div className="hidden">
          <input
            id="reupload-license"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", e)}
          />
          <input
            id="reupload-id"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", e)}
          />
        </div>

        {/* Help text */}
        <section className="rounded-3xl border border-blue-50 bg-blue-50/30 p-5 flex items-start space-x-3">
          <div className="mt-0.5 bg-blue-100 p-1.5 rounded-xl">
             <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 text-[11px] text-blue-900/70 space-y-1.5">
            <p className="font-black text-xs text-blue-900 uppercase tracking-tight">
               Need Help?
            </p>
            <div className="font-medium space-y-1">
              <p>• Avoid reflections on plastic or laminated cards.</p>
              <p>• Ensure the entire document is inside the frame.</p>
              <p>• Use a dark background to make the white edges pop.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() =>
              navigate("/driver/onboarding/profile/documents/review")
            }
            className="w-full rounded-2xl bg-[#03cd8c] py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:bg-[#02b77c] active:scale-[0.98] transition-all uppercase tracking-widest"
          >
            Update & Re-submit
          </button>
        </section>
      </main>
    </div>
  );
}
