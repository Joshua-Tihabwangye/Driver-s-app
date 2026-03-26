import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  Clock,
  Navigation,
  ShieldCheck,
  Users,
} from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";

function toAmount(value: string | number): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function SharedRideDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, revenueEvents } = useStore();

  const trip = useMemo(
    () => trips.find((entry) => entry.id === tripId && entry.jobType === "shared") || null,
    [trips, tripId]
  );

  const tripRevenue = useMemo(
    () =>
      trip
        ? revenueEvents.filter(
            (event) => event.tripId === trip.id && event.category === "shared"
          )
        : [],
    [revenueEvents, trip]
  );

  if (!trip) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Shared Ride Details" onBack={() => navigate("/driver/history/rides")} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">
              Shared Trip Not Found
            </p>
            <button
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

  const total = toAmount(trip.amount);
  const baseRevenue = tripRevenue
    .filter((event) => event.type === "base")
    .reduce((sum, event) => sum + event.amount, 0);
  const addonRevenue = tripRevenue
    .filter((event) => event.type === "shared_addon")
    .reduce((sum, event) => sum + event.amount, 0);
  const noShowRevenue = tripRevenue
    .filter((event) => event.type === "no_show_fee")
    .reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Shared Ride Details" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        <section className="bg-orange-500 rounded-[2rem] p-6 shadow-xl shadow-orange-500/20 text-white flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
          <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur z-10">
            Shared Co-Ride
          </span>
          <span className="text-5xl font-black z-10">${total.toFixed(2)}</span>
          <span className="text-xs font-bold uppercase tracking-widest z-10 text-orange-100 mt-1">
            Completed {trip.date} · {trip.time}
          </span>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Users className="h-5 w-5 text-orange-500 mb-1" />
            <span className="text-lg font-black text-slate-900">
               {trip.details?.passengers?.length || 0}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Riders</span>
          </div>
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Navigation className="h-5 w-5 text-emerald-500 mb-1" />
            <span className="text-lg font-black text-slate-900">{trip.distance || "N/A"}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Distance</span>
          </div>
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center justify-center">
            <Clock className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-lg font-black text-slate-900">{trip.duration || "N/A"}</span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Duration</span>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Route Overview
          </h3>
          <div className="flex flex-col space-y-3">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Main Pickup</span>
                <p className="text-sm font-black text-slate-900">{trip.from}</p>
             </div>
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Final Drop-off</span>
                <p className="text-sm font-black text-slate-900">{trip.to}</p>
             </div>
          </div>
        </section>

        {/* Passenger List */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
           <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
             Passenger Manifest
           </h3>
           <div className="space-y-3">
              {trip.details?.passengers?.map((p) => (
                 <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900">
                    <div className="flex flex-col">
                       <span className="text-sm font-black">{p.displayName}</span>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{p.seatCount} Seat(s)</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'no_show' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {p.status.replace('_', ' ')}
                       </span>
                       <span className="text-[9px] font-bold text-slate-400 tracking-widest">+${p.fareContribution.toFixed(2)}</span>
                    </div>
                 </div>
              )) || (
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center py-4">No passenger records found</p>
              )}
           </div>
        </section>

        <section className="bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-800 space-y-4 text-white">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Earnings Detail
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span>Base Shared Fare</span>
              <span>${baseRevenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span>Shared Add-ons</span>
              <span>${addonRevenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span>No-show Fees</span>
              <span>${noShowRevenue.toFixed(2)}</span>
            </div>
          </div>
          {tripRevenue.length > 0 && (
            <div className="pt-3 border-t border-slate-700 space-y-2">
              {tripRevenue.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-slate-300"
                >
                  <span>{event.label}</span>
                  <span>+${event.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="pt-3 border-t border-slate-700 flex justify-between items-center">
            <span className="text-sm font-black">Final Payout</span>
            <span className="text-lg font-black text-emerald-400">
              ${total.toFixed(2)}
            </span>
          </div>
        </section>

        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-white text-slate-900 rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-sm border border-slate-200 active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-slate-400" />
          <span className="text-xs font-black uppercase tracking-widest">View Verifications</span>
        </button>
        <div className="text-center pt-2">
           <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Shared Session ID: {trip.id}</span>
        </div>
      </main>
    </div>
  );
}
