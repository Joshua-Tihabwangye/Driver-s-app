import { ArrowRight, CheckCircle2, ChevronLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CASHOUT_METHODS } from "./cashoutConfig";

export default function CashOutScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("25,750");

  const balance = "UGX 25,750";

  const handleContinue = () => {
    if (!selected) return;
    navigate(
      `/driver/earnings/cashout/${selected}/details?amount=${encodeURIComponent(amount)}`
    );
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="relative" style={{ minHeight: 90 }}>
        <header className="relative z-10 flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-black text-slate-900 tracking-tight leading-tight text-center">Cash Out</h1>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-5 pt-4 pb-16 space-y-5 overflow-y-auto scrollbar-hide">
        <section className="rounded-2xl bg-[#0b1e3a] text-white p-5 space-y-1 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">Available Balance</p>
          <p className="text-2xl font-bold tracking-tight">{balance}</p>
          <p className="text-[11px] text-slate-300">Choose payout method to open full simulated transaction pages</p>
        </section>

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

        <section className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Choose payment method</h2>

          <div className="space-y-2.5">
            {CASHOUT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = selected === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelected(method.id)}
                  className={`w-full rounded-2xl border-2 p-3.5 flex items-center gap-3.5 text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-orange-500 bg-[#fffdf5] shadow-md ring-1 ring-orange-500/20"
                      : "border-orange-500/10 bg-cream hover:border-orange-500/30 shadow-sm"
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
                      <span>
                        Fee: <span className="font-semibold text-slate-600">{method.fee}</span>
                      </span>
                      <span>
                        Time: <span className="font-semibold text-slate-600">{method.time}</span>
                      </span>
                    </div>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? "border-[#03cd8c] bg-[#03cd8c]" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#03cd8c] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            This opens a realistic simulation flow for each payout method. No real transfer is executed.
          </p>
        </section>

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
            Continue to Method Steps
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    </div>
  );
}
