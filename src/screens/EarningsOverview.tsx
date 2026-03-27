import {
  Car,
  History,
  Wallet as WalletIcon
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/MetricCard";
import PageHeader from "../components/PageHeader";
import { useStore, isWithinPeriod } from "../context/StoreContext";
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
  const {
    recentEarnings,
    filteredRevenueEvents,
    periodFilter,
    setPeriodFilter,
    dashboardMetrics,
    assignableJobTypes,
  } = useStore();
  const latestEarning = recentEarnings[0] || { amount: 0 };

  const filteredRevenue = filteredRevenueEvents.filter((event) =>
    isWithinPeriod(event.timestamp, periodFilter)
  );

  const rideRev = filteredRevenue.filter(r => r.category === "ride").reduce((sum, r) => sum + r.amount, 0);
  const sharedRev = filteredRevenue.filter(r => r.category === "shared").reduce((sum, r) => sum + r.amount, 0);
  const deliveryRev = filteredRevenue.filter(r => r.category === "delivery").reduce((sum, r) => sum + r.amount, 0);
  const rentalRev = filteredRevenue.filter(r => r.category === "rental").reduce((sum, r) => sum + r.amount, 0);
  const tourRev = filteredRevenue.filter(r => r.category === "tour").reduce((sum, r) => sum + r.amount, 0);
  
  const totalRevenue = rideRev + sharedRev + deliveryRev + rentalRev + tourRev;
  const sharedPercentage = totalRevenue > 0
    ? Math.round((sharedRev / totalRevenue) * 100)
    : 0;
  
  const avgPerJob = dashboardMetrics.jobsCount > 0 ? totalRevenue / dashboardMetrics.jobsCount : 0;

  // Determine Top Earning Category
  const revMap = { "Private": rideRev, "Shared": sharedRev, "Delivery": deliveryRev, "Rental": rentalRev, "Tour": tourRev };
  const topCategory =
    totalRevenue > 0
      ? Object.entries(revMap).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      : "N/A";

  return (
    <div className="flex flex-col h-full bg-transparent">
      <PageHeader title="Earnings" subtitle="Overview" hideBack={true} />

      {/* Content */}
      <main className="flex-1 px-6 pt-6 pb-24 space-y-8 overflow-y-auto scrollbar-hide">
        
        {/* Top Navigation / Filters */}
        <div className="space-y-4">
          <section className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/overview")}
              className="rounded-2xl bg-slate-900 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/weekly")}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/earnings/monthly")}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Monthly
            </button>
          </section>

          <div className="flex justify-between items-center bg-white px-5 py-4 rounded-[2rem] shadow-sm border border-slate-100">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Viewing Stats</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Analysis Period</span>
             </div>
             <select 
               value={periodFilter} 
               onChange={(e) => setPeriodFilter(e.target.value as any)}
               className="bg-slate-100 text-slate-900 text-[10px] font-black px-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-brand-active/20 cursor-pointer uppercase tracking-wider"
             >
               <option value="day">Today</option>
               <option value="week">This Week</option>
               <option value="month">This Month</option>
               <option value="quarter">Last 90 Days</option>
               <option value="year">This Year</option>
             </select>
          </div>
        </div>

        {/* Financial Heart: Wallet & Revenue */}
        <section className="space-y-4">
          <div className="rounded-[2.5rem] bg-slate-900 p-7 flex items-center space-x-5 shadow-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mt-24 animate-pulse" />
            <div className="h-16 w-16 flex items-center justify-center rounded-[1.5rem] bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 z-10 shrink-0">
               <WalletIcon className="h-8 w-8 text-emerald-500" />
            </div>
            <div className="flex-1 z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">AVAILABLE BALANCE</span>
              <div className="text-2xl font-black text-white tracking-tighter leading-none mt-1.5 flex items-baseline">
                <span className="text-xs mr-1 opacity-50">UGX</span>
                {MOCK_WALLET_BALANCE.toLocaleString()}
              </div>
            </div>
             <button 
              type="button" 
              onClick={() => navigate("/driver/earnings/cashout")} 
              className="rounded-2xl bg-orange-500 px-6 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/30 active:scale-95 transition-all z-10 hover:bg-orange-600"
            >
              CASH OUT
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-brand-active/5 rounded-full -mb-10 -mr-10 transition-transform group-hover:scale-150" />
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-brand-active">Total Revenue</span>
                <span className="text-2xl font-black mt-4 tracking-tighter leading-none flex items-baseline">
                   <span className="text-[10px] mr-1 opacity-40">UGX</span>
                   {totalRevenue.toLocaleString()}
                </span>
             </div>
             <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">Average / Job</span>
                <span className="text-2xl font-black mt-4 text-slate-900 tracking-tighter leading-none flex items-baseline">
                   <span className="text-[10px] mr-1 opacity-40">UGX</span>
                   {avgPerJob.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
             </div>
          </div>
        </section>
 
        {/* Performance Visualization */}
        <section className="rounded-[2.5rem] border-2 border-emerald-500/10 bg-white p-7 space-y-8 shadow-sm hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Weekly Pulse</span>
               <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">11-17 MARCH</span>
            </div>
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span>Growth: +12%</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="text-3xl font-black text-emerald-500 tracking-tighter uppercase leading-none">{formatUGX(latestEarning.amount)}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Session Total: {formatUGX(MOCK_WEEKLY_TOTAL)}</div>
          </div>

          <div className="flex items-end justify-between h-40 px-1 pt-6 border-b border-slate-50 pb-2">
            {recentEarnings.slice().reverse().map((e, i) => (
              <div key={e.id} className="flex flex-col items-center space-y-4">
                <div
                   className={`w-4 rounded-full ${i === 6 ? 'bg-orange-500 shadow-xl shadow-orange-500/30 scale-x-110' : 'bg-slate-100'} relative transition-all duration-700 hover:bg-slate-200 cursor-pointer group`}
                  style={{ height: `${(e.amount / 20000) * 140}px` }}
                >
                  {i === 6 && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-3 py-1.5 rounded-xl font-black shadow-2xl whitespace-nowrap z-20 animate-in zoom-in-50 duration-300">
                      {formatUGX(e.amount)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 
           LEARNING: REORGANIZATION HIERARCHY
           - Summary (Wallet/Balance) -> Key Metrics (Total/Avg) -> Trend/Chart (Weekly Pulse) -> Supporting Details.
           - The "Start Earning" card was removed here to maintain a clean, professional focus on financial data.
           - Components are grouped logically to improve scannability for the driver.
        */}

        {/* Composition & Efficiency: Supporting Financial Details */}
        <div className="grid grid-cols-1 gap-6">
           {/* Service Mix */}
           <section className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
             <div className="flex flex-col px-1">
                <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">Composition</span>
                <h3 className="text-[11px] uppercase font-black tracking-widest text-slate-900">Revenue by Service</h3>
             </div>
             <div className="space-y-3.5">
                {[
                  { label: "Private Rides", val: rideRev, color: "bg-slate-900", text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100" },
                  { label: "Shared Rides", val: sharedRev, color: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
                  { label: "Deliveries", val: deliveryRev, color: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                  { label: "Rentals & Tours", val: rentalRev + tourRev, color: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" }
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between p-4 rounded-[1.8rem] ${item.bg} border ${item.border} transition-transform hover:scale-[1.02]`}>
                    <div className="flex items-center space-x-4">
                       <div className={`h-2.5 w-2.5 rounded-full ${item.color} shadow-sm`} />
                       <span className={`text-[11px] font-black ${item.text} uppercase tracking-tight`}>{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{formatUGX(item.val)}</span>
                  </div>
                ))}
                
                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center px-2">
                  <div className="flex flex-col">
                     <span className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em]">Primary Engine</span>
                     <span className="text-[10px] uppercase font-black text-slate-900">{topCategory}</span>
                  </div>
                  <span className="text-[10px] uppercase font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full tracking-widest shadow-sm">Revenue Leader</span>
                </div>
             </div>
           </section>

           {/* Efficiency */}
           <section className="rounded-[2.5rem] border-2 border-orange-500/10 bg-cream p-8 space-y-6 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12" />
             <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] bg-orange-100 px-3 py-1 rounded-full">Yield Efficiency</span>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-relaxed max-w-[220px]">
                  Shared rides added <span className="text-orange-600">+{sharedPercentage}%</span> margin efficiency to your total revenue portfolio.
                </p>
             </div>
             <div className="h-6 w-full bg-slate-200 rounded-full flex overflow-hidden border border-slate-300/20 shadow-inner">
                <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${100 - sharedPercentage}%` }} />
                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${sharedPercentage}%` }} />
             </div>
             <div className="flex justify-between items-center px-2 relative z-10">
               <div className="flex items-center space-x-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Private {100 - sharedPercentage}%</span>
               </div>
               <div className="flex items-center space-x-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Shared {sharedPercentage}%</span>
               </div>
             </div>
           </section>
        </div>

        {/* Global Statistics */}
        <section className="space-y-4">
           <div className="px-2 flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Hub</span>
              <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Lifetime Engagement</h2>
           </div>
           <div className="grid grid-cols-2 gap-3">
             <MetricCard label="Total Trips" value="482" icon={History} onClick={() => navigate("/driver/history/rides")} />
             <MetricCard label="Dist. Covered" value="1,248 km" icon={History} />
             <MetricCard label="Hours Online" value="156H" />
             <MetricCard label="Completed" value="482" />
           </div>
        </section>

        {/* Demand Intelligence (Hot Locations) */}
        <section className="space-y-6 pt-4 pb-12">
          <div className="px-2 flex flex-col">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence</span>
             <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">High-Demand Stations</h2>
          </div>
          <div className="space-y-4">
            <StationRow name="Main Hub: Kampala Central" value="20" total="28" />
            <StationRow name="East Side Hub: Nakasero" value="14" total="22" />
          </div>
        </section>

      </main>
    </div>
  );
}

function formatUGX(value: number): string {
  return `UGX ${Math.round(value).toLocaleString()}`;
}
