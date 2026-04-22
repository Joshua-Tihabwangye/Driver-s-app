import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  CASHOUT_METHODS_BY_ID,
  CASHOUT_STEPS,
  type CashoutMethodId,
  type CashoutStepId,
} from "./cashoutConfig";

type FormState = {
  mobileNetwork: "MTN MoMo" | "Airtel Money";
  mobileMsisdn: string;
  mobileLegalName: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranchCode: string;
  walletIdentifier: string;
  walletOwnerName: string;
  walletNarration: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardPayoutSpeed: "standard" | "instant";
  authCode: string;
};

const INITIAL_FORM: FormState = {
  mobileNetwork: "MTN MoMo",
  mobileMsisdn: "",
  mobileLegalName: "",
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankBranchCode: "",
  walletIdentifier: "DRV-UG-00118468",
  walletOwnerName: "",
  walletNarration: "Driver weekly earnings payout",
  cardHolderName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  cardPayoutSpeed: "standard",
  authCode: "",
};

const STEP_LABELS: Record<CashoutStepId, string> = {
  details: "Recipient Details",
  review: "Review",
  authorize: "Authorize",
  success: "Completed",
};

function toDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

function formatDisplayAmount(raw: string): string {
  const cleaned = toDigits(raw);
  if (!cleaned) return "0";
  return Number(cleaned).toLocaleString("en-US");
}

function parseStep(stepRaw: string | undefined): CashoutStepId {
  if (stepRaw === "review") return "review";
  if (stepRaw === "authorize") return "authorize";
  if (stepRaw === "success") return "success";
  return "details";
}

function maskCardNumber(value: string): string {
  const digits = toDigits(value);
  if (digits.length < 4) return "****";
  return `**** **** **** ${digits.slice(-4)}`;
}

function resolveFeeAmount(amount: number, feeLabel: string, payoutSpeed: "standard" | "instant") {
  if (feeLabel === "Free") return 0;
  if (feeLabel === "UGX 500") return 500;
  if (feeLabel === "2.5%") {
    const base = Math.round(amount * 0.025);
    if (payoutSpeed === "instant") {
      return base + 700;
    }
    return base;
  }
  return 0;
}

export default function CashOutMethodFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { methodId: methodIdRaw, step: stepRaw } = useParams();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const methodId = methodIdRaw as CashoutMethodId | undefined;
  const method = methodId ? CASHOUT_METHODS_BY_ID[methodId] : null;

  if (!method || !methodId) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-6 text-center space-y-4">
        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">Invalid Cashout Method</h1>
        <p className="text-sm text-slate-500">This payout method does not exist.</p>
        <button
          type="button"
          onClick={() => navigate("/driver/earnings/cashout")}
          className="rounded-full bg-[#03cd8c] px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Cash Out
        </button>
      </div>
    );
  }

  const step = parseStep(stepRaw);
  const stepIndex = CASHOUT_STEPS.indexOf(step);

  const amountRaw = searchParams.get("amount") || "25,750";
  const displayAmount = formatDisplayAmount(amountRaw);
  const amountValue = Number(toDigits(amountRaw) || "0");
  const feeAmount = resolveFeeAmount(amountValue, method.fee, form.cardPayoutSpeed);
  const netAmount = Math.max(0, amountValue - feeAmount);

  const methodTime =
    method.id === "visa_mastercard" && form.cardPayoutSpeed === "instant"
      ? "Typically within 30 minutes"
      : method.time;

  const routeFor = (nextStep: CashoutStepId) =>
    `/driver/earnings/cashout/${method.id}/${nextStep}?amount=${encodeURIComponent(displayAmount)}`;

  const complianceHint = useMemo(() => {
    if (method.id === "mobile_money") {
      return "Use a wallet-registered phone number, keep your MoMo PIN private, and verify via SMS receipt. Transfers are treated as non-reversible after processing.";
    }
    if (method.id === "bank_transfer") {
      return "Account name and account number must match your bank KYC records. Some banks require a branch code.";
    }
    if (method.id === "evzone_wallet") {
      return "Wallet transfers use provider identifier details and are verified before final settlement.";
    }
    return "Use an eligible debit card and issuer security verification for faster card payouts.";
  }, [method.id]);

  const canProceedFromDetails = useMemo(() => {
    if (method.id === "mobile_money") {
      return Boolean(form.mobileMsisdn.trim() && form.mobileLegalName.trim());
    }
    if (method.id === "bank_transfer") {
      return Boolean(
        form.bankName.trim() &&
          form.bankAccountName.trim() &&
          form.bankAccountNumber.trim()
      );
    }
    if (method.id === "evzone_wallet") {
      return Boolean(form.walletIdentifier.trim() && form.walletOwnerName.trim());
    }
    return Boolean(
      form.cardHolderName.trim() &&
        toDigits(form.cardNumber).length >= 12 &&
        form.cardExpiry.trim() &&
        toDigits(form.cardCvv).length >= 3
    );
  }, [form, method.id]);

  const canProceedFromAuthorize = useMemo(() => {
    if (method.id === "mobile_money") {
      return true;
    }
    if (method.id === "bank_transfer") {
      return toDigits(form.authCode).length === 6;
    }
    if (method.id === "evzone_wallet") {
      return toDigits(form.authCode).length === 4;
    }
    return toDigits(form.authCode).length === 6;
  }, [form.authCode, method.id]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full ">
      <div className="relative" style={{ minHeight: 92 }}>
        <header className="relative z-10 flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => {
                if (step === "details") {
                  navigate("/driver/earnings/cashout");
                  return;
                }
                const prev = CASHOUT_STEPS[Math.max(0, stepIndex - 1)];
                navigate(routeFor(prev));
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-lg active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5 text-slate-900" />
            </button>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <h1 className="text-base font-black text-slate-900 tracking-tight text-center">
                {method.label} Cashout
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Step {stepIndex + 1} / {CASHOUT_STEPS.length} - {STEP_LABELS[step]}
              </span>
            </div>
          </div>
          <div className="w-10" />
        </header>
      </div>

      <main className="flex-1 px-5 pt-4 pb-16 space-y-4 overflow-y-auto scrollbar-hide">
        <section className="rounded-2xl bg-[#0b1e3a] text-white p-5 space-y-1 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#a5f3fc]">Simulation Mode</p>
          <p className="text-2xl font-bold tracking-tight">UGX {displayAmount}</p>
          <p className="text-[11px] text-slate-300">No real funds move in this flow. This mirrors production payout steps.</p>
        </section>

        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-3 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-relaxed">{complianceHint}</p>
        </section>

        {step === "details" && (
          <section className="rounded-2xl border-2 border-orange-500/10 bg-cream p-4 space-y-4 shadow-sm">
            {method.id === "mobile_money" && (
              <>
                <label className="text-xs font-semibold text-slate-700">Network</label>
                <div className="grid grid-cols-2 gap-2">
                  {["MTN MoMo", "Airtel Money"].map((network) => (
                    <button
                      key={network}
                      type="button"
                      onClick={() => updateField("mobileNetwork", network as FormState["mobileNetwork"])}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                        form.mobileNetwork === network
                          ? "border-[#03cd8c] bg-[#e6fff7] text-[#03cd8c]"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      {network}
                    </button>
                  ))}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Mobile Money Number</label>
                  <input
                    value={form.mobileMsisdn}
                    onChange={(e) => updateField("mobileMsisdn", e.target.value)}
                    placeholder="+2567XXXXXXXX"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Registered Legal Name</label>
                  <input
                    value={form.mobileLegalName}
                    onChange={(e) => updateField("mobileLegalName", e.target.value)}
                    placeholder="Name on wallet KYC"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
              </>
            )}

            {method.id === "bank_transfer" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Bank Name</label>
                  <input
                    value={form.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    placeholder="e.g. Stanbic Bank Uganda"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Account Name</label>
                  <input
                    value={form.bankAccountName}
                    onChange={(e) => updateField("bankAccountName", e.target.value)}
                    placeholder="Name on bank account"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Account Number</label>
                  <input
                    value={form.bankAccountNumber}
                    onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                    placeholder="10-14 digits"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Branch Code (if applicable)</label>
                  <input
                    value={form.bankBranchCode}
                    onChange={(e) => updateField("bankBranchCode", e.target.value)}
                    placeholder="Optional depending on destination bank"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
              </>
            )}

            {method.id === "evzone_wallet" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">EVzone Wallet Identifier</label>
                  <input
                    value={form.walletIdentifier}
                    onChange={(e) => updateField("walletIdentifier", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Wallet Owner Name</label>
                  <input
                    value={form.walletOwnerName}
                    onChange={(e) => updateField("walletOwnerName", e.target.value)}
                    placeholder="Recipient wallet legal name"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Narration</label>
                  <input
                    value={form.walletNarration}
                    onChange={(e) => updateField("walletNarration", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
              </>
            )}

            {method.id === "visa_mastercard" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Cardholder Name</label>
                  <input
                    value={form.cardHolderName}
                    onChange={(e) => updateField("cardHolderName", e.target.value)}
                    placeholder="Name on debit card"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Debit Card Number</label>
                  <input
                    value={form.cardNumber}
                    onChange={(e) => updateField("cardNumber", e.target.value)}
                    placeholder="16-digit Visa or Mastercard"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Expiry (MM/YY)</label>
                    <input
                      value={form.cardExpiry}
                      onChange={(e) => updateField("cardExpiry", e.target.value)}
                      placeholder="08/30"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">CVV</label>
                    <input
                      value={form.cardCvv}
                      onChange={(e) => updateField("cardCvv", e.target.value)}
                      placeholder="123"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Payout Speed</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateField("cardPayoutSpeed", "standard")}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                        form.cardPayoutSpeed === "standard"
                          ? "border-[#03cd8c] bg-[#e6fff7] text-[#03cd8c]"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("cardPayoutSpeed", "instant")}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                        form.cardPayoutSpeed === "instant"
                          ? "border-[#03cd8c] bg-[#e6fff7] text-[#03cd8c]"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      Instant
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {step === "review" && (
          <section className="rounded-2xl border-2 border-orange-500/10 bg-cream p-4 space-y-3 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Payout Review</h2>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Method</span><span className="font-semibold text-slate-900">{method.label}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-900">UGX {displayAmount}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Fee</span><span className="font-semibold text-slate-900">UGX {feeAmount.toLocaleString("en-US")}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">You receive</span><span className="font-bold text-[#03cd8c]">UGX {netAmount.toLocaleString("en-US")}</span></div>
            <div className="flex justify-between text-[13px]"><span className="text-slate-500">Expected arrival</span><span className="font-semibold text-slate-900">{methodTime}</span></div>
            <div className="h-px bg-orange-500/10" />
            {method.id === "mobile_money" && (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Destination: {form.mobileNetwork} - {form.mobileMsisdn || "(not set)"} - {form.mobileLegalName || "(not set)"}
              </p>
            )}
            {method.id === "bank_transfer" && (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Destination: {form.bankName || "(bank)"}, Acc {form.bankAccountNumber || "(number)"}, Holder {form.bankAccountName || "(name)"}
              </p>
            )}
            {method.id === "evzone_wallet" && (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Destination: Provider flutterwave, Identifier {form.walletIdentifier || "(identifier)"}
              </p>
            )}
            {method.id === "visa_mastercard" && (
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Destination card: {maskCardNumber(form.cardNumber)} ({form.cardPayoutSpeed === "instant" ? "Instant payout" : "Standard payout"})
              </p>
            )}
          </section>
        )}

        {step === "authorize" && (
          <section className="rounded-2xl border-2 border-orange-500/10 bg-cream p-4 space-y-4 shadow-sm">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Authorization</h2>
            {method.id === "mobile_money" && (
              <p className="text-[12px] text-slate-600 leading-relaxed">
                A mobile money approval prompt was sent to {form.mobileMsisdn || "your registered number"}. Authorize on your phone with your PIN, then continue.
              </p>
            )}
            {method.id === "bank_transfer" && (
              <>
                <p className="text-[12px] text-slate-600 leading-relaxed">Enter the 6-digit OTP sent to your verified phone/email to authorize this bank payout.</p>
                <input
                  value={form.authCode}
                  onChange={(e) => updateField("authCode", e.target.value)}
                  placeholder="6-digit OTP"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </>
            )}
            {method.id === "evzone_wallet" && (
              <>
                <p className="text-[12px] text-slate-600 leading-relaxed">Enter your 4-digit wallet security PIN to confirm this internal wallet payout simulation.</p>
                <input
                  value={form.authCode}
                  onChange={(e) => updateField("authCode", e.target.value)}
                  placeholder="4-digit wallet PIN"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </>
            )}
            {method.id === "visa_mastercard" && (
              <>
                <p className="text-[12px] text-slate-600 leading-relaxed">Enter issuer challenge code (3DS/OTP) to complete card payout authorization.</p>
                <input
                  value={form.authCode}
                  onChange={(e) => updateField("authCode", e.target.value)}
                  placeholder="6-digit issuer code"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </>
            )}
          </section>
        )}

        {step === "success" && (
          <section className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 space-y-3 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Cashout Simulated</h2>
            <p className="text-sm text-slate-600">
              UGX {displayAmount} via {method.label} was simulated successfully.
            </p>
            <p className="text-xs text-slate-500">Expected real-world timeline: {methodTime}</p>
            <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-left text-[11px] text-slate-600">
              Transfer status lifecycle:{" "}
              <span className="font-semibold text-slate-900">NEW {"->"} PENDING {"->"} SUCCESSFUL</span>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-3 flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-[#03cd8c] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 leading-relaxed">
            This is a simulation flow based on production payout steps. No real authorization or settlement is executed.
          </p>
        </section>

        <section className="pb-4 flex gap-2">
          {step !== "success" ? (
            <button
              type="button"
              onClick={() => {
                const next = CASHOUT_STEPS[Math.min(CASHOUT_STEPS.length - 1, stepIndex + 1)];
                navigate(routeFor(next));
              }}
              disabled={
                (step === "details" && !canProceedFromDetails) ||
                (step === "authorize" && !canProceedFromAuthorize)
              }
              className={`w-full rounded-full py-3.5 text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                (step === "details" && !canProceedFromDetails) ||
                (step === "authorize" && !canProceedFromAuthorize)
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-[#03cd8c] text-white active:scale-[0.98]"
              }`}
            >
              {step === "authorize" ? "Submit Authorization" : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate("/driver/earnings/overview")}
                className="w-full rounded-full bg-[#03cd8c] py-3.5 text-sm font-bold text-white"
              >
                Back to Earnings
              </button>
              <button
                type="button"
                onClick={() => navigate("/driver/earnings/cashout")}
                className="w-full rounded-full border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700"
              >
                New Cashout
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
