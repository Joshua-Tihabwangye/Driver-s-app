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
} from "../../services/api/driverApi";

type DriverProfileLike = Partial<{
  fullName: string;
  phone: string;
  city: string;
  country: string;
}>;

type DriverPreferencesLike = Partial<{
  areaIds: string[];
  serviceIds: string[];
  requirementIds: string[];
}>;

type UseDriverProfileAndAssetsActionsOptions = {
  setDriverProfile: Dispatch<SetStateAction<any>>;
  setDriverPreferences: Dispatch<SetStateAction<any>>;
  setEmergencyContacts: Dispatch<SetStateAction<SharedContact[]>>;
  setVehicles: Dispatch<SetStateAction<Vehicle[]>>;
  resolveAccessoriesForVehicle: (vehicleType: Vehicle["type"], current?: Vehicle["accessories"]) => Vehicle["accessories"];
};

export function useDriverProfileAndAssetsActions({
  setDriverProfile,
  setDriverPreferences,
  setEmergencyContacts,
  setVehicles,
  resolveAccessoriesForVehicle,
}: UseDriverProfileAndAssetsActionsOptions) {
  const updateDriverProfile = useCallback((patch: DriverProfileLike) => {
    setDriverProfile((prev: any) => ({
      ...prev,
      ...patch,
    }));

    if (shouldUseDriverBackendWrites()) {
      void patchDriverProfile({
        fullName: patch.fullName,
        phone: patch.phone,
        city: patch.city,
        country: patch.country,
      }).catch((error) => {
        console.warn("Driver backend profile update failed.", error);
      });
    }
  }, [setDriverProfile]);

  const updateDriverPreferences = useCallback((patch: DriverPreferencesLike) => {
    setDriverPreferences((prev: any) => ({
      ...prev,
      ...patch,
    }));

    if (shouldUseDriverBackendWrites()) {
      void patchDriverPreferences({
        areaIds: patch.areaIds,
        serviceIds: patch.serviceIds,
        requirementIds: patch.requirementIds,
      }).catch((error) => {
        console.warn("Driver backend preferences update failed.", error);
      });
    }
  }, [setDriverPreferences]);

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
        })
        .catch((error) => {
          console.warn("Driver backend emergency contact create failed.", error);
        });
    }
  }, [setEmergencyContacts]);

  const removeEmergencyContact = useCallback((id: string) => {
    setEmergencyContacts((prev) => prev.filter((c) => c.id !== id));

    if (shouldUseDriverBackendWrites()) {
      void deleteDriverEmergencyContact(id).catch((error) => {
        console.warn("Driver backend emergency contact delete failed.", error);
      });
    }
  }, [setEmergencyContacts]);

  const updateEmergencyContact = useCallback((updated: SharedContact) => {
    setEmergencyContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

    if (shouldUseDriverBackendWrites()) {
      void patchDriverEmergencyContact(updated.id, {
        name: updated.name,
        phone: updated.phone,
        relationship: updated.relationship,
      }).catch((error) => {
        console.warn("Driver backend emergency contact update failed.", error);
      });
    }
  }, [setEmergencyContacts]);

  const updateVehicle = useCallback((id: string, patch: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));

    if (shouldUseDriverBackendWrites()) {
      void patchDriverVehicle(id, {
        make: patch.make,
        model: patch.model,
        year: patch.year,
        plate: patch.plate,
        type: patch.type,
        status: patch.status as "active" | "inactive" | "maintenance" | undefined,
        accessories: patch.accessories,
      }).catch((error) => {
        console.warn("Driver backend vehicle update failed.", error);
      });
    }
  }, [setVehicles]);

  const addVehicle = useCallback((vehicle: Vehicle) => {
    const accessories = resolveAccessoriesForVehicle(vehicle.type, vehicle.accessories);
    setVehicles((prev) => [...prev, { ...vehicle, accessories }]);

    if (shouldUseDriverBackendWrites()) {
      void createDriverVehicle({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        type: vehicle.type,
        status: vehicle.status as "active" | "inactive" | "maintenance" | undefined,
        accessories,
      }).catch((error) => {
        console.warn("Driver backend vehicle create failed.", error);
      });
    }
  }, [resolveAccessoriesForVehicle, setVehicles]);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));

    if (shouldUseDriverBackendWrites()) {
      void deleteDriverVehicle(id).catch((error) => {
        console.warn("Driver backend vehicle delete failed.", error);
      });
    }
  }, [setVehicles]);

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
