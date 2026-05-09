# System Routing & Page Inventory

Generated from code in `src/config/routes.ts`, `src/App.tsx`, and backend route modules.

- Frontend screen routes found: **131**
- Includes auth/public/private routing, guard behavior, and backend API endpoints currently present in repository.

## 1) Frontend Router Behavior (Global)

### Redirect Routes

| Path | Behavior |
|---|---|
| `/` | Redirects to `AUTH_LOGIN_ROUTE` (currently `/app/register-services`). |
| `/auth/login` | Redirects to `AUTH_LOGIN_ROUTE` (currently `/app/register-services`). |
| `/driver/preferences/identity` | Redirects to `/driver/preferences/identity/upload-image`. |
| `/driver/qr/instruction` | Redirects to `/driver/qr/scanner`. |
| `*` | Fallback redirect to `AUTH_LOGIN_ROUTE` (currently `/app/register-services`) for unknown paths. |

### Route Guards

- `GuestOnlyRoute`: blocks logged-in users from guest auth pages (`/auth/forgot-password`, `/auth/verify-otp`).
- `RequireAuth`: protects non-public pages and redirects unauthenticated users to login, preserving `from` state.
- `RequireOnlineForJobs`: blocks offline access to job/trip/delivery/QR/rental/tour/ambulance/searching/online dashboard paths and redirects to `/driver/dashboard/offline` or `/driver/dashboard/online` with context messages.
- Public screen IDs in current app: `RegisterServices`, `Registration`, `DriverRegistration`, and onboarding-sensitive screens listed in `SENSITIVE_ONBOARDING_IDS` in `src/App.tsx`.

### Offline-Restricted Path Prefixes

- `/driver/jobs`
- `/driver/trip`
- `/driver/delivery`
- `/driver/qr`
- `/driver/rental`
- `/driver/tour`
- `/driver/ambulance`
- `/driver/map/searching`
- `/driver/map/online`
- `/driver/dashboard/online`
- `/driver/dashboard/active`

## 2) Frontend Screens (All Registered Pages)

### Authentication & Registration

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/app/register-services` | `RegisterServices` | `RegisterServices` | Entry page to choose EVzone service/role before role-specific flows. |
| `/auth/register` | `Registration` | `Registration` | Account creation screen for new users before driver activation. |
| `/driver/register` | `DriverRegistration` | `DriverRegistration` | Driver-role registration screen to activate EVzone Driver service. |
| `/auth/forgot-password` | `ForgotPassword` | `ForgotPassword` | Account recovery start screen for password reset. |
| `/auth/verify-otp` | `OTPVerification` | `OTPVerification` | OTP verification page used during password reset/auth recovery. |

### Onboarding, Identity & Documents

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/onboarding/profile` | `DriverProfileOnboarding` | `DriverProfileOnboarding` | Onboarding profile/documents stage for KYC completion and verification status. |
| `/driver/preferences` | `DriverPreferences` | `DriverPreferences` | Driver preferences hub for onboarding, training, and account options. |
| `/driver/onboarding/profile/documents/upload` | `DocumentUpload` | `DocumentUpload` | Onboarding profile/documents stage for KYC completion and verification status. |
| `/driver/onboarding/profile/documents/review` | `DocumentReview` | `DocumentReview` | Onboarding profile/documents stage for KYC completion and verification status. |
| `/driver/onboarding/profile/documents/rejected` | `DocumentRejected` | `DocumentRejected` | Onboarding profile/documents stage for KYC completion and verification status. |
| `/driver/onboarding/profile/documents/verified` | `DocumentVerified` | `DocumentVerified` | Onboarding profile/documents stage for KYC completion and verification status. |
| `/driver/preferences/identity/face-capture` | `FaceCapture` | `FaceCapture` | Liveness/face capture verification flow before enabling sensitive actions. |
| `/driver/preferences/identity/upload-image` | `ImageUpload` | `ImageUpload` | Identity photo upload/confirmation step for KYC profile. |
| `/driver/documents` | `Documents` | `DocumentCenter` | Document center showing uploaded documents, states, and required actions. |

### Vehicle Management

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/vehicles` | `MyVehicles` | `MyVehicles` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/vehicles/manage` | `MyVehiclesManage` | `MyVehicles` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/vehicles/:vehicleId` | `VehicleDetails` | `VehicleDetails` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/vehicles/business` | `BusinessVehicles` | `BusinessVehicles` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/vehicles/:vehicleId/accessories` | `VehicleAccessories` | `VehicleAccessories` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/manage/vehicles` | `ManageVehicles` | `ManageVehicles` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/manage/vehicles/:vehicleId` | `ManageVehicleDetails` | `ManageVehicleDetails` | Vehicle and fleet management page for EV details, accessories, and eligibility. |
| `/driver/manage/vehicles/:vehicleId/accessories` | `ManageVehicleAccessories` | `ManageVehicleAccessories` | Vehicle and fleet management page for EV details, accessories, and eligibility. |

### Training

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/training/intro` | `TrainingIntro` | `TrainingIntro` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/info-session` | `TrainingInfoSession` | `TrainingInfoSession` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/earnings-tutorial` | `EarningsTutorial` | `EarningsTutorial` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/quiz` | `TrainingQuiz` | `TrainingQuiz` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/quiz/answer` | `TrainingQuizAnswer` | `TrainingQuizAnswer` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/quiz/passed` | `TrainingQuizPassed` | `TrainingQuizPassed` | Training/assessment flow for driver readiness and compliance. |
| `/driver/training/completion` | `TrainingCompletion` | `TrainingCompletion` | Training/assessment flow for driver readiness and compliance. |

### Dashboards, Analytics & Map

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/dashboard/delivery` | `DeliveryDashboard` | `DeliveryDashboard` | Primary operational dashboard showing driver state, tasks, and next actions. |
| `/driver/map/online` | `OnlineMapView` | `OnlineMapView` | Map workflow page for online visibility, navigation context, and geo actions. |
| `/driver/dashboard/offline` | `OfflineDashboard` | `OfflineDashboard` | Primary operational dashboard showing driver state, tasks, and next actions. |
| `/driver/map/online/variant` | `OnlineMapVariant` | `OnlineMapVariant` | Map workflow page for online visibility, navigation context, and geo actions. |
| `/driver/dashboard/active` | `ActiveDashboard` | `ActiveDashboard` | Primary operational dashboard showing driver state, tasks, and next actions. |
| `/driver/dashboard/required-actions` | `RequiredActionsDashboard` | `RequiredActionsDashboard` | Primary operational dashboard showing driver state, tasks, and next actions. |
| `/driver/dashboard/online` | `OnlineDashboard` | `OnlineDashboard` | Primary operational dashboard showing driver state, tasks, and next actions. |
| `/driver/map/searching` | `SearchingForRide` | `SearchingForRide` | Map workflow page for online visibility, navigation context, and geo actions. |
| `/driver/analytics` | `AnalyticsDashboard` | `AnalyticsDashboard` | Performance analytics dashboard with activity and trend summaries. |
| `/driver/search` | `SearchScreen` | `SearchScreen` | Search utility screen for quick lookup and navigation. |
| `/driver/map/settings` | `MapSettings` | `MapSettings` | Map workflow page for online visibility, navigation context, and geo actions. |

### Jobs, Ride Lifecycle & Trip Flows

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/trip/last-summary` | `LastTripSummary` | `LastTripSummary` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/jobs/incoming` | `RideRequestIncoming` | `RideRequestIncoming` | Dispatch intake screen for reviewing and accepting available jobs. |
| `/driver/jobs/incoming/rich` | `RideRequestRich` | `RideRequestRich` | Dispatch intake screen for reviewing and accepting available jobs. |
| `/driver/jobs/list` | `RideRequestsList` | `RideRequestsList` | Dispatch intake screen for reviewing and accepting available jobs. |
| `/driver/jobs/prompt` | `RideRequestsPrompt` | `RideRequestsPrompt` | Dispatch intake screen for reviewing and accepting available jobs. |
| `/driver/trip/:tripId/navigate-to-pickup` | `NavigateToPickup` | `NavigateToPickup` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/navigation` | `NavigationInProgress` | `NavigationInProgress` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/waiting` | `WaitingForPassenger` | `WaitingForPassenger` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/cancel/no-show` | `CancelNoShow` | `CancelNoShow` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/verify-rider` | `RiderVerification` | `RiderVerification` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/start` | `StartDrive` | `StartDrive` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/in-progress` | `RideInProgress` | `RideInProgress` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/active` | `ActiveSharedTrip` | `ActiveSharedTrip` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/completed` | `TripCompletion` | `TripCompletion` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/cancel/reason` | `CancelReason` | `CancelReason` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/cancel/details` | `CancelDetails` | `CancelDetails` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/rental/job/:jobId` | `RentalJobOverview` | `RentalJobOverview` | Rental-specific active job page with long-duration trip controls. |
| `/driver/tour/:tourId/today` | `TourSchedule` | `TourSchedule` | Tour job schedule view and execution context for today. |
| `/driver/ambulance/incoming` | `AmbulanceIncoming` | `AmbulanceIncoming` | Ambulance/emergency job flow screen with mission-specific status updates. |
| `/driver/ambulance/job/:jobId/status` | `AmbulanceJobStatus` | `AmbulanceJobStatus` | Ambulance/emergency job flow screen with mission-specific status updates. |

### Delivery Operations & QR

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/delivery/orders-dashboard` | `DeliveryOrdersDashboard` | `DeliveryOrdersDashboard` | Delivery order queue/list page for filtering and selecting active orders. |
| `/driver/delivery/orders` | `DeliveryOrdersEntry` | `DeliveryOrdersEntry` | Delivery order queue/list page for filtering and selecting active orders. |
| `/driver/delivery/orders/filter` | `DeliveryOrdersFilterEntry` | `DeliveryOrdersFilterEntry` | Delivery order queue/list page for filtering and selecting active orders. |
| `/driver/delivery/orders/picked-up` | `PickedUpOrders` | `PickedUpOrders` | Delivery order queue/list page for filtering and selecting active orders. |
| `/driver/delivery/route/:routeId` | `DeliveryRouteDetails` | `DeliveryRouteDetails` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/route/:routeId/map` | `DeliveryRouteMap` | `DeliveryRouteMap` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/route/:routeId/active` | `ActiveDeliveryRoute` | `ActiveDeliveryRoute` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/route/:routeId/stop/:stopId/contact` | `DeliveryStopContact` | `DeliveryStopContact` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/route/:routeId/details` | `ActiveRouteDetails` | `ActiveRouteDetails` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/route/:routeId/stop/:stopId/details` | `DeliveryStopDetails` | `DeliveryStopDetails` | Delivery route execution page for route details, stops, and progress. |
| `/driver/delivery/destination/select` | `SelectDestination` | `SelectDestination` | Destination selection screen for delivery route initiation. |
| `/driver/delivery/pickup/confirm` | `PickupConfirmation` | `PickupConfirmation` | Delivery pickup verification and confirmation stage. |
| `/driver/delivery/pickup/confirm-location` | `ConfirmPickupLocation` | `ConfirmPickupLocation` | Delivery pickup verification and confirmation stage. |
| `/driver/delivery/pickup/qr` | `PackagePickupQR` | `PackagePickupQR` | Delivery pickup verification and confirmation stage. |
| `/driver/qr/scanner` | `QRScanner` | `QRScanner` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/scan-confirmation` | `QRScanConfirmation` | `QRScanConfirmation` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/active` | `QRScannerActive` | `QRScannerActive` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/scanned` | `QRScanned` | `QRScanned` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/processing` | `QRProcessing` | `QRProcessing` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/marketing-scan` | `QRMarketingScan` | `QRMarketingScan` | QR scanning workflow stage for package or campaign verification. |
| `/driver/qr/marketing-processing` | `QRMarketingProcessing` | `QRMarketingProcessing` | QR scanning workflow stage for package or campaign verification. |
| `/driver/delivery/pickup/confirmed` | `PickupConfirmed` | `PickupConfirmed` | Delivery pickup verification and confirmation stage. |
| `/driver/delivery/dropoff/confirmed` | `DeliveryDropoffConfirmed` | `DeliveryDropoffConfirmed` | Delivery completion confirmation after successful drop-off. |

### Safety & Emergency

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/safety/toolkit` | `SafetyToolkit` | `SafetyToolkit` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/emergency/map` | `EmergencyAssistanceMap` | `EmergencyAssistanceMap` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/sos/sending` | `SOSSending` | `SOSSending` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/emergency/details` | `EmergencyAssistanceDetails` | `EmergencyAssistanceDetails` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/emergency/contacts` | `EmergencyContactsManager` | `EmergencyContactsManager` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/emergency/call` | `EmergencyCall` | `EmergencyCall` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/emergency/confirmation` | `EmergencyConfirmation` | `EmergencyConfirmation` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/follow-my-ride` | `FollowMyRideEntry` | `FollowMyRideEntry` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/share-my-ride` | `ShareMyRideEntry` | `ShareMyRideEntry` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/follow-my-ride/:rideId` | `FollowMyRide` | `FollowMyRide` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/share-my-ride/:rideId` | `ShareMyRide` | `ShareMyRide` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/share-my-ride/:rideId/add-contact` | `AddShareContact` | `AddShareContact` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/hub` | `SafetyHub` | `SafetyHub` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/hub/expanded` | `SafetyHubExpanded` | `SafetyHubExpanded` | Safety feature page for SOS, emergency help, and ride-sharing protection. |
| `/driver/safety/driving-hours` | `DrivingHours` | `DrivingHours` | Safety feature page for SOS, emergency help, and ride-sharing protection. |

### History, Proof & Earnings

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/earnings/overview` | `EarningsOverview` | `EarningsOverview` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/earnings/weekly` | `WeeklyEarnings` | `WeeklyEarnings` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/earnings/monthly` | `MonthlyEarnings` | `MonthlyEarnings` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/earnings/goals` | `EarningsGoals` | `EarningsGoals` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/trip/:tripId/proof` | `ProofOfTripMain` | `ProofOfTripMain` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/trip/:tripId/proof/active` | `ProofOfTripActive` | `ProofOfTripActive` | Private trip lifecycle stage (pickup, navigation, ride state, cancellation, or completion). |
| `/driver/history/rides` | `RideHistory` | `RideHistory` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/ride/:tripId` | `RideDetails` | `RideDetails` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/shared/:tripId` | `SharedRideDetails` | `SharedRideDetails` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/delivery/:tripId` | `DeliveryDetailsView` | `DeliveryDetailsView` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/rental/:tripId` | `RentalDetailsView` | `RentalDetailsView` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/tour/:tripId` | `TourDetailsView` | `TourDetailsView` | Historical details page for completed trips/jobs and receipts. |
| `/driver/history/ambulance/:tripId` | `AmbulanceDetailsView` | `AmbulanceDetailsView` | Historical details page for completed trips/jobs and receipts. |
| `/driver/earnings/cashout` | `CashOut` | `CashOutScreen` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/earnings/cashout/:methodId/:step` | `CashOutMethodFlow` | `CashOutMethodFlow` | Earnings and payout management screen for revenue tracking and cashout. |
| `/driver/ratings` | `Ratings` | `RatingsAndFeedback` | Screen for ratings & reviews. |

### Profile, Help & Settings

| Route Path | Screen ID | Component | What it does / content |
|---|---|---|---|
| `/driver/surge/notification` | `SurgeNotification` | `SurgeNotification` | Surge-awareness UI showing opportunity and map-based pricing context. |
| `/driver/ridesharing/notification` | `RideSharingNotification` | `RideSharingNotification` | Ride-sharing notification page for shared trip opportunities. |
| `/driver/surge/map` | `SurgePricing` | `SurgePricing` | Surge-awareness UI showing opportunity and map-based pricing context. |
| `/driver/settings/job-types-legend` | `JobTypesLegend` | `JobTypesLegend` | Settings page for language, privacy, password, account, and policy options. |
| `/driver/help/shuttle-link` | `ShuttleLinkInfo` | `ShuttleLinkInfo` | Help and support page for assistance resources and external links. |
| `/driver/more` | `MoreMenu` | `MoreMenuScreen` | More menu page with secondary navigation to profile, settings, and support. |
| `/driver/profile` | `Profile` | `ProfileScreen` | Driver profile page with identity, performance, and account details. |
| `/driver/more/profile` | `ProfileMore` | `ProfileScreen` | Driver profile page with identity, performance, and account details. |
| `/driver/help` | `Help` | `HelpScreen` | Help and support page for assistance resources and external links. |
| `/driver/about` | `About` | `AboutScreen` | About page describing app, service, and legal/product information. |
| `/driver/notifications` | `NotificationsCenter` | `NotificationsCenter` | Notification center page for alerts and recent updates. |
| `/driver/settings` | `Settings` | `Settings` | Screen for settings. |
| `/driver/settings/language` | `SettingsLanguage` | `SettingsLanguage` | Settings page for language, privacy, password, account, and policy options. |
| `/driver/settings/password` | `SettingsPassword` | `SettingsPassword` | Settings page for language, privacy, password, account, and policy options. |
| `/driver/settings/privacy` | `SettingsPrivacy` | `SettingsPrivacy` | Settings page for language, privacy, password, account, and policy options. |
| `/driver/settings/delete-account` | `SettingsDelete` | `SettingsDeleteAccount` | Settings page for language, privacy, password, account, and policy options. |
| `/driver/navigation/destination` | `DestinationFilter` | `DestinationFilter` | Destination filter and navigation preference selection page. |

## 3) Backend API Routing (Current)

| Method | Endpoint | What it does / content | Source |
|---|---|---|---|
| `POST` | `/drivers/:driverId/documents` | Upload/upsert a driver document with expiry validation (and optional OCR-derived expiry date). | `backend/src/routes/documentRoutes.ts` |
| `GET` | `/drivers/:driverId/documents/status` | Return required document statuses with expiry status and days-until-expiry metadata. | `backend/src/routes/documentRoutes.ts` |
| `GET` | `/drivers/:driverId/orders` | Fetch driver orders; guarded by `requireValidDocuments` middleware before returning data. | `backend/src/routes/orderRoutes.ts` |

## 4) Notes for Backend + Frontend Planning

- Dynamic URL parameters used in pages: `:vehicleId`, `:tripId`, `:rideId`, `:routeId`, `:stopId`, `:jobId`, `:tourId`, `:methodId`, `:step`.
- Primary frontend route source of truth: `SCREENS` array in `src/config/routes.ts`.
- Runtime access behavior is enforced in `src/App.tsx` via `GuestOnlyRoute`, `RequireAuth`, and `RequireOnlineForJobs`.
- For API expansion, current backend routing starts with document lifecycle and order access, with middleware-driven compliance checks.
