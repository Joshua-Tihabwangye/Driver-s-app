import type { JobCategory } from "../data/types";
import { JOB_CATEGORY_STYLES, GENERIC_STATUS_STYLES } from "../data/constants";

/**
 * Reusable status chip used across the application.
 * Supports either a job category or a generic status string.
 */
export default function StatusChip({ 
  jobType, 
  status 
}: { 
  jobType?: JobCategory; 
  status?: string;
}) {
  let style = JOB_CATEGORY_STYLES.ride;
  let label = "Unknown";

  if (jobType && JOB_CATEGORY_STYLES[jobType]) {
    style = JOB_CATEGORY_STYLES[jobType];
    label = style.label;
  } else if (status && GENERIC_STATUS_STYLES[status.toLowerCase()]) {
    style = GENERIC_STATUS_STYLES[status.toLowerCase()];
    label = style.label;
  } else if (status) {
    label = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${style.bg} ${style.border} ${style.text}`}
    >
      {label}
    </span>
  );
}
