import {
  AlertTriangle,
  BookOpenCheck,
  Car,
  ChevronLeft,
  ClipboardCheck,
  FileBadge2,
  FileText,
  IdCard,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";
import type { VehicleDocumentGroup, VehicleDocuments } from "../data/types";
import PageHeader from "../components/PageHeader";
import VehicleDocumentCard from "../components/VehicleDocumentCard";
import { useStore, type OnboardingCheckpointId } from "../context/StoreContext";
import {
  areAllRequiredDocumentsCompliant,
  createLocalDocumentFileUrl,
  getDaysUntilExpiry,
  getDocumentExpiryStatus,
  getRequiredDocumentSides,
  isAcceptedDocumentFile,
  isDocumentEntryComplete,
  persistDocumentState,
  readStoredDocumentState,
  validateDocumentExpiryDate,
  type DocumentUploadCopy,
  type DocumentUploadKey,
  type DocumentUploadSide,
  type DocumentUploadState,
  type DocumentExpiryStatus,
} from "../utils/documentVerificationState";

type IconComponent = LucideIcon;

interface ActionRowProps {
  icon: IconComponent;
  title: string;
  text: string;
  type: "blocking" | "recommended";
  onClick: () => void;
}

interface PersonalCopyRowProps {
  label: string;
  copy: DocumentUploadCopy;
  onClick: () => void;
}

const PERSONAL_DOCUMENT_META: Array<{
  key: DocumentUploadKey;
  title: string;
  subtitle: string;
  icon: IconComponent;
}> = [
  {
    key: "id",
    title: "National ID or Passport",
    subtitle: "Front and back copies",
    icon: IdCard,
  },
  {
    key: "license",
    title: "Driver's License",
    subtitle: "Front and back copies",
    icon: FileBadge2,
  },
  {
    key: "police",
    title: "Conduct Clearance",
    subtitle: "Single copy",
    icon: ClipboardCheck,
  },
];

const BLOCKER_ICON_MAP: Record<OnboardingCheckpointId, IconComponent> = {
  roleSelected: ShieldCheck,
  documentsVerified: FileText,
  identityVerified: ShieldCheck,
  vehicleReady: Car,
  emergencyContactReady: Users,
  trainingCompleted: BookOpenCheck,
};

function ActionRow({ icon: Icon, title, text, type, onClick }: ActionRowProps) {
  const isBlocking = type === "blocking";
  const iconColor = isBlocking ? "text-red-600" : "text-amber-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border-2 border-orange-500/10 bg-cream px-3 py-2.5 text-left text-[11px] transition-all hover:scale-[1.01] hover:border-orange-500/30 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start space-x-2">
        <div
          className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-colors ${iconColor} group-hover:bg-orange-500 group-hover:text-white`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 text-slate-700">
          <p className="mb-0.5 text-xs font-semibold text-slate-900">{title}</p>
          <p>{text}</p>
        </div>
        {isBlocking && (
          <span className="ml-1 mt-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-700">
            Required
          </span>
        )}
      </div>
    </button>
  );
}

function PersonalCopyRow({ label, copy, onClick }: PersonalCopyRowProps) {
  const tone =
    copy.status === "Uploaded"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : copy.status === "Rejected"
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
          {copy.fileName ? (
            <span className="break-all text-[10px] text-slate-500">Selected: {copy.fileName}</span>
          ) : (
            <span className="text-[10px] text-slate-400">No file selected</span>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tone}`}>
            {copy.status}
          </span>
          <span className="ml-auto inline-flex items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700 sm:ml-0">
            <Upload className="mr-1 h-3 w-3" />
            Re-upload
          </span>
        </div>
      </div>
      {copy.error ? <p className="mt-1 text-[10px] font-medium text-red-600">{copy.error}</p> : null}
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
    typeof daysUntilExpiry === "number" && daysUntilExpiry >= 0
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

function scrollToSection(ref: RefObject<HTMLElement | null>) {
  ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function isVehicleDocumentCompliant(group: VehicleDocumentGroup | undefined): boolean {
  if (!group?.file?.url || !group.file.fileName) {
    return false;
  }
  const expiryDate = group.expiryDate || group.file.expiryDate || "";
  return validateDocumentExpiryDate(expiryDate).valid;
}

export default function RequiredActionsDashboard() {
  const navigate = useNavigate();
  const personalDocumentsRef = useRef<HTMLElement | null>(null);
  const vehicleDocumentsRef = useRef<HTMLElement | null>(null);

  const {
    onboardingBlockers,
    canGoOnline,
    resolveGoOnlineAttempt,
    setDriverOnline,
    setOnboardingCheckpoint,
    vehicles,
    selectedVehicleIndex,
    setSelectedVehicleIndex,
    updateVehicle,
  } = useStore();

  const [personalDocs, setPersonalDocs] = useState<DocumentUploadState>(() =>
    readStoredDocumentState()
  );
  const [expiryErrors, setExpiryErrors] = useState<Record<DocumentUploadKey, string>>({
    id: "",
    license: "",
    police: "",
  });

  const allPersonalDocsCompliant = areAllRequiredDocumentsCompliant(personalDocs);

  const activeVehicle =
    selectedVehicleIndex !== null &&
    selectedVehicleIndex >= 0 &&
    selectedVehicleIndex < vehicles.length
      ? vehicles[selectedVehicleIndex]
      : null;

  const activeVehicleDocsCompliant = useMemo(() => {
    if (!activeVehicle) {
      return false;
    }

    const insuranceOk = isVehicleDocumentCompliant(activeVehicle.vehicleDocs?.insurance);
    const inspectionOk = isVehicleDocumentCompliant(activeVehicle.vehicleDocs?.inspection);
    return insuranceOk && inspectionOk;
  }, [activeVehicle]);

  useEffect(() => {
    setOnboardingCheckpoint("documentsVerified", allPersonalDocsCompliant);
  }, [allPersonalDocsCompliant, setOnboardingCheckpoint]);

  const handleBlockerOpen = (blocker: { id: OnboardingCheckpointId; route: string }) => {
    if (blocker.id === "documentsVerified") {
      scrollToSection(personalDocumentsRef);
      return;
    }

    if (blocker.id === "vehicleReady") {
      scrollToSection(vehicleDocumentsRef);
      return;
    }

    navigate(blocker.route);
  };

  const handleStartGoOnline = () => {
    const decision = resolveGoOnlineAttempt("/driver/dashboard/online");
    if (decision.allowed && !decision.requiresSelfie) {
      setDriverOnline();
      navigate("/driver/dashboard/online", { replace: true });
      return;
    }

    navigate(decision.route, {
      state: decision.allowed
        ? undefined
        : {
            offlineGuardMessage: decision.message,
          },
    });
  };

  const triggerPersonalUpload = (key: DocumentUploadKey, side: DocumentUploadSide) => {
    const input = document.getElementById(`required-actions-doc-${key}-${side}`);
    if (input) {
      input.click();
    }
  };

  const handlePersonalExpiryDate = (key: DocumentUploadKey, value: string) => {
    setPersonalDocs((prev) => {
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

  const handlePersonalFileSelected = (
    key: DocumentUploadKey,
    side: DocumentUploadSide,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const accepted = isAcceptedDocumentFile(file);
    const expiryValidation = validateDocumentExpiryDate(personalDocs[key].expiryDate);
    setExpiryErrors((prev) => ({
      ...prev,
      [key]: expiryValidation.valid ? "" : expiryValidation.error,
    }));

    const hasValidExpiry = expiryValidation.valid;

    setPersonalDocs((prev) => {
      const next = {
        ...prev,
        [key]: {
          ...prev[key],
          [side]: accepted && hasValidExpiry
            ? {
                status: "Uploaded" as const,
                fileName: file.name,
                fileUrl: createLocalDocumentFileUrl(file.name),
                error: "",
              }
            : {
                status: "Rejected" as const,
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

    event.target.value = "";
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const index = vehicles.findIndex((vehicle) => vehicle.id === vehicleId);
    setSelectedVehicleIndex(index >= 0 ? index : null);
  };

  const handleVehicleDocUpdate = (
    key: "insurance" | "inspection",
    group: VehicleDocumentGroup
  ) => {
    if (!activeVehicle) {
      return;
    }

    const nextVehicleDocs: VehicleDocuments = {
      ...activeVehicle.vehicleDocs,
      [key]: group,
    };

    updateVehicle(activeVehicle.id, {
      vehicleDocs: nextVehicleDocs,
      documentsUploaded:
        isVehicleDocumentCompliant(nextVehicleDocs.insurance) &&
        isVehicleDocumentCompliant(nextVehicleDocs.inspection),
    });
  };

  const blockerCount = onboardingBlockers.length;

  return (
    <div className="flex h-full flex-col">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader
        title="Required Actions"
        subtitle="Account Setup"
        onBack={() => navigate(-1)}
      />

      <main className="scrollbar-hide flex-1 space-y-6 overflow-y-auto px-6 pb-16 pt-6">
        <section className="group relative space-y-4 overflow-hidden rounded-[2.5rem] bg-[#0b1e3a] p-6 text-white shadow-2xl shadow-slate-200">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-orange-500/10 transition-transform group-hover:scale-110" />

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-md transition-transform active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                Account Restricted
              </span>
              <p className="mt-0.5 text-base font-black tracking-tight text-white">
                {canGoOnline ? "Setup Complete" : "Incomplete Setup Detected"}
              </p>
            </div>
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-slate-400">
            {canGoOnline
              ? "All required onboarding steps are complete. You can now switch to online mode."
              : `Complete ${blockerCount} required onboarding step${
                  blockerCount === 1 ? "" : "s"
                } before receiving ride requests.`}
          </p>
        </section>

        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Mandatory Steps
            </h2>
          </div>
          {onboardingBlockers.length === 0 ? (
            <div className="rounded-2xl border-2 border-emerald-500/20 bg-emerald-50 px-4 py-4 text-[11px] text-emerald-900">
              <p className="text-xs font-black uppercase tracking-widest">No blockers remaining</p>
              <p className="mt-1 font-medium">Your onboarding requirements are complete.</p>
              <button
                type="button"
                onClick={handleStartGoOnline}
                className="mt-3 w-full rounded-xl bg-emerald-600 py-3 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Start Identity Check
              </button>
            </div>
          ) : (
            onboardingBlockers.map((blocker) => (
              <ActionRow
                key={blocker.id}
                icon={BLOCKER_ICON_MAP[blocker.id]}
                title={blocker.title}
                text={blocker.description}
                onClick={() => handleBlockerOpen({ id: blocker.id, route: blocker.route })}
                type="blocking"
              />
            ))
          )}
        </section>

        <section
          ref={personalDocumentsRef}
          className="space-y-4 rounded-[2rem] border-2 border-brand-active/10 bg-cream p-5 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Personal Documents
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              Access and update personal verification files directly here.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              Changes save automatically. Re-upload any outdated copy.
            </p>
          </div>

          <div className="space-y-3">
            {PERSONAL_DOCUMENT_META.map((meta) => {
              const entry = personalDocs[meta.key];
              const requiredSides = getRequiredDocumentSides(meta.key);
              const expiryStatus = getDocumentExpiryStatus(entry.expiryDate);
              const daysUntilExpiry = getDaysUntilExpiry(entry.expiryDate);
              const isComplete = isDocumentEntryComplete(meta.key, entry);
              const CardIcon = meta.icon;

              return (
                <div
                  key={meta.key}
                  className="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-100 bg-orange-50">
                        <CardIcon className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{meta.title}</p>
                        <p className="text-[10px] font-medium text-slate-500">{meta.subtitle}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-tight ${
                        isComplete
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isComplete ? "Complete" : "Needs Update"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <PersonalCopyRow
                      label="Front Copy"
                      copy={entry.front}
                      onClick={() => triggerPersonalUpload(meta.key, "front")}
                    />
                    {requiredSides.includes("back") ? (
                      <PersonalCopyRow
                        label="Back Copy"
                        copy={entry.back}
                        onClick={() => triggerPersonalUpload(meta.key, "back")}
                      />
                    ) : null}
                  </div>

                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex min-w-0 flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                          Expiry Date
                        </span>
                        <input
                          type="date"
                          value={entry.expiryDate}
                          onChange={(evt) => handlePersonalExpiryDate(meta.key, evt.target.value)}
                          className="h-9 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-700 focus:border-orange-300 focus:outline-none"
                        />
                      </label>
                      <ExpiryStatusBadge status={expiryStatus} daysUntilExpiry={daysUntilExpiry} />
                    </div>
                    {expiryErrors[meta.key] ? (
                      <p className="mt-2 text-[10px] font-medium text-red-600">{expiryErrors[meta.key]}</p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          ref={vehicleDocumentsRef}
          className="space-y-4 rounded-[2rem] border-2 border-blue-500/10 bg-blue-50/20 p-5 shadow-sm"
        >
          <div className="space-y-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Vehicle Documents
            </h2>
            <p className="text-[11px] font-medium text-slate-500">
              Manage insurance and inspection documents from this page.
            </p>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[11px] text-amber-800">
              <p className="font-black uppercase tracking-tight">No vehicle selected</p>
              <p className="mt-1 font-medium">
                Add a vehicle first, then upload insurance and inspection documents here.
              </p>
              <button
                type="button"
                onClick={() => navigate("/driver/vehicles")}
                className="mt-3 w-full rounded-xl bg-amber-500 py-3 text-[10px] font-black uppercase tracking-widest text-white"
              >
                Add Vehicle
              </button>
            </div>
          ) : (
            <>
              <label className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                  Active Vehicle
                </span>
                <select
                  value={activeVehicle?.id || ""}
                  onChange={(event) => handleVehicleSelect(event.target.value)}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-semibold text-slate-700 focus:border-blue-300 focus:outline-none"
                >
                  <option value="" disabled>
                    Select vehicle
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} · {vehicle.plate}
                    </option>
                  ))}
                </select>
              </label>

              {!activeVehicle ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-tight text-amber-700">
                  Select a vehicle above to update its documents.
                </p>
              ) : (
                <>
                  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-tight text-slate-600">
                    {activeVehicleDocsCompliant
                      ? "Vehicle documents are compliant"
                      : "Vehicle documents need update"}
                  </div>
                  <VehicleDocumentCard
                    icon={ShieldCheck}
                    title="Proof of Insurance"
                    subtitle="Upload one clear copy"
                    documentGroup={activeVehicle.vehicleDocs?.insurance}
                    onChange={(group) => handleVehicleDocUpdate("insurance", group)}
                  />
                  <VehicleDocumentCard
                    icon={FileBadge2}
                    title="Vehicle Inspection Report"
                    subtitle="Upload one clear copy"
                    documentGroup={activeVehicle.vehicleDocs?.inspection}
                    onChange={(group) => handleVehicleDocUpdate("inspection", group)}
                  />
                </>
              )}
            </>
          )}
        </section>

        <section className="space-y-4 pb-12 pt-1">
          <div className="px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Account Optimization
            </h2>
          </div>
          <ActionRow
            icon={ShieldCheck}
            title="Vehicle Inspection"
            text="Update your recent maintenance logs to ensure your vehicle rating remains at the highest level."
            onClick={() => navigate("/driver/vehicles")}
            type="recommended"
          />
        </section>

        <div className="hidden">
          {PERSONAL_DOCUMENT_META.map((meta) =>
            getRequiredDocumentSides(meta.key).map((side) => (
              <input
                key={`${meta.key}-${side}`}
                id={`required-actions-doc-${meta.key}-${side}`}
                type="file"
                accept="image/*,.pdf"
                onChange={(event) => handlePersonalFileSelected(meta.key, side, event)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
