import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Clock, ShieldCheck, Map, MapPin, Camera, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

function toAmount(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function TourDetailsView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();
  const trip = useMemo(
    () => trips.find((entry) => entry.id === tripId && entry.jobType === "tour") || null,
    [trips, tripId]
  );

  if (!trip) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Tour Excursion Summary" onBack={() => navigate("/driver/history/rides")} />
        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Tour record not found
            </p>
            <button
              type="button"
              onClick={() => navigate("/driver/history/rides")}
              className="rounded-full bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Back to History
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Tour Excursion Summary" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        
        {/* Header Summary */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16" />
           <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full text-amber-600">Chartered Tour</span>
           <span className="text-4xl font-black text-slate-900 tracking-tighter">
             ${toAmount(trip.amount).toFixed(2)}
           </span>
           <span className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
             <Sparkles className="h-3 w-3 mr-1 text-amber-500" /> Finished
           </span>
        </section>

        {/* Group & Duration */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
               <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Group Name</span>
               <span className="text-sm font-black text-slate-900 leading-tight">Smith Family (4)</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
               <Clock className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Duration</span>
               <span className="text-sm font-black text-slate-900 leading-tight">6 Hours</span>
            </div>
          </div>
        </section>

        {/* Itinerary */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Tour Itinerary</h3>
           <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200" />
              
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pickup</span>
                <span className="text-sm font-black text-slate-900">{trip.from}</span>
                <span className="text-[10px] font-bold text-slate-400">09:00 AM</span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Stop 1</span>
                <span className="text-sm font-black text-slate-900">National Museum</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center">
                  10:30 AM • 90 min stop
                </span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-amber-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">Stop 2</span>
                <span className="text-sm font-black text-slate-900">Craft Village (Lunch)</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center">
                  12:30 PM • 120 min stop
                </span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Return Drop-off</span>
                <span className="text-sm font-black text-slate-900">{trip.to}</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center">
                  03:00 PM • Tour concludes
                </span>
              </div>
           </div>
        </section>

        {/* Special Instructions */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-3">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Guide Notes</h3>
           <p className="text-sm font-bold text-slate-600 leading-relaxed">
             "Family needs space for 2 strollers. Requested A/C to be kept on medium. Prefers scenic route over highway on the return trip."
           </p>
        </section>

        {/* Action: Documentation */}
        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-transform"
        >
          <Camera className="h-5 w-5 text-amber-500" />
          <span className="text-xs font-black uppercase tracking-widest">View Verifications</span>
        </button>

      </main>
    </div>
  );
}
