import {
Car,
ChevronLeft,
ClipboardList,
FileText,
MapPin,
Phone,
User
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – D97 Rental Job Overview / On Rental Screen (v1)
// Long-duration rental view for chauffeur / car rental jobs.
// Key elements:
// - Header: Rental job overview + Rental job type pill
// - Rental window: Start 09:00 · End 18:00
// - Status chips: On rental / Waiting at hotel / With client / Returning to base
// - Key details: client name, car, pick-up location, main contact, notes
// - CTAs: "Open navigation to next stop", "End rental" (hook up to D56 in real app)
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.

const STATUSES = ["On rental", "Waiting at hotel", "With client", "Returning to base"];


function StatusChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-[11px] font-medium border active:scale-[0.97] transition-transform ${
        active
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function RentalJobOverviewScreen() {
  const [status, setStatus] = useState("On rental");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Job Overview" 
        subtitle="Driver · Rental" 
        onBack={() => navigate(-1)} 
        rightAction={
          <div className="flex items-center rounded-2xl bg-orange-500/10 px-4 py-1.5 backdrop-blur-md border border-orange-500/20">
             <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
               Rental
             </span>
          </div>
        }
      />

      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        {/* Rental window & status */}
        <section className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">
                 Rental Window
               </span>
               <p className="text-lg font-black text-white">
                 09:00 – 18:00
               </p>
            </div>
            <div className="text-right">
               <p className="text-lg font-black text-white">
                 $64.80
               </p>
               <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                 Est. Earnings
               </span>
            </div>
          </div>

          <div className="space-y-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               Job Status
             </span>
             <div className="flex flex-wrap gap-2">
                {STATUSES.map((label) => (
                  <StatusChip
                    key={label}
                    label={label}
                    active={status === label}
                    onClick={() => setStatus(label)}
                  />
                ))}
             </div>
          </div>
        </section>

        {/* Details list */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest px-2">
            Rental Details
          </h2>
          
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-xl shadow-slate-200/50 space-y-6">
             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Alex M · VIP Guest
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     Primary contact for this rental session.
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Car className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     Toyota Camry · White
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     UAX 123A · Clean & Charged
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-sm font-black text-slate-900 uppercase">
                     City Hotel Entrance
                   </p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">
                     First meeting point for this rental.
                   </p>
                </div>
             </div>

             <div className="flex items-start space-x-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                   <p className="text-sm font-black text-slate-900">
                     +256 700 000 111
                   </p>
                   <button className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-50 text-orange-600">
                      <Phone className="h-4 w-4" />
                   </button>
                </div>
             </div>

             <div className="flex items-start space-x-4 pt-2 border-t border-slate-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-orange-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                   <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic">
                     "Airport + City errands. Client prefers quiet ride and 
                     air-conditioning. Confirm timing for airport drop-off."
                   </p>
                </div>
             </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="space-y-3 pb-8">
          <button
            onClick={() => navigate("/driver/trip/demo-trip/navigation")}
            className="w-full rounded-[2rem] bg-orange-500 px-6 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-100 active:scale-[0.98] transition-all"
          >
            Start Navigation
          </button>
          <button
            onClick={() => navigate("/driver/trip/demo-trip/completed")}
            className="w-full rounded-[2rem] border-2 border-slate-900 bg-white px-6 py-5 text-[11px] font-black uppercase tracking-widest text-slate-900 active:scale-[0.98] transition-all"
          >
            End Rental
          </button>
        </section>
      </main>
    </div>
  );
}
