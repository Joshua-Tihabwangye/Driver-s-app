import {
Car,
ChevronLeft,
ChevronRight,
History,
Wallet as WalletIcon
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D33 Driver App – Earnings & Stats Dashboard
// Redesigned to match Screenshot 3.
// Massive scrolling dashboard with welcome banner, wallet, charts, stats grids, and map station lists.

function StatCard({ label, value, sub = null, icon: Icon = null }: { label: string; value: string; sub?: string | null; icon?: React.ElementType | null }) {
  return (
    <div className="rounded-2xl bg-cream border-2 border-orange-500/10 p-4 space-y-1.5 relative overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-orange-500/30 transition-all duration-300 group">
      {Icon && <Icon className="absolute top-3 right-3 h-4 w-4 text-orange-500/20 group-hover:text-orange-500/40 transition-colors" />}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className="flex flex-col">
        <span className="text-base font-bold text-slate-800">{value}</span>
        {sub && <span className="text-[10px] text-[#03cd8c] font-semibold mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

function StationRow({ name, value, total, colorClass }) {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div className="rounded-2xl border-2 border-orange-500/10 bg-cream p-3.5 space-y-2 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-orange-500/30 transition-all duration-300 group">
      <div className="flex justify-between text-[11px] font-medium">
        <div className="flex flex-col">
          <span className="text-slate-400 group-hover:text-slate-500 transition-colors">Total Riders</span>
          <span className="text-slate-900 font-bold">{value}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 group-hover:text-slate-500 transition-colors">Total Earnings</span>
          <span className="text-slate-900 font-bold">UGX 4,200</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider group-hover:text-slate-500">Location</div>
      <div className="text-[12px] text-slate-800 font-bold">{name}</div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full bg-orange-500`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex justify-end text-[10px] font-bold text-slate-400">{percentage.toFixed(0)}%</div>
    </div>
  );
}

export default function EarningsStatsDashboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Green curved header */}
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
              <p className="text-center text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Earnings
              </p>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">

        {/* Welcome Banner */}
        <section className="rounded-[2.5rem] bg-[#00a3ff] p-6 flex items-center justify-between text-white relative h-28 overflow-hidden shadow-2xl shadow-blue-500/20 group hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
          <div className="z-10 space-y-1">
            <h2 className="text-lg font-black tracking-tight uppercase">Earnings Dashboard</h2>
            <p className="text-[10px] text-white/80 max-w-[180px] leading-tight font-bold uppercase tracking-wide">
              Welcome back, Driver. Here's your earnings overview and performance summary.
            </p>
          </div>
          <div className="relative h-20 w-20 flex-shrink-0 z-10">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="40" fill="white" opacity="0.2" />
              <rect x="30" y="30" width="40" height="40" rx="6" fill="white" opacity="0.5" />
              <circle cx="70" cy="30" r="10" fill="#fbbf24" />
            </svg>
          </div>
        </section>

        {/* Wallet Card */}
        <section className="rounded-[2rem] bg-slate-900 p-6 flex items-center space-x-4 shadow-2xl border border-white/5">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <WalletIcon className="h-7 w-7 text-orange-400" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">WALLET BALANCE</span>
            <div className="text-xl font-black text-white tracking-tight">UGX 25,750</div>
          </div>
          <button 
            type="button" 
            onClick={() => navigate("/driver/earnings/cashout")} 
            className="rounded-2xl bg-orange-500 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
          >
            CASH OUT
          </button>
        </section>

        {/* Earnings Chart */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-6 space-y-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between text-slate-400">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-[11px] font-black uppercase tracking-widest">Weekly View: 01-07 JAN</span>
            <ChevronRight className="h-5 w-5" />
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-black text-orange-500 tracking-tighter">UGX 12,500</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Weekly Total: $24,141.00</div>
          </div>
          <div className="flex items-end justify-between h-40 px-2 pt-4">
            {[12, 18, 25, 14, 30, 10, 16].map((h, i) => (
              <div key={i} className="flex flex-col items-center space-y-3">
                <div
                  className={`w-4 rounded-full ${i === 4 ? 'bg-[#00a3ff] shadow-lg shadow-blue-500/30' : 'bg-slate-100'} relative transition-all`}
                  style={{ height: `${h * 2.5}px` }}
                >
                  {i === 4 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded-lg font-black shadow-xl">
                      UGX 5,502
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ride Banner */}
        <section className="rounded-[2.5rem] bg-[#00a3ff] p-6 flex items-center justify-between text-white overflow-hidden shadow-2xl shadow-blue-500/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="z-10 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black uppercase tracking-tight">Start Earning</h2>
              <p className="text-[10px] text-white/80 max-w-[150px] leading-tight font-bold uppercase tracking-wide">
                Go online and start accepting rides to boost your earnings.
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => navigate("/driver/delivery/orders")} 
              className="rounded-full bg-white text-[#00a3ff] px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              VIEW RIDES
            </button>
          </div>
          <div className="h-16 w-24 relative opacity-40">
            <Car className="h-full w-full" />
          </div>
        </section>

        {/* Stats Grid 1 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Total Trips" value="45" icon={History} />
          <StatCard label="Net Earnings" value="UGX 7,500" sub="+ $5.00 this week" icon={History} />
          <StatCard label="Distance" value="248 miles" />
          <StatCard label="Scheduled" value="10" icon={History} />
          <StatCard label="Hours Online" value="36H 20M" />
          <StatCard label="Completed" value="38" />
        </div>

        {/* Stations List */}
        <section className="space-y-6 pt-4 pb-12">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Locations</h2>
          </div>
          {/* Map Placeholder */}
          <div className="rounded-[2.5rem] h-48 bg-slate-50 overflow-hidden relative border border-slate-100 shadow-inner">
            <div className="absolute inset-0 opacity-20">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#64748b" strokeWidth="1" />
                <path d="M50,0 Q30,25 50,50 T50,100" fill="none" stroke="#64748b" strokeWidth="1" />
              </svg>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-orange-500 border-4 border-white shadow-2xl animate-pulse" />
          </div>

          <div className="space-y-4">
            <StationRow name="Main Hub: Kampala" value="20" total="28" colorClass="bg-orange-500" />
            <StationRow name="East Side Hub: Nakasero" value="14" total="22" colorClass="bg-blue-500" />
          </div>
        </section>

      </main>
    </div>
  );
}
