export const DOCUMENT_UPLOAD_STATE_KEY = "driver_document_upload_state";

export type DocumentUploadKey = "id" | "license" | "police";
export type DocumentUploadStatus = "Missing" | "Uploaded";

export interface DocumentUploadEntry {
  status: DocumentUploadStatus;
  emphasise: boolean;
  fileName: string;
}

export type DocumentUploadState = Record<DocumentUploadKey, DocumentUploadEntry>;

export const DEFAULT_DOCUMENT_UPLOAD_STATE: DocumentUploadState = {
  id: { status: "Missing", emphasise: false, fileName: "" },
  license: { status: "Missing", emphasise: true, fileName: "" },
  police: { status: "Missing", emphasise: false, fileName: "" },
};

function sanitizeEntry(
  raw: unknown,
  fallback: DocumentUploadEntry
): DocumentUploadEntry {
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const candidate = raw as Partial<DocumentUploadEntry>;
  const status =
    candidate.status === "Uploaded" || candidate.status === "Missing"
      ? candidate.status
      : fallback.status;
  const emphasise =
    typeof candidate.emphasise === "boolean"
      ? candidate.emphasise
      : fallback.emphasise;
  const fileName =
    typeof candidate.fileName === "string" ? candidate.fileName : fallback.fileName;

  return { status, emphasise, fileName };
}

export function readStoredDocumentState(): DocumentUploadState {
  if (typeof window === "undefined") {
    return DEFAULT_DOCUMENT_UPLOAD_STATE;
  }

  try {
    const raw = window.localStorage.getItem(DOCUMENT_UPLOAD_STATE_KEY);
    if (!raw) {
      return DEFAULT_DOCUMENT_UPLOAD_STATE;
    }

    const parsed = JSON.parse(raw) as Partial<Record<DocumentUploadKey, unknown>>;
    return {
      id: sanitizeEntry(parsed?.id, DEFAULT_DOCUMENT_UPLOAD_STATE.id),
      license: sanitizeEntry(parsed?.license, DEFAULT_DOCUMENT_UPLOAD_STATE.license),
      police: sanitizeEntry(parsed?.police, DEFAULT_DOCUMENT_UPLOAD_STATE.police),
    };
  } catch {
    return DEFAULT_DOCUMENT_UPLOAD_STATE;
  }
}

export function persistDocumentState(nextState: DocumentUploadState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(DOCUMENT_UPLOAD_STATE_KEY, JSON.stringify(nextState));
}

export function areAllRequiredDocumentsUploaded(
  state: DocumentUploadState
): boolean {
  return Object.values(state).every((doc) => doc.status === "Uploaded");
}

export function getFirstMissingDocumentKey(
  state: DocumentUploadState
): DocumentUploadKey | null {
  if (state.id.status !== "Uploaded") {
    return "id";
  }
  if (state.license.status !== "Uploaded") {
    return "license";
  }
  if (state.police.status !== "Uploaded") {
    return "police";
  }
  return null;
}
