import { useCallback, type Dispatch, type SetStateAction } from "react";
import type { SharedContact, Vehicle } from "../../data/types";
import {
  createDriverEmergencyContact,
  createDriverVehicle,
  deleteDriverEmergencyContact,
  deleteDriverVehicle,
  patchDriverPreferences,
  patchDriverProfile,
  patchDriverVehicle,
  shouldUseDriverBackendWrites,
  updateDriverEmergencyContact as patchDriverEmergencyContact,
  uploadDriverVehicleDocument,
  uploadFile,
} from "../../services/api/driverApi";
import { VEHICLE_DOCUMENT_API_TYPES } from "../../utils/mapBackendVehicleDocuments";

type DriverProfileLike = Partial<{
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  dob: string;
  streetAddress: string;
  district: string;
  postalCode: string;
  landmark: string;
  memberSinceYear: number;
}>;

type DriverPreferencesLike = Partial<{
  areaIds: string[];
  serviceIds: string[];
  requirementIds: string[];
}>;

const VEHICLE_DOCUMENT_KEYS = ["insurance", "inspection"] as const;

type UseDriverProfileAndAssetsActionsOptions = {
  setDriverProfile: Dispatch<SetStateAction<any>>;
  setDriverPreferences: Dispatch<SetStateAction<any>>;
  setEmergencyContacts: Dispatch<SetStateAction<SharedContact[]>>;
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
  resolveAccessoriesForVehicle: (vehicleType: Vehicle["type"], current?: Vehicle["accessories"]) => Vehicle["accessories"];
  refreshBackendOnboardingState: () => Promise<void>;
};

export function useDriverProfileAndAssetsActions({
  setDriverProfile,
  setDriverPreferences,
  setEmergencyContacts,
  setVehicles,
  resolveAccessoriesForVehicle,
  refreshBackendOnboardingState,
}: UseDriverProfileAndAssetsActionsOptions) {
  const updateDriverProfile = useCallback(async (patch: DriverProfileLike) => {
    let previousProfile: any;
    setDriverProfile((prev: any) => {
      previousProfile = prev;
      return {
        ...prev,
        ...patch,
      };
    });

    if (shouldUseDriverBackendWrites()) {
      try {
        await patchDriverProfile({
          fullName: patch.fullName,
          phone: patch.phone,
          city: patch.city,
          country: patch.country,
          dateOfBirth: patch.dob,
          streetAddress: patch.streetAddress,
          district: patch.district,
          postalCode: patch.postalCode,
          landmark: patch.landmark,
        });
        await refreshBackendOnboardingState();
      } catch (error) {
        setDriverProfile(previousProfile);
        console.warn("Driver backend profile update failed.", error);
        return false;
      }
    }

    return true;
  }, [refreshBackendOnboardingState, setDriverProfile]);

  const updateDriverPreferences = useCallback(async (patch: DriverPreferencesLike) => {
    let previousPreferences: any;
    setDriverPreferences((prev: any) => {
      previousPreferences = prev;
      return {
        ...prev,
        ...patch,
      };
    });

    if (shouldUseDriverBackendWrites()) {
      try {
        await patchDriverPreferences({
          areaIds: patch.areaIds,
          serviceIds: patch.serviceIds,
          requirementIds: patch.requirementIds,
        });
        await refreshBackendOnboardingState();
      } catch (error) {
        setDriverPreferences(previousPreferences);
        console.warn("Driver backend preferences update failed.", error);
        return false;
      }
    }

    return true;
  }, [refreshBackendOnboardingState, setDriverPreferences]);

  const persistVehicleDocuments = useCallback(async (vehicleId: string, vehicleDocs?: Vehicle["vehicleDocs"]) => {
    if (!vehicleDocs) {
      return;
    }

    for (const docKey of VEHICLE_DOCUMENT_KEYS) {
      const group = vehicleDocs[docKey];
      const file = group?.file?.rawFile as File | undefined;
      const expiryDate = group?.expiryDate || group?.file?.expiryDate || "";
      if (!expiryDate) {
        continue;
      }

      let uploadedUrl = group?.file?.url?.trim() || "";
      let uploadedKey = group?.file?.fileKey;
      let mimeType = group?.file?.mimeType;
      let sizeBytes = group?.file?.sizeBytes;
      const originalFileName = group?.file?.fileName || file?.name;

      if (file && (!uploadedUrl || uploadedUrl.startsWith("data:") || uploadedUrl.startsWith("local://"))) {
        const uploadResult = await uploadFile(file, "document");
        if (!uploadResult) {
          throw new Error(`Vehicle ${docKey} upload failed.`);
        }
        uploadedUrl = uploadResult.fileUrl;
        uploadedKey = uploadResult.fileKey;
        mimeType = uploadResult.mimeType;
        sizeBytes = uploadResult.sizeBytes;
      }

      if (!uploadedUrl || uploadedUrl.startsWith("local://") || uploadedUrl.startsWith("data:")) {
        throw new Error(`Vehicle ${docKey} file was not uploaded.`);
      }

      await uploadDriverVehicleDocument(vehicleId, {
        documentType: VEHICLE_DOCUMENT_API_TYPES[docKey],
        fileUrl: uploadedUrl,
        fileKey: uploadedKey,
        originalFileName,
        mimeType,
        sizeBytes,
        expiryDate,
      });
    }
  }, []);

  const addEmergencyContact = useCallback((contact: Omit<SharedContact, "id" | "createdAt">) => {
    const tempId = `ec-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const createdAt = Date.now();

    setEmergencyContacts((prev) => [
      ...prev,
      {
        ...contact,
        id: tempId,
        createdAt,
      },
    ]);

    if (shouldUseDriverBackendWrites()) {
      void createDriverEmergencyContact({
        name: contact.name,
        phone: contact.phone,
        relationship: contact.relationship,
      })
        .then((backendContact) => {
          if (!backendContact) return;
          setEmergencyContacts((prev) =>
            prev.map((entry) =>
              entry.id === tempId
                ? {
                    ...entry,
                    id: backendContact.id,
                    name: backendContact.name,
                    phone: backendContact.phone,
                    relationship: backendContact.relationship,
                  }
                : entry,
            ),
          );
          return refreshBackendOnboardingState();
        })
        .catch((error) => {
          console.warn("Driver backend emergency contact create failed.", error);
        });
    }
  }, [refreshBackendOnboardingState, setEmergencyContacts]);

  const removeEmergencyContact = useCallback((id: string) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));

    if (shouldUseDriverBackendWrites()) {
      void deleteDriverEmergencyContact(id)
        .then(() => refreshBackendOnboardingState())
        .catch((error) => {
          console.warn("Driver backend emergency contact delete failed.", error);
        });
    }
  }, [refreshBackendOnboardingState, setEmergencyContacts]);

  const updateEmergencyContact = useCallback((updated: SharedContact) => {
    setEmergencyContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

    if (shouldUseDriverBackendWrites()) {
      void patchDriverEmergencyContact(updated.id, {
        name: updated.name,
        phone: updated.phone,
        relationship: updated.relationship,
      })
        .then(() => refreshBackendOnboardingState())
        .catch((error) => {
          console.warn("Driver backend emergency contact update failed.", error);
        });
    }
  }, [refreshBackendOnboardingState, setEmergencyContacts]);

  const updateVehicle = useCallback(async (id: string, patch: Partial<Vehicle>) => {
    let previousVehicles: Vehicle[] = [];
    setVehicles((prev) => {
      previousVehicles = prev;
      return prev.map((v) => (v.id === id ? { ...v, ...patch } : v));
    });

    if (shouldUseDriverBackendWrites()) {
      try {
        await patchDriverVehicle(id, {
          make: patch.make,
          model: patch.model,
          year: patch.year,
          plate: patch.plate,
          type: patch.type,
          status: patch.status as "active" | "inactive" | "maintenance" | undefined,
          accessories: patch.accessories,
          imageKey: patch.imageKey,
          imageUrl: patch.imageUrl,
          batterySize: patch.batterySize,
          color: patch.color,
          range: patch.range,
          isActive: patch.isActive,
        });
        await persistVehicleDocuments(id, patch.vehicleDocs);
        await refreshBackendOnboardingState();
      } catch (error) {
        setVehicles(previousVehicles);
        console.warn("Driver backend vehicle update failed.", error);
        return false;
      }
    }

    return true;
  }, [persistVehicleDocuments, refreshBackendOnboardingState, setVehicles]);

  const addVehicle = useCallback(async (vehicle: Vehicle) => {
    const accessories = resolveAccessoriesForVehicle(vehicle.type, vehicle.accessories);
    let previousVehicles: Vehicle[] = [];
    setVehicles((prev) => {
      previousVehicles = prev;
      return [...prev, { ...vehicle, accessories }];
    });

    if (shouldUseDriverBackendWrites()) {
      let createdVehicleId: string | null = null;
      try {
        const created = await createDriverVehicle({
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          type: vehicle.type,
          status: vehicle.status as "active" | "inactive" | "maintenance" | undefined,
          accessories,
          imageKey: vehicle.imageKey,
          imageUrl: vehicle.imageUrl,
          batterySize: vehicle.batterySize,
          color: vehicle.color,
          range: vehicle.range,
          isActive: vehicle.isActive,
        });
        if (!created?.id) {
          throw new Error("Vehicle was not saved to the backend.");
        }
        createdVehicleId = created.id;
        await persistVehicleDocuments(created.id, vehicle.vehicleDocs);
        await refreshBackendOnboardingState();
      } catch (error) {
        if (createdVehicleId) {
          await deleteDriverVehicle(createdVehicleId).catch(() => undefined);
        }
        setVehicles(previousVehicles);
        console.warn("Driver backend vehicle create failed.", error);
        return false;
      }
    }

    return true;
  }, [persistVehicleDocuments, refreshBackendOnboardingState, resolveAccessoriesForVehicle, setVehicles]);

  const deleteVehicle = useCallback(async (id: string) => {
    let previousVehicles: Vehicle[] = [];
    setVehicles((prev) => {
      previousVehicles = prev;
      return prev.filter((v) => v.id !== id);
    });

    if (shouldUseDriverBackendWrites()) {
      try {
        await deleteDriverVehicle(id);
        await refreshBackendOnboardingState();
      } catch (error) {
        setVehicles(previousVehicles);
        console.warn("Driver backend vehicle delete failed.", error);
        return false;
      }
    }

    return true;
  }, [refreshBackendOnboardingState, setVehicles]);

  return {
    updateDriverProfile,
    updateDriverPreferences,
    addEmergencyContact,
    removeEmergencyContact,
    updateEmergencyContact,
    updateVehicle,
    addVehicle,
    deleteVehicle,
  };
}
