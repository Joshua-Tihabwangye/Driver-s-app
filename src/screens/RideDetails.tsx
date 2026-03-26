import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  CreditCard,
  Navigation,
  ShieldCheck,
  User,
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

export default function RideDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, revenueEvents } = useStore();

  const trip = useMemo(
    () => trips.find((entry) => entry.id === tripId && entry.jobType === "ride") || null,
    [trips, tripId]
  );

  const tripRevenue = useMemo(
    () =>
      trip
        ? revenueEvents.filter((event) => event.tripId === trip.id && event.category === "ride")
        : [],
    [revenueEvents, trip]
  );

  if (!trip) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Ride Summary" onBack={() => navigate("/driver/history/rides")} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-3 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ride not found
            </p>
            <button
              onClick={() => navigate("/driver/history/rides")}
              className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white"
            >
              Back to History
            </button>
          </div>
        </main>
      </div>
    );
  }

  const total = toAmount(trip.amount);
  const earningsRows = tripRevenue;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Ride Summary" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Private Ride
          </span>
          <span className="text-4xl font-black text-slate-900 tracking-tighter">
            ${total.toFixed(2)}
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {trip.status}
          </span>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Passenger</span>
              <span className="text-sm font-black text-slate-900">Recorded Rider</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
            <div className="h-10 w-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</span>
              <span className="text-sm font-black text-slate-900">{trip.date}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-5">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Route Overview</h3>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Pickup</p>
            <p className="text-sm font-black text-slate-900">{trip.from}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Drop-off</p>
            <p className="text-sm font-black text-slate-900">{trip.to}</p>
          </div>
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Distance
              </span>
              <div className="flex items-center text-slate-900">
                <Navigation className="h-3 w-3 mr-1 text-brand-active" />
                <span className="text-sm font-black">{trip.distance || "N/A"}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Time Taken
              </span>
              <div className="flex items-center text-slate-900">
                <Clock className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-sm font-black">
                  {trip.duration || (trip.startedAt && trip.completedAt 
                    ? `${Math.round((trip.completedAt - trip.startedAt) / 60000)} min` 
                    : "N/A")}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Start Time</span>
                <span className="text-xs font-black text-slate-900">
                   {trip.startedAt ? new Date(trip.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : trip.time}
                </span>
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">End Time</span>
                <span className="text-xs font-black text-slate-900">
                   {trip.completedAt ? new Date(trip.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently"}
                </span>
             </div>
          </div>
          <div className="pt-2">
             <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Record ID: {trip.id}</span>
          </div>
        </section>

        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Fare Details
          </h3>
          {earningsRows.length > 0 ? (
            earningsRows.map((row) => (
              <div
                key={row.id}
                className="flex justify-between items-center text-sm font-bold text-slate-600"
              >
                <span>{row.label}</span>
                <span>${row.amount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-[11px] font-bold uppercase tracking-tight text-slate-400">
              No recorded revenue events for this trip.
            </p>
          )}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-black text-slate-900">Total Earnings</span>
            <span className="text-lg font-black text-emerald-600">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase pt-2">
            <CreditCard className="h-3 w-3" />
            <span>Recorded in trip ledger</span>
          </div>
        </section>

        <button
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-slate-900 text-white rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest">
            View Trip Documentation
          </span>
        </button>
      </main>
    </div>
  );
}
