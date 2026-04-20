export const DOCUMENT_UPLOAD_STATE_KEY = "driver_document_upload_state";

export type DocumentUploadKey = "id" | "license" | "police";
export type DocumentUploadSide = "front" | "back";
export type DocumentUploadStatus = "Missing" | "Uploaded" | "Rejected";
export type DocumentExpiryStatus = "missing" | "valid" | "expiring_soon" | "expired";
const DOCUMENT_UPLOAD_KEYS: readonly DocumentUploadKey[] = ["id", "license", "police"];
const DEFAULT_REQUIRED_SIDES: readonly DocumentUploadSide[] = ["front", "back"];
const DAY_MS = 24 * 60 * 60 * 1000;

export const DOCUMENT_REQUIRED_SIDES: Readonly<
  Record<DocumentUploadKey, readonly DocumentUploadSide[]>
> = {
  id: ["front", "back"],
  license: ["front", "back"],
  police: ["front"],
};

export interface DocumentUploadCopy {
  status: DocumentUploadStatus;
  fileName: string;
  fileUrl: string;
  error: string;
}

export interface DocumentUploadEntry {
  documentType: DocumentUploadKey;
  expiryDate: string;
  front: DocumentUploadCopy;
  back: DocumentUploadCopy;
  emphasise: boolean;
}

export type DocumentUploadState = Record<DocumentUploadKey, DocumentUploadEntry>;

const EMPTY_COPY: DocumentUploadCopy = {
  status: "Missing",
  fileName: "",
  fileUrl: "",
  error: "",
};

export const DEFAULT_DOCUMENT_UPLOAD_STATE: DocumentUploadState = {
  id: {
    documentType: "id",
    expiryDate: "",
    front: { ...EMPTY_COPY },
    back: { ...EMPTY_COPY },
    emphasise: false,
  },
  license: {
    documentType: "license",
    expiryDate: "",
    front: { ...EMPTY_COPY },
    back: { ...EMPTY_COPY },
    emphasise: true,
  },
  police: {
    documentType: "police",
    expiryDate: "",
    front: { ...EMPTY_COPY },
    back: { ...EMPTY_COPY },
    emphasise: false,
  },
};

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".gif",
  ".tif",
  ".tiff",
];

function cloneDefaultState(): DocumentUploadState {
  return {
    id: {
      documentType: DEFAULT_DOCUMENT_UPLOAD_STATE.id.documentType,
      expiryDate: DEFAULT_DOCUMENT_UPLOAD_STATE.id.expiryDate,
      front: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.id.front },
      back: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.id.back },
      emphasise: DEFAULT_DOCUMENT_UPLOAD_STATE.id.emphasise,
    },
    license: {
      documentType: DEFAULT_DOCUMENT_UPLOAD_STATE.license.documentType,
      expiryDate: DEFAULT_DOCUMENT_UPLOAD_STATE.license.expiryDate,
      front: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.license.front },
      back: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.license.back },
      emphasise: DEFAULT_DOCUMENT_UPLOAD_STATE.license.emphasise,
    },
    police: {
      documentType: DEFAULT_DOCUMENT_UPLOAD_STATE.police.documentType,
      expiryDate: DEFAULT_DOCUMENT_UPLOAD_STATE.police.expiryDate,
      front: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.police.front },
      back: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.police.back },
      emphasise: DEFAULT_DOCUMENT_UPLOAD_STATE.police.emphasise,
    },
  };
}

function sanitizeCopy(raw: unknown, fallback: DocumentUploadCopy): DocumentUploadCopy {
  if (!raw || typeof raw !== "object") {
    return { ...fallback };
  }

  const candidate = raw as Partial<DocumentUploadCopy>;
  const status =
    candidate.status === "Uploaded" ||
    candidate.status === "Missing" ||
    candidate.status === "Rejected"
      ? candidate.status
      : fallback.status;
  const fileName =
    typeof candidate.fileName === "string" ? candidate.fileName : fallback.fileName;
  const fileUrl = typeof candidate.fileUrl === "string" ? candidate.fileUrl : "";
  const error = typeof candidate.error === "string" ? candidate.error : fallback.error;

  return { status, fileName, fileUrl, error };
}

function sanitizeEntry(raw: unknown, fallback: DocumentUploadEntry): DocumentUploadEntry {
  if (!raw || typeof raw !== "object") {
    return {
      documentType: fallback.documentType,
      expiryDate: fallback.expiryDate,
      front: { ...fallback.front },
      back: { ...fallback.back },
      emphasise: fallback.emphasise,
    };
  }

  const candidate = raw as Partial<DocumentUploadEntry>;

  return {
    documentType:
      candidate.documentType === "id" ||
      candidate.documentType === "license" ||
      candidate.documentType === "police"
        ? candidate.documentType
        : fallback.documentType,
    expiryDate:
      typeof candidate.expiryDate === "string" ? candidate.expiryDate : fallback.expiryDate,
    front: sanitizeCopy(candidate.front, fallback.front),
    back: sanitizeCopy(candidate.back, fallback.back),
    emphasise:
      typeof candidate.emphasise === "boolean"
        ? candidate.emphasise
        : fallback.emphasise,
  };
}

export function readStoredDocumentState(): DocumentUploadState {
  if (typeof window === "undefined") {
    return cloneDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(DOCUMENT_UPLOAD_STATE_KEY);
    if (!raw) {
      return cloneDefaultState();
    }

    const parsed = JSON.parse(raw) as Partial<Record<DocumentUploadKey, unknown>>;
    return {
      id: sanitizeEntry(parsed?.id, DEFAULT_DOCUMENT_UPLOAD_STATE.id),
      license: sanitizeEntry(parsed?.license, DEFAULT_DOCUMENT_UPLOAD_STATE.license),
      police: sanitizeEntry(parsed?.police, DEFAULT_DOCUMENT_UPLOAD_STATE.police),
    };
  } catch {
    return cloneDefaultState();
  }
}

export function persistDocumentState(nextState: DocumentUploadState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DOCUMENT_UPLOAD_STATE_KEY, JSON.stringify(nextState));
}

export function resetStoredDocumentState(): DocumentUploadState {
  const nextState = cloneDefaultState();
  persistDocumentState(nextState);
  return nextState;
}

export function isAcceptedDocumentFile(file: File): boolean {
  const mimeType = (file.type || "").toLowerCase();
  if (mimeType.startsWith("image/") || mimeType === "application/pdf") {
    return true;
  }

  const fileName = file.name.toLowerCase();
  return SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

export function createLocalDocumentFileUrl(fileName: string): string {
  const normalized = fileName.trim();
  return normalized ? `local://documents/${encodeURIComponent(normalized)}` : "";
}

function parseExpiryDate(expiryDate: string): Date | null {
  const trimmed = expiryDate.trim();
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return null;
  }

  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function validateDocumentExpiryDate(
  expiryDate: string,
  now: Date = new Date()
): { valid: boolean; error: string } {
  if (!expiryDate.trim()) {
    return { valid: false, error: "Expiry date is required." };
  }

  const parsedExpiry = parseExpiryDate(expiryDate);
  if (!parsedExpiry) {
    return { valid: false, error: "Enter a valid expiry date." };
  }

  const expiryDay = startOfDay(parsedExpiry).getTime();
  const today = startOfDay(now).getTime();
  if (expiryDay <= today) {
    return { valid: false, error: "Expiry date must be in the future." };
  }

  return { valid: true, error: "" };
}

export function getDaysUntilExpiry(expiryDate: string, now: Date = new Date()): number | null {
  const parsedExpiry = parseExpiryDate(expiryDate);
  if (!parsedExpiry) {
    return null;
  }

  const expiryDay = startOfDay(parsedExpiry).getTime();
  const today = startOfDay(now).getTime();
  return Math.ceil((expiryDay - today) / DAY_MS);
}

export function getDocumentExpiryStatus(
  expiryDate: string,
  warningDays = 30,
  now: Date = new Date()
): DocumentExpiryStatus {
  const daysRemaining = getDaysUntilExpiry(expiryDate, now);
  if (daysRemaining === null) {
    return "missing";
  }
  if (daysRemaining < 0) {
    return "expired";
  }
  if (daysRemaining <= warningDays) {
    return "expiring_soon";
  }
  return "valid";
}

export function getExpiryWarningMatches(
  expiryDate: string,
  windows: readonly number[] = [30, 14, 7],
  now: Date = new Date()
): number[] {
  const daysRemaining = getDaysUntilExpiry(expiryDate, now);
  if (daysRemaining === null || daysRemaining < 0) {
    return [];
  }
  return windows.filter((windowDays) => daysRemaining === windowDays);
}

export function isDocumentEntryExpired(
  entry: DocumentUploadEntry,
  now: Date = new Date()
): boolean {
  return getDocumentExpiryStatus(entry.expiryDate, 30, now) === "expired";
}

export function isDocumentEntryExpiringSoon(
  entry: DocumentUploadEntry,
  warningDays = 30,
  now: Date = new Date()
): boolean {
  return getDocumentExpiryStatus(entry.expiryDate, warningDays, now) === "expiring_soon";
}

export function getRequiredDocumentSides(
  key: DocumentUploadKey
): readonly DocumentUploadSide[] {
  return DOCUMENT_REQUIRED_SIDES[key] || DEFAULT_REQUIRED_SIDES;
}

export function isDocumentSideRequired(
  key: DocumentUploadKey,
  side: DocumentUploadSide
): boolean {
  return getRequiredDocumentSides(key).includes(side);
}

export function isDocumentEntryComplete(
  key: DocumentUploadKey,
  entry: DocumentUploadEntry
): boolean {
  return getRequiredDocumentSides(key).every(
    (side) => entry[side].status === "Uploaded"
  );
}

export function isDocumentEntryRejected(
  key: DocumentUploadKey,
  entry: DocumentUploadEntry
): boolean {
  return getRequiredDocumentSides(key).some(
    (side) => entry[side].status === "Rejected"
  );
}

export function areAllRequiredDocumentsUploaded(
  state: DocumentUploadState
): boolean {
  return DOCUMENT_UPLOAD_KEYS.every((key) => isDocumentEntryComplete(key, state[key]));
}

export function areAllRequiredDocumentsCompliant(
  state: DocumentUploadState,
  now: Date = new Date()
): boolean {
  return DOCUMENT_UPLOAD_KEYS.every((key) => {
    const entry = state[key];
    if (!isDocumentEntryComplete(key, entry)) {
      return false;
    }
    return validateDocumentExpiryDate(entry.expiryDate, now).valid;
  });
}

export function getFirstMissingDocumentKey(
  state: DocumentUploadState
): DocumentUploadKey | null {
  for (const key of DOCUMENT_UPLOAD_KEYS) {
    if (!isDocumentEntryComplete(key, state[key])) {
      return key;
    }
  }
  return null;
}

export function getFirstNonCompliantDocumentKey(
  state: DocumentUploadState,
  now: Date = new Date()
): DocumentUploadKey | null {
  for (const key of DOCUMENT_UPLOAD_KEYS) {
    const entry = state[key];
    if (!isDocumentEntryComplete(key, entry)) {
      return key;
    }
    if (!validateDocumentExpiryDate(entry.expiryDate, now).valid) {
      return key;
    }
  }
  return null;
}
