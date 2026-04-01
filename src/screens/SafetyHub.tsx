import {
  AlertTriangle,
  ChevronRight,
  LifeBuoy,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { SharedContact } from "../data/types";

// EVzone Driver App – SafetyHub
// Redesigned with persistent emergency contact management, edit support, and relationship fields.

function ContactForm({
  contact,
  onSave,
  onCancel,
}: {
  contact?: SharedContact;
  onSave: (contact: Omit<SharedContact, "id" | "createdAt"> | SharedContact) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [relationship, setRelationship] = useState(contact?.relationship || "");
  const [error, setError] = useState("");
  const [isPicking, setIsPicking] = useState(false);

  // EVzone Driver – Part 3: Device contact picker integration.
  // This function attempts to use the native browser Contact Picker API.
  const handlePickContact = async () => {
    if (!("contacts" in navigator && "select" in (navigator as any).contacts)) {
      setError("Contact picker is not supported on this browser/device.");
      return;
    }

    try {
      setIsPicking(true);
      setError("");
      // @ts-ignore - Contact Picker API is relatively new and might not be in standard types yet
      const contacts = await navigator.contacts.select(["name", "tel"], { multiple: false });
      
      if (contacts && contacts.length > 0) {
        const picked = contacts[0];
        if (picked.name && picked.name.length > 0) setName(picked.name[0]);
        if (picked.tel && picked.tel.length > 0) setPhone(picked.tel[0]);
      }
    } catch (err: any) {
      if (err.name === "SecurityError") {
        setError("Permission to access contacts was denied.");
      } else {
        setError("Could not open contact picker. Please enter details manually.");
      }
      console.error("Contact picker error:", err);
    } finally {
      setIsPicking(false);
    }
  };

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !relationship.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 10) {
      setError("Please enter a valid phone number (min 10 digits).");
      return;
    }

    if (contact) {
      onSave({ ...contact, name, phone, relationship });
    } else {
      onSave({ name, phone, relationship });
    }
  };

  return (
    <div className="space-y-4 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {contact ? "Edit Contact" : "Add Contact"}
        </span>
        <button
          onClick={handlePickContact}
          disabled={isPicking}
          className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-active bg-white px-3 py-1.5 rounded-full border border-brand-active/20 shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <Smartphone className="h-3 w-3" />
          <span>{isPicking ? "Opening..." : "Pick from Phonebook"}</span>
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-active transition-all"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+256..."
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-active transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Relationship
          </label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-active transition-all appearance-none"
          >
            <option value="">Select</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Partner">Partner</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</p>}
      <div className="flex space-x-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-full py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white border border-slate-200 active:scale-95 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 rounded-full py-3.5 text-[10px] font-black uppercase tracking-widest text-white bg-brand-active shadow-lg shadow-brand-active/20 active:scale-95 transition-all"
        >
          {contact ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

function HubTile({
  icon: Icon,
  title,
  subtitle,
  tone = "default",
  onClick = () => {}
}) {
  const bg = tone === "danger" ? "bg-red-50" : "bg-white";
  const border = tone === "danger" ? "border-red-100" : "border-slate-100";
  const iconColor = tone === "danger" ? "text-red-500" : "text-brand-active";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-start space-x-4 p-5 rounded-[2rem] border ${border} ${bg} shadow-sm active:scale-[0.98] transition-all group overflow-hidden relative`}
    >
      <div className={`h-12 w-12 flex items-center justify-center rounded-2xl ${tone === "danger" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-brand-active/10 text-brand-active"} group-hover:scale-110 transition-transform shrink-0`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">{title}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-relaxed">{subtitle}</span>
      </div>
    </button>
  );
}

export default function SafetyHub() {
  const navigate = useNavigate();
  const {
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
    updateEmergencyContact,
  } = useStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddSave = (contact: Omit<SharedContact, "id" | "createdAt">) => {
    addEmergencyContact(contact);
    setIsAdding(false);
  };

  const handleEditSave = (contact: SharedContact) => {
    updateEmergencyContact(contact);
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Safety Hub" 
        subtitle="Driver Protection" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-8">
        {/* Rapid Actions */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Rapid Response</h2>
          <div className="space-y-3">
            <HubTile
              icon={AlertTriangle}
              title="SOS / Emergency Alert"
              subtitle="Instantly notify your trusted contacts and local authorities of your location."
              tone="danger"
              onClick={() => navigate("/driver/safety/emergency/map")}
            />
            <HubTile
              icon={LifeBuoy}
              title="Safety Toolkit"
              subtitle="Access live tracking, trip sharing, and real-time support channels."
              onClick={() => navigate("/driver/safety/toolkit")}
            />
          </div>
        </section>

        {/* Emergency Contacts Management */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted Contacts</h2>
            {!isAdding && emergencyContacts.length < 5 && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-brand-active"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {isAdding && (
              // @ts-ignore - Form handles Add
              <ContactForm
                onSave={handleAddSave}
                onCancel={() => setIsAdding(false)}
              />
            )}

            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="animate-in fade-in slide-in-from-top-2">
                {editingId === contact.id ? (
                  <ContactForm
                    contact={contact}
                    onSave={handleEditSave}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div 
                    onClick={() => setEditingId(contact.id)}
                    className="flex w-full items-center justify-between p-4.5 rounded-[1.8rem] bg-white border border-slate-100 shadow-sm cursor-pointer hover:border-brand-active/30 active:scale-[0.99] transition-all"
                  >
                    {/* EVzone Driver – Part 4: Clicking the contact card now opens it for update. */}
                    <div className="flex items-center space-x-4">
                      <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-slate-50 text-brand-active border border-slate-100 uppercase font-black text-sm">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                          {contact.name}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {contact.relationship} · {contact.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="p-2.5 text-slate-300 group-hover:text-brand-active transition-colors">
                        <Plus className="h-4 w-4 rotate-45" /> 
                      </div>
                      <button
                        onClick={(e) => {
                          // EVzone Driver – Part 5: Delete contact logic.
                          e.stopPropagation(); // Prevent opening edit mode
                          removeEmergencyContact(contact.id);
                        }}
                        className="p-2.5 text-slate-300 hover:text-red-500 transition-colors active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {emergencyContacts.length === 0 && !isAdding && (
              <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <ShieldCheck className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Protect your journey.<br/>Add up to 5 trusted contacts.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Policy & Training Links */}
        <section className="space-y-4 pb-6">
           <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Knowledge Base</h2>
           <button
             onClick={() => navigate("/driver/safety/hub/expanded")}
             className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-slate-900 text-white active:scale-[0.98] transition-all group overflow-hidden relative shadow-2xl"
           >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-active/10 rounded-full -mr-12 -mt-12" />
              <div className="flex items-center space-x-4 relative">
                 <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 group-hover:bg-brand-active transition-colors">
                    <ShieldCheck className="h-5.5 w-5.5 text-brand-active group-hover:text-white transition-colors" />
                 </div>
                 <div className="flex flex-col items-start translate-y-0.5">
                    <span className="text-xs font-black uppercase tracking-widest">Safety Guidelines</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Policy, Training & Ethics</span>
                 </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-600 relative" />
           </button>
        </section>
      </main>
    </div>
  );
}
