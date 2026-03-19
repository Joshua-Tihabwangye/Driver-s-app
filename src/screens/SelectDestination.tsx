import {
ChevronLeft,
Clock,
MapPin,
Search
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// EVzone Driver App – SelectDestination Pick Your Destination (v1)
// Screen for choosing a destination on the map or from recent/favourite locations.
// 375x812 phone frame, swipe scrolling in <main>, scrollbar hidden.


function LocationRow({ label, detail, eta, distance }) {
  return (
    <button className="w-full rounded-2xl border border-slate-100 bg-white shadow-sm px-3 py-2.5 shadow-sm active:scale-[0.98] transition-transform flex items-center justify-between text-[11px] text-slate-600">
      <div className="flex items-center space-x-2 max-w-[210px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
          <MapPin className="h-4 w-4 text-orange-500" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold text-slate-900 truncate max-w-[170px]">
            {label}
          </span>
          <span className="text-[10px] text-slate-500 truncate max-w-[180px]">
            {detail}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end text-[10px] text-slate-500">
        <span className="inline-flex items-center mb-0.5">
          <Clock className="h-3 w-3 mr-1" />
          {eta}
        </span>
        <span>{distance}</span>
      </div>
    </button>
  );
}

export default function SelectDestination() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-full ">
      <PageHeader 
        title="Pick Destination" 
        subtitle="Driver · Navigation" 
        onBack={() => navigate(-1)} 
      />

      <main className="flex-1 px-6 pt-6 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        {/* Search input */}
        <section className="space-y-4">
          <div className="flex items-center rounded-[2rem] bg-white px-6 py-4 border border-slate-100 shadow-xl shadow-slate-200/50">
            <Search className="h-6 w-6 text-slate-400 mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destination or address"
              className="flex-1 bg-transparent text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
            Choose a destination to plan your route, see distance and estimated
            time.
          </p>
        </section>

        {/* Map preview */}
        <section className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 bg-slate-200 h-[200px] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200" />

          {/* Current location marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-orange-500/20 animate-pulse" />
              <div className="absolute h-10 w-10 rounded-full bg-orange-500/40" />
              <div className="absolute h-5 w-5 rounded-full bg-orange-500 border-4 border-white shadow-lg" />
            </div>
          </div>
        </section>

        {/* Recent / favourite destinations */}
        <section className="space-y-4 pb-12">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
            Recently Visited
          </h2>
          <div className="space-y-3">
            <LocationRow
              label="Home"
              detail="Kira Road · Saved"
              eta="20–25 min"
              distance="7.2 km"
            />
            <LocationRow
              label="Acacia Mall"
              detail="Retail & food court"
              eta="10–15 min"
              distance="3.4 km"
            />
            <LocationRow
              label="City Centre (Clock Tower)"
              detail="Popular pick-up and drop-off area"
              eta="15–20 min"
              distance="5.1 km"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
