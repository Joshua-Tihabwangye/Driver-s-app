import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation, Clock, ShieldCheck, Users, Activity } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function SharedRideDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === tripId) || trips.find(t => t.jobType === "shared") || trips[0];

  if (!trip) return null;

  // Mocking deep shared calculations for presentation based on the trip's top-level data
  const originalFare = 15.40;
  const recalculatedTotal = typeof trip.amount === 'number' ? trip.amount : 28.50;
  const addedRevenue = recalculatedTotal - originalFare;
  const matchPercentage = Math.round((addedRevenue / originalFare) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Shared Ride Details" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        
        {/* Recalculation Hero */}
        <section className="bg-orange-500 rounded-[2rem] p-6 shadow-xl shadow-orange-500/20 text-white flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
           <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur z-10">Shared Co-Ride</span>
           <div className="flex items-center space-x-3 z-10 pt-2">
             <span className="text-xl font-bold line-through opacity-60">${originalFare.toFixed(2)}</span>
             <span className="text-5xl font-black">${recalculatedTotal.toFixed(2)}</span>
           </div>
           <span className="text-xs font-bold uppercase tracking-widest z-10 text-orange-100 mt-1">
             +{matchPercentage}% Match Bonus
           </span>
        </section>

        {/* Global Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Users className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-lg font-black text-slate-900">3</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Total Pax</span>
          </div>
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Navigation className="h-5 w-5 text-emerald-500 mb-1" />
            <span className="text-lg font-black text-slate-900">14.2</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Total KM</span>
          </div>
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Clock className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-lg font-black text-slate-900">42m</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Duration</span>
          </div>
        </section>

        {/* Passenger Manifest & Route Impact */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
           <div className="flex justify-between items-center">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Passenger & Stopovers</h3>
             <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">Optimized</span>
           </div>

           <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200" />
              
              {/* Stop 1 */}
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pickup 1 (Original)</span>
                <span className="text-sm font-black text-slate-900">Acacia Mall</span>
                <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-2">
                   <span>Passenger: Sarah K. (1 Seat)</span>
                </div>
              </div>

              {/* Stop 2 */}
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">Pickup 2 (Matched)</span>
                <span className="text-sm font-black text-slate-900">Kololo Airstrip</span>
                <div className="flex items-center text-[10px] font-bold text-slate-400 space-x-2">
                   <span>Passenger: Mike T. (2 Seats)</span>
                   <span className="text-orange-500 bg-orange-50 px-1.5 rounded">+$13.10 added</span>
                </div>
              </div>

              {/* Stop 3 */}
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 border-2 border-slate-300 bg-white rounded-full ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Drop-off 1 (Sarah K.)</span>
                <span className="text-sm font-black text-slate-900">Ntinda Complex</span>
              </div>

              {/* Stop 4 */}
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-red-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">Final Drop-off (Mike T.)</span>
                <span className="text-sm font-black text-slate-900">Naalya</span>
              </div>
           </div>
        </section>

        {/* Fare Narrative */}
        <section className="bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-800 space-y-4 text-white">
           <div className="flex items-center space-x-2">
             <Activity className="h-4 w-4 text-emerald-400" />
             <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Earnings Detail</h3>
           </div>
           <p className="text-xs font-bold leading-relaxed text-slate-300">
             You originally accepted a ride for <span className="text-white">${originalFare.toFixed(2)}</span>. 
             During the trip, the dispatch system automatically matched you with Mike T., adding 2.4 km to your route but increasing your fare by <span className="text-emerald-400">${addedRevenue.toFixed(2)}</span>.
           </p>
           <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
             <span className="text-sm font-black">Final Payout</span>
             <span className="text-lg font-black text-emerald-400">
               ${recalculatedTotal.toFixed(2)}
             </span>
           </div>
        </section>

        {/* Action: Documentation */}
        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-white text-slate-900 rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-sm border border-slate-200 active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-slate-400" />
          <span className="text-xs font-black uppercase tracking-widest">View Verifications</span>
        </button>

      </main>
    </div>
  );
}
