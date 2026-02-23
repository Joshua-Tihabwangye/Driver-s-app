import React, { useState } from "react";
import {
  ChevronLeft,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  Home,
  Briefcase,
  Settings,
} from "lucide-react";
import { useNavigate , useLocation } from "react-router-dom";

const PAYMENT_METHODS = [
  {
    id: "mobile_money",
    label: "Mobile Money",
    description: "MTN MoMo, Airtel Money",
    icon: Smartphone,
    color: "#f59e0b",
    bgColor: "#fef3c7",
    tag: "Fastest",
    tagColor: "bg-amber-100 text-amber-700",
    fee: "Free",
    time: "Instant",
  },
  {
    id: "bank_transfer",
    label: "Bank Transfer",
    description: "Direct to your bank account",
    icon: Building2,
    color: "#3b82f6",
    bgColor: "#dbeafe",
    tag: null,
    tagColor: "",
    fee: "UGX 500",
    time: "1–2 business days",
  },
  {
    id: "evzone_wallet",
    label: "EVzone Wallet",
    description: "Keep funds in your EVzone Wallet",
    icon: Wallet,
    color: "#03cd8c",
    bgColor: "#d1fae5",
    tag: "Recommended",
    tagColor: "bg-emerald-100 text-emerald-700",
    fee: "Free",
    time: "Instant",
  },
  {
    id: "visa_mastercard",
    label: "Visa / Mastercard",
    description: "Withdraw to your debit card",
    icon: CreditCard,
    color: "#6366f1",
    bgColor: "#e0e7ff",
    tag: null,
    tagColor: "",
    fee: "2.5%",
    time: "1–3 business days",
  },
  {
    id: "cash_pickup",
    label: "Cash Pickup",
    description: "Collect at an EVzone agent",
    icon: Banknote,
    color: "#f97316",
    bgColor: "#ffedd5",
    tag: null,
    tagColor: "",
    fee: "UGX 1,000",
    time: "Same day",
  },
];

function BottomNavItem({ icon: Icon, label, active = false, onClick = () => {} }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-semibold transition-all relative ${
        active ? "text-white" : "text-white/50 hover:text-white/80"
      }`}
    >
      {active && <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-white/20" />}
      <Icon className="h-5 w-5 mb-0.5 relative z-10" />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

export default function CashOutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const navActive = (key) => {
    const p = location.pathname;
    const routes = { home: ["/driver/dashboard", "/driver/map/", "/driver/trip/", "/driver/safety/"], manager: ["/driver/jobs/", "/driver/delivery/", "/driver/vehicles", "/driver/onboarding/", "/driver/register", "/driver/training/", "/driver/help/"], wallet: ["/driver/earnings/", "/driver/surge/"], settings: ["/driver/preferences", "/driver/search"] };
    return (routes[key] || []).some(r => p.startsWith(r));
  };
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("25,750");
  const [step, setStep] = useState<"select" | "confirm" | "success">("select");

  const balance = "UGX 25,750";
  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selected);

  const handleContinue = () => {
    if (!selected) return;
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
        <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
        {/* Hide scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { width: 0; height: 0; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <div className="h-20 w-20 rounded-full bg-[#d1fae5] flex items-center justify-center mb-6">
              <CheckCircle2 className="h-10 w-10 text-[#03cd8c]" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Cash Out Initiated</h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-1">
              Your withdrawal of <span className="font-semibold text-slate-900">UGX {amount}</span> via{" "}
              <span className="font-semibold text-slate-900">{selectedMethod?.label}</span> is being processed.
            </p>
            <p className="text-xs text-slate-400 mb-8">
              Expected: {selectedMethod?.time}
            </p>

            <div className="w-full rounded-2xl border border-emerald-100 bg-emerald-50 p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-800">Transaction secured by EVzone</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                You will receive an SMS and in-app notification once the funds arrive. If there are any issues, contact support.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/driver/earnings/overview")}
              className="w-full rounded-full bg-[#03cd8c] py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all"
            >
              Back to Earnings
            </button>
            <button
              type="button"
              onClick={() => navigate("/driver/dashboard/online")}
              className="w-full mt-2 rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
        <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">
          <div className="relative" style={{ minHeight: 80 }}>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
              }}
            />
            <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <h1 className="text-base font-semibold text-white">Confirm Withdrawal</h1>
              <div className="w-9" />
            </header>
          </div>

          <main className="flex-1 px-5 pt-6 pb-4 space-y-5 overflow-y-auto scrollbar-hide">
            <div className="rounded-2xl bg-[#0b1e3a] p-5 text-white text-center space-y-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">Withdrawal Amount</p>
              <p className="text-3xl font-bold">UGX {amount}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                {selectedMethod && (
                  <>
                    <selectedMethod.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{selectedMethod.label}</span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">UGX {amount}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Fee</span>
                <span className="font-semibold text-slate-900">{selectedMethod?.fee}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-500">Estimated arrival</span>
                <span className="font-semibold text-slate-900">{selectedMethod?.time}</span>
              </div>
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between text-[13px]">
                <span className="font-semibold text-slate-900">You receive</span>
                <span className="font-bold text-[#03cd8c] text-base">UGX {amount}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Please verify that your {selectedMethod?.label} details are correct. Withdrawals cannot be reversed once processed.
              </p>
            </div>

            <div className="space-y-2 pt-2 pb-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full rounded-full bg-[#03cd8c] py-3.5 text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Confirm & Withdraw
              </button>
              <button
                type="button"
                onClick={() => setStep("select")}
                className="w-full rounded-full border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700"
              >
                Go Back
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-stage min-h-screen flex justify-center bg-[#edf3f2] py-4 px-3">
      <div className="app-phone w-[375px] h-[812px] bg-white rounded-[20px] border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden flex flex-col">

        {/* Green curved header */}
        <div className="relative" style={{ minHeight: 80 }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #a8e6cf 0%, #03cd8c 50%, #02b77c 100%)"
            }}
          />
          <header className="relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h1 className="text-base font-semibold text-white">Cash Out</h1>
            <div className="w-9" />
          </header>
        </div>

        {/* Content */}
        <main className="flex-1 px-5 pt-4 pb-4 space-y-5 overflow-y-auto scrollbar-hide">

          {/* Balance card */}
          <section className="rounded-2xl bg-[#0b1e3a] text-white p-5 space-y-1 text-center">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">Available Balance</p>
            <p className="text-2xl font-bold tracking-tight">{balance}</p>
            <p className="text-[11px] text-slate-300">Withdraw to your preferred payment method</p>
          </section>

          {/* Amount input */}
          <section className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Amount to withdraw</label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#03cd8c] focus-within:ring-1 focus-within:ring-[#03cd8c] transition-all">
              <span className="text-sm font-semibold text-slate-400 mr-2">UGX</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 text-lg font-bold text-slate-900 bg-transparent outline-none"
                placeholder="0"
              />
            </div>
            <div className="flex gap-2">
              {["5,000", "10,000", "25,750"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-all active:scale-[0.97] ${
                    amount === preset
                      ? "border-[#03cd8c] bg-[#e6fff7] text-[#03cd8c]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </section>

          {/* Payment methods */}
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Choose payment method</h2>

            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = selected === method.id;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelected(method.id)}
                    className={`w-full rounded-2xl border p-3.5 flex items-center gap-3.5 text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? "border-[#03cd8c] bg-[#f0fdf9] shadow-sm shadow-emerald-100"
                        : "border-slate-100 bg-white hover:border-slate-200"
                    }`}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                      style={{ backgroundColor: method.bgColor }}
                    >
                      <Icon className="h-5 w-5" style={{ color: method.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-semibold text-slate-900">{method.label}</span>
                        {method.tag && (
                          <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${method.tagColor}`}>
                            {method.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{method.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                        <span>Fee: <span className="font-semibold text-slate-600">{method.fee}</span></span>
                        <span>Time: <span className="font-semibold text-slate-600">{method.time}</span></span>
                      </div>
                    </div>

                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "border-[#03cd8c] bg-[#03cd8c]" : "border-slate-300"
                    }`}>
                      {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Security note */}
          <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#03cd8c] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              All transactions are encrypted and secured by EVzone. Your funds are protected at all times.
            </p>
          </section>

          {/* Continue button */}
          <section className="pb-4">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!selected}
              className={`w-full rounded-full py-3.5 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                selected
                  ? "bg-[#03cd8c] text-white active:scale-[0.98] transition-transform"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </main>

        {/* Bottom Navigation */}
        <nav className="app-bottom-nav flex" style={{ background: "#03cd8c" }}>
          <BottomNavItem icon={Home} label="Home" active={navActive("home")} onClick={() => navigate("/driver/dashboard/online")} />
          <BottomNavItem icon={Briefcase} label="Manager" active={navActive("manager")} onClick={() => navigate("/driver/jobs/list")} />
          <BottomNavItem icon={Wallet} label="Wallet" active={navActive("wallet")} onClick={() => navigate("/driver/earnings/overview")} />
          <BottomNavItem icon={Settings} label="Settings" active={navActive("settings")} onClick={() => navigate("/driver/preferences")} />
        </nav>
      </div>
    </div>
  );
}
