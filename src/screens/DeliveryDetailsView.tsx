import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, User, Navigation, Clock, ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

export default function DeliveryDetailsView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();
  const trip = trips.find(t => t.id === tripId) || { id: "demo", amount: 15.00, date: "Today", pickup: "Warehouse A", dropoff: "Client B", jobType: "delivery", distance: "8 km", duration: "20 min" };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Delivery Details" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        
        {/* Header Summary */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
           <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Parcel Delivery</span>
           <span className="text-4xl font-black text-slate-900 tracking-tighter">
             ${typeof trip.amount === 'number' ? trip.amount.toFixed(2) : trip.amount}
           </span>
           <span className="flex items-center text-xs font-bold text-emerald-500 uppercase tracking-widest mt-1">
             <CheckCircle2 className="h-3 w-3 mr-1" /> Delivered
           </span>
        </section>

        {/* Parcel Info */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Package Details</h3>
           <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-secondary">
                 <Box className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-sm font-black text-slate-900">Electronics</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medium Box • 3.2 kg</span>
              </div>
           </div>
        </section>

        {/* Sender / Recipient */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
               <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Sender</span>
               <span className="text-xs font-black text-slate-900 leading-tight">TechStore Hub</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
               <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Recipient</span>
               <span className="text-xs font-black text-slate-900 leading-tight">Alice M.</span>
            </div>
          </div>
        </section>

        {/* Route Details */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Delivery Route</h3>
           <div className="relative pl-6 space-y-6">
              <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-slate-200" />
              
              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-slate-900 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pickup</span>
                <span className="text-sm font-black text-slate-900">{trip.pickup || "Store Warehouse"}</span>
                <span className="text-[10px] font-bold text-slate-400">09:00 AM</span>
              </div>

              <div className="relative z-10 flex flex-col space-y-1">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-white" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">Drop-off</span>
                <span className="text-sm font-black text-slate-900">{trip.dropoff || "Client House"}</span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center">
                  09:45 AM <FileText className="h-3 w-3 ml-2 mr-1"/> Signature Collected
                </span>
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Distance</span>
                 <div className="flex items-center text-slate-900">
                   <Navigation className="h-3 w-3 mr-1 text-brand-secondary" />
                   <span className="text-sm font-black">{trip.distance || "8.5 km"}</span>
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

        {/* Action: Documentation */}
        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-white text-slate-900 rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-sm border border-slate-200 active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-widest">View Delivery Proof</span>
        </button>

      </main>
    </div>
  );
}
