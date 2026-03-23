import {
ChevronLeft,
ClipboardCheck,
FileBadge2,
IdCard,
Info,
ShieldCheck,
Upload
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import {
  areAllRequiredDocumentsUploaded,
  persistDocumentState,
  readStoredDocumentState,
  type DocumentUploadKey,
  type DocumentUploadState,
} from "../utils/documentVerificationState";

// EVzone Driver App – DocumentUpload Driver Personal – Document Verification
// Green curved header design. ALL original functionality preserved:
// document upload via hidden file inputs, status tracking, file selection.


function DocItem({
  icon: Icon,
  title,
  subtitle,
  status,
  emphasise,
  onClick,
  fileName
}) {
  const tone =
    status === "Missing"
      ? "bg-red-50 text-red-600 border-red-100"
      : status === "Uploaded"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 bg-cream px-3 py-2.5 shadow-sm active:scale-[0.97] transition-all hover:scale-[1.01] ${emphasise ? "border-brand-secondary shadow-orange-100/50" : "border-brand-secondary/10 hover:border-brand-secondary/30"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-slate-800 border ${emphasise ? "border-brand-secondary/20" : "border-brand-inactive/20"}`}>
          <Icon className={`h-4 w-4 ${emphasise ? "text-brand-secondary" : "text-brand-inactive"}`} />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
          {emphasise && (
            <span className="mt-1 inline-flex items-center text-[10px] text-slate-500">
              <Info className="mr-1 h-3 w-3 text-brand-secondary" />
              Make sure all text is clear and not cut off.
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>
          {status}
        </span>
        <span className="inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </span>
        {fileName && (
          <span className="text-[10px] text-slate-400">Selected: {fileName}</span>
        )}
      </div>
    </button>
  );
}

export default function DocumentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOnboardingCheckpoint } = useStore();
  const focusedDoc = useMemo(() => {
    const query = new URLSearchParams(location.search);
    const focus = query.get("focus");
    if (focus === "id" || focus === "license" || focus === "police") {
      return focus;
    }
    return null;
  }, [location.search]);
  
  const [docs, setDocs] = useState<DocumentUploadState>(() => readStoredDocumentState());
  const allRequiredUploaded = areAllRequiredDocumentsUploaded(docs);

  useEffect(() => {
    setOnboardingCheckpoint("documentsVerified", allRequiredUploaded);
  }, [allRequiredUploaded, setOnboardingCheckpoint]);

  const handleFileSelected = (key: DocumentUploadKey, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocs((prev) => {
      const next = {
        ...prev,
        [key]: { ...prev[key], status: "Uploaded", emphasise: false, fileName: file.name },
      };
      persistDocumentState(next);
      return next;
    });
  };

  const triggerFilePick = (key: DocumentUploadKey) => {
    const input = document.getElementById(`doc-upload-${key}`);
    if (input) input.click();
  };

  const handleSubmitDocuments = () => {
    if (!allRequiredUploaded) {
      return;
    }

    setOnboardingCheckpoint("documentsVerified", true);
    navigate("/driver/onboarding/profile");
  };

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Personal Verification" 
        subtitle="Verify Documents" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Intro banner */}
        <section className="rounded-[2.5rem] bg-cream dark:bg-slate-900 border-2 border-brand-active/10 p-6 space-y-3 shadow-sm relative overflow-hidden group hover:border-brand-active/30 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-active/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white dark:bg-slate-800 border border-brand-active/20 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-brand-active" />
            </div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand-active font-black">
              Verify Account
            </p>
          </div>
          <p className="text-sm font-black text-slate-900 tracking-tight leading-snug">
            Upload clear photos of your documents to start driving.
          </p>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Ensure your name, photo and expiry dates are visible. Blurry or
            cropped images can cause delays in your activation.
          </p>
        </section>

        {/* Document list */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Required Documents
            </h2>
          </div>
          <div className="space-y-3">
            <DocItem
              icon={IdCard}
              title="National ID"
              subtitle="Front and back, all corners"
              status={docs.id.status}
              emphasise={docs.id.emphasise || focusedDoc === "id"}
              fileName={docs.id.fileName}
              onClick={() => triggerFilePick("id")}
            />
            <DocItem
              icon={FileBadge2}
              title="Driver's License"
              subtitle="Valid and not expired"
              status={docs.license.status}
              emphasise={docs.license.emphasise || focusedDoc === "license"}
              fileName={docs.license.fileName}
              onClick={() => triggerFilePick("license")}
            />
            <DocItem
              icon={ClipboardCheck}
              title="Conduct Clearance"
              subtitle="Issued within 6 months"
              status={docs.police.status}
              emphasise={docs.police.emphasise || focusedDoc === "police"}
              fileName={docs.police.fileName}
              onClick={() => triggerFilePick("police")}
            />
          </div>
        </section>

        {/* Hidden file pickers */}
        <div className="hidden">
          <input
            id="doc-upload-id"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", e)}
          />
          <input
            id="doc-upload-license"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", e)}
          />
          <input
            id="doc-upload-police"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("police", e)}
          />
        </div>

        {/* Helper text */}
        <section className="rounded-3xl border-2 border-brand-active/10 bg-brand-active/5 dark:bg-brand-active/10 p-5 flex items-start space-x-3 shadow-sm">
          <div className="mt-0.5 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-brand-active/20 shadow-sm">
            <Info className="h-4 w-4 text-brand-active" />
          </div>
          <div className="flex-1 text-[11px] text-slate-600/80 space-y-1.5">
            <p className="font-black text-xs text-slate-900 uppercase tracking-tight">
              Speed Up Approval
            </p>
            <div className="font-medium space-y-1">
              <p>• Use natural light, avoid strong glare.</p>
              <p>• Place the document on a dark flat surface.</p>
              <p>• Ensure all 4 corners are clearly visible.</p>
            </div>
          </div>
        </section>

        {/* Continue button */}
         <section className="pt-4 pb-12">
          <button
            type="button"
            disabled={!allRequiredUploaded}
            onClick={handleSubmitDocuments}
            className={`w-full rounded-2xl py-4 text-sm font-black shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest ${
              allRequiredUploaded
                ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:bg-brand-secondary/90"
                : "bg-slate-200 text-slate-500 shadow-none cursor-not-allowed"
            }`}
          >
            Save Documents & Continue
          </button>
          {!allRequiredUploaded && (
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-tight text-slate-400">
              Upload all required documents to proceed.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
