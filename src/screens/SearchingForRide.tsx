import {
Clock,
Loader2,
XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SearchingForRide Driver App – Searching for Ride (v1)
// Map view showing searching state while the system looks for a ride request.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function SearchingForRide() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full ">
      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <DriverMapSurface
        heightClass="h-[460px]"
        className="shrink-0"
        onBack={() => navigate(-1)}
        defaultTrafficOn
        defaultAlertsOn
        routeColor="#15b79e"
        infoCard={(
          <div className="rounded-[1.5rem] border border-slate-800/10 bg-[#0b1e3a]/92 px-4 py-4 text-[11px] font-black uppercase tracking-widest text-emerald-300 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-center">
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              Searching for nearby riders...
            </div>
          </div>
        )}
        markers={[
          {
            id: "search-center",
            positionClass: "left-[30%] top-[52%]",
            tone: "driver",
            label: "Searching",
          },
          {
            id: "candidate-1",
            positionClass: "left-[22%] top-[30%]",
            tone: "danger",
          },
          {
            id: "candidate-2",
            positionClass: "right-[22%] top-[46%]",
            tone: "warning",
          },
        ]}
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-5 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Finding Ride
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Matching You with Nearby Riders
          </h1>
        </section>

        {/* Info & timer */}
        <section className="space-y-4 pt-1 pb-12">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 flex items-start space-x-5 shadow-xl shadow-slate-200/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-black text-sm text-slate-900 uppercase tracking-tight">
                Search Progress
              </p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                Currently searching for the best ride match in your area. This usually takes between 60-180 seconds.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => navigate("/driver/dashboard/online")}
            className="w-full rounded-2xl py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl bg-white text-red-500 border border-red-50 active:scale-95 transition-all flex items-center justify-center"
          >
            <XCircle className="h-5 w-5 mr-3" />
            Cancel Search
          </button>
        </section>
      </main>
    </div>
  );
}
