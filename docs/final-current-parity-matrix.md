# Final -> Current Parity Matrix

Generated: 2026-03-24T12:08:45.050Z

Status taxonomy: `aligned`, `renamed`, `missing`, `intentionally deprecated`.

## Summary

- Total final routes: 102
- Aligned: 98
- Renamed: 2
- Missing: 0
- Intentionally deprecated: 2

## Matrix

| Final ID | Final Route | Final Label | Current Route | Current ID | Status | Contract Note |
| --- | --- | --- | --- | --- | --- | --- |
| D01 | `/app/home` | Home (Super App) | `/app/register-services` | RegisterServices | intentionally deprecated | Legacy super-app home alias redirects to the auth entry route. |
| D02 | `/app/register-services` | Register Services | `/app/register-services` | RegisterServices | aligned | Exact route match in current router. |
| D03 | `/auth/register` | Registration | `/auth/register` | Registration | aligned | Exact route match in current router. |
| D04 | `/driver/register` | Registration – EVzone Driver | `/driver/register` | DriverRegistration | aligned | Exact route match in current router. |
| D05 | `/driver/onboarding/profile` | Driver Personal | `/driver/onboarding/profile` | DriverProfileOnboarding | aligned | Exact route match in current router. |
| D06 | `/driver/preferences` | Preferences | `/driver/preferences` | DriverPreferences | aligned | Exact route match in current router. |
| D07 | `/driver/onboarding/profile/documents/upload` | Document Verification | `/driver/onboarding/profile/documents/upload` | DocumentUpload | aligned | Exact route match in current router. |
| D08 | `/driver/onboarding/profile/documents/review` | Document Under Review | `/driver/onboarding/profile/documents/review` | DocumentReview | aligned | Exact route match in current router. |
| D09 | `/driver/onboarding/profile/documents/rejected` | Document Rejected | `/driver/onboarding/profile/documents/rejected` | DocumentRejected | aligned | Exact route match in current router. |
| D10 | `/driver/onboarding/profile/documents/verified` | All Documents Verified | `/driver/onboarding/profile/documents/verified` | DocumentVerified | aligned | Exact route match in current router. |
| D11 | `/driver/preferences/identity` | Identity Verification | `/driver/preferences/identity/upload-image` | ImageUpload | intentionally deprecated | Identity landing page was removed; alias now routes to upload-image. |
| D12 | `/driver/preferences/identity/face-capture` | Face Capture | `/driver/preferences/identity/face-capture` | FaceCapture | aligned | Exact route match in current router. |
| D13 | `/driver/preferences/identity/upload-image` | Upload Your Image | `/driver/preferences/identity/upload-image` | ImageUpload | aligned | Exact route match in current router. |
| D14 | `/driver/vehicles` | My Vehicles | `/driver/vehicles` | MyVehicles | aligned | Exact route match in current router. |
| D15 | `/driver/vehicles/:vehicleId` | Vehicles | `/driver/vehicles/:vehicleId` | VehicleDetails | aligned | Exact route match in current router. |
| D16 | `/driver/vehicles/business` | Business Vehicles | `/driver/vehicles/business` | BusinessVehicles | aligned | Exact route match in current router. |
| D17 | `/driver/vehicles/accessories` | Vehicle Accessories | `/driver/vehicles/accessories` | VehicleAccessories | aligned | Exact route match in current router. |
| D18 | `/driver/training/intro` | Intro to Driving with EVzone Ride | `/driver/training/intro` | TrainingIntro | aligned | Exact route match in current router. |
| D19 | `/driver/training/info-session` | Info Session for Driver-Partners | `/driver/training/info-session` | TrainingInfoSession | aligned | Exact route match in current router. |
| D20 | `/driver/training/earnings-tutorial` | Driver Info Tutorial | `/driver/training/earnings-tutorial` | EarningsTutorial | aligned | Exact route match in current router. |
| D21 | `/driver/training/quiz` | Driver Info Session Quiz | `/driver/training/quiz` | TrainingQuiz | aligned | Exact route match in current router. |
| D22 | `/driver/training/quiz/answer` | Quiz Answer Selected | `/driver/training/quiz/answer` | TrainingQuizAnswer | aligned | Exact route match in current router. |
| D23 | `/driver/training/quiz/passed` | Quiz Passed Confirmation | `/driver/training/quiz/passed` | TrainingQuizPassed | aligned | Exact route match in current router. |
| D24 | `/driver/training/completion` | Content Completion Screen | `/driver/training/completion` | TrainingCompletion | aligned | Exact route match in current router. |
| D25 | `/driver/dashboard/delivery` | Delivery Driver Dashboard | `/driver/dashboard/delivery` | DeliveryDashboard | aligned | Exact route match in current router. |
| D26 | `/driver/map/online` | Online Map View | `/driver/map/online` | OnlineMapView | aligned | Exact route match in current router. |
| D27 | `/driver/dashboard/offline` | Dashboard (Offline State) | `/driver/dashboard/offline` | OfflineDashboard | aligned | Exact route match in current router. |
| D28 | `/driver/map/online/variant` | Map View (Online Variant) | `/driver/map/online/variant` | OnlineMapVariant | aligned | Exact route match in current router. |
| D29 | `/driver/dashboard/active` | Active Dashboard (Online Mode) | `/driver/dashboard/active` | ActiveDashboard | aligned | Exact route match in current router. |
| D30 | `/driver/dashboard/required-actions` | Required Actions Dashboard | `/driver/dashboard/required-actions` | RequiredActionsDashboard | aligned | Exact route match in current router. |
| D31 | `/driver/dashboard/online` | Online Dashboard (Active) | `/driver/dashboard/online` | OnlineDashboard | aligned | Exact route match in current router. |
| D32 | `/driver/map/searching` | Searching for Ride | `/driver/map/searching` | SearchingForRide | aligned | Exact route match in current router. |
| D33 | `/driver/earnings/overview` | Earnings Overview | `/driver/earnings/overview` | EarningsOverview | aligned | Exact route match in current router. |
| D34 | `/driver/earnings/weekly` | Weekly Earnings Summary | `/driver/earnings/weekly` | WeeklyEarnings | aligned | Exact route match in current router. |
| D35 | `/driver/earnings/monthly` | Monthly Earnings Summary | `/driver/earnings/monthly` | MonthlyEarnings | aligned | Exact route match in current router. |
| D36 | `/driver/search` | Search Screen | `/driver/search` | SearchScreen | aligned | Exact route match in current router. |
| D37 | `/driver/map/settings` | Map Settings & Report Issues | `/driver/map/settings` | MapSettings | aligned | Exact route match in current router. |
| D38 | `/driver/earnings/goals` | Set Weekly Earning Goal | `/driver/earnings/goals` | EarningsGoals | aligned | Exact route match in current router. |
| D39 | `/driver/surge/notification` | Surge Notification Popup | `/driver/surge/notification` | SurgeNotification | aligned | Exact route match in current router. |
| D40 | `/driver/ridesharing/notification` | Ride Sharing Notification Popup | `/driver/ridesharing/notification` | RideSharingNotification | aligned | Exact route match in current router. |
| D41 | `/driver/trip/last-summary` | Last Trip Summary Popup | `/driver/trip/last-summary` | LastTripSummary | aligned | Exact route match in current router. |
| D42 | `/driver/jobs/incoming` | Ride Request Incoming | `/driver/jobs/incoming` | RideRequestIncoming | aligned | Exact route match in current router. |
| D43 | `/driver/jobs/incoming/rich` | Incoming Ride Request (Rich) | `/driver/jobs/incoming/rich` | RideRequestRich | aligned | Exact route match in current router. |
| D44 | `/driver/jobs/list` | Ride Requests List | `/driver/jobs/list` | RideRequestsList | aligned | Exact route match in current router. |
| D45 | `/driver/jobs/prompt` | Ride Requests Prompt | `/driver/jobs/prompt` | RideRequestsPrompt | aligned | Exact route match in current router. |
| D46 | `/driver/jobs/active-with-additional` | Active Ride with Additional Requests | `/driver/trip/:tripId/active` | ActiveSharedTrip | renamed | Legacy alias removed; canonical shared active route is `/driver/trip/:tripId/active`. |
| D47 | `/driver/trip/:tripId/navigate-to-pickup` | Navigate to Pick-Up Location | `/driver/trip/:tripId/navigate-to-pickup` | NavigateToPickup | aligned | Exact route match in current router. |
| D48 | `/driver/trip/:tripId/navigation` | Navigation in Progress | `/driver/trip/:tripId/navigation` | NavigationInProgress | aligned | Exact route match in current router. |
| D49 | `/driver/trip/:tripId/en-route-details` | En Route to Pickup – Details | `/driver/trip/:tripId/navigation` | NavigationInProgress | renamed | Legacy alias removed; canonical navigation route is `/driver/trip/:tripId/navigation`. |
| D50 | `/driver/trip/:tripId/arrived` | Arrived at Pickup Point | `/driver/trip/:tripId/arrived` | ArrivedAtPickup | aligned | Exact route match in current router. |
| D51 | `/driver/trip/:tripId/waiting` | Waiting for Passenger | `/driver/trip/:tripId/waiting` | WaitingForPassenger | aligned | Exact route match in current router. |
| D52 | `/driver/trip/:tripId/cancel/no-show` | Cancel Ride – Passenger No-Show | `/driver/trip/:tripId/cancel/no-show` | CancelNoShow | aligned | Exact route match in current router. |
| D53 | `/driver/trip/:tripId/verify-rider` | Rider Verification Code Entry | `/driver/trip/:tripId/verify-rider` | RiderVerification | aligned | Exact route match in current router. |
| D54 | `/driver/trip/:tripId/start` | Start Drive | `/driver/trip/:tripId/start` | StartDrive | aligned | Exact route match in current router. |
| D55 | `/driver/trip/:tripId/in-progress` | Ride in Progress | `/driver/trip/:tripId/in-progress` | RideInProgress | aligned | Exact route match in current router. |
| D56 | `/driver/trip/:tripId/completed` | Trip Completion Screen | `/driver/trip/:tripId/completed` | TripCompletion | aligned | Exact route match in current router. |
| D57 | `/driver/trip/:tripId/cancel/reason` | Cancel Ride – Reason | `/driver/trip/:tripId/cancel/reason` | CancelReason | aligned | Exact route match in current router. |
| D58 | `/driver/trip/:tripId/cancel/details` | Cancel Ride – Additional Comment | `/driver/trip/:tripId/cancel/details` | CancelDetails | aligned | Exact route match in current router. |
| D59 | `/driver/safety/toolkit` | Safety Toolkit | `/driver/safety/toolkit` | SafetyToolkit | aligned | Exact route match in current router. |
| D60 | `/driver/safety/emergency/map` | Emergency Assistance (Map Variant) | `/driver/safety/emergency/map` | EmergencyAssistanceMap | aligned | Exact route match in current router. |
| D61 | `/driver/safety/sos/sending` | SOS / Emergency Alert Sending | `/driver/safety/sos/sending` | SOSSending | aligned | Exact route match in current router. |
| D62 | `/driver/safety/emergency/details` | Emergency Assistance (Details Variant) | `/driver/safety/emergency/details` | EmergencyAssistanceDetails | aligned | Exact route match in current router. |
| D63 | `/driver/safety/emergency/call` | Emergency Calling Screen | `/driver/safety/emergency/call` | EmergencyCall | aligned | Exact route match in current router. |
| D64 | `/driver/safety/emergency/confirmation` | Emergency Assistance Confirmation | `/driver/safety/emergency/confirmation` | EmergencyConfirmation | aligned | Exact route match in current router. |
| D65 | `/driver/safety/follow-my-ride` | Follow My Ride | `/driver/safety/follow-my-ride` | FollowMyRideEntry | aligned | Exact route match in current router. |
| D66 | `/driver/safety/share-my-ride` | Share My Ride | `/driver/safety/share-my-ride` | ShareMyRideEntry | aligned | Exact route match in current router. |
| D67 | `/driver/trip/:tripId/proof` | Proof of Trip Status – Main View | `/driver/trip/:tripId/proof` | ProofOfTripMain | aligned | Exact route match in current router. |
| D68 | `/driver/trip/:tripId/proof/active` | Proof of Trip – Active Trip View | `/driver/trip/:tripId/proof/active` | ProofOfTripActive | aligned | Exact route match in current router. |
| D69 | `/driver/history/rides` | Ride History | `/driver/history/rides` | RideHistory | aligned | Exact route match in current router. |
| D70 | `/driver/safety/hub` | Safety Hub | `/driver/safety/hub` | SafetyHub | aligned | Exact route match in current router. |
| D71 | `/driver/safety/hub/expanded` | Safety Hub – Expanded | `/driver/safety/hub/expanded` | SafetyHubExpanded | aligned | Exact route match in current router. |
| D72 | `/driver/safety/driving-hours` | Driving Hours | `/driver/safety/driving-hours` | DrivingHours | aligned | Exact route match in current router. |
| D73 | `/driver/surge/map` | Surge Pricing | `/driver/surge/map` | SurgePricing | aligned | Exact route match in current router. |
| D74 | `/driver/delivery/orders-dashboard` | Orders to Delivery | `/driver/delivery/orders-dashboard` | DeliveryOrdersDashboard | aligned | Exact route match in current router. |
| D75 | `/driver/delivery/orders` | List of Orders | `/driver/delivery/orders` | DeliveryOrdersEntry | aligned | Exact route match in current router. |
| D76 | `/driver/delivery/orders/filter` | Select Order Type | `/driver/delivery/orders/filter` | DeliveryOrdersFilterEntry | aligned | Exact route match in current router. |
| D77 | `/driver/delivery/orders/picked-up` | Picked-Up Orders | `/driver/delivery/orders/picked-up` | PickedUpOrders | aligned | Exact route match in current router. |
| D78 | `/driver/delivery/route/:routeId` | Route Details | `/driver/delivery/route/:routeId` | DeliveryRouteDetails | aligned | Exact route match in current router. |
| D79 | `/driver/delivery/route/:routeId/map` | Route Details (Map Variant) | `/driver/delivery/route/:routeId/map` | DeliveryRouteMap | aligned | Exact route match in current router. |
| D80 | `/driver/delivery/route/:routeId/active` | Active Delivery Route | `/driver/delivery/route/:routeId/active` | ActiveDeliveryRoute | aligned | Exact route match in current router. |
| D81 | `/driver/delivery/route/:routeId/stop/:stopId/contact` | Active Route – Stop Contact | `/driver/delivery/route/:routeId/stop/:stopId/contact` | DeliveryStopContact | aligned | Exact route match in current router. |
| D82 | `/driver/delivery/route/:routeId/details` | Active Route Details | `/driver/delivery/route/:routeId/details` | ActiveRouteDetails | aligned | Exact route match in current router. |
| D83 | `/driver/delivery/route/:routeId/stop/:stopId/details` | Active Route – Expanded Stop Details | `/driver/delivery/route/:routeId/stop/:stopId/details` | DeliveryStopDetails | aligned | Exact route match in current router. |
| D84 | `/driver/delivery/destination/select` | Pick Your Destination | `/driver/delivery/destination/select` | SelectDestination | aligned | Exact route match in current router. |
| D85 | `/driver/delivery/pickup/confirm` | Pick Up Confirmation | `/driver/delivery/pickup/confirm` | PickupConfirmation | aligned | Exact route match in current router. |
| D86 | `/driver/delivery/pickup/confirm-location` | Confirm Current Location as Pick Up | `/driver/delivery/pickup/confirm-location` | ConfirmPickupLocation | aligned | Exact route match in current router. |
| D87 | `/driver/delivery/pickup/qr` | Package Pickup Verification | `/driver/delivery/pickup/qr` | PackagePickupQR | aligned | Exact route match in current router. |
| D88 | `/driver/qr/scanner` | QR Code Scanner | `/driver/qr/scanner` | QRScanner | aligned | Exact route match in current router. |
| D89 | `/driver/qr/scan-confirmation` | Scan QR Code Confirmation | `/driver/qr/scan-confirmation` | QRScanConfirmation | aligned | Exact route match in current router. |
| D90 | `/driver/qr/instruction` | Scan QR Code – Instruction Popup | `/driver/qr/instruction` | QRInstruction | aligned | Exact route match in current router. |
| D91 | `/driver/qr/active` | Scan QR Code – Active Camera View | `/driver/qr/active` | QRScannerActive | aligned | Exact route match in current router. |
| D92 | `/driver/qr/scanned` | QR Code Scanned – Confirmation Indicator | `/driver/qr/scanned` | QRScanned | aligned | Exact route match in current router. |
| D93 | `/driver/qr/processing` | QR Code – Processing Stage | `/driver/qr/processing` | QRProcessing | aligned | Exact route match in current router. |
| D94 | `/driver/qr/marketing-scan` | QR Code Scanning – Marketing | `/driver/qr/marketing-scan` | QRMarketingScan | aligned | Exact route match in current router. |
| D95 | `/driver/qr/marketing-processing` | QR Code – Marketing Processing | `/driver/qr/marketing-processing` | QRMarketingProcessing | aligned | Exact route match in current router. |
| D96 | `/driver/delivery/pickup/confirmed` | Pick-Up Confirmed Screen | `/driver/delivery/pickup/confirmed` | PickupConfirmed | aligned | Exact route match in current router. |
| D97 | `/driver/rental/job/:jobId` | Rental Job Overview / On Rental | `/driver/rental/job/:jobId` | RentalJobOverview | aligned | Exact route match in current router. |
| D98 | `/driver/tour/:tourId/today` | Tour – Today's Schedule | `/driver/tour/:tourId/today` | TourSchedule | aligned | Exact route match in current router. |
| D99 | `/driver/ambulance/incoming` | Ambulance Job Incoming | `/driver/ambulance/incoming` | AmbulanceIncoming | aligned | Exact route match in current router. |
| D100 | `/driver/ambulance/job/:jobId/status` | Ambulance Job Status Screen | `/driver/ambulance/job/:jobId/status` | AmbulanceJobStatus | aligned | Exact route match in current router. |
| D101 | `/driver/settings/job-types-legend` | Job Types & Icons Legend | `/driver/settings/job-types-legend` | JobTypesLegend | aligned | Exact route match in current router. |
| D102 | `/driver/help/shuttle-link` | Shuttle Link Info Screen | `/driver/help/shuttle-link` | ShuttleLinkInfo | aligned | Exact route match in current router. |

## Route Disposition Decisions Implemented

- `/app/home` -> deprecated route removed; wildcard fallback now resolves to auth entry.
- `/driver/preferences/identity` -> intentionally deprecated -> redirects to `/driver/preferences/identity/upload-image`.
- `/driver/jobs/active-with-additional` -> deprecated alias removed; use `/driver/trip/:tripId/active`.
- `/driver/trip/:tripId/en-route-details` -> deprecated alias removed; use `/driver/trip/:tripId/navigation`.
