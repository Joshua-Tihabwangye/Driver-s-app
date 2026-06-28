import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { shouldUseDriverBackendWrites } from "../services/api/driverApi";
import type { VehicleDocuments, VehicleDocumentGroup } from "../data/types";

const DB_NAME = "evzone_driver_vehicle_docs_db";
const STORE_NAME = "vehicle_documents";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open vehicle document DB"));
  });
}

async function idbGetItem(name: string): Promise<string | null> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(name);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error("Failed to read vehicle documents"));
  });
}

async function idbSetItem(name: string, value: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.put(value, name);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to write vehicle documents"));
  });
}

async function idbRemoveItem(name: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.delete(name);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Failed to remove vehicle documents"));
  });
}

const idbStorage = createJSONStorage(() => ({
  getItem: async (name: string) => {
    if (shouldUseDriverBackendWrites()) return null;
    return idbGetItem(name);
  },
  setItem: async (name: string, value: string) => {
    if (shouldUseDriverBackendWrites()) return;
    return idbSetItem(name, value);
  },
  removeItem: async (name: string) => {
    if (shouldUseDriverBackendWrites()) return;
    return idbRemoveItem(name);
  },
}));

function sanitizeDocumentGroup(group?: VehicleDocumentGroup): VehicleDocumentGroup | undefined {
  if (!group) return undefined;
  const { file } = group;
  if (!file) return group;
  const { rawFile: _, ...fileWithoutRaw } = file;
  return {
    ...group,
    file: fileWithoutRaw,
  };
}

function sanitizeDocuments(docs: VehicleDocuments): VehicleDocuments {
  const result: VehicleDocuments = {};
  for (const key of Object.keys(docs) as (keyof VehicleDocuments)[]) {
    const sanitized = sanitizeDocumentGroup(docs[key]);
    if (sanitized) {
      result[key] = sanitized;
    }
  }
  return result;
}

interface VehicleDocumentStoreState {
  documentsByVehicle: Record<string, VehicleDocuments>;
}

interface VehicleDocumentStoreActions {
  setDocuments: (vehicleId: string, docs: VehicleDocuments) => void;
  getDocuments: (vehicleId: string) => VehicleDocuments | undefined;
  removeDocuments: (vehicleId: string) => void;
  hasPersistedDocuments: (vehicleId: string) => boolean;
}

export const useVehicleDocumentStore = create<VehicleDocumentStoreState & VehicleDocumentStoreActions>()(
  persist(
    (set, get) => ({
      documentsByVehicle: {},

      setDocuments: (vehicleId, docs) => {
        if (!vehicleId) return;
        const sanitized = sanitizeDocuments(docs);
        set((state) => ({
          documentsByVehicle: {
            ...state.documentsByVehicle,
            [vehicleId]: sanitized,
          },
        }));
      },

      getDocuments: (vehicleId) => {
        return vehicleId ? get().documentsByVehicle[vehicleId] : undefined;
      },

      removeDocuments: (vehicleId) => {
        if (!vehicleId) return;
        set((state) => {
          const next = { ...state.documentsByVehicle };
          delete next[vehicleId];
          return { documentsByVehicle: next };
        });
      },

      hasPersistedDocuments: (vehicleId) => {
        if (!vehicleId) return false;
        const docs = get().documentsByVehicle[vehicleId];
        if (!docs) return false;
        return Object.values(docs).some((group) => Boolean(group?.file?.url));
      },
    }),
    {
      name: "evzone-driver-vehicle-documents",
      storage: idbStorage,
    }
  )
);
