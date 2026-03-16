import {
CheckCircle2,
ChevronLeft,
Mail,
MapPin,
Phone,
Share2,
Users
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D65 Driver – Follow My Ride Screen (v1)
// Screen for selecting contacts who can follow the driver’s live trip.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function ContactRow({ name, detail, channel, selected, onToggle }) {
  const Icon = channel === "sms" ? Phone : Mail;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-between rounded-2xl border-2 px-3 py-2.5 text-[11px] shadow-sm active:scale-[0.98] transition-transform w-full ${selected
          ? "border-orange-500 bg-orange-50 text-slate-900"
          : "border-orange-500/5 bg-cream text-slate-700 hover:border-orange-500/20"
        }`}
    >
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-orange-500 shadow-sm border border-orange-50">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col items-start truncate overflow-hidden">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[160px]">
            {name}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
            {detail}
          </span>
        </div>
      </div>
      {selected && (
        <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
      )}
    </button>
  );
}

export default function FollowMyRideScreen() {
  const [selectedIds, setSelectedIds] = useState(["c1"]);
  const navigate = useNavigate();


  const contacts = [
    { id: "c1", name: "Sarah (sister)", detail: "+256 700 000 111", channel: "sms" },
    { id: "c2", name: "Michael (friend)", detail: "michael@example.com", channel: "email" },
    { id: "c3", name: "Home contact", detail: "+256 700 000 222", channel: "sms" },
  ];

  const toggleContact = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="flex flex-col h-full ">
      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400">Support</span>
               <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Safety Features</p>
            </div>
          </div>
          <div className="w-9" />
        </header>
      </div>

      {/* Content Area */}
      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-8">

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Contact</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Trip Sharing</h2>
          </div>
</div>

        {/* Intro card */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-4 text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#03cd8c] text-white shadow-lg shadow-emerald-500/20">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/80">Live Now</span>
                <p className="text-sm font-black uppercase tracking-tight">Trip Tracking</p>
              </div>
            </div>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
            Sharing a secure link for this trip only. Contacts can see your location and status until the trip is completed.
          </p>
        </section>

        {/* Contacts list */}
        <section className="space-y-4">
          <div className="flex items-center justify-between ml-1">
             <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Select Trusted Contacts</h2>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{selectedIds.length} Selected</span>
          </div>
          <div className="space-y-3">
            {contacts.map((c) => (
              <ContactRow
                key={c.id}
                name={c.name}
                detail={c.detail}
                channel={c.channel}
                selected={selectedIds.includes(c.id)}
                onToggle={() => toggleContact(c.id)}
              />
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="rounded-[2rem] border-2 border-orange-500/10 bg-cream p-6 flex items-start space-x-4 shadow-sm hover:border-orange-500/30 transition-all">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 flex-shrink-0 shadow-sm">
             <CheckCircle2 className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-[11px] text-slate-900 uppercase tracking-tight mb-1">Secure Sharing</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">Contacts receive a link via SMS/Email. They cannot control your trip.</p>
          </div>
        </section>

        {/* Actions */}
        <div className="pb-8">
          <button
            type="button"
            disabled={!hasSelection}
            onClick={() => navigate("/driver/safety/share-my-ride")}
            className={`w-full rounded-full py-5 text-[13px] font-black uppercase tracking-[0.2em] flex items-center justify-center shadow-2xl transition-all active:scale-95 ${hasSelection
                ? "bg-orange-500 text-white shadow-orange-500/30"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
          >
            <Share2 className="h-5 w-5 mr-3" />
            {hasSelection ? "Start Sharing" : "Select Contact First"}
          </button>
        </div>
      </main>
    </div>
  );
}
