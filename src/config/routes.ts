// ── Route Configuration ──────────────────────────────────
// Extracted from App.tsx for clean separation of routing config from rendering.

import { SAMPLE_IDS } from "../data/constants";

export interface ScreenConfig {
  id: string;
  label: string;
  path: string;
  previewPath?: string;
}

/**
 * Returns the route for a given job type, with an optional fallback.
 */
export function getRouteForJobType(
  jobType: string,
  routeMap: Record<string, string>,
  fallback = "/driver/jobs/list"
): string {
  return routeMap[jobType] || fallback;
}

/**
 * Returns the preview path (with sample IDs substituted) or the raw path.
 */
export function getPreviewPath(screen: ScreenConfig): string {
  return screen.previewPath ?? screen.path;
}

// Re-export for convenience
export { SAMPLE_IDS };
