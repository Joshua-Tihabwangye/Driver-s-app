import {
Clock,
DollarSign,
MapPin,
Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – LastTripSummary Driver App – Last Trip Summary Popup (v1)
// Map view with a small summary popup for the last completed trip.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function LastTripSummary() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full ">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <PageHeader 
        title="Last Trip" 
        subtitle="Driver" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">
        <DriverMapSurface
          heightClass="h-[460px]"
          onBack={() => navigate(-1)}
          routePath="M20 80 C 40 60, 60 40, 80 20"
          routeColor="#15b79e"
          routeStrokeWidth={2.4}
          routeDasharray="4 2"
          markers={[
            { id: "origin", positionClass: "left-[16%] bottom-[18%]", tone: "driver", label: "Origin", icon: MapPin },
            { id: "dropoff", positionClass: "right-[16%] top-[18%]", tone: "warning", label: "Drop-off", icon: MapPin },
          ]}
        >
          <div className="absolute inset-x-6 bottom-6 z-30">
            <div className="rounded-[2.5rem] bg-[#fffdf5]/95 backdrop-blur-xl shadow-2xl border-2 border-orange-500/20 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                    LAST TRIP
                  </span>
                  <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    City Centre → Ntinda
                  </span>
                  <span className="text-[11px] text-orange-500 font-bold uppercase tracking-tight">
                    8.4 km Total Distance
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-black text-slate-900 tracking-tighter">
                    $6.80
                  </span>
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mt-0.5">EARNED</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-orange-500/10">
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" /> 17m Duration
                  </span>
                  <span className="inline-flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <Star className="h-4 w-4 mr-2 text-amber-400" /> 5.0 Rating
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/driver/history/rides")}
                className="w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest border-2 border-orange-500/10 text-slate-900 bg-cream hover:bg-orange-50 active:scale-95 transition-all shadow-sm flex items-center justify-center"
              >
                View Trip Details
              </button>
            </div>
          </div>
        </DriverMapSurface>
      </main>
    </div>
  );
}
