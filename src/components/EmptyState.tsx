import { Inbox } from "lucide-react";
import React from "react";

/**
 * Reusable empty state component for list pages.
 * Shows when no data matches the current filters.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing Found",
  description = "Try adjusting your filters or check back later.",
}: {
  icon?: React.ElementType;
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-16 flex flex-col items-center justify-center text-center">
      <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-slate-300 dark:text-slate-500" />
      </div>
      <p className="text-sm font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-2 max-w-[220px]">
        {description}
      </p>
    </div>
  );
}
