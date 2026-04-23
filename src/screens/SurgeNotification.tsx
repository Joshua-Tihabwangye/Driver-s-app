import {
Activity,
AlertTriangle,
MapPin,
X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SurgeNotification Driver App – Surge Notification Popup (v1)
// Map view with an overlaid surge notification popup.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


export default function SurgeNotification() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full ">
      <PageHeader 
        title="Area Scan" 
        subtitle="Map View" 
        onBack={() => navigate(-1)} 
      />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6">
        <DriverMapSurface
          heightClass="h-[460px]"
          markers={[
            { id: "current", positionClass: "left-[30%] top-[48%]", tone: "driver", label: "You" },
            { id: "surge", positionClass: "left-[18%] top-[26%]", tone: "warning", label: "Earnings x2.0", icon: MapPin },
            { id: "bonus", positionClass: "right-[22%] top-[42%]", tone: "warning" },
          ]}
        >
          <div className="absolute inset-x-6 bottom-6 z-30">
            <div className="rounded-[2rem] bg-white/90 backdrop-blur-xl shadow-2xl border border-orange-100 p-6 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#f97316] shadow-sm">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Surge Zone (x2.0)
                  </p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">
                    High demand detected in your area. Driving to this zone now will significantly increase your earnings.
                  </p>
                </div>
                <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 active:scale-90 transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  <Activity className="h-3.5 w-3.5 mr-2" />
                  <span>Est. x1.8 Bonus · 45m Duration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button type="button" onClick={() => navigate("/driver/map/online")} className="flex-1 rounded-full border-2 border-orange-500/10 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all hover:border-orange-500/30">
                    Dismiss
                  </button>
                  <button type="button" onClick={() => navigate("/driver/surge/map")} className="flex-1 rounded-full bg-orange-500 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                    View Area
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DriverMapSurface>
      </main>
    </div>
  );
}
