import type { VehicleDocuments } from "../data/types";

const INSURANCE_KEYS = ["insurance", "vehicle_insurance", "proof_of_insurance"] as const;
const INSPECTION_KEYS = ["inspection", "vehicle_inspection"] as const;
const LOGBOOK_KEYS = ["logbook", "vehicle_logbook", "ownership"] as const;
const REGISTRATION_KEYS = ["registration", "road_license", "vehicle_registration"] as const;

type BackendVehicleDocuments = Record<string, unknown> | null | undefined;

function readEntry(
  documents: BackendVehicleDocuments,
  keys: readonly string[],
): VehicleDocuments["insurance"] | undefined {
  if (!documents || typeof documents !== "object" || Array.isArray(documents)) {
    return undefined;
  }

  for (const key of keys) {
    const raw = documents[key];
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      continue;
    }
    const entry = raw as Record<string, unknown>;
    const fileUrl = typeof entry.fileUrl === "string" ? entry.fileUrl.trim() : "";
    const expiryDate = typeof entry.expiryDate === "string" ? entry.expiryDate.trim() : "";
    if (!fileUrl) {
      continue;
    }

    const originalFileName =
      typeof entry.originalFileName === "string" ? entry.originalFileName.trim() : "";
    const fileName =
      originalFileName || (typeof entry.fileName === "string" ? entry.fileName.trim() : "") || `${key}-document`;
    return {
      documentType: key,
      expiryDate,
      file: {
        url: fileUrl,
        fileName,
        documentType: key,
        expiryDate,
        fileKey: typeof entry.fileKey === "string" ? entry.fileKey : undefined,
        mimeType: typeof entry.mimeType === "string" ? entry.mimeType : undefined,
        sizeBytes: typeof entry.sizeBytes === "number" ? entry.sizeBytes : undefined,
      },
    };
  }

  return undefined;
}

export function mapBackendVehicleDocuments(
  documents: BackendVehicleDocuments,
): VehicleDocuments {
  return {
    logbook: readEntry(documents, LOGBOOK_KEYS),
    registration: readEntry(documents, REGISTRATION_KEYS),
    insurance: readEntry(documents, INSURANCE_KEYS),
    inspection: readEntry(documents, INSPECTION_KEYS),
  };
}

export const VEHICLE_DOCUMENT_API_TYPES = {
  logbook: "VEHICLE_LOGBOOK",
  registration: "ROAD_LICENSE",
  insurance: "VEHICLE_INSURANCE",
  inspection: "VEHICLE_INSPECTION",
} as const;
