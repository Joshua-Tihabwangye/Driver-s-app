import React, { useState } from 'react';
import { useSharedTrips } from '../context/SharedTripsContext';
import { useStore } from '../context/StoreContext';
import { Settings2, Plus, ArrowDownToLine } from 'lucide-react';

export default function SharedTripSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSharedTrip, simulateNewMatch } = useSharedTrips();
  const { setPeriodFilter, periodFilter, addJob } = useStore();

  const triggerIncomingRequest = () => {
    addJob({
      id: `mock-shared-${Date.now()}`,
      from: "Makerere Main Gate",
      to: "Ntinda (+2 stops)",
      distance: "8.5 km",
      duration: "30 min",
      fare: "18.20",
      jobType: "shared",
      status: "pending",
      requestedAt: Date.now()
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-4 shadow-2xl mb-3 w-[260px] text-white">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simulator Panel</h4>
            <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase tracking-tight">Dev Tools</span>
          </div>

          <div className="space-y-4">
            {/* Actions */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Trip Events</p>
              
              <button 
                onClick={triggerIncomingRequest} 
                className="w-full bg-slate-800 hover:bg-slate-700 text-left px-3 py-2 rounded-xl flex items-center text-[11px] font-bold transition-colors"
               >
                 <ArrowDownToLine className="h-3 w-3 mr-2 text-blue-400" /> Simulate Incoming Request
              </button>

              <button 
                onClick={simulateNewMatch} 
                disabled={!activeSharedTrip || !activeSharedTrip.allowAdditionalMatches}
                className="w-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-left px-3 py-2 rounded-xl flex items-center text-[11px] font-bold transition-colors"
               >
                 <Plus className="h-3 w-3 mr-2 text-emerald-400" /> Simulate Co-Rider Match
              </button>
            </div>

            {/* Global Settings */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
               <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Time Period Filter</p>
               <div className="flex space-x-2">
                 {(['day', 'week', 'month'] as const).map(p => (
                   <button 
                     key={p}
                     onClick={() => setPeriodFilter(p)}
                     className={`flex-1 text-[9px] font-black uppercase tracking-widest py-1.5 rounded-lg border ${periodFilter === p ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                   >
                     {p}
                   </button>
                 ))}
               </div>
            </div>
            
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 text-white p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-700 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group"
      >
        <span className="max-w-0 overflow-hidden font-black text-[10px] uppercase tracking-widest group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:pl-2">
           Simulator
        </span>
        <Settings2 className="h-5 w-5" />
      </button>
    </div>
  );
}
