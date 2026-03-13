import { ChevronLeft, Map, Clock, Wallet, Navigation, Star, Phone, ShieldCheck, Mail } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, fetch based on tripId
  const trip = {
    id: tripId || "TR-4859",
    date: "Mon, 12 Mar 14:32",
    pickup: "Acacia Mall, Kampala",
    dropoff: "Entebbe International Airport",
    distance: "34.2 km",
    duration: "48 min",
    amount: "UGX 65,000",
    fareBreakdown: [
      { label: "Base Fare", value: "UGX 10,000" },
      { label: "Distance (34.2 km)", value: "UGX 45,000" },
      { label: "Time (48 min)", value: "UGX 10,000" },
    ],
    rider: "Sarah J.",
    rating: 5,
    paymentMethod: "EVzone Wallet",
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70 text-center">Receipt</span>
                <p className="text-base font-black text-white tracking-tight leading-tight text-center">Trip Details</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto scrollbar-hide space-y-6">
        {/* Simple Map Preview Placeholder */}
        <section className="rounded-[2.5rem] h-48 bg-slate-200 relative overflow-hidden shadow-inner border border-slate-100">
           <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
           <div className="absolute inset-0 flex items-center justify-center">
             <Map className="h-10 w-10 text-slate-400" />
           </div>
           <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
              <div className="px-4 py-2 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center space-x-2">
                 <div className="w-2 h-2 bg-blue-500 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Route Map</span>
              </div>
              <div className="px-4 py-2 bg-[#03cd8c] rounded-2xl shadow-md flex items-center space-x-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">{trip.amount}</span>
              </div>
           </div>
        </section>

        {/* Trip Timeline */}
        <section className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-6">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trip.date}</span>
              <div className="px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 text-[#03cd8c] text-[9px] font-black uppercase tracking-widest">
                 Completed
              </div>
           </div>

           <div className="space-y-6 relative">
              <div className="absolute left-[11px] top-3 bottom-3 w-[2px] bg-slate-100 border-l border-dashed border-slate-300" />
              <div className="flex items-start space-x-4 relative z-10">
                 <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{trip.pickup}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Pickup Location</p>
                 </div>
              </div>
              <div className="flex items-start space-x-4 relative z-10">
                 <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{trip.dropoff}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Drop-off Location</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
              <div className="flex items-center space-x-3">
                 <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Distance</p>
                    <p className="text-xs font-black text-slate-900">{trip.distance}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3">
                 <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center">
                    <Clock className="h-5 w-5 text-slate-400" />
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Duration</p>
                    <p className="text-xs font-black text-slate-900">{trip.duration}</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Fare Breakdown */}
        <section className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Fare Breakdown</h2>
           <div className="space-y-3">
              {trip.fareBreakdown.map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="text-slate-900">{item.value}</span>
                 </div>
              ))}
              <div className="h-px bg-slate-50 my-2" />
              <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-[#03cd8c]" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">Net Earnings</span>
                 </div>
                 <span className="text-lg font-black text-[#03cd8c]">{trip.amount}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight text-right">
                  Paid via {trip.paymentMethod}
              </div>
           </div>
        </section>

        {/* Feedback Summary */}
        <section className="bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
               </div>
               <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">Trip Rating</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Customer: {trip.rider}</p>
               </div>
            </div>
            <div className="text-xl font-black text-slate-900">{trip.rating}.0</div>
        </section>

        {/* Support Actions */}
        <section className="pt-2 pb-10 flex space-x-3">
           <button className="flex-1 rounded-full py-4 flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 active:scale-[0.98] transition-all">
              <Phone className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
           </button>
           <button className="flex-1 rounded-full py-4 flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 active:scale-[0.98] transition-all">
              <Mail className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
           </button>
           <button className="flex-1 rounded-full py-4 flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 active:scale-[0.98] transition-all">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">SOS</span>
           </button>
        </section>
      </main>
    </div>
  );
}
