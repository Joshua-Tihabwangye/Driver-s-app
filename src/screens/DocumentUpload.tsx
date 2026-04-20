import {
  ClipboardCheck,
  FileBadge2,
  IdCard,
  Info,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import {
  areAllRequiredDocumentsCompliant,
  createLocalDocumentFileUrl,
  getDaysUntilExpiry,
  getDocumentExpiryStatus,
  getRequiredDocumentSides,
  isAcceptedDocumentFile,
  isDocumentEntryComplete,
  isDocumentEntryRejected,
  persistDocumentState,
  readStoredDocumentState,
  validateDocumentExpiryDate,
  type DocumentUploadKey,
  type DocumentExpiryStatus,
  type DocumentUploadSide,
  type DocumentUploadState,
} from "../utils/documentVerificationState";

function CopyRow({
  label,
  status,
  fileName,
  error,
  onClick,
}: {
  label: string;
  status: string;
  fileName: string;
  error: string;
  onClick: () => void;
}) {
  const tone =
    status === "Uploaded"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : status === "Rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-amber-50 text-amber-700 border-amber-100";

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-all hover:border-orange-300"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-black uppercase tracking-tight text-slate-800">
            {label}
          </span>
          {fileName ? (
            <span className="break-all text-[10px] text-slate-500">Selected: {fileName}</span>
          ) : (
            <span className="text-[10px] text-slate-400">No file selected</span>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}>
            {status}
          </span>
          <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 sm:ml-0">
            <Upload className="mr-1 h-3 w-3" />
            Upload
          </span>
        </div>
      </div>
      {error && <p className="mt-1 text-[10px] font-medium text-red-600">{error}</p>}
    </button>
  );
}

function ExpiryStatusBadge({
  status,
  daysUntilExpiry,
}: {
  status: DocumentExpiryStatus;
  daysUntilExpiry: number | null;
}) {
  const palette =
    status === "valid"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "expiring_soon"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : status === "expired"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-100 text-slate-500";

  const label =
    status === "valid"
      ? "Valid"
      : status === "expiring_soon"
      ? "Expiring Soon"
      : status === "expired"
      ? "Expired"
      : "Expiry Date Required";

  const detail =
    status === "valid" && typeof daysUntilExpiry === "number"
      ? `${daysUntilExpiry} days left`
      : status === "expiring_soon" && typeof daysUntilExpiry === "number"
      ? `${daysUntilExpiry} days left`
      : status === "expired"
      ? "Update required"
      : "Set expiry date";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${palette}`}
    >
      {label} · {detail}
    </span>
  );
}

function DocumentCard({
  icon: Icon,
  title,
  subtitle,
  emphasise,
  frontStatus,
  frontFileName,
  frontError,
  backStatus,
  backFileName,
  backError,
  showBackCopy,
  expiryDate,
  expiryStatus,
  expiryError,
  daysUntilExpiry,
  onExpiryDateChange,
  onUploadFront,
  onUploadBack,
}: {
  icon: any;
  title: string;
  subtitle: string;
  emphasise: boolean;
  frontStatus: string;
  frontFileName: string;
  frontError: string;
  backStatus: string;
  backFileName: string;
  backError: string;
  showBackCopy: boolean;
  expiryDate: string;
  expiryStatus: DocumentExpiryStatus;
  expiryError: string;
  daysUntilExpiry: number | null;
  onExpiryDateChange: (value: string) => void;
  onUploadFront: () => void;
  onUploadBack?: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border-2 bg-cream px-3 py-3 shadow-sm ${
        emphasise
          ? "border-orange-300 shadow-orange-100/40"
          : "border-brand-secondary/10 hover:border-brand-secondary/30"
      }`}
    >
      <div className="mb-2 flex items-center space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-white">
          <Icon className="h-4 w-4 text-brand-secondary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-900">{title}</span>
          <span className="text-[11px] text-slate-500">{subtitle}</span>
        </div>
      </div>

      <div className="space-y-2">
        <CopyRow
          label="Front Copy"
          status={frontStatus}
          fileName={frontFileName}
          error={frontError}
          onClick={onUploadFront}
        />
        {showBackCopy && onUploadBack && (
          <CopyRow
            label="Back Copy"
            status={backStatus}
            fileName={backFileName}
            error={backError}
            onClick={onUploadBack}
          />
        )}
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">
              Expiry Date
            </span>
            <input
              type="date"
              value={expiryDate}
              onChange={(event) => onExpiryDateChange(event.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-700 focus:border-orange-300 focus:outline-none"
            />
          </label>
          <div className="w-full sm:w-auto">
            <ExpiryStatusBadge status={expiryStatus} daysUntilExpiry={daysUntilExpiry} />
          </div>
        </div>
        {expiryError ? (
          <p className="mt-2 text-[10px] font-medium text-red-600">{expiryError}</p>
        ) : null}
      </div>
    </div>
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
  const [expiryErrors, setExpiryErrors] = useState<Record<DocumentUploadKey, string>>({
    id: "",
    license: "",
    police: "",
  });
  const allRequiredUploadedWithValidExpiry = areAllRequiredDocumentsCompliant(docs);
  const hasRejectedFiles =
    isDocumentEntryRejected("id", docs.id) ||
    isDocumentEntryRejected("license", docs.license) ||
    isDocumentEntryRejected("police", docs.police);

  useEffect(() => {
    setOnboardingCheckpoint("documentsVerified", allRequiredUploadedWithValidExpiry);
  }, [allRequiredUploadedWithValidExpiry, setOnboardingCheckpoint]);

  const handleExpiryDateChange = (key: DocumentUploadKey, value: string) => {
    setDocs((prev) => {
      const next = {
        ...prev,
        [key]: {
          ...prev[key],
          expiryDate: value,
        },
      };
      persistDocumentState(next);
      return next;
    });

    if (!value) {
      setExpiryErrors((prev) => ({ ...prev, [key]: "" }));
      return;
    }

    const result = validateDocumentExpiryDate(value);
    setExpiryErrors((prev) => ({ ...prev, [key]: result.error }));
  };

  const handleFileSelected = (
    key: DocumentUploadKey,
    side: DocumentUploadSide,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const accepted = isAcceptedDocumentFile(file);
    const expiryValidation = validateDocumentExpiryDate(docs[key].expiryDate);
    setExpiryErrors((prev) => ({
      ...prev,
      [key]: expiryValidation.valid ? "" : expiryValidation.error,
    }));
    const hasValidExpiry = expiryValidation.valid;

    setDocs((prev) => {
      const next = {
        ...prev,
        [key]: {
          ...prev[key],
          [side]: accepted && hasValidExpiry
            ? {
                status: "Uploaded",
                fileName: file.name,
                fileUrl: createLocalDocumentFileUrl(file.name),
                error: "",
              }
            : {
                status: "Rejected",
                fileName: file.name,
                fileUrl: "",
                error: accepted
                  ? expiryValidation.error
                  : "Only PDF and image files are allowed. Re-upload this copy.",
              },
        },
      };
      persistDocumentState(next);
      return next;
    });

    if (!accepted) {
      navigate(`/driver/onboarding/profile/documents/rejected?focus=${key}&side=${side}`);
    }
  };

  const triggerFilePick = (key: DocumentUploadKey, side: DocumentUploadSide) => {
    const input = document.getElementById(`doc-upload-${key}-${side}`);
    if (input) input.click();
  };

  const handleSubmitDocuments = () => {
    const nextExpiryErrors = (["id", "license", "police"] as const).reduce(
      (acc, key) => {
        const validation = validateDocumentExpiryDate(docs[key].expiryDate);
        acc[key] = validation.error;
        return acc;
      },
      { id: "", license: "", police: "" } as Record<DocumentUploadKey, string>
    );
    setExpiryErrors(nextExpiryErrors);

    if (!allRequiredUploadedWithValidExpiry) {
      return;
    }

    setOnboardingCheckpoint("documentsVerified", true);
    navigate("/driver/onboarding/profile");
  };

  const documentCards = [
    {
      key: "id" as const,
      icon: IdCard,
      title: "National ID or Passport",
      subtitle: "Upload both front and back copies",
    },
    {
      key: "license" as const,
      icon: FileBadge2,
      title: "Driver's License",
      subtitle: "Upload both front and back copies",
    },
    {
      key: "police" as const,
      icon: ClipboardCheck,
      title: "Conduct Clearance",
      subtitle: "Upload one clear copy",
    },
  ];

  return (
    <div className="flex min-h-full flex-col ">
      <PageHeader
        title="Personal Verification"
        subtitle="Verify Documents"
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <section className="relative space-y-3 overflow-hidden rounded-[2.5rem] border-2 border-brand-active/10 bg-cream p-6 shadow-sm transition-all hover:border-brand-active/30">
          <div className="absolute right-0 top-0 h-24 w-24 -mr-12 -mt-12 rounded-full bg-brand-active/10 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-brand-active/20 bg-white p-1">
              <ShieldCheck className="h-4 w-4 text-brand-active" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-active">
              Verify Account
            </p>
          </div>
          <p className="text-sm font-black leading-snug tracking-tight text-slate-900">
            Upload required copies for every document.
          </p>
          <p className="text-[11px] font-medium leading-relaxed text-slate-500">
            Accepted formats: image files and PDF only. Invalid formats are rejected and
            must be uploaded again. Each document must include a future expiry date.
          </p>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Required Documents
            </h2>
          </div>

          <div className="space-y-3">
            {documentCards.map((doc) => {
              const entry = docs[doc.key];
              const requiredSides = getRequiredDocumentSides(doc.key);
              const isComplete = isDocumentEntryComplete(doc.key, entry);
              const completedSubtitle =
                requiredSides.length === 2
                  ? "Front and back copies uploaded"
                  : "Required copy uploaded";
              const expiryStatus = getDocumentExpiryStatus(entry.expiryDate);
              const daysUntilExpiry = getDaysUntilExpiry(entry.expiryDate);
              return (
                <DocumentCard
                  key={doc.key}
                  icon={doc.icon}
                  title={doc.title}
                  subtitle={isComplete ? completedSubtitle : doc.subtitle}
                  emphasise={entry.emphasise || focusedDoc === doc.key}
                  frontStatus={entry.front.status}
                  frontFileName={entry.front.fileName}
                  frontError={entry.front.error}
                  backStatus={entry.back.status}
                  backFileName={entry.back.fileName}
                  backError={entry.back.error}
                  expiryDate={entry.expiryDate}
                  expiryStatus={expiryStatus}
                  expiryError={expiryErrors[doc.key]}
                  daysUntilExpiry={daysUntilExpiry}
                  onExpiryDateChange={(value) => handleExpiryDateChange(doc.key, value)}
                  showBackCopy={requiredSides.includes("back")}
                  onUploadFront={() => triggerFilePick(doc.key, "front")}
                  onUploadBack={
                    requiredSides.includes("back")
                      ? () => triggerFilePick(doc.key, "back")
                      : undefined
                  }
                />
              );
            })}
          </div>
        </section>

        <div className="hidden">
          <input
            id="doc-upload-id-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", "front", e)}
          />
          <input
            id="doc-upload-id-back"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", "back", e)}
          />
          <input
            id="doc-upload-license-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", "front", e)}
          />
          <input
            id="doc-upload-license-back"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", "back", e)}
          />
          <input
            id="doc-upload-police-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("police", "front", e)}
          />
        </div>

        <section className="flex items-start space-x-3 rounded-3xl border-2 border-brand-active/10 bg-brand-active/5 p-5 shadow-sm">
          <div className="mt-0.5 rounded-xl border border-brand-active/20 bg-white p-1.5 shadow-sm">
            <Info className="h-4 w-4 text-brand-active" />
          </div>
          <div className="flex-1 space-y-1.5 text-[11px] text-slate-600/80">
            <p className="text-xs font-black uppercase tracking-tight text-slate-900">
              Upload Rules
            </p>
            <div className="space-y-1 font-medium">
              <p>- National ID or Passport and Driver's License require front and back copies.</p>
              <p>- Conduct Clearance requires one clear copy only.</p>
              <p>- Use image or PDF format only.</p>
              <p>- Expiry date must be in the future.</p>
              <p>- Rejected files must be re-uploaded with a valid format.</p>
            </div>
          </div>
        </section>

        <section className="pb-12 pt-4">
          {hasRejectedFiles && (
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-tight text-red-600">
              Some files were rejected. Upload valid PDF or image files for all copies.
            </p>
          )}

          <button
            type="button"
            disabled={!allRequiredUploadedWithValidExpiry}
            aria-disabled={!allRequiredUploadedWithValidExpiry}
            onClick={handleSubmitDocuments}
            className={`w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] ${
              allRequiredUploadedWithValidExpiry
                ? "bg-brand-secondary text-white shadow-brand-secondary/20 hover:bg-brand-secondary/90"
                : "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none"
            }`}
          >
            Save Documents & Continue
          </button>
          {!allRequiredUploadedWithValidExpiry && (
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-tight text-slate-400">
              Upload all required copies and add a valid future expiry date.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
