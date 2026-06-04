import type { VehicleDocuments } from "../data/types";

const INSURANCE_KEYS = ["insurance", "vehicle_insurance", "proof_of_insurance"] as const;
const INSPECTION_KEYS = ["inspection", "vehicle_inspection"] as const;

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

    const fileName = fileUrl.split("/").pop() || `${key}-document`;
    return {
      documentType: key,
      expiryDate,
      file: {
        url: fileUrl,
        fileName,
        documentType: key,
        expiryDate,
      },
    };
  }

  return undefined;
}

export function mapBackendVehicleDocuments(
  documents: BackendVehicleDocuments,
): VehicleDocuments {
  return {
    insurance: readEntry(documents, INSURANCE_KEYS),
    inspection: readEntry(documents, INSPECTION_KEYS),
  };
}

export const VEHICLE_DOCUMENT_API_TYPES = {
  insurance: "insurance",
  inspection: "inspection",
} as const;
