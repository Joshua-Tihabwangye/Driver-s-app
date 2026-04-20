type ContactSelection = {
  name?: string[];
  tel?: string[];
};

type NavigatorWithContacts = Navigator & {
  contacts?: {
    select: (
      properties: string[],
      options?: { multiple?: boolean }
    ) => Promise<ContactSelection[]>;
  };
};

export interface PickedPhonebookContact {
  name: string;
  phone: string;
}

export function canUsePhonebookPicker(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const nav = navigator as NavigatorWithContacts;
  return typeof nav.contacts?.select === "function";
}

export async function pickSinglePhonebookContact(): Promise<PickedPhonebookContact | null> {
  if (!canUsePhonebookPicker()) {
    throw new Error("Phonebook picker is unavailable.");
  }

  const nav = navigator as NavigatorWithContacts;
  const contacts = await nav.contacts!.select(["name", "tel"], {
    multiple: false,
  });
  const picked = contacts?.[0];

  if (!picked) {
    return null;
  }

  const phone = Array.isArray(picked.tel) ? (picked.tel[0] || "").trim() : "";
  const name = Array.isArray(picked.name) ? (picked.name[0] || "").trim() : "";

  if (!name && !phone) {
    return null;
  }

  return { name, phone };
}
