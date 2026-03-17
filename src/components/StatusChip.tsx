import type { JobCategory } from "../data/types";
import { JOB_CATEGORY_STYLES } from "../data/constants";

/**
 * Reusable job-type status chip used across Jobs, History, Search, and detail screens.
 * Renders a colored pill indicating the job category.
 */
export default function StatusChip({ jobType }: { jobType: JobCategory }) {
  const style = JOB_CATEGORY_STYLES[jobType] || JOB_CATEGORY_STYLES.ride;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${style.bg} ${style.border} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
