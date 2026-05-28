# Cross-Frontend API Endpoint Audit (4 Frontends -> 1 Backend)

Date: 2026-05-14

Scope audited:
- Rider: `/home/developer/Projects/rider`
- Driver: `/home/developer/Projects/Driver-s-app`
- Fleet Partner: `/home/developer/Projects/FleetPartnerAPP`
- Rides Admin: `/home/developer/Projects/Rides-Admin`
- Backend reference: `/home/developer/Projects/backend/src`

Base API prefix assumed by all frontends: `/api/v1`

## 1) Rider App Endpoint Matrix

### Auth + compatibility
- `POST /auth/register` -> `AuthController` (`src/auth/auth.controller.ts`) -> Present
- `POST /auth/login` -> `AuthController` -> Present
- `POST /auth/refresh` -> `AuthController` -> Present
- `POST /auth/forgot-password` -> `AuthController` -> Present
- `POST /auth/verify-otp` -> `AuthController` -> Present
- `POST /auth/reset-password` -> `AuthController` -> Present
- `GET /compat/flags/:appId` -> `CompatibilityContractController` (`src/compatibility/compatibility.controller.ts`) -> Present
- `GET /compat/canonical-routes/:appId` -> `CompatibilityContractController` -> Present

### Rider domain
- `GET /riders/me/profile` -> `RiderController` -> Present
- `GET /riders/me/trips/active` -> `RiderController` -> Present
- `GET /riders/me/trips/history` -> `RiderController` -> Present
- `POST /riders/me/trips/request` -> `RiderController` -> Present
- `PATCH /riders/me/trips/:tripId/tracking` -> `RiderController` -> Present
- `GET /riders/me/notifications` -> `NotificationsController` (`/:userType/me/notifications`) -> Present
- `GET /riders/me/deliveries` -> `RiderDeliveryController` -> Present
- `GET /riders/me/deliveries/:orderId` -> `RiderDeliveryController` -> Present
- `POST /riders/me/deliveries` -> `RiderDeliveryController` -> Present
- `PATCH /riders/me/deliveries/:orderId` -> `RiderDeliveryController` -> Present
- `POST /riders/me/deliveries/:orderId/cancel` -> `RiderDeliveryController` -> Present
- `GET /riders/me/rentals` -> `RiderController` -> Present
- `GET /riders/me/rentals/:rentalId` -> `RiderController` -> Present
- `POST /riders/me/rentals` -> `RiderController` -> Present
- `PATCH /riders/me/rentals/:rentalId` -> `RiderController` -> Present
- `POST /riders/me/rentals/:rentalId/cancel` -> `RiderController` -> Present
- `GET /riders/me/tours` -> `RiderController` -> Present
- `GET /riders/me/tours/:tourId` -> `RiderController` -> Present
- `POST /riders/me/tours` -> `RiderController` -> Present
- `POST /riders/me/tours/:tourId/cancel` -> `RiderController` -> Present
- `GET /riders/me/ambulances` -> `RiderController` -> Present
- `GET /riders/me/ambulances/:ambulanceId` -> `RiderController` -> Present
- `POST /riders/me/ambulances` -> `RiderController` -> Present
- `PATCH /riders/me/ambulances/:ambulanceId` -> `RiderController` -> Present
- `POST /riders/me/ambulances/:ambulanceId/cancel` -> `RiderController` -> Present
- `GET /riders/me/wallet` -> `RiderController` -> Present
- `GET /riders/me/wallet/transactions` -> `RiderController` -> Present
- `GET /riders/me/payment-methods` -> `RiderController` -> Present
- `POST /riders/me/payment-intents` -> `RiderController` -> Present
- `POST /riders/me/payment-intents/:intentId/verify` -> `RiderController` -> Present
- `POST /riders/me/wallet/transfers` -> `RiderController` -> Present
- `GET /riders/me/wallet/transfers` -> `RiderController` -> Present
- `GET /riders/me/promos/eligible` -> `RiderController` -> Present
- `POST /riders/me/promos/apply` -> `RiderController` -> Present
- `GET /riders/me/commutes` -> `RiderController` -> Present
- `POST /riders/me/commutes` -> `RiderController` -> Present
- `PATCH /riders/me/commutes/:commuteId` -> `RiderController` -> Present
- `DELETE /riders/me/commutes/:commuteId` -> `RiderController` -> Present
- `GET /riders/me/preferences` -> `RiderController` -> Present
- `PATCH /riders/me/preferences` -> `RiderController` -> Present
- `GET /riders/me/emergency-contacts` -> `RiderController` -> Present
- `POST /riders/me/emergency-contacts` -> `RiderController` -> Present
- `PATCH /riders/me/emergency-contacts/:contactId` -> `RiderController` -> Present
- `DELETE /riders/me/emergency-contacts/:contactId` -> `RiderController` -> Present
- `POST /riders/me/sos` -> `RiderController` -> Present
- `GET /riders/me/sos/history` -> `RiderController` -> Present

### Realtime
- Socket namespace `/rider` (path `/socket.io`) -> `RiderRealtimeGateway` -> Present

### Rider map proxy endpoints used by frontend runtime
- `GET /api/osm/search?...`
- `GET /api/osm/reverse?...`
- `GET /api/osrm/route/v1/...`

Status: available via Rider Vite proxy in local dev. Not implemented in backend controllers.

## 2) Driver App Endpoint Matrix

### Auth + compatibility
- `POST /auth/register` -> `AuthController` -> Present
- `POST /auth/login` -> `AuthController` -> Present
- `POST /auth/forgot-password` -> `AuthController` -> Present
- `POST /auth/verify-otp` -> `AuthController` -> Present
- `POST /auth/reset-password` -> `AuthController` -> Present
- `POST /auth/refresh` -> `AuthController` -> Present
- `GET /compat/flags/:appId` -> `CompatibilityContractController` -> Present
- `GET /compat/canonical-routes/:appId` -> `CompatibilityContractController` -> Present

### Driver domain
- `GET /drivers/me` -> `DriverProfileController` -> Present
- `PATCH /drivers/me` -> `DriverProfileController` -> Present
- `GET /drivers/me/preferences` -> `DriverProfileController` -> Present
- `PATCH /drivers/me/preferences` -> `DriverProfileController` -> Present
- `GET /drivers/me/onboarding/checkpoints` -> `OnboardingController` -> Present
- `POST /drivers/me/presence/online` -> `PresenceLocationController` -> Present
- `POST /drivers/me/presence/offline` -> `PresenceLocationController` -> Present
- `GET /drivers/me/vehicles` -> `VehiclesController` -> Present
- `POST /drivers/me/vehicles` -> `VehiclesController` -> Present
- `PATCH /drivers/me/vehicles/:vehicleId` -> `VehiclesController` -> Present
- `DELETE /drivers/me/vehicles/:vehicleId` -> `VehiclesController` -> Present
- `GET /drivers/me/jobs` -> `JobsDispatchController` -> Present
- `POST /drivers/me/jobs/:jobId/accept` -> `JobsDispatchController` -> Present
- `POST /drivers/me/jobs/:jobId/reject` -> `JobsDispatchController` -> Present
- `GET /drivers/me/trips` -> `TripsController` -> Present
- `GET /drivers/me/trips/active` -> `TripsController` -> Present
- `POST /drivers/me/trips/:tripId/arrive` -> `TripsController` -> Present
- `POST /drivers/me/trips/:tripId/verify-rider` -> `TripsController` -> Present
- `POST /drivers/me/trips/:tripId/start` -> `TripsController` -> Present
- `POST /drivers/me/trips/:tripId/complete` -> `TripsController` -> Present
- `POST /drivers/me/trips/:tripId/cancel` -> `TripsController` -> Present
- `GET /drivers/me/trips/:tripId/safety` -> `SafetyController` -> Present
- `PUT /drivers/me/trips/:tripId/safety` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/temporary-stop/request` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/temporary-stop/respond` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/temporary-stop/resume` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/sos` -> `SafetyController` -> Present
- `GET /drivers/me/trips/:tripId/share-contacts` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/share-contacts` -> `SafetyController` -> Present
- `DELETE /drivers/me/trips/:tripId/share-contacts/:contactId` -> `SafetyController` -> Present
- `POST /drivers/me/trips/:tripId/share-link` -> `SafetyController` -> Present
- `GET /drivers/me/trips/:tripId/share-status` -> `SafetyController` -> Present
- `POST /locations/heartbeat` -> `PresenceLocationController` -> Present
- `GET /drivers/me/notifications` -> `NotificationsController` (`/:userType/me/notifications`) -> Present
- `GET /drivers/me/emergency-contacts` -> `SafetyController` -> Present
- `POST /drivers/me/emergency-contacts` -> `SafetyController` -> Present
- `PATCH /drivers/me/emergency-contacts/:contactId` -> `SafetyController` -> Present
- `DELETE /drivers/me/emergency-contacts/:contactId` -> `SafetyController` -> Present
- `GET /drivers/me/documents` -> `DocumentsController` (`/:userType/me/documents`) -> Present
- `POST /drivers/me/documents` -> `DocumentsController` -> Present
- `PATCH /drivers/me/documents/:documentId` -> `DocumentsController` -> Present
- `DELETE /drivers/me/documents/:documentId` -> `DocumentsController` -> Present
- `GET /drivers/me/documents/status` -> `DocumentsController` -> Present
- `GET /drivers/me/earnings/summary` -> `EarningsCashoutController` -> Present
- `GET /drivers/me/wallet` -> `EarningsCashoutController` -> Present
- `GET /drivers/me/earnings/events` -> `EarningsCashoutController` -> Present
- `POST /drivers/me/cashout/requests` -> `EarningsCashoutController` -> Present
- `GET /drivers/me/cashout/requests` -> `EarningsCashoutController` -> Present
- `GET /drivers/me/delivery/orders` -> `DeliveryController` -> Present
- `GET /drivers/me/training/modules` -> `SafetyController` -> Present
- `GET /drivers/me/training/modules/:moduleId` -> `SafetyController` -> Present
- `POST /drivers/me/training/modules/:moduleId/attempts` -> `SafetyController` -> Present
- `POST /drivers/me/training/modules/:moduleId/complete` -> `SafetyController` -> Present

### Realtime
- Socket namespace `/driver` (path `/socket.io`) -> `RealtimeGateway` -> Present

## 3) Fleet Partner App Endpoint Matrix

### Auth + compatibility
- `POST /auth/login` -> `AuthController` -> Present
- `POST /auth/register` -> `AuthController` -> Present
- `POST /auth/forgot-password` -> `AuthController` -> Present
- `POST /auth/verify-otp` -> `AuthController` -> Present
- `POST /auth/reset-password` -> `AuthController` -> Present
- `POST /auth/refresh` -> `AuthController` -> Present
- `GET /compat/flags/:appId` -> `CompatibilityContractController` -> Present
- `GET /compat/canonical-routes/:appId` -> `CompatibilityContractController` -> Present

### Fleet domain used by frontend APIs
- `GET /fleet/me/profile` -> `FleetController` -> Present
- `GET /fleet/me/branches` -> `FleetController` -> Present
- `GET /fleet/me/branches/:branchId` -> `FleetController` -> Present
- `GET /fleet/drivers` -> `FleetDriversController` -> Present
- `GET /fleet/drivers/:driverId` -> `FleetDriversController` -> Present
- `POST /fleet/drivers` -> `FleetDriversController` -> Present
- `PATCH /fleet/drivers/:driverId` -> `FleetDriversController` -> Present
- `DELETE /fleet/drivers/:driverId` -> `FleetDriversController` -> Present
- `GET /fleet/vehicles` -> `FleetVehiclesController` -> Present
- `POST /fleet/vehicles` -> `FleetVehiclesController` -> Present
- `PATCH /fleet/vehicles/:vehicleId` -> `FleetVehiclesController` -> Present
- `DELETE /fleet/vehicles/:vehicleId` -> `FleetVehiclesController` -> Present
- `GET /fleet/vehicles/:vehicleId/documents` -> `FleetVehiclesController` -> Present
- `POST /fleet/vehicles/:vehicleId/documents` -> `FleetVehiclesController` -> Present
- `GET /fleet/vehicles/:vehicleId/maintenance` -> `FleetVehiclesController` -> Present
- `POST /fleet/vehicles/:vehicleId/maintenance` -> `FleetVehiclesController` -> Present
- `GET /fleet/dispatches` -> `FleetOperationsController` -> Present
- `POST /fleet/dispatches` -> `FleetOperationsController` -> Present
- `GET /fleet/dispatches/:dispatchId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/dispatches/:dispatchId` -> `FleetOperationsController` -> Present
- `DELETE /fleet/dispatches/:dispatchId` -> `FleetOperationsController` -> Present
- `POST /fleet/dispatches/:dispatchId/assign` -> `FleetOperationsController` -> Present
- `GET /fleet/rentals` -> `FleetOperationsController` -> Present
- `POST /fleet/rentals` -> `FleetOperationsController` -> Present
- `GET /fleet/rentals/:rentalId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/rentals/:rentalId` -> `FleetOperationsController` -> Present
- `POST /fleet/rentals/:rentalId/cancel` -> `FleetOperationsController` -> Present
- `GET /fleet/tours` -> `FleetOperationsController` -> Present
- `POST /fleet/tours` -> `FleetOperationsController` -> Present
- `GET /fleet/tours/:tourId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/tours/:tourId` -> `FleetOperationsController` -> Present
- `POST /fleet/tours/:tourId/cancel` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles` -> `FleetOperationsController` -> Present
- `POST /fleet/school-shuttles` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/:serviceId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/school-shuttles/:serviceId` -> `FleetOperationsController` -> Present
- `POST /fleet/school-shuttles/:serviceId/cancel` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/routes` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/students` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/attendance` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/trips` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/attendants` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/payments` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/feedback` -> `FleetOperationsController` -> Present
- `GET /fleet/school-shuttles/trips/:tripId/live` -> `FleetOperationsController` -> Present
- `GET /fleet/compliance/incidents` -> `FleetOperationsController` -> Present
- `POST /fleet/compliance/incidents` -> `FleetOperationsController` -> Present
- `GET /fleet/compliance/incidents/:incidentId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/compliance/incidents/:incidentId` -> `FleetOperationsController` -> Present
- `GET /fleet/compliance/training-courses` -> `FleetOperationsController` -> Present
- `POST /fleet/compliance/training-courses` -> `FleetOperationsController` -> Present
- `GET /fleet/compliance/training-courses/:courseId` -> `FleetOperationsController` -> Present
- `PATCH /fleet/compliance/training-courses/:courseId` -> `FleetOperationsController` -> Present
- `DELETE /fleet/compliance/training-courses/:courseId` -> `FleetOperationsController` -> Present
- `GET /fleet/earnings/payouts` -> `FleetOperationsController` -> Present
- `GET /fleet/earnings/summary` -> `FleetOperationsController` -> Present
- `GET /fleet/earnings/statements/:statementId` -> `FleetOperationsController` -> Present
- `GET /fleet/earnings/payouts/:payoutId` -> `FleetOperationsController` -> Present
- `GET /fleet/me/notifications` -> `NotificationsController` (`/:userType/me/notifications`) -> Present
- `GET /fleet/rider-services` -> `FleetOperationsController` -> Present

### Realtime
- Socket namespace `/fleet` (path `/socket.io`) -> `FleetRealtimeGateway` -> Present

## 4) Rides Admin App Endpoint Matrix

### Auth + compatibility
- `POST /auth/login` -> `AuthController` -> Present
- `POST /auth/forgot-password` -> `AuthController` -> Present
- `POST /auth/refresh` -> `AuthController` -> Present
- `GET /compat/flags/:appId` -> `CompatibilityContractController` -> Present
- `GET /compat/canonical-routes/:appId` -> `CompatibilityContractController` -> Present

### Admin domain
- Riders: `GET /admin/riders`, `GET /admin/riders/:riderId`, `POST /admin/riders`, `PATCH /admin/riders/:riderId` -> `AdminUsersController` -> Present
- Drivers: `GET /admin/drivers`, `GET /admin/drivers/:driverId`, `POST /admin/drivers`, `PATCH /admin/drivers/:driverId` -> `AdminUsersController` -> Present
- Roles: `GET /admin/roles`, `GET /admin/roles/:roleId`, `POST /admin/roles`, `PATCH /admin/roles/:roleId` -> `AdminUsersController` -> Present
- Pricing zones: `GET /admin/pricing-zones`, `GET /admin/pricing-zones/:zoneId`, `POST /admin/pricing-zones`, `PATCH /admin/pricing-zones/:zoneId` -> `AdminPricingZoneController` -> Present
- Services: `GET /admin/services`, `PATCH /admin/services/:serviceId` -> `AdminConfigController` -> Present
- Agents: `GET /admin/agents`, `GET /admin/agents/:agentId`, `POST /admin/agents`, `PATCH /admin/agents/:agentId`, `DELETE /admin/agents/:agentId` -> `AdminOperationsController` -> Present
- Search: `GET /admin/search?query=...` -> `AdminOperationsController` -> Present
- Feature flags: `GET /admin/system/flags`, `PATCH /admin/system/flags/:flagKey` -> `AdminSystemController` -> Present
- Analytics: `GET /admin/analytics/finance`, `GET /admin/analytics/operations` -> `AdminOperationsController` -> Present
- Promos: `GET /admin/promos`, `POST /admin/promos`, `PATCH /admin/promos/:promoId` -> `AdminConfigController` -> Present
- Finance config: `GET /admin/finance/tax-config`, `PATCH /admin/finance/tax-config/:regionId`, `GET /admin/finance/invoice-templates`, `PATCH /admin/finance/invoice-templates/:templateId` -> `AdminConfigController` -> Present
- Training modules: `GET /admin/training/modules`, `POST /admin/training/modules`, `PATCH /admin/training/modules/:moduleId`, `DELETE /admin/training/modules/:moduleId` -> `AdminConfigController` -> Present
- Policies: `GET /admin/policies`, `POST /admin/policies`, `PATCH /admin/policies/:policyId`, `GET /admin/vertical-policies`, `PATCH /admin/vertical-policies/:verticalId` -> `AdminConfigController` -> Present
- Risk: `GET /admin/risk/cases`, `GET /admin/risk/cases/:caseId` -> `AdminOperationsController` -> Present
- Rider services: `GET /admin/rider-services`, `GET /admin/rider-services/:requestId` -> `AdminOperationsController` -> Present
- Audit: `GET /admin/system/audit-log` -> `AdminSystemController` -> Present
- Approvals: `GET /admin/approvals`, `GET /admin/approvals/:approvalId`, `PATCH /admin/approvals/:approvalId` -> `AdminOperationsController` -> Present
- Companies: `GET /admin/companies`, `GET /admin/companies/:companyId`, `PATCH /admin/companies/:companyId` -> `AdminOperationsController` -> Present

### Realtime
- Socket namespace `/admin` (path `/socket.io`) -> `AdminRealtimeGateway` -> Present

## 5) Endpoint Gap Backlog (Updated)

This section is split into:
- Created from previous backlog
- Still uncreated endpoint areas

## 5.1 Created From Previous Backlog
- Cross-cutting:
  - `DELETE /:userType/me/documents/:documentId` -> Implemented in `DocumentsController`
- Rider:
  - `GET /riders/me/payment-methods`
  - `POST /riders/me/payment-intents`
  - `POST /riders/me/payment-intents/:intentId/verify`
  - `POST /riders/me/wallet/transfers`
  - `GET /riders/me/wallet/transfers`
  - `GET /riders/me/promos/eligible`
  - `POST /riders/me/promos/apply`
  - `GET /riders/me/commutes`
  - `POST /riders/me/commutes`
  - `PATCH /riders/me/commutes/:commuteId`
  - `DELETE /riders/me/commutes/:commuteId`
- Driver:
  - `GET /drivers/me/trips/:tripId/share-contacts`
  - `POST /drivers/me/trips/:tripId/share-contacts`
  - `DELETE /drivers/me/trips/:tripId/share-contacts/:contactId`
  - `POST /drivers/me/trips/:tripId/share-link`
  - `GET /drivers/me/trips/:tripId/share-status`
  - `GET /drivers/me/training/modules`
  - `GET /drivers/me/training/modules/:moduleId`
  - `POST /drivers/me/training/modules/:moduleId/attempts`
  - `POST /drivers/me/training/modules/:moduleId/complete`
- Fleet:
  - `GET /fleet/me/branches/:branchId`
  - `GET /fleet/drivers/:driverId`
  - `DELETE /fleet/drivers/:driverId`
  - `DELETE /fleet/vehicles/:vehicleId`
  - `GET /fleet/vehicles/:vehicleId/documents`
  - `POST /fleet/vehicles/:vehicleId/documents`
  - `GET /fleet/vehicles/:vehicleId/maintenance`
  - `POST /fleet/vehicles/:vehicleId/maintenance`
  - `GET /fleet/dispatches/:dispatchId`
  - `PATCH /fleet/dispatches/:dispatchId`
  - `DELETE /fleet/dispatches/:dispatchId`
  - `POST /fleet/dispatches/:dispatchId/assign`
  - `GET /fleet/rentals/:rentalId`
  - `PATCH /fleet/rentals/:rentalId`
  - `POST /fleet/rentals/:rentalId/cancel`
  - `GET /fleet/tours/:tourId`
  - `PATCH /fleet/tours/:tourId`
  - `POST /fleet/tours/:tourId/cancel`
  - `GET /fleet/school-shuttles/:id`
  - `PATCH /fleet/school-shuttles/:id`
  - `POST /fleet/school-shuttles/:id/cancel`
  - Routes CRUD under `/fleet/school-shuttles/routes...`
  - Students CRUD under `/fleet/school-shuttles/students...`
  - Attendance endpoints under `/fleet/school-shuttles/attendance...`
  - Trips lifecycle under `/fleet/school-shuttles/trips...`
  - Attendants CRUD under `/fleet/school-shuttles/attendants...`
  - Payments endpoints under `/fleet/school-shuttles/payments...`
  - Parent feedback endpoints under `/fleet/school-shuttles/feedback...`
  - Live feed `GET /fleet/school-shuttles/trips/:tripId/live`
  - `GET /fleet/compliance/incidents/:incidentId`
  - `PATCH /fleet/compliance/incidents/:incidentId`
  - `GET /fleet/compliance/training-courses/:courseId`
  - `PATCH /fleet/compliance/training-courses/:courseId`
  - `DELETE /fleet/compliance/training-courses/:courseId`
  - `GET /fleet/earnings/statements/:statementId`
  - `GET /fleet/earnings/payouts/:payoutId`
- Admin:
  - `GET /admin/agents`
  - `GET /admin/agents/:agentId`
  - `POST /admin/agents`
  - `PATCH /admin/agents/:agentId`
  - `DELETE /admin/agents/:agentId`
  - `GET /admin/search?query=...`
  - `GET /admin/finance/tax-config`
  - `PATCH /admin/finance/tax-config/:regionId`
  - `GET /admin/finance/invoice-templates`
  - `PATCH /admin/finance/invoice-templates/:templateId`
  - `GET /admin/training/modules`
  - `POST /admin/training/modules`
  - `PATCH /admin/training/modules/:moduleId`
  - `DELETE /admin/training/modules/:moduleId`
  - `GET /admin/policies`
  - `POST /admin/policies`
  - `PATCH /admin/policies/:policyId`
  - `GET /admin/vertical-policies`
  - `PATCH /admin/vertical-policies/:verticalId`

## 5.2 Still Uncreated Endpoint Areas
- Rider map/geocoding proxy APIs are still frontend-side proxy only (not in backend controllers):
  - `GET /api/osm/search?...`
  - `GET /api/osm/reverse?...`
  - `GET /api/osrm/route/v1/...`
- If production architecture requires single-backend ownership for maps, these proxy APIs should be implemented as backend endpoints and secured with rate limiting and provider key management.

## 5.3 Notes On Newly Created APIs
- Many of the newly created endpoints currently use service-level in-memory stores for initial integration wiring.
- This is acceptable for API contract coverage and frontend integration, but these should be persisted to database entities before production rollout.

## 6) Realtime namespaces by app
- Rider -> `/rider`
- Driver -> `/driver`
- Fleet -> `/fleet`
- Admin -> `/admin`

All use Socket.IO path `/socket.io` and bearer token in `handshake.auth.token`.

## 7) Immediate implementation priority (blocking, revised)
1. Implement backend-owned map proxy endpoints (or gateway adapters) to replace frontend-only OSM/OSRM proxy use.
2. Persist newly added in-memory endpoint domains to DB tables (admin agents, policies, tax/invoice config, training modules, rider commute/payment artifacts, driver share/training).
3. Add end-to-end tests for all newly created endpoints across Rider, Driver, Fleet, and Admin flows.
