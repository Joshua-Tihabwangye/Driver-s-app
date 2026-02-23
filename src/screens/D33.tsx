import React, { useState } from "react";
import {
    ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Wallet,
  Settings,
  Car,
  Wallet as WalletIcon,
  Search,
  Truck,
  History,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// EVzone Driver App – D33 Driver App – Earnings & Stats Dashboard
// Redesigned to match Screenshot 3.
// Massive scrolling dashboard with welcome banner, wallet, charts, stats grids, and map station lists.

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${active ? "text-white" : "text-white/60 hover:text-white/80"
        }`}
      onClick={onClick}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, sub = null, icon: Icon = null }: { label: string; value: string; sub?: string | null; icon?: React.ElementType | null }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 p-4 space-y-1.5 relative overflow-hidden shadow-sm">
      {Icon && <Icon className="absolute top-3 right-3 h-4 w-4 text-slate-200" />}
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
    <div className="rounded-2xl border border-slate-100 bg-white p-3.5 space-y-2 shadow-sm">
      <div className="flex justify-between text-[11px] font-medium">
        <div className="flex flex-col">
          <span className="text-slate-400">Total Riders</span>
          <span className="text-slate-900 font-bold">{value}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400">Total Earnings</span>
          <span className="text-slate-900 font-bold">UGX 4,200</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Location</div>
      <div className="text-[12px] text-slate-800 font-bold">{name}</div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex justify-end text-[10px] font-bold text-slate-400">{percentage.toFixed(0)}%</div>
    </div>
  );
}

export default function EarningsStatsDashboardScreen() {
  const [nav] = useState("wallet");
  const navigate = useNavigate();

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
            }}
          />
          <header className="app-header relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Car className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-sm font-semibold text-white">EVzone Driver</h1>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center overflow-hidden">
              <div className="text-white text-[11px] font-bold">J</div>
            </div>
          </header>
        </div>

        {/* Content */}
        <main className="app-main flex-1 px-4 pt-4 pb-4 space-y-5 overflow-y-auto scrollbar-hide">

          {/* Welcome Banner */}
          <section className="rounded-2xl bg-[#00a3ff] p-4 flex items-center justify-between text-white relative h-24 overflow-hidden shadow-lg shadow-blue-500/10">
            <div className="z-10">
              <h2 className="text-[15px] font-bold">Welcome John Doe</h2>
              <p className="text-[10px] text-white/80 max-w-[160px] leading-tight mt-1">
                Welcome to the Driver App! Manage your rides, track your earnings and plan your next journey with ease.
              </p>
            </div>
            <div className="relative h-20 w-20 flex-shrink-0">
              {/* Mock illustration with SVG */}
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="50" r="40" fill="white" opacity="0.2" />
                <rect x="30" y="30" width="40" height="40" rx="4" fill="white" opacity="0.5" />
                <circle cx="70" cy="30" r="10" fill="#fbbf24" />
              </svg>
            </div>
          </section>

          {/* Wallet Card */}
          <section className="rounded-2xl bg-[#0b1e3a] p-4 flex items-center space-x-3 shadow-lg">
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <WalletIcon className="h-5 w-5 text-[#a5f3fc]" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#a5f3fc] uppercase tracking-wider">Your Balance</span>
              <div className="text-lg font-bold text-white">UGX 25,750</div>
            </div>
            <button type="button" onClick={() => navigate("/driver/earnings/cashout")} className="rounded-xl bg-[#03cd8c] px-4 py-2.5 text-[11px] font-bold text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              Cash Out
            </button>
          </section>

          {/* Earnings Chart */}
          <section className="rounded-2xl border border-slate-100 bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <ChevronLeft className="h-4 w-4" />
              <span className="text-[11px] font-bold">01 Jan - 07 Jan</span>
              <ChevronRight className="h-4 w-4" />
            </div>
            <div className="text-center">
              <div className="text-[16px] font-bold text-[#03cd8c]">UGX 12,500</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-tight">Daily highest $24,141.00</div>
            </div>
            <div className="flex items-end justify-between h-32 px-2 pt-2">
              {[12, 18, 25, 14, 30, 10, 16].map((h, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-4 rounded-t-sm ${i === 4 ? 'bg-[#00a3ff]' : 'bg-slate-100'}`}
                    style={{ height: `${h * 2}px` }}
                  >
                    {i === 4 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00a3ff] text-white text-[8px] px-1 py-0.5 rounded shadow">UGX 5,502</div>}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Ride Banner */}
          <section className="rounded-2xl bg-[#00a3ff] p-4 flex items-center justify-between text-white overflow-hidden shadow-lg shadow-blue-500/10">
            <div className="z-10 space-y-3">
              <div>
                <h2 className="text-[13px] font-bold">Your rides/trips</h2>
                <p className="text-[9px] text-white/80 max-w-[150px] leading-tight mt-0.5">
                  Start your journey and manage costs professionally.
                </p>
              </div>
              <button type="button" onClick={() => navigate("/driver/delivery/orders")} className="rounded-full bg-[#03cd8c] px-4 py-1.5 text-[10px] font-bold text-white shadow active:scale-95 transition-all">
                Search
              </button>
            </div>
            <div className="h-16 w-24">
              {/* Car illustration placeholder */}
              <svg viewBox="0 0 100 60" className="h-full w-full">
                <rect x="20" y="20" width="60" height="25" rx="5" fill="white" opacity="0.4" />
                <circle cx="30" cy="45" r="5" fill="white" />
                <circle cx="70" cy="45" r="5" fill="white" />
              </svg>
            </div>
          </section>

          {/* Stats Grid 1 */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Earning" value="45" icon={History} />
            <StatCard label="Revenue" value="UGX 7,500" sub="+ $5.00 than last month" icon={History} />
            <StatCard label="Total Distance" value="248 miles" />
            <StatCard label="Upcoming Rides" value="10" icon={History} />
            <StatCard label="Total Online time" value="36H 20M" />
            <StatCard label="Successful rides" value="38" />
          </div>

          {/* Stations List */}
          <section className="space-y-6 pt-2">
            <h2 className="text-[14px] font-bold text-slate-800">Top Performing Stations</h2>
            {/* Map Placeholder */}
            <div className="rounded-3xl h-40 bg-slate-100 overflow-hidden relative border border-slate-50">
              <div className="absolute inset-0 opacity-40">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="#ddd" strokeWidth="2" />
                  <path d="M50,0 Q30,25 50,50 T50,100" fill="none" stroke="#ddd" strokeWidth="2" />
                </svg>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#03cd8c] border-2 border-white shadow-md shadow-emerald-500/50" />
              <div className="absolute top-1/4 left-1/4 h-3 w-3 rounded-full bg-blue-400 border border-white" />
              <div className="absolute bottom-1/3 right-1/4 h-3 w-3 rounded-full bg-orange-400 border border-white" />
            </div>

            <div className="space-y-3 pt-2">
              <StationRow name="Kampala Central Division" value="20" total="28" colorClass="bg-[#03cd8c]" />
              <StationRow name="Nakasero, Kampala" value="14" total="22" colorClass="bg-[#00a3ff]" />
              <StationRow name="Ntinda, Kampala" value="5" total="42" colorClass="bg-orange-400" />
              <StationRow name="Kololo, Kampala" value="4" total="10" colorClass="bg-yellow-400" />
            </div>
          </section>

          {/* Delivery Banner */}
          <section className="rounded-2xl bg-[#00a3ff] p-4 flex items-center justify-between text-white overflow-hidden shadow-lg shadow-blue-500/10">
            <div className="z-10 space-y-3">
              <div>
                <h2 className="text-[13px] font-bold">Your Deliveries</h2>
                <p className="text-[9px] text-white/80 max-w-[150px] leading-tight mt-0.5">
                  Start your journey and manage costs professionally.
                </p>
              </div>
              <button type="button" onClick={() => navigate("/driver/delivery/orders")} className="rounded-full bg-[#03cd8c] px-4 py-1.5 text-[10px] font-bold text-white shadow active:scale-95 transition-all">
                Search
              </button>
            </div>
            <div className="h-16 w-24">
              <Truck className="h-full w-full text-white opacity-40" />
            </div>
          </section>

          {/* Delivery Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pb-10">
            <StatCard label="Order completed" value="45" icon={History} />
            <StatCard label="Expected Payout" value="UGX 5,500" icon={History} />
            <StatCard label="Order in-delivery" value="19" sub="+2 than last month" icon={History} />
            <StatCard label="On-time Delivery" value="85%" icon={History} />
          </div>

        </main>

        {/* Bottom Navigation – Green */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" active onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
