import {
ChevronLeft,
Phone,
TriangleAlert,
X
} from "lucide-react";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SOSSending Driver – SOS / Emergency Alert Sending Screen (v3)
// Redesigned to match the high-fidelity SOS countdown layout with pulsing circle and 112 link.

export default function SOSSending() {
  const navigate = useNavigate();
  const [sosTimer, setSosTimer] = useState(10);

  // SOS Countdown Timer
  useEffect(() => {
    if (sosTimer > 0) {
      const timer = setInterval(() => setSosTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      // Navigate to EmergencyCall (Emergency Calling) when timer hits 0
      navigate("/driver/safety/emergency/call");
    }
  }, [sosTimer, navigate]);

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Driver App" 
        subtitle="Protocol" 
        onBack={() => navigate(-1)} 
      />

      {/* Content Area */}
      <main className="flex-1 flex flex-col p-8 relative items-center text-center overflow-y-auto scrollbar-hide">

        {/* Section Header */}
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex flex-col items-start text-left">
             <span className="text-[10px] tracking-[0.2em] font-black uppercase text-orange-500">Emergency Hub</span>
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">SOS</h2>
          </div>
          <button
            onClick={() => navigate('/driver/safety/toolkit')}
            className="h-10 w-10 bg-slate-100 rounded-2xl flex items-center justify-center active:scale-95 transition-all text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 mb-12">
          <h3 className="text-[24px] font-black text-slate-900 leading-tight uppercase tracking-tight">Sending<br />Emergency Alert</h3>
          <p className="text-[11px] text-slate-400 font-bold px-4 leading-relaxed tracking-tight uppercase">
            Sharing your trip details and live location with emergency contacts and help centers.
          </p>
        </div>

        {/* SOS Pulsing Circle */}
        <div className="flex-1 flex items-center justify-center relative w-full mb-12">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full bg-red-500/10 animate-ping duration-1000" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-64 w-64 rounded-full border-2 border-slate-50 opacity-50" />
          </div>

          <div className="h-48 w-48 rounded-full bg-[#ff3b30] flex flex-col items-center justify-center text-white shadow-2xl shadow-red-500/40 relative z-10 active:scale-95 transition-all outline outline-8 outline-white border-8 border-slate-50">
            <span className="text-[48px] font-black italic tracking-tighter mb-0 leading-none">SOS</span>
            <span className="text-[12px] font-black uppercase tracking-widest opacity-90">{sosTimer}s</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="w-full space-y-8 pb-8">
          <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
            SOS will be sent automatically when the timer ends
          </p>

          <div className="bg-slate-900 p-6 rounded-[2.5rem] flex items-start space-x-4 border border-slate-800 shadow-2xl">
            <div className="h-12 w-12 bg-red-500/20 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 animate-pulse">
              <TriangleAlert className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-[11px] font-bold text-slate-100 text-left leading-relaxed uppercase tracking-tight py-1">
              Connecting to 112: your trip details and contact info will be automatically shared for immediate assistance
            </p>
          </div>

          <button className="w-full py-5 rounded-full bg-red-600 text-white font-black text-[13px] flex items-center justify-center space-x-3 shadow-2xl shadow-red-900/30 active:scale-95 transition-all uppercase tracking-[0.2em]">
            <Phone className="h-5 w-5 fill-current" />
            <span>Call 112 Now</span>
          </button>
        </div>

      </main>
    </div>
  );
}
