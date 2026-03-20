import {
  Car,
  History,
  Wallet as WalletIcon
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import { useStore } from "../context/StoreContext";
import { MOCK_WALLET_BALANCE, MOCK_WEEKLY_TOTAL } from "../data/mockData";

// EVzone Driver App – EarningsOverview Driver App – Earnings & Stats Dashboard
// scrolling dashboard with welcome banner, wallet, charts, stats grids, and map station lists.

function StationRow({ name, value, total }: any) {
  const percentage = Math.min((value / total) * 100, 100);
  return (
    <div className="rounded-2xl border-2 border-brand-secondary/10 bg-cream dark:bg-slate-800 p-3.5 space-y-2 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-brand-secondary/30 transition-all duration-300 group">
      <div className="flex justify-between text-[11px] font-medium">
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-500 transition-colors">Total Riders</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold">{value}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-500 transition-colors">Total Earnings</span>
           <span className="text-brand-secondary font-bold">UGX 4,200</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider group-hover:text-slate-500">Location</div>
      <div className="text-[12px] text-slate-800 dark:text-slate-100 font-black uppercase tracking-tight">{name}</div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
         <div className={`h-full rounded-full bg-brand-active`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex justify-end text-[10px] font-bold text-slate-400">{percentage.toFixed(0)}%</div>
    </div>
  );
}

export default function EarningsOverview() {
  const navigate = useNavigate();
  const { recentEarnings, revenueEvents, periodFilter } = useStore();
  const latestEarning = recentEarnings[0];

  const filteredRevenue = revenueEvents.filter(r => {
    // simplified filter based on period array in store, we just take all revenue events for this demo
    return true;
  });

  const sharedRevenue = filteredRevenue.filter(r => r.category === "shared").reduce((sum, r) => sum + r.amount, 0);
  const privateRevenue = filteredRevenue.filter(r => r.category !== "shared").reduce((sum, r) => sum + r.amount, 0);
  const totalRevenue = sharedRevenue + privateRevenue || 1; // prevent div by zero
  const sharedPercentage = Math.round((sharedRevenue / totalRevenue) * 100);

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader title="Earnings" subtitle="Overview" hideBack={true} />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-16 space-y-6 overflow-y-auto scrollbar-hide">

        {/* Welcome Banner */}
        <section className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 flex items-center justify-between text-white relative h-28 overflow-hidden shadow-2xl group hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
          <div className="z-10 space-y-1">
            <h2 className="text-lg font-black tracking-tight uppercase">Performance</h2>
            <p className="text-[10px] text-white/80 max-w-[180px] leading-tight font-bold uppercase tracking-wide">
              Weekly earnings overview and performance summary.
            </p>
          </div>
          <div className="relative h-20 w-20 flex-shrink-0 z-10 opacity-20 group-hover:opacity-40 transition-opacity">
             <WalletIcon className="h-full w-full text-orange-500" />
          </div>
        </section>

        {/* Wallet Card */}
        <section className="rounded-[2.5rem] bg-slate-900 p-6 flex items-center space-x-4 shadow-2xl border border-white/5">
          <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20">
             <WalletIcon className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">WALLET BALANCE</span>
            <div className="text-xl font-black text-white tracking-tight">UGX {MOCK_WALLET_BALANCE.toLocaleString()}</div>
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
        <section className="rounded-[2.5rem] border-2 border-emerald-500/10 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-black uppercase tracking-widest">Weekly: 11-17 MAR</span>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-black text-emerald-500 tracking-tighter uppercase">UGX {latestEarning.amount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tight">Weekly Total: UGX {MOCK_WEEKLY_TOTAL.toLocaleString()}</div>
          </div>
          <div className="flex items-end justify-between h-32 px-2 pt-4">
            {recentEarnings.slice().reverse().map((e, i) => (
              <div key={e.id} className="flex flex-col items-center space-y-3">
                <div
                   className={`w-4 rounded-full ${i === 6 ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-slate-100 dark:bg-slate-700'} relative transition-all`}
                  style={{ height: `${(e.amount / 20000) * 120}px` }}
                >
                  {i === 6 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded-lg font-black shadow-xl whitespace-nowrap">
                      UGX {e.amount}
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Breakdown */}
        <section className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-6 space-y-4 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue Mix</h3>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900">UGX {privateRevenue.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">Private Rides</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xl font-black text-orange-600">UGX {sharedRevenue.toLocaleString()}</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">Shared Rides</span>
            </div>
          </div>
          <div className="h-4 w-full bg-slate-200 rounded-full flex overflow-hidden">
             <div className="h-full bg-slate-900" style={{ width: `${100 - sharedPercentage}%` }} />
             <div className="h-full bg-orange-500" style={{ width: `${sharedPercentage}%` }} />
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight text-center">
             Shared rides added <span className="text-orange-600">+{sharedPercentage}%</span> to your earnings
          </div>
        </section>

        {/* Ride Banner */}
        <section className="rounded-[2.5rem] bg-orange-500 p-6 flex items-center justify-between text-white overflow-hidden shadow-2xl shadow-orange-500/20 relative group hover:scale-[1.01] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="z-10 space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-black uppercase tracking-tight">Start Earning</h2>
              <p className="text-[10px] text-white/80 max-w-[150px] leading-tight font-bold uppercase tracking-wide">
                Go online and start accepting rides to boost your income today.
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => navigate("/driver/jobs/list")}               className="rounded-full bg-slate-900 text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-emerald-500"
            >
              VIEW RIDES
            </button>
          </div>
          <div className="h-16 w-24 relative opacity-40 group-hover:scale-110 transition-transform">
            <Car className="h-full w-full" />
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="Total Trips" value="482" icon={History} onClick={() => navigate("/driver/history/rides")} />
          <MetricCard label="Dist. Covered" value="1,248 km" icon={History} />
          <MetricCard label="Hours Online" value="156H" />
          <MetricCard label="Completed" value="482" />
        </div>

        {/* Stations List */}
        <section className="space-y-6 pt-4 pb-12">
          <div className="px-1">
            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Hot Locations</h2>
          </div>
          <div className="space-y-4">
            <StationRow name="Main Hub: Kampala" value="20" total="28" />
            <StationRow name="East Side Hub: Nakasero" value="14" total="22" />
          </div>
        </section>

      </main>
    </div>
  );
}
