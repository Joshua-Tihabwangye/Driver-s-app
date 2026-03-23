export const DOCUMENT_UPLOAD_STATE_KEY = "driver_document_upload_state";

export type DocumentUploadKey = "id" | "license" | "police";
export type DocumentUploadSide = "front" | "back";
export type DocumentUploadStatus = "Missing" | "Uploaded" | "Rejected";

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

export function isDocumentEntryComplete(entry: DocumentUploadEntry): boolean {
  return entry.front.status === "Uploaded" && entry.back.status === "Uploaded";
}

export function isDocumentEntryRejected(entry: DocumentUploadEntry): boolean {
  return entry.front.status === "Rejected" || entry.back.status === "Rejected";
}

export function areAllRequiredDocumentsUploaded(
  state: DocumentUploadState
): boolean {
  return Object.values(state).every((doc) => isDocumentEntryComplete(doc));
}

export function getFirstMissingDocumentKey(
  state: DocumentUploadState
): DocumentUploadKey | null {
  if (!isDocumentEntryComplete(state.id)) {
    return "id";
  }
  if (!isDocumentEntryComplete(state.license)) {
    return "license";
  }
  if (!isDocumentEntryComplete(state.police)) {
    return "police";
  }
  return null;
}
