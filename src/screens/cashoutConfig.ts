import { Building2, CreditCard, Smartphone, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type CashoutMethodId =
  | "mobile_money"
  | "bank_transfer"
  | "evzone_wallet"
  | "visa_mastercard";

export type CashoutStepId = "details" | "review" | "authorize" | "success";

export interface CashoutMethod {
  id: CashoutMethodId;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  tag: string | null;
  tagColor: string;
  fee: string;
  time: string;
}

export const CASHOUT_STEPS: CashoutStepId[] = [
  "details",
  "review",
  "authorize",
  "success",
];

export const CASHOUT_METHODS: CashoutMethod[] = [
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
    time: "1-2 business days",
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
    time: "1-3 business days",
  },
];

export const CASHOUT_METHODS_BY_ID: Record<CashoutMethodId, CashoutMethod> = {
  mobile_money: CASHOUT_METHODS[0],
  bank_transfer: CASHOUT_METHODS[1],
  evzone_wallet: CASHOUT_METHODS[2],
  visa_mastercard: CASHOUT_METHODS[3],
};
