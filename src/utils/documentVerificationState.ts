export const DOCUMENT_UPLOAD_STATE_KEY = "driver_document_upload_state";

export type DocumentUploadKey = "id" | "license" | "police";
export type DocumentUploadSide = "front" | "back";
export type DocumentUploadStatus = "Missing" | "Uploaded" | "Rejected";
const DOCUMENT_UPLOAD_KEYS: readonly DocumentUploadKey[] = ["id", "license", "police"];
const DEFAULT_REQUIRED_SIDES: readonly DocumentUploadSide[] = ["front", "back"];

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
  error: string;
}

export interface DocumentUploadEntry {
  front: DocumentUploadCopy;
  back: DocumentUploadCopy;
  emphasise: boolean;
}

export type DocumentUploadState = Record<DocumentUploadKey, DocumentUploadEntry>;

const EMPTY_COPY: DocumentUploadCopy = {
  status: "Missing",
  fileName: "",
  error: "",
};

export const DEFAULT_DOCUMENT_UPLOAD_STATE: DocumentUploadState = {
  id: { front: { ...EMPTY_COPY }, back: { ...EMPTY_COPY }, emphasise: false },
  license: { front: { ...EMPTY_COPY }, back: { ...EMPTY_COPY }, emphasise: true },
  police: { front: { ...EMPTY_COPY }, back: { ...EMPTY_COPY }, emphasise: false },
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
      front: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.id.front },
      back: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.id.back },
      emphasise: DEFAULT_DOCUMENT_UPLOAD_STATE.id.emphasise,
    },
    license: {
      front: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.license.front },
      back: { ...DEFAULT_DOCUMENT_UPLOAD_STATE.license.back },
      emphasise: DEFAULT_DOCUMENT_UPLOAD_STATE.license.emphasise,
    },
    police: {
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
  const error = typeof candidate.error === "string" ? candidate.error : fallback.error;

  return { status, fileName, error };
}

function sanitizeEntry(raw: unknown, fallback: DocumentUploadEntry): DocumentUploadEntry {
  if (!raw || typeof raw !== "object") {
    return {
      front: { ...fallback.front },
      back: { ...fallback.back },
      emphasise: fallback.emphasise,
    };
  }

  const candidate = raw as Partial<DocumentUploadEntry>;

  return {
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
