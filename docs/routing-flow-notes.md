# Routing And Flow Notes

Updated: 2026-03-24

## Canonical Route Families

- Auth entry:
  - `/app/register-services`
  - `/auth/register`
  - `/driver/register`
- Generic request intake:
  - `/driver/jobs/incoming`
  - `/driver/jobs/incoming/rich`
  - `/driver/jobs/list`
- Ride private lifecycle:
  - `/driver/trip/:tripId/navigate-to-pickup`
  - `/driver/trip/:tripId/navigation`
  - `/driver/trip/:tripId/arrived`
  - `/driver/trip/:tripId/waiting`
  - `/driver/trip/:tripId/verify-rider`
  - `/driver/trip/:tripId/start`
  - `/driver/trip/:tripId/in-progress`
  - `/driver/trip/:tripId/completed`
- Specialized lifecycle:
  - Rental: `/driver/rental/job/:jobId`
  - Tour: `/driver/tour/:tourId/today`
  - Ambulance: `/driver/ambulance/job/:jobId/status`
- History details:
  - Ride: `/driver/history/ride/:tripId`
  - Shared: `/driver/history/shared/:tripId`
  - Delivery: `/driver/history/delivery/:tripId`
  - Rental: `/driver/history/rental/:tripId`
  - Tour: `/driver/history/tour/:tripId`
  - Ambulance: `/driver/history/ambulance/:tripId`

## Deprecated Aliases Removed

- `/app/home`
- `/driver/jobs/active-with-additional`
- `/driver/trip/:tripId/en-route-details`

## Task Category Source Of Truth

- `driverRoleSelection` (`StoreContext`) is persisted in localStorage.
- `assignableJobTypes` is derived only via `getAssignableJobTypesFromRoleConfig(...)`.
- Task selection/labels/conversion helpers are centralized in:
  - `src/utils/taskCategories.ts`
- UI surfaces using this single model:
  - Driver registration service selection
  - Driver preferences task chips + role label + projected allocation
  - Onboarding role breakdown label
  - Dashboard category pills
  - Assignment filters (requests/history)

## QA Gate Entry Points

- `npm run check:route-hygiene`
- `npm run check:ride-regression`
- `npm run check:shared-workflow`
- `npm run check:qa-smoke`
