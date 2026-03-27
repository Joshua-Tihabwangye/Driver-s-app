# Driver App Architecture Audit Report
**Date**: March 27, 2026
**Subject**: Supervisor QA vs. Produced System Route Integrity

## Executive Summary
This audit compares the **Supervisor QA Mode** (a development-only route-switching UI) against the **Real Post-Onboarding Driver System** (the actual navigation paths available to a driver). The goal is to identify mismatches, orphaned pages, and routing gaps to ensure functional parity and platform integrity.

---

## 1. Primary Discrepancies: QA vs. Real System

### A. Atomic Exposure (QA) vs. Tabbed Hierarchy (Real)
- **QA Mode**: Exposes every individual screen in `src/config/routes.ts` as a flat selectable list. It allows jumping into transient screens (e.g., `TrainingQuizPassed`) or sub-flow steps (e.g., `VehicleAccessories`) out of context.
- **Real System**: Uses a restricted 4-tab top-level hierarchy (`Home`, `Jobs`, `Earnings`, `More`). Access to most screens is gated by the driver's current state and specific user interactions (e.g., clicking a job card).

### B. Orphaned Screens (Visible in QA, Unreachable in Real)
We identified several "orphan" screens that exist in the codebase but have no corresponding navigation path in the post-onboarding UI:
- **`ActiveDashboard` (`/driver/dashboard/active`)**: This is a high-fidelity performance dashboard that is currently redundant with `OnlineDashboard`. It is not linked in any menu.
- **`DocumentReview` / `DocumentRejected`**: These the user can jump to via QA mode, but in reality, they are only triggered via the document verification backend/polling logic which is not yet fully mirrored in the local navigation tree.

---

## 2. Navigation Flow & Integrity Gaps

### A. The "Blocked" State Entry Point
- **Logic Found**: If a driver is logged in but `canGoOnline` is false, the `OfflineDashboard` correctly displays a "View Required Actions" button.
- **The Gap**: Once a driver is **Online**, there is no easy way to navigate back to the `RequiredActionsDashboard` unless they go offline first. If an account requirement expires (e.g., insurance), the driver might get "stuck" without a clear path to the fix until the next login session or offline toggle.

### B. Route Guarding Reliability
- **Mechanism**: `App.tsx` uses a `PUBLIC_SCREEN_IDS` set to gate `RequireAuth`.
- **Finding**: Most onboarding and training pages are marked as "Public". This is safe for registration but means a malicious or curious user can access the training quiz or vehicle setup without a session if they know the URL path.

---

## 3. Page Inventory & Accessibility Matrix

| Screen ID | Path | Real System Access Point | Status |
| :--- | :--- | :--- | :--- |
| `OnlineDashboard` | `/driver/dashboard/online` | Home Tab | **OK** |
| `RequiredActionsDashboard` | `/driver/dashboard/required-actions` | `OfflineDashboard` (Go Online button) | **OK** |
| `ActiveDashboard` | `/driver/dashboard/active` | **None Found** | **Orphaned** |
| `SafetyHub` | `/driver/safety/hub` | More Menu / Dashboard Quick Action | **OK** |
| `ManageVehicles` | `/driver/manage/vehicles` | More Menu | **OK** |
| `TrainingIntro` | `/driver/training/intro` | `RequiredActionsDashboard` | **OK** |

---

## 4. Recommendations for System Integrity

1.  **Consolidate Dashboards**: Either merge `ActiveDashboard` features into `OnlineDashboard` or replace the Home tab route with `ActiveDashboard` if it is the intended "Premium" view.
2.  **Persistent Required Actions**: Add a "Documents & Compliance" link to the `MoreMenu` so drivers can check their status even when online.
3.  **Strict Auth for Onboarding**: Move onboarding routes (except `DriverRegistration`) out of `PUBLIC_SCREEN_IDS` once a user record is partially created, ensuring sessions protect sensitive data like vehicle details.

---
**Audit Performed by Antigravity AI**
