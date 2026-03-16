import { MapPin, ChevronLeft, Search, Clock, History, Navigation2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RECENT = [
  { id: 1, name: "Home", address: "Ggaba Road, Kampala", type: "Home" },
  { id: 2, name: "City Mall", address: "Kampala Road, Central", type: "Recent" },
  { id: 3, name: "Entebbe Airport", address: "Airport Road, Entebbe", type: "Favorite" },
];

export default function DestinationFilter() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col h-full ">
      <div className="relative shrink-0" style={{ minHeight: 90 }}>
        
        <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
<div className="flex flex-col items-center">
                <span className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-500 dark:text-slate-400 text-center">Navigation</span>
                <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">Destination Filter</p>
              </div>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-8">
        {/* Search Bar */}
        <section className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#03cd8c] transition-colors" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-cream border-2 border-orange-500/10 rounded-3xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#03cd8c]/20 focus:border-[#03cd8c] transition-all shadow-md hover:border-orange-500/30"
              placeholder="Where are you heading?"
            />
          </div>
          <div className="rounded-[2.5rem] bg-slate-900 p-6 text-white text-center space-y-2 shadow-xl shadow-slate-200">
<h3 className="text-xs font-black uppercase tracking-tight">Active Destination Mode</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                When active, we'll only send you ride requests heading toward your destination.
             </p>
          </div>
        </section>

        {/* Recent & Saved */}
        <section className="space-y-4">
          <div className="px-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent & Saved</h2>
          </div>
          <div className="space-y-3">
            {RECENT.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate("/driver/dashboard/online")}
                className="w-full bg-cream rounded-3xl p-5 border-2 border-orange-500/10 flex items-center space-x-4 shadow-sm active:scale-[0.98] transition-all text-left hover:border-orange-500/30 hover:shadow-md group"
              >
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-orange-50">
                  <Clock className="h-5 w-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{item.address}</p>
                </div>
                <div className="px-3 py-1 bg-white rounded-full border border-orange-50 group-hover:bg-orange-50 transition-colors">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.type}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Favorites */}
        <section className="pt-2 pb-10">
          <button className="w-full rounded-full py-5 flex items-center justify-center space-x-3 bg-emerald-50 text-[#03cd8c] border border-emerald-100 active:scale-[0.98] transition-all">
             <MapPin className="h-5 w-5" />
             <span className="text-xs font-black uppercase tracking-widest">Set Current Location</span>
          </button>
        </section>
      </main>
    </div>
  );
}
