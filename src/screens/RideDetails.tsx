import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Navigation, Clock, CreditCard, ShieldCheck, User, Calendar } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function RideDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === tripId) || trips[0]; // fallback for demo

  if (!trip) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Ride Summary" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        
        {/* Header Summary */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16" />
           <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Private Ride</span>
           <span className="text-4xl font-black text-slate-900 tracking-tighter">
             ${typeof trip.amount === 'number' ? trip.amount.toFixed(2) : trip.amount}
           </span>
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{trip.status || "Completed"}</span>
        </section>

        {/* Passenger & Time */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
               <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Passenger</span>
               <span className="text-sm font-black text-slate-900">John Doe</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
               <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</span>
               <span className="text-sm font-black text-slate-900">{trip.date || "Today"}</span>
            </div>
          </div>
        </section>

        {/* Route Details */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Route Overview</h3>
           <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200" />
              
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Pickup</span>
                <span className="text-sm font-black text-slate-900">{trip.pickup || "Acacia Mall"}</span>
                <span className="text-[10px] font-bold text-slate-400">14:30 PM</span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-orange-500">Drop-off</span>
                <span className="text-sm font-black text-slate-900">{trip.dropoff || "Entebbe Airport"}</span>
                <span className="text-[10px] font-bold text-slate-400">15:15 PM</span>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Distance</span>
                 <div className="flex items-center text-slate-900">
                   <Navigation className="h-3 w-3 mr-1 text-brand-active" />
                   <span className="text-sm font-black">{trip.distance || "12.5 km"}</span>
                 </div>
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Duration</span>
                 <div className="flex items-center text-slate-900">
                   <Clock className="h-3 w-3 mr-1 text-orange-500" />
                   <span className="text-sm font-black">{trip.duration || "45 min"}</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Fare Breakdown */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Fare Details</h3>
           <div className="flex justify-between items-center text-sm font-bold text-slate-600">
             <span>Base Fare</span>
             <span>$12.50</span>
           </div>
           <div className="flex justify-between items-center text-sm font-bold text-slate-600">
             <span>Distance (12.5 km)</span>
             <span>$8.40</span>
           </div>
           <div className="flex justify-between items-center text-sm font-bold text-slate-600">
             <span>Time (45 min)</span>
             <span>$4.50</span>
           </div>
           <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
             <span className="text-sm font-black text-slate-900">Total Earnings</span>
             <span className="text-lg font-black text-emerald-600">
               ${typeof trip.amount === 'number' ? trip.amount.toFixed(2) : trip.amount}
             </span>
           </div>
           <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase pt-2">
             <CreditCard className="h-3 w-3" />
             <span>Paid via Card ending in 4242</span>
           </div>
        </section>

        {/* Action: Documentation */}
        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-slate-900 text-white rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest">View Trip Documentation</span>
        </button>

      </main>
    </div>
  );
}
