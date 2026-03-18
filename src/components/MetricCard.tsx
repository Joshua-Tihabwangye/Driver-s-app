import React from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  onClick?: () => void;
  variant?: "default" | "active";
}

/**
 * Standardised metric/stat card for dashboards.
 */
export default function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  onClick,
  variant = "default",
}: MetricCardProps) {
  const clickableStyles = onClick
    ? "active:scale-[0.98] transition-all cursor-pointer hover:border-brand-highlight/30"
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex flex-col rounded-2xl bg-white dark:bg-slate-800 px-4 py-4 shadow-sm border border-[var(--evz-brand-green-border)] flex-1 min-w-[0] group hover:scale-[1.02] hover:shadow-md hover:border-brand-active/30 transition-all duration-300 ${clickableStyles} ${
        variant === "active" ? "border-brand-active bg-brand-active/10 dark:bg-brand-active/20" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2 w-full text-left">
        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] truncate">
          {label}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-700 text-slate-400 group-hover:bg-brand-active/10 group-hover:text-brand-active dark:group-hover:bg-brand-active/20 transition-colors shadow-sm border border-brand-active/10">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <div className="text-left w-full">
        <span className="text-base font-medium text-slate-900 dark:text-slate-100 tracking-tight truncate block">
          {value}
        </span>
        {sub && (
          <span className="mt-1 text-[9px] text-slate-400 dark:text-slate-500 font-normal leading-tight block truncate">
            {sub}
          </span>
        )}
      </div>
    </button>
  );
}
