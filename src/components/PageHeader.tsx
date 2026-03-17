import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Standardized page header with back button and centered title.
 * Used across all non-dashboard screens for consistent navigation.
 */
export default function PageHeader({
  title,
  subtitle,
  onBack,
  rightAction,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="relative shrink-0" style={{ minHeight: 90 }}>
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              {subtitle && (
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-slate-400">
                  {subtitle}
                </span>
              )}
              <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight text-center">
                {title}
              </p>
            </div>
          </div>
        </div>
        <div className="w-10 flex items-center justify-end">
          {rightAction || null}
        </div>
      </header>
    </div>
  );
}
