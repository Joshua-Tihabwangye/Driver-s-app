# Release Checklist

Updated: 2026-03-24

## Pre-Release Gates

- [ ] `npm run typecheck`
- [ ] `npm run check:route-hygiene`
- [ ] `npm run check:ride-regression`
- [ ] `npm run check:shared-workflow`
- [ ] `npm run check:qa-smoke`
- [ ] Verify no unresolved lint/build warnings in CI logs
- [ ] Confirm docs were updated (`docs/final-current-parity-matrix.md`, `docs/routing-flow-notes.md`)

## Manual Test Matrix

| Area | Scenario | Expected Result |
| --- | --- | --- |
| Registration | Select Ride + Delivery + Rental, continue onboarding | Role saved, onboarding opens, selected categories persist after reload |
| Preferences | Toggle categories and save | Onboarding role label + task allocation update immediately and persist |
| Preferences | Disable Ride while shared is on | Shared toggles off automatically and stays off |
| Onboarding | Open Info Breakdowns | Role line shows selected category label, links remain functional |
| Dashboard | Open Active Dashboard with restricted categories | Only selected categories show as pills |
| Requests Filter | `/driver/jobs/list` category selector | Only assignable categories appear, unsupported query resets to `all` |
| History Filter | `/driver/history/rides` filter chips | Only assignable categories appear |
| Ride Flow | Accept ride, complete trip | Trip moves to history and details open via canonical route |
| Shared Flow | Accept shared, progress all stops, complete | Completion writes shared trip + shared revenue events |
| Rental Flow | Open rental job, start navigation, end rental | Completion persists to history and Rental details open |
| Tour Flow | Open tour schedule, complete tour | Tour completion persists and details route opens |
| Ambulance Flow | Accept incoming ambulance job, complete mission | Completion persists and ambulance history details open |
| Details Strictness | Open history detail route with unknown id | Explicit “record not found” state, no silent fallback data |
| Deprecated Routes | Try removed aliases (`/app/home`, `/driver/jobs/active-with-additional`) | No alias behavior; app follows current canonical routing |
