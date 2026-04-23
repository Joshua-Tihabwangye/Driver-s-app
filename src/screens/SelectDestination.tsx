import {
Clock,
MapPin,
Search
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverMapSurface from "../components/DriverMapSurface";
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
      <DriverMapSurface
        heightClass="h-[460px]"
        className="shrink-0"
        onBack={() => navigate(-1)}
        defaultTrafficOn
        defaultAlertsOn
        infoCard={(
          <div className="rounded-[1.5rem] border border-white/70 bg-white/92 p-4 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Destination Picker
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-tight text-slate-700">
              Search or tap a pin to preview travel time and distance.
            </p>
          </div>
        )}
        markers={[
          { id: "current", positionClass: "left-[30%] top-[48%]", tone: "driver", label: "Current" },
          { id: "candidate-1", positionClass: "left-[20%] top-[26%]", tone: "warning" },
          { id: "candidate-2", positionClass: "right-[18%] top-[42%]", tone: "danger" },
        ]}
      />

      <main className="flex-1 px-6 pt-5 pb-16 overflow-y-auto scrollbar-hide space-y-6">
        <section className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] font-black uppercase text-slate-400">
            Pick Destination
          </p>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">
            Select Your Target Location
          </h1>
        </section>

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
