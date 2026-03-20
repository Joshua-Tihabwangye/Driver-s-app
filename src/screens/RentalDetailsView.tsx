import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Key, User, Clock, ShieldCheck, MapPin, BadgeCheck, FileText } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function RentalDetailsView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === tripId) || { id: "demo", amount: 150.00, date: "Today", pickup: "Depot", dropoff: "Depot", jobType: "rental", duration: "12 Hours" };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Rental Summary" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        
        {/* Header Summary */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16" />
           <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Hourly Rental</span>
           <span className="text-4xl font-black text-slate-900 tracking-tighter">
             ${typeof trip.amount === 'number' ? trip.amount.toFixed(2) : trip.amount}
           </span>
           <span className="flex items-center text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">
             <BadgeCheck className="h-3 w-3 mr-1" /> Completed
           </span>
        </section>

        {/* Customer & Duration */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
               <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Customer</span>
               <span className="text-sm font-black text-slate-900 leading-tight">David W.</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
               <Clock className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Billed For</span>
               <span className="text-sm font-black text-slate-900 leading-tight">12 Hours</span>
            </div>
          </div>
        </section>

        {/* Rental Timeline */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Rental Session</h3>
           <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200" />
              
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Handover (Start)</span>
                <span className="text-sm font-black text-slate-900">{trip.pickup || "Central Depot"}</span>
                <span className="text-[10px] font-bold text-slate-400">08:00 AM • Keys Given</span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-500">Return (End)</span>
                <span className="text-sm font-black text-slate-900">{trip.dropoff || "Central Depot"}</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center">
                  08:00 PM • Inspected & Returned
                </span>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Rate</span>
                 <div className="flex items-center text-slate-900">
                   <Key className="h-3 w-3 mr-1 text-slate-400" />
                   <span className="text-sm font-black">$12.50 / Hr</span>
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</span>
                 <div className="flex items-center text-slate-900">
                   <ShieldCheck className="h-3 w-3 mr-1 text-emerald-500" />
                   <span className="text-sm font-black flex items-center">No Damage</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Allowance & Usage */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Usage Details</h3>
           <div className="bg-slate-50 p-4 rounded-2xl flex flex-col space-y-1 border border-slate-100">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Included Mileage</span>
             <span className="text-sm font-black text-slate-900">150 km (City Limits Only)</span>
           </div>
           <div className="bg-slate-50 p-4 rounded-2xl flex flex-col space-y-1 border border-slate-100">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Actual Covered</span>
             <span className="text-sm font-black text-slate-900">92 km</span>
           </div>
        </section>

        {/* Action: Documentation */}
        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-slate-900 text-white rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <FileText className="h-5 w-5 text-purple-400" />
          <span className="text-xs font-black uppercase tracking-widest">View Agreement & Proof</span>
        </button>

      </main>
    </div>
  );
}
