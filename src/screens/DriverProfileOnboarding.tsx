import {
  AlertCircle,
  Camera,
  Car,
  CheckCircle2,
  CreditCard,
  FileBadge2,
  FileText,
  IdCard,
  Link2,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  User,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import StatusChip from "../components/StatusChip";
import { useStore } from "../context/StoreContext";
import {
  areAllRequiredDocumentsCompliant,
  getDocumentExpiryStatus,
  getRequiredDocumentSides,
  isDocumentEntryComplete,
  isDocumentEntryRejected,
  readStoredDocumentState,
  validateDocumentExpiryDate,
  type DocumentUploadKey,
} from "../utils/documentVerificationState";
import { formatPrimaryTaskRoleLabelFromAssignable } from "../utils/taskCategories";

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

interface SocialLinkEntry {
  id: string;
  platform: string;
  username: string;
  url: string;
}

const SOCIAL_LINKS_STORAGE_KEY = "driver_social_links";

function createSocialLinkEntry(): SocialLinkEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    platform: "",
    username: "",
    url: "",
  };
}

function readStoredSocialLinks(): SocialLinkEntry[] {
  if (typeof window === "undefined") {
    return [createSocialLinkEntry()];
  }

  try {
    const raw = window.localStorage.getItem(SOCIAL_LINKS_STORAGE_KEY);
    if (!raw) {
      return [createSocialLinkEntry()];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [createSocialLinkEntry()];
    }

    const sanitized = parsed
      .filter((item) => item && typeof item === "object")
      .map((item) => {
        const candidate = item as Partial<SocialLinkEntry>;
        return {
          id:
            typeof candidate.id === "string" && candidate.id.trim()
              ? candidate.id
              : createSocialLinkEntry().id,
          platform: typeof candidate.platform === "string" ? candidate.platform : "",
          username: typeof candidate.username === "string" ? candidate.username : "",
          url: typeof candidate.url === "string" ? candidate.url : "",
        };
      });

    return sanitized.length > 0 ? sanitized : [createSocialLinkEntry()];
  } catch {
    return [createSocialLinkEntry()];
  }
}

export default function DriverProfileOnboarding() {
  const navigate = useNavigate();
  const {
    canGoOnline,
    assignableJobTypes,
    driverProfile,
    driverProfilePhoto,
    onboardingBlockers,
    onboardingCheckpoints,
    setOnboardingCheckpoint,
    resolveGoOnlineAttempt,
    setDriverOnline,
    vehicles,
    selectedVehicleIndex,
    emergencyContacts,
  } = useStore();
  const documentState = useMemo(() => readStoredDocumentState(), []);
  const blockerCount = onboardingBlockers.length;
  const documentsComplete = areAllRequiredDocumentsCompliant(documentState);
  const trainingComplete = onboardingCheckpoints.trainingCompleted;
  const onboardingPrerequisitesComplete =
    onboardingCheckpoints.roleSelected &&
    onboardingCheckpoints.documentsVerified &&
    onboardingCheckpoints.identityVerified &&
    onboardingCheckpoints.vehicleReady &&
    onboardingCheckpoints.emergencyContactReady;
  const [isSocialEditorOpen, setIsSocialEditorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInfoBreakdownsOpen, setIsInfoBreakdownsOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinkEntry[]>(() => readStoredSocialLinks());
  const driverDisplayName =
    driverProfile.fullName.trim().length > 0 ? driverProfile.fullName.trim() : "Driver";
  const driverCityLabel =
    driverProfile.city.trim().length > 0 ? driverProfile.city.trim() : "City Not Set";
  const driverSinceYear = driverProfile.memberSinceYear || new Date().getFullYear();
  const onboardingRoleLabel = useMemo(
    () => formatPrimaryTaskRoleLabelFromAssignable(assignableJobTypes),
    [assignableJobTypes]
  );

  const getDocumentStatusLabel = (key: DocumentUploadKey) => {
    const entry = documentState[key];
    const complete = isDocumentEntryComplete(key, entry);
    const expiryStatus = getDocumentExpiryStatus(entry.expiryDate);
    const hasValidExpiry = validateDocumentExpiryDate(entry.expiryDate).valid;
    if (complete && (expiryStatus === "expired" || !hasValidExpiry)) {
      return "Expired";
    }
    if (complete) {
      return "Verified";
    }
    if (isDocumentEntryRejected(key, entry)) {
      return "Rejected";
    }
    return "Pending";
  };

  const getDocumentDescription = (key: DocumentUploadKey) => {
    const entry = documentState[key];
    const requiredSides = getRequiredDocumentSides(key);
    const uploadedSides =
      Number(entry.front.status === "Uploaded") +
      Number(requiredSides.includes("back") && entry.back.status === "Uploaded");
    const complete = isDocumentEntryComplete(key, entry);
    const expiryStatus = getDocumentExpiryStatus(entry.expiryDate);
    const hasValidExpiry = validateDocumentExpiryDate(entry.expiryDate).valid;

    if (complete && (expiryStatus === "expired" || !hasValidExpiry)) {
      return "Document expired. Upload an updated copy with a future expiry date.";
    }
    if (complete) {
      return requiredSides.length === 2
        ? "Front and back copies uploaded"
        : "Required copy uploaded";
    }
    if (isDocumentEntryRejected(key, entry)) {
      return "Invalid format rejected. Re-upload with PDF or image.";
    }
    if (uploadedSides > 0 && uploadedSides < requiredSides.length) {
      return "Upload the remaining required copy.";
    }
    return requiredSides.length === 2
      ? "Upload front and back copies."
      : "Upload one clear copy.";
  };

  useEffect(() => {
    setOnboardingCheckpoint("documentsVerified", documentsComplete);
  }, [documentsComplete, setOnboardingCheckpoint]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SOCIAL_LINKS_STORAGE_KEY, JSON.stringify(socialLinks));
  }, [socialLinks]);

  const vehicleReady = onboardingCheckpoints.vehicleReady;

  const gatewayAction = useMemo(() => {
    if (!onboardingPrerequisitesComplete) {
      return {
        label: "Complete Required Steps",
        route: onboardingBlockers[0]?.route || "/driver/onboarding/profile",
        note: "Finish all onboarding requirements to unlock training.",
      };
    }

    if (!trainingComplete) {
      return {
        label: "Continue to Training",
        route: "/driver/training/info-session",
        note: "Finish training before going online.",
      };
    }

    return {
      label: "Go Online",
      route: "/driver/preferences/identity/face-capture?mode=go-online&next=/driver/dashboard/online",
      note: "Identity check is required every time you go online.",
    };
  }, [onboardingBlockers, onboardingPrerequisitesComplete, trainingComplete]);

  type BreakdownItem = {
    id: string;
    label: string;
    detail: string;
    present: boolean;
    route: string;
  };

  const documentSides = useMemo(
    () => [
      {
        id: "license-front",
        label: "Driving Permit (Front)",
        copy: documentState.license.front,
        uploadRoute: "/driver/onboarding/profile/documents/upload?focus=license",
      },
      {
        id: "license-back",
        label: "Driving Permit (Back)",
        copy: documentState.license.back,
        uploadRoute: "/driver/onboarding/profile/documents/upload?focus=license",
      },
      {
        id: "id-front",
        label: "National ID or Passport (Front)",
        copy: documentState.id.front,
        uploadRoute: "/driver/onboarding/profile/documents/upload?focus=id",
      },
      {
        id: "id-back",
        label: "National ID or Passport (Back)",
        copy: documentState.id.back,
        uploadRoute: "/driver/onboarding/profile/documents/upload?focus=id",
      },
      {
        id: "police-front",
        label: "Conduct Cert",
        copy: documentState.police.front,
        uploadRoute: "/driver/onboarding/profile/documents/upload?focus=police",
      },
    ],
    [documentState]
  );

  const uploadedDocumentSideCount = useMemo(
    () => documentSides.filter((item) => item.copy.status === "Uploaded").length,
    [documentSides]
  );

  const infoBreakdownItems = useMemo<BreakdownItem[]>(() => {
    const profileItems: BreakdownItem[] = [
      {
        id: "profile-name",
        label: "Full Name",
        detail:
          driverProfile.fullName.trim().length > 0
            ? driverProfile.fullName.trim()
            : "Name not provided yet.",
        present: driverProfile.fullName.trim().length > 0,
        route: "/auth/register",
      },
      {
        id: "profile-phone",
        label: "Phone Number",
        detail:
          driverProfile.phone.trim().length > 0
            ? driverProfile.phone.trim()
            : "Phone number not provided yet.",
        present: driverProfile.phone.trim().length > 0,
        route: "/auth/register",
      },
      {
        id: "profile-email",
        label: "Email Address",
        detail:
          driverProfile.email.trim().length > 0
            ? driverProfile.email.trim()
            : "Email address not provided yet.",
        present: driverProfile.email.trim().length > 0,
        route: "/auth/register",
      },
      {
        id: "profile-city",
        label: "Operational City",
        detail:
          driverProfile.city.trim().length > 0
            ? driverProfile.city.trim()
            : "City not provided yet.",
        present: driverProfile.city.trim().length > 0,
        route: "/auth/register",
      },
    ];

    const checkpointItems: BreakdownItem[] = [
      {
        id: "role-selected",
        label: "Driver Role Selection",
        detail: onboardingCheckpoints.roleSelected
          ? `Task categories enabled: ${onboardingRoleLabel}.`
          : "Service category has not been selected yet.",
        present: onboardingCheckpoints.roleSelected,
        route: "/driver/register",
      },
      {
        id: "documents-verified",
        label: "Documents Verification",
        detail: onboardingCheckpoints.documentsVerified
          ? "All required documents are uploaded."
          : (() => {
              // EVzone Driver – Part 2: Explicit missing-credential messages.
              const missingNames = documentSides
                .filter((item) => item.copy.status !== "Uploaded")
                .map((item) => item.label);
              if (missingNames.length === 0) return "All required documents are uploaded.";
              if (missingNames.length <= 2) return `${missingNames.join(" and ")} is missing.`;
              return `${missingNames.length} document sides are still missing. Check list below.`;
            })(),
        present: onboardingCheckpoints.documentsVerified,
        route: "/driver/onboarding/profile/documents/upload",
      },
      {
        id: "identity-verified",
        label: "Identity Verification",
        detail: onboardingCheckpoints.identityVerified
          ? "Identity checks are completed."
          : "Profile picture is missing.",
        present: onboardingCheckpoints.identityVerified,
        route: "/driver/preferences/identity/upload-image",
      },
      {
        id: "vehicle-ready",
        label: "Vehicle Setup",
        detail: onboardingCheckpoints.vehicleReady
          ? "Active vehicle selected and ready."
          : (() => {
              if (vehicles.length === 0) return "No vehicles added. Insurance and inspection documents missing.";
              if (selectedVehicleIndex === null) return "Vehicle selected but not set as active.";
              return "Vehicle setup incomplete.";
            })(),
        present: onboardingCheckpoints.vehicleReady,
        route: "/driver/vehicles",
      },
      {
        id: "emergency-contact-ready",
        label: "Emergency Contacts",
        detail: onboardingCheckpoints.emergencyContactReady
          ? "Trusted emergency contact is saved."
          : "Add at least one trusted emergency contact.",
        present: onboardingCheckpoints.emergencyContactReady,
        route: "/driver/safety/emergency/contacts",
      },
    ];

    const docItems: BreakdownItem[] = documentSides.map((item) => {
      const isUploaded = item.copy.status === "Uploaded";
      const detail =
        item.copy.status === "Uploaded"
          ? item.copy.fileName
            ? `Uploaded: ${item.copy.fileName}`
            : "Uploaded."
          : item.copy.status === "Rejected"
          ? item.copy.error
            ? `Rejected: ${item.copy.error}`
            : `${item.label} rejected. Re-upload required.`
          : `${item.label} is missing.`; // EVzone Driver – Part 2: Explicit per-item message.

      return {
        id: item.id,
        label: item.label,
        detail,
        present: isUploaded,
        route: item.uploadRoute,
      };
    });

    return [...profileItems, ...checkpointItems, ...docItems];
  }, [
    documentSides,
    driverProfile.city,
    driverProfile.email,
    driverProfile.fullName,
    driverProfile.phone,
    onboardingRoleLabel,
    onboardingCheckpoints.documentsVerified,
    onboardingCheckpoints.emergencyContactReady,
    onboardingCheckpoints.identityVerified,
    onboardingCheckpoints.roleSelected,
    onboardingCheckpoints.trainingCompleted,
    onboardingCheckpoints.vehicleReady,
    uploadedDocumentSideCount,
  ]);

  const presentInfoItems = useMemo(
    () => infoBreakdownItems.filter((item) => item.present),
    [infoBreakdownItems]
  );
  const missingInfoItems = useMemo(
    () => infoBreakdownItems.filter((item) => !item.present),
    [infoBreakdownItems]
  );
  const completedSocialLinksCount = useMemo(
    () =>
      socialLinks.filter(
        (entry) => entry.username.trim().length > 0 && entry.url.trim().length > 0
      ).length,
    [socialLinks]
  );

  const updateSocialLink = (
    id: string,
    field: "platform" | "username" | "url",
    value: string
  ) => {
    setSocialLinks((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry))
    );
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, createSocialLinkEntry()]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => {
      if (prev.length === 1) {
        return [{ ...prev[0], platform: "", username: "", url: "" }];
      }
      return prev.filter((entry) => entry.id !== id);
    });
  };

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
              {driverProfilePhoto ? (
                <img
                  src={driverProfilePhoto}
                  alt="Driver profile"
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-brand-active" />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 inline-flex items-center rounded-lg bg-brand-active px-1.5 py-0.5 text-[8px] font-black text-white shadow-lg uppercase tracking-tighter">
              EV Zone
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-0.5">
              <span className="text-sm font-black text-slate-900 tracking-tight">{driverDisplayName}</span>
            </div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
              {driverCityLabel} · Since {driverSinceYear}
            </span>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 border border-orange-100/60">
                <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight">
                  {onboardingRoleLabel}
                </span>
              </div>
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
            <button
              type="button"
              onClick={() => navigate("/driver/preferences/identity/face-capture")}
              className="h-20 w-20 rounded-[2rem] bg-white border-2 border-dashed border-orange-200 flex items-center justify-center group-hover:bg-orange-50/50 group-hover:border-orange-500/30 transition-all active:scale-95 shadow-sm"
            >
              <Camera className="h-8 w-8 text-slate-300 group-hover:text-orange-500" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
             <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Take Selfie</span>
             <StatusChip status="online" />
          </div>
        </section>

        {/* Emergency Contacts section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Emergency Contacts</h2>
            <button
              onClick={() => navigate("/driver/safety/emergency/contacts")}
              className="flex items-center space-x-1 text-[11px] font-black text-orange-500 uppercase tracking-tight"
            >
              <Plus className="h-3 w-3" />
              <span>Add / Manage</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {emergencyContacts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {emergencyContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => navigate("/driver/safety/emergency/contacts")}
                    className="flex items-center space-x-2 rounded-xl border border-orange-200 bg-orange-50/50 px-3 py-2 transition-all active:scale-95 hover:border-orange-300"
                  >
                    <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center border border-orange-100 shadow-sm">
                      <User className="h-3 w-3 text-orange-500" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-black text-slate-900 tracking-tight">{contact.name}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{contact.relationship}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/driver/safety/emergency/contacts")}
                className="w-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center space-y-2 hover:border-orange-300 hover:bg-orange-50/30 transition-all"
              >
                <Users className="h-8 w-8 text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No trusted contacts added</span>
              </button>
            )}
          </div>
        </section>

        {/* Variables section */}
        <button
          type="button"
          onClick={() => setIsSocialEditorOpen(true)}
          className="w-full rounded-3xl border-2 border-orange-500/10 bg-cream p-6 text-center space-y-4 shadow-sm hover:border-orange-500/30 transition-all"
        >
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-orange-50 shadow-sm">
              <Link2 className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div>
             <h4 className="text-xs font-black text-slate-900 tracking-tight uppercase mb-1">Social Variables</h4>
             <p className="text-[11px] text-slate-400 font-medium leading-relaxed px-4">
               Open table and add usernames plus profile links.
             </p>
          </div>
          <p className="text-[11px] font-black text-orange-500 tracking-tight">
            {completedSocialLinksCount} profile link{completedSocialLinksCount === 1 ? "" : "s"} saved
          </p>
        </button>

        {/* Status alert */}
        <section className={`rounded-3xl border p-5 flex items-start space-x-3 ${
          canGoOnline
            ? "bg-emerald-50/60 border-emerald-100/80"
            : "bg-amber-50/50 border-amber-100/50"
        }`}>
          <div className={`mt-0.5 p-1.5 rounded-xl ${
            canGoOnline ? "bg-emerald-100" : "bg-amber-100"
          }`}>
            <AlertCircle className={`h-4 w-4 ${
              canGoOnline ? "text-emerald-600" : "text-amber-600"
            }`} />
          </div>
          <div className={`shrink text-[11px] ${
            canGoOnline ? "text-emerald-900" : "text-amber-900"
          }`}>
            <p className="font-black text-xs mb-1 uppercase tracking-tight">
              {canGoOnline
                ? "Setup Complete"
                : onboardingPrerequisitesComplete && !trainingComplete
                ? "Training Pending"
                : "Setup Incomplete"}
            </p>
            <p className="font-medium opacity-70">
              {canGoOnline
                ? "All onboarding requirements are complete. Use Go Online when ready."
                : onboardingPrerequisitesComplete && !trainingComplete
                ? "All prerequisites are complete. Continue to training to unlock Go Online."
                : `Complete ${blockerCount} required step${blockerCount === 1 ? "" : "s"} to unlock shifts.`}
            </p>
          </div>
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
              Upload National IDs or Passports, plus Driving Permits, for verification.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <DocRow
              icon={IdCard}
              title="Driving Permit"
              description={getDocumentDescription("license")}
              statusLabel={getDocumentStatusLabel("license")}
              onClick={() =>
                navigate(
                  documentsComplete
                    ? "/driver/onboarding/profile/documents/verified"
                    : "/driver/onboarding/profile/documents/upload?focus=license"
                )
              }
            />
            <DocRow
              icon={CreditCard}
              title="National ID or Passport"
              description={getDocumentDescription("id")}
              statusLabel={getDocumentStatusLabel("id")}
              onClick={() =>
                navigate(
                  documentsComplete
                    ? "/driver/onboarding/profile/documents/verified"
                    : "/driver/onboarding/profile/documents/upload?focus=id"
                )
              }
            />
            <DocRow
              icon={FileBadge2}
              title="Conduct Cert"
              description={getDocumentDescription("police")}
              statusLabel={getDocumentStatusLabel("police")}
              onClick={() =>
                navigate(
                  documentsComplete
                    ? "/driver/onboarding/profile/documents/verified"
                    : "/driver/onboarding/profile/documents/upload?focus=police"
                )
              }
            />
          </div>
        </section>

        {/* Info Breakdowns */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setIsInfoBreakdownsOpen((prev) => !prev)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between text-left hover:border-orange-300 transition-colors"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
              Info Breakdowns
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              {isInfoBreakdownsOpen ? "Hide" : "Show"} · {presentInfoItems.length} Present · {missingInfoItems.length} Missing
            </span>
          </button>

          {isInfoBreakdownsOpen && (
            <>
              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-700">
                    Present
                  </h4>
                </div>
                {presentInfoItems.length === 0 ? (
                  <p className="text-[11px] font-medium text-emerald-800">No completed information yet.</p>
                ) : (
                  <div className="space-y-2">
                    {presentInfoItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.route)}
                        className="w-full rounded-2xl border border-emerald-100 bg-white/80 px-3 py-2 text-left hover:border-emerald-300 transition-colors"
                      >
                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{item.label}</p>
                        <p className="text-[11px] font-medium text-slate-600">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-4 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-700">
                  Missing
                </h4>
                {missingInfoItems.length === 0 ? (
                  <p className="text-[11px] font-medium text-amber-900">
                    No missing information. You are all set.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {missingInfoItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.route)}
                        className="w-full rounded-2xl border border-amber-100 bg-white/80 px-3 py-2 text-left hover:border-amber-300 transition-colors"
                      >
                        <p className="text-[11px] font-black uppercase tracking-tight text-slate-900">{item.label}</p>
                        <p className="text-[11px] font-medium text-slate-600">{item.detail}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {isSocialEditorOpen && (
          <section className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/70 px-3 py-3 sm:items-center sm:px-4">
            <div className="max-h-[85vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    Social Variables Table
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">
                    Add username and URL for each account.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSocialEditorOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-slate-600 sm:w-auto"
                >
                  Close
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200">
                <div className="hidden overflow-x-auto sm:block">
                  <table className="min-w-[720px] w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Platform</th>
                        <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Username</th>
                        <th className="px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Profile URL</th>
                        <th className="px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socialLinks.map((entry) => (
                        <tr key={entry.id} className="border-t border-slate-100">
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={entry.platform}
                              onChange={(event) =>
                                updateSocialLink(entry.id, "platform", event.target.value)
                              }
                              placeholder="e.g. Instagram"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={entry.username}
                              onChange={(event) =>
                                updateSocialLink(entry.id, "username", event.target.value)
                              }
                              placeholder="@yourname"
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="url"
                              value={entry.url}
                              onChange={(event) =>
                                updateSocialLink(entry.id, "url", event.target.value)
                              }
                              placeholder="https://..."
                              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeSocialLink(entry.id)}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 p-3 sm:hidden">
                  {socialLinks.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Row {index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(entry.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>

                      <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Platform
                        </span>
                        <input
                          type="text"
                          value={entry.platform}
                          onChange={(event) =>
                            updateSocialLink(entry.id, "platform", event.target.value)
                          }
                          placeholder="e.g. Instagram"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                        />
                      </label>

                      <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Username
                        </span>
                        <input
                          type="text"
                          value={entry.username}
                          onChange={(event) =>
                            updateSocialLink(entry.id, "username", event.target.value)
                          }
                          placeholder="@yourname"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                        />
                      </label>

                      <label className="block space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                          Profile URL
                        </span>
                        <input
                          type="url"
                          value={entry.url}
                          onChange={(event) =>
                            updateSocialLink(entry.id, "url", event.target.value)
                          }
                          placeholder="https://..."
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-orange-500 focus:outline-none"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-orange-600 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </button>
                <button
                  type="button"
                  onClick={() => setIsSocialEditorOpen(false)}
                  className="w-full rounded-xl bg-orange-500 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-white sm:w-auto"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Main Action Button */}
        <section className="pt-4 pb-12">
          <button
            type="button"
            onClick={() => {
              if (gatewayAction.label === "Complete Required Steps") {
                navigate(gatewayAction.route);
                return;
              }
              if (gatewayAction.label === "Go Online") {
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
                return;
              }
              if (!documentsComplete) {
                alert("Please upload all required documents (Driving Permit, National ID or Passport, and Conduct Cert) before proceeding.");
                return;
              }
              const identityVerified = onboardingCheckpoints.identityVerified;
              if (!identityVerified) {
                alert("Please complete the Identity Check selfie first.");
                return;
              }
              if (!vehicleReady) {
                alert("Please go to the Garage and select your active vehicle before proceeding.");
                return;
              }
              navigate(gatewayAction.route);
            }}
            className={`w-full rounded-2xl py-4 text-sm font-black shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest ${
              gatewayAction.label === "Go Online" || gatewayAction.label === "Continue to Training"
                ? "bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600"
                : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800"
            }`}
          >
            {gatewayAction.label}
          </button>
          <p className="mt-2 text-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
            {gatewayAction.note}
          </p>
        </section>
      </main>
    </div>
  );
}
