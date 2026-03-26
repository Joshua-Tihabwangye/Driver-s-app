import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Ambulance,
  Clock,
  MapPin,
  ShieldCheck,
  Siren,
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

export default function AmbulanceDetailsView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips } = useStore();

  const trip = useMemo(
    () => trips.find((entry) => entry.id === tripId && entry.jobType === "ambulance") || null,
    [trips, tripId]
  );

  if (!trip) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <PageHeader title="Ambulance Mission" onBack={() => navigate("/driver/history/rides")} />
        <main className="flex-1 flex items-center justify-center px-4 py-6">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-center space-y-4 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Ambulance record not found
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

  const amount = toAmount(trip.amount);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <PageHeader title="Ambulance Mission" onBack={() => navigate("/driver/history/rides")} />

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-2">
          <span className="text-[10px] uppercase font-black tracking-widest text-red-500 bg-red-50 px-3 py-1 rounded-full">
            {trip.details?.ambulance?.missionType || "Ambulance Mission"}
          </span>
          {amount > 0 ? (
            <span className="text-4xl font-black text-slate-900 tracking-tighter">
              ${amount.toFixed(2)}
            </span>
          ) : (
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Operator billed
            </span>
          )}
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">
            {trip.status === 'completed' ? 'Mission Success' : trip.status}
          </span>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">ID: {trip.id}</span>
        </section>

        <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-5">
          <div className="flex items-center space-x-2">
            <Siren className="h-4 w-4 text-red-500" />
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Mission Route
            </h3>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Dispatch Point
            </p>
            <p className="text-sm font-black text-slate-900">{trip.from}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">
              Destination
            </p>
            <p className="text-sm font-black text-slate-900">{trip.to}</p>
          </div>
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Distance
              </span>
              <div className="flex items-center text-slate-900">
                <MapPin className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-sm font-black">{trip.distance || "N/A"}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Response
              </span>
              <div className="flex items-center text-slate-900">
                <Clock className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-sm font-black">{trip.details?.ambulance?.responseTime || "N/A"}</span>
              </div>
            </div>
          </div>
          {trip.details?.ambulance?.careNotes && (
             <div className="pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Care Notes</span>
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">{trip.details.ambulance.careNotes}</p>
             </div>
          )}
        </section>

        <button
          type="button"
          onClick={() => navigate(`/driver/trip/${trip.id}/proof`)}
          className="w-full bg-slate-900 text-white rounded-[2rem] p-4 flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest">
            View Mission Documentation
          </span>
        </button>
      </main>
    </div>
  );
}
