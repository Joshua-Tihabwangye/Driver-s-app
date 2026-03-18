import { ChevronLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Standardized page header with optional back button and left-aligned title.
 * Scrolls away naturally with page content (not sticky).
 */
export default function PageHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  hideBack = false,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  hideBack?: boolean;
}) {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <header className="shrink-0 flex items-center justify-between px-5 pt-8 pb-4 gap-3">
      {/* Left: back button + title */}
      <div className="flex items-center gap-3 min-w-0">
        {!hideBack && (
          <button
            onClick={handleBack}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-[var(--evz-brand-green-border)] shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-slate-900 dark:text-white" />
          </button>
        )}
        <div className="flex flex-col min-w-0">
          {subtitle && (
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
          <p className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
            {title}
          </p>
        </div>
      </div>
      {/* Right: optional action */}
      {rightAction && (
        <div className="shrink-0 flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
}

