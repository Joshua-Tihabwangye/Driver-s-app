import {
ArrowRight,
ChevronLeft,
Clock,
DollarSign,
ListFilter,
MapPin,
Settings,
Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D46 Ride Requests – Active Ride with Additional Requests (v1)
// Shows the currently active ride plus additional ride-sharing requests the driver can add.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function ActiveRideCard() {
  return (
    <div className="w-full rounded-2xl border-2 border-orange-500/10 bg-[#f0fff4]/50 px-3 py-2.5 shadow-sm flex flex-col space-y-2 hover:border-orange-500/30 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start">
          <span className="text-[11px] uppercase tracking-[0.12em] text-orange-500 font-black">
            Active trip
          </span>
          <span className="text-xs font-bold text-slate-900">
            Acacia Mall 
            <ArrowRight className="inline h-3 w-3 mx-1 text-orange-500" />
            Ntinda
          </span>
          <span className="text-[11px] text-slate-500">
            Customer: John K · 4.92 ★ · 2 seats
          </span>
        </div>
        <div className="flex flex-col items-end text-[10px] text-slate-900">
          <span className="text-sm font-black text-orange-500">$6.80</span>
          <span className="font-medium">7.9 km · 18 min left</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-orange-500" />
          0.8 km to next stop
        </span>
        <span className="inline-flex items-center">
          <Clock className="h-3 w-3 mr-1 text-orange-500" />
          ETA 18:25
        </span>
      </div>
    </div>
  );
}

function AdditionalRequestCard({ from, to, detour, extraFare }) {
  return (
    <button className="w-full rounded-2xl border-2 border-orange-500/10 bg-cream shadow-sm px-3 py-2.5 active:scale-[0.98] hover:border-orange-500/30 hover:scale-[1.01] transition-all flex flex-col space-y-2 group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
          {from} 
          <ArrowRight className="inline h-3 w-3 mx-1 text-orange-500" />
          {to}
        </span>
        <span className="text-sm font-bold text-orange-600 flex items-center">
          <DollarSign className="h-3 w-3 mr-0.5" />
          {extraFare}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center">
          <MapPin className="h-3 w-3 mr-1 text-orange-500" />
          Adds {detour} detour
        </span>
        <span className="inline-flex items-center">
          <Users className="h-3 w-3 mr-1 text-orange-500" />
          +1 customer
        </span>
      </div>
    </button>
  );
}

export default function ActiveRideWithAdditionalRequestsScreen() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)",
            borderBottomLeftRadius: '40px',
            borderBottomRightRadius: '40px',
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <ListFilter className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.2em] font-black uppercase text-emerald-100/70">Driver · Ride Sharing</span>
              <p className="text-base font-black text-white tracking-tight leading-tight">Additional requests</p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-6 overflow-y-auto scrollbar-hide">
        {/* Active ride card */}
        <section className="space-y-2">
          <ActiveRideCard />
        </section>

        {/* Additional requests */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Nearby requests you can add
          </h2>
          <div className="space-y-3">
            <AdditionalRequestCard
              from="Garden City"
              to="Bugolobi"
              detour="+6 min"
              extraFare="3.20"
            />
            <AdditionalRequestCard
              from="Acacia Mall"
              to="Naguru"
              detour="+4 min"
              extraFare="2.40"
            />
            <AdditionalRequestCard
              from="City Centre"
              to="Kansanga"
              detour="+9 min"
              extraFare="4.10"
            />
          </div>
        </section>

        {/* Hint */}
        <section className="pt-2">
          <div className="rounded-[2.5rem] border-2 border-orange-500/10 bg-[#f0fff4]/50 p-6 flex flex-col items-start space-y-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-orange-50 text-orange-500 shadow-sm">
                <Settings className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                  Trip Management
                </p>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">
                  Capacity control
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
              Only accept extra customers if the detour keeps your current trip comfortable and on time. 
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
