import { AlertCircle, Phone, Plus, Smartphone, Trash2, User, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import type { SharedContact } from "../data/types";

type ContactFormState = {
  name: string;
  relationship: string;
  phone: string;
};

const EMPTY_FORM: ContactFormState = {
  name: "",
  relationship: "",
  phone: "",
};

function toFormState(contact: SharedContact): ContactFormState {
  return {
    name: contact.name || "",
    relationship: contact.relationship || "",
    phone: contact.phone || "",
  };
}

export default function EmergencyContactsManager() {
  const navigate = useNavigate();
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, removeEmergencyContact } =
    useStore();

  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pickerMessage, setPickerMessage] = useState("");
  const [isPicking, setIsPicking] = useState(false);

  const supportsContactPicker = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return (
      window.isSecureContext &&
      "contacts" in navigator &&
      "select" in ((navigator as any).contacts || {})
    );
  }, []);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
  };

  const handleSelectForEdit = (contact: SharedContact) => {
    setEditingId(contact.id);
    setForm(toFormState(contact));
    setError("");
    setPickerMessage("");
  };

  const handlePickFromPhonebook = async () => {
    if (!supportsContactPicker) {
      setPickerMessage("Phonebook access is unavailable here. Enter contact details manually.");
      return;
    }

    try {
      setIsPicking(true);
      setError("");
      setPickerMessage("");

      // Contact Picker API is not yet part of standard TS DOM typings.
      const pickedContacts = await (navigator as any).contacts.select(["name", "tel"], {
        multiple: false,
      });

      if (!Array.isArray(pickedContacts) || pickedContacts.length === 0) {
        return;
      }

      const picked = pickedContacts[0];
      const selectedName = Array.isArray(picked.name) ? picked.name[0] : "";
      const selectedPhone = Array.isArray(picked.tel) ? picked.tel[0] : "";

      setForm((prev) => ({
        ...prev,
        name: selectedName || prev.name,
        phone: selectedPhone || prev.phone,
      }));
      setPickerMessage("Contact selected from phonebook.");
    } catch (pickerError: any) {
      if (pickerError?.name === "SecurityError") {
        setPickerMessage("Contact permission denied. Enter details manually.");
        return;
      }
      if (pickerError?.name === "AbortError") {
        return;
      }
      setPickerMessage("Could not open phonebook. Enter details manually.");
    } finally {
      setIsPicking(false);
    }
  };

  const handleSave = () => {
    const name = form.name.trim();
    const relationship = form.relationship.trim();
    const phone = form.phone.trim();

    if (!name || !relationship || !phone) {
      setError("Name, relationship, and phone number are required.");
      return;
    }

    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 10) {
      setError("Phone number must contain at least 10 digits.");
      return;
    }

    if (editingId) {
      const existing = emergencyContacts.find((contact) => contact.id === editingId);
      if (!existing) {
        setError("Selected contact no longer exists.");
        return;
      }

      updateEmergencyContact({
        ...existing,
        name,
        relationship,
        phone,
      });
    } else {
      addEmergencyContact({
        name,
        relationship,
        phone,
      });
    }

    resetForm();
  };

  return (
    <div className="flex flex-col min-h-full bg-transparent">
      <PageHeader
        title="Emergency Contacts"
        subtitle="Safety Setup"
        onBack={() => navigate(-1)}
      />

      <main className="flex-1 px-6 pt-6 pb-20 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="rounded-3xl border border-orange-200 bg-orange-50/70 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-700">
            Trusted Contacts
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-700 leading-relaxed">
            Add a person we can notify quickly during an emergency. You can pick from phonebook when
            supported, or enter details manually.
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {editingId ? "Edit Contact" : "Add Contact"}
            </p>
            <button
              type="button"
              onClick={handlePickFromPhonebook}
              disabled={isPicking}
              className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-700 disabled:opacity-50"
            >
              <Smartphone className="h-3 w-3" />
              {isPicking ? "Opening..." : "Phonebook"}
            </button>
          </div>

          {pickerMessage ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[10px] font-medium text-blue-700">
              {pickerMessage}
            </div>
          ) : null}

          {!supportsContactPicker ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-medium text-slate-600">
              Phonebook API not supported in this browser/device. Manual entry is available.
            </div>
          ) : null}

          <label className="block space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Aisha Nakato"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Relationship
              </span>
              <input
                type="text"
                value={form.relationship}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, relationship: event.target.value }))
                }
                placeholder="e.g. Sister"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="+256..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-semibold text-slate-900 focus:border-orange-500 focus:outline-none"
              />
            </label>
          </div>

          {error ? (
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </div>
          ) : null}

          <div className="flex gap-3 pt-1">
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-slate-600"
              >
                Cancel Edit
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-full bg-orange-500 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              {editingId ? "Update Contact" : "Save Contact"}
            </button>
          </div>
        </section>

        <section className="space-y-3 pb-10">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Saved Contacts
            </h2>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              {emergencyContacts.length}
            </span>
          </div>

          {emergencyContacts.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-[11px] font-black uppercase tracking-widest text-slate-500">
                No trusted contacts added
              </p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Add at least one contact to complete onboarding.
              </p>
            </div>
          ) : (
            emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between"
              >
                <button
                  type="button"
                  onClick={() => handleSelectForEdit(contact)}
                  className="flex items-center gap-3 text-left"
                >
                  <div className="h-10 w-10 rounded-xl border border-orange-100 bg-orange-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-tight text-slate-900">{contact.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {contact.relationship || "Relationship"}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {contact.phone}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600"
                  aria-label={`Delete ${contact.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}

          {emergencyContacts.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
                setError("");
              }}
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 py-3 text-[10px] font-black uppercase tracking-widest text-orange-700 inline-flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Another Contact
            </button>
          ) : null}
        </section>
      </main>
    </div>
  );
}
