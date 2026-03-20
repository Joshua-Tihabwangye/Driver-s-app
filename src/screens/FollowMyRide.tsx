import {
  CheckCircle2,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  Share2,
  Users,
  Plus,
  ArrowRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useJobs } from "../context/JobsContext";

function ContactRow({ contact, selected, onToggle }: any) {
  const { name, phone, email, relationship } = contact;
  const channel = email ? "email" : "sms";
  const detail = email || phone;
  const Icon = channel === "sms" ? Phone : Mail;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-between rounded-2xl border-2 px-3 py-3 text-[11px] shadow-sm active:scale-[0.98] transition-all w-full ${selected
          ? "border-emerald-500 bg-emerald-50 text-slate-900"
          : "border-slate-100 bg-white text-slate-700 hover:border-emerald-500/20"
        }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm border ${selected ? "bg-emerald-500 text-white border-emerald-400" : "bg-orange-50 text-orange-500 border-orange-100"}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="flex flex-col items-start truncate overflow-hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900 truncate">
              {name}
            </span>
            {relationship && (
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-black uppercase tracking-widest">{relationship}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate">
            {detail}
          </span>
        </div>
      </div>
      {selected ? (
        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </div>
      ) : (
        <div className="h-5 w-5 rounded-full border-2 border-slate-100" />
      )}
    </button>
  );
}

export default function FollowMyRide() {
  const { rideId } = useParams();
  const { allJobs } = useJobs();
  const navigate = useNavigate();
  
  const ride = useMemo(() => allJobs.find(j => j.id === rideId), [allJobs, rideId]);
  const contacts = ride?.sharedContacts || [];
  
  const [selectedIds, setSelectedIds] = useState<string[]>(contacts.map(c => c.id));

  const toggleContact = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasSelection = selectedIds.length > 0;

  if (!ride) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Follow Ride" onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-slate-500 font-medium">Ride not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader 
        title="Trusted Tracking" 
        subtitle="Safety · Real-time" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-20 overflow-y-auto scrollbar-hide space-y-8">
        {/* Ride Context Card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
                <Users className="h-24 w-24 text-emerald-500" />
            </div>
            
            <div className="flex items-center space-x-4 text-left relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-300">Live Status</span>
                <p className="text-sm font-bold truncate max-w-[180px]">{ride.from} → {ride.to}</p>
              </div>
            </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed relative z-10">
            Selected contacts will receive a secure link to follow your progress in real-time. Link expires once you arrive.
          </p>
        </section>

        {/* Contacts list */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <div className="flex flex-col">
                <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Trusted Team</h2>
                <p className="text-[11px] text-slate-400 font-medium">{contacts.length} registered contacts</p>
             </div>
             <button
               onClick={() => navigate(`/driver/safety/share-my-ride/${rideId}/add-contact`)}
               className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
             >
               <Plus className="h-5 w-5" />
             </button>
          </div>
          
          <div className="space-y-3">
            {contacts.map((c) => (
              <ContactRow
                key={c.id}
                contact={c}
                selected={selectedIds.includes(c.id)}
                onToggle={() => toggleContact(c.id)}
              />
            ))}
            
            {contacts.length === 0 && (
              <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50 space-y-3">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest text-center px-6">
                  No contacts registered for this trip yet.
                </p>
                <button
                   onClick={() => navigate(`/driver/safety/share-my-ride/${rideId}/add-contact`)}
                   className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100"
                >
                    Add Person
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 pb-4">
            <button
                type="button"
                disabled={!hasSelection}
                onClick={() => navigate(`/driver/safety/share-my-ride/${rideId}`)}
                className={`w-full rounded-full py-5 text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center shadow-lg transition-all active:scale-95 ${hasSelection
                    ? "bg-orange-500 text-white shadow-orange-500/30 hover:bg-emerald-500 hover:shadow-emerald-500/30 font-black"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
            >
                <Share2 className="h-5 w-5 mr-3" />
                {hasSelection ? "Proceed to Share" : "Select Contact to proceed"}
            </button>
        </div>
      </main>
    </div>
  );
}
