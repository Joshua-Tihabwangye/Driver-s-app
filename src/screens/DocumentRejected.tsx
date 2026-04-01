import { AlertTriangle, Info, Upload, XCircle } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import {
  areAllRequiredDocumentsUploaded,
  getRequiredDocumentSides,
  isAcceptedDocumentFile,
  isDocumentSideRequired,
  persistDocumentState,
  readStoredDocumentState,
  type DocumentUploadKey,
  type DocumentUploadSide,
  type DocumentUploadState,
} from "../utils/documentVerificationState";

const DOC_LABELS: Record<DocumentUploadKey, string> = {
  id: "National ID",
  license: "Driver's License",
  police: "Conduct Clearance",
};

function RejectedRow({
  title,
  reason,
  fileName,
  emphasise,
  onClick,
}: {
  title: string;
  reason: string;
  fileName: string;
  emphasise: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 ${
        emphasise ? "border-red-300 bg-red-50" : "border-red-100 bg-red-50/60"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-red-800">{title}</span>
            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
              <XCircle className="mr-1 h-3 w-3" />
              Rejected
            </span>
          </div>
          <p className="text-[11px] text-red-700">{reason}</p>
          {fileName && (
            <p className="text-[10px] text-slate-500">Last upload: {fileName}</p>
          )}
          <button
            type="button"
            onClick={onClick}
            className="mt-1 inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-[11px] font-semibold text-red-600"
          >
            <Upload className="mr-1 h-3 w-3" />
            Re-upload this copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DocumentRejected() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOnboardingCheckpoint } = useStore();
  const [docs, setDocs] = useState<DocumentUploadState>(() => readStoredDocumentState());

  const highlightedFocus = useMemo(() => {
    const query = new URLSearchParams(location.search);
    const focus = query.get("focus");
    const side = query.get("side");
    if (
      (focus === "id" || focus === "license" || focus === "police") &&
      (side === "front" || side === "back") &&
      isDocumentSideRequired(focus, side)
    ) {
      return `${focus}-${side}`;
    }
    return null;
  }, [location.search]);

  const rejectedCopies = useMemo(() => {
    const items: Array<{
      key: DocumentUploadKey;
      side: DocumentUploadSide;
      title: string;
      reason: string;
      fileName: string;
    }> = [];

    (["id", "license", "police"] as const).forEach((key) => {
      getRequiredDocumentSides(key).forEach((side) => {
        const copy = docs[key][side];
        if (copy.status === "Rejected") {
          items.push({
            key,
            side,
            title: `${DOC_LABELS[key]} (${side === "front" ? "Front" : "Back"})`,
            reason:
              copy.error ||
              "This file format is not accepted. Please upload a PDF or image file.",
            fileName: copy.fileName,
          });
        }
      });
    });

    return items;
  }, [docs]);

  useEffect(() => {
    setOnboardingCheckpoint("documentsVerified", areAllRequiredDocumentsUploaded(docs));
  }, [docs, setOnboardingCheckpoint]);

  const handleFileSelected = (
    key: DocumentUploadKey,
    side: DocumentUploadSide,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const accepted = isAcceptedDocumentFile(file);

    setDocs((prev) => {
      const next = {
        ...prev,
        [key]: {
          ...prev[key],
          [side]: accepted
            ? { status: "Uploaded", fileName: file.name, error: "" }
            : {
                status: "Rejected",
                fileName: file.name,
                error: "Only PDF and image files are allowed. Re-upload this copy.",
              },
        },
      };

      persistDocumentState(next);
      return next;
    });

    if (accepted) {
      navigate("/driver/onboarding/profile", { replace: true });
    }
  };

  const triggerFilePick = (key: DocumentUploadKey, side: DocumentUploadSide) => {
    const input = document.getElementById(`reupload-${key}-${side}`);
    if (input) {
      input.click();
    }
  };

  return (
    <div className="flex min-h-full flex-col ">
      <PageHeader
        title="Personal Verification"
        subtitle="Action Required"
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <section className="rounded-[2.5rem] border border-rose-100 bg-rose-50/50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-white">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="inline-flex rounded-lg bg-rose-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-700">
                Action Required
              </p>
              <p className="text-sm font-black tracking-tight text-slate-900">
                Document upload rejected
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] font-medium leading-relaxed text-slate-600">
            Fix the rejected files below. Each rejected copy includes the exact reason.
            After uploading a valid file, you will return to your onboarding profile.
          </p>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Rejected Files
            </h2>
          </div>

          {rejectedCopies.length === 0 ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-[11px] text-emerald-800">
              <p className="font-black uppercase tracking-wide">No rejected copies</p>
              <p className="mt-1 font-medium">
                There are no rejected files right now.
              </p>
              <button
                type="button"
                onClick={() => navigate("/driver/onboarding/profile")}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Back to Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {rejectedCopies.map((item) => (
                <RejectedRow
                  key={`${item.key}-${item.side}`}
                  title={item.title}
                  reason={item.reason}
                  fileName={item.fileName}
                  emphasise={highlightedFocus === `${item.key}-${item.side}`}
                  onClick={() => triggerFilePick(item.key, item.side)}
                />
              ))}
            </div>
          )}
        </section>

        <div className="hidden">
          <input
            id="reupload-id-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", "front", e)}
          />
          <input
            id="reupload-id-back"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("id", "back", e)}
          />
          <input
            id="reupload-license-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", "front", e)}
          />
          <input
            id="reupload-license-back"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("license", "back", e)}
          />
          <input
            id="reupload-police-front"
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileSelected("police", "front", e)}
          />
        </div>

        <section className="flex items-start space-x-3 rounded-3xl border border-blue-100 bg-blue-50/40 p-5">
          <div className="mt-0.5 rounded-xl bg-blue-100 p-1.5">
            <Info className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-[11px] text-blue-900/80">
            <p className="text-xs font-black uppercase tracking-tight">Accepted formats</p>
            <p className="mt-1 font-medium">
              Upload images (`.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`, `.gif`, `.tif`,
              `.tiff`) or PDF (`.pdf`) only.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
