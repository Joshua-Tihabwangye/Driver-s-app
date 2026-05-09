# Driver App Navigation & Routing Architecture

This document provides a comprehensive map of every screen in the EVzone Driver application and explains the underlying routing mechanisms that connect them.

## Routing Architecture

The application uses **React Router DOM** for navigation, centralizing route configurations within `src/config/routes.ts` and `src/App.tsx`. 

### Key Routing Principles
1. **Config-Driven Routing**: Routes are defined in a single `SCREENS` array in `routes.ts`, mapping a unique `id`, human-readable `label`, URL `path`, and the React `Component`.
2. **App Shell Wrapping**: The majority of the application is wrapped inside `<AppPhoneShell>` which manages the mobile layout and bottom navigation bar. Auth flows and analytics (on desktop) break out of this shell.
3. **Route Guards**:
   - `GuestOnlyRoute`: Prevents logged-in users from accessing authentication pages (e.g., login, forgot password, OTP).
   - `RequireAuth`: Secures private routes. Users not logged in are redirected to the login screen.
   - `RequireOnlineForJobs`: Validates driver presence. If a driver attempts to access an offline-restricted path (like job queues) while marked offline or missing documents, they are intercepted and redirected to an appropriate online/offline guard page.

---

## Complete Screen Mapping

Below is the definitive list of all pages in the system, categorized by their domain.

### 1. Authentication & Onboarding
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `Registration` | Registration | `/auth/register` |
| `RegisterServices` | Register Services | `/app/register-services` |
| `DriverRegistration` | Registration – EVzone Driver | `/driver/register` |
| `ForgotPassword` | Forgot Password | `/auth/forgot-password` |
| `OTPVerification` | OTP Verification | `/auth/verify-otp` |
| `Login` | Login (Redirect) | `/auth/login` |

### 2. Driver Profile & Identity Verification
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `DriverProfileOnboarding` | Driver Personal | `/driver/onboarding/profile` |
| `DriverPreferences` | Preferences | `/driver/preferences` |
| `DocumentUpload` | Document Verification | `/driver/onboarding/profile/documents/upload` |
| `DocumentReview` | Document Under Review | `/driver/onboarding/profile/documents/review` |
| `DocumentRejected` | Document Rejected | `/driver/onboarding/profile/documents/rejected` |
| `DocumentVerified` | All Documents Verified | `/driver/onboarding/profile/documents/verified` |
| `FaceCapture` | Face Capture | `/driver/preferences/identity/face-capture` |
| `ImageUpload` | Upload Your Image | `/driver/preferences/identity/upload-image` |

### 3. Fleet & Vehicle Management
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `MyVehicles` | My Vehicles | `/driver/vehicles` |
| `MyVehiclesManage` | My Vehicles (Manage) | `/driver/vehicles/manage` |
| `VehicleDetails` | Vehicles | `/driver/vehicles/:vehicleId` |
| `BusinessVehicles` | Business Vehicles | `/driver/vehicles/business` |
| `VehicleAccessories` | Vehicle Accessories | `/driver/vehicles/:vehicleId/accessories` |
| `ManageVehicles` | Manage Fleet | `/driver/manage/vehicles` |
| `ManageVehicleDetails` | Manage Vehicle | `/driver/manage/vehicles/:vehicleId` |
| `ManageVehicleAccessories` | Manage Vehicle Accessories | `/driver/manage/vehicles/:vehicleId/accessories` |

### 4. Training & Certification
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `TrainingIntro` | Intro to Driving with EVzone Ride | `/driver/training/intro` |
| `TrainingInfoSession` | Info Session for Driver-Partners | `/driver/training/info-session` |
| `EarningsTutorial` | Driver Info Tutorial | `/driver/training/earnings-tutorial` |
| `TrainingQuiz` | Driver Info Session Quiz | `/driver/training/quiz` |
| `TrainingQuizAnswer` | Quiz Answer Selected | `/driver/training/quiz/answer` |
| `TrainingQuizPassed` | Quiz Passed Confirmation | `/driver/training/quiz/passed` |
| `TrainingCompletion` | Content Completion Screen | `/driver/training/completion` |

### 5. Dashboards & Overviews
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `ActiveDashboard` | Active Dashboard (Online Mode) | `/driver/dashboard/active` |
| `OnlineDashboard` | Online Dashboard (Active) | `/driver/dashboard/online` |
| `OfflineDashboard` | Dashboard (Offline State) | `/driver/dashboard/offline` |
| `RequiredActionsDashboard`| Required Actions Dashboard | `/driver/dashboard/required-actions` |
| `DeliveryDashboard` | Delivery Driver Dashboard | `/driver/dashboard/delivery` |
| `AnalyticsDashboard` | Analytics Dashboard | `/driver/analytics` |
| `OnlineMapView` | Online Map View | `/driver/map/online` |
| `OnlineMapVariant` | Map View (Online Variant) | `/driver/map/online/variant` |
| `MapSettings` | Map Settings & Report Issues | `/driver/map/settings` |
| `SearchScreen` | Search Screen | `/driver/search` |

### 6. Job Requests & Dispatch
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `RideRequestIncoming` | Ride Request Incoming | `/driver/jobs/incoming` |
| `RideRequestRich` | Incoming Ride Request (Rich) | `/driver/jobs/incoming/rich` |
| `RideRequestsList` | Ride Requests List | `/driver/jobs/list` |
| `RideRequestsPrompt` | Ride Requests Prompt | `/driver/jobs/prompt` |
| `SearchingForRide` | Searching for Ride | `/driver/map/searching` |

### 7. Ride Navigation & Trip Progress
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `NavigateToPickup` | Navigate to Pick-Up Location | `/driver/trip/:tripId/navigate-to-pickup` |
| `NavigationInProgress` | Navigation in Progress | `/driver/trip/:tripId/navigation` |
| `WaitingForPassenger` | Waiting for Passenger | `/driver/trip/:tripId/waiting` |
| `CancelNoShow` | Cancel Ride – Passenger No-Show | `/driver/trip/:tripId/cancel/no-show` |
| `CancelReason` | Cancel Ride – Reason | `/driver/trip/:tripId/cancel/reason` |
| `CancelDetails` | Cancel Ride – Additional Comment | `/driver/trip/:tripId/cancel/details` |
| `RiderVerification` | Rider Verification Code Entry | `/driver/trip/:tripId/verify-rider` |
| `StartDrive` | Start Drive | `/driver/trip/:tripId/start` |
| `RideInProgress` | Ride in Progress | `/driver/trip/:tripId/in-progress` |
| `ActiveSharedTrip` | Active Shared Trip | `/driver/trip/:tripId/active` |
| `TripCompletion` | Trip Completion Screen | `/driver/trip/:tripId/completed` |

### 8. Earnings & Payments
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `EarningsOverview` | Earnings Overview | `/driver/earnings/overview` |
| `WeeklyEarnings` | Weekly Earnings Summary | `/driver/earnings/weekly` |
| `MonthlyEarnings` | Monthly Earnings Summary | `/driver/earnings/monthly` |
| `EarningsGoals` | Set Weekly Earning Goal | `/driver/earnings/goals` |
| `CashOut` | Cash Out – Payment Gateway | `/driver/earnings/cashout` |
| `CashOutMethodFlow` | Cash Out Method Flow | `/driver/earnings/cashout/:methodId/:step` |

### 9. Safety & Emergency
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `SafetyHub` | Safety Hub | `/driver/safety/hub` |
| `SafetyHubExpanded` | Safety Hub – Expanded | `/driver/safety/hub/expanded` |
| `SafetyToolkit` | Safety Toolkit | `/driver/safety/toolkit` |
| `DrivingHours` | Driving Hours | `/driver/safety/driving-hours` |
| `EmergencyAssistanceMap` | Emergency Assistance (Map Variant) | `/driver/safety/emergency/map` |
| `EmergencyAssistanceDetails`| Emergency Assistance (Details Variant) | `/driver/safety/emergency/details` |
| `SOSSending` | SOS / Emergency Alert Sending | `/driver/safety/sos/sending` |
| `EmergencyContactsManager` | Emergency Contacts | `/driver/safety/emergency/contacts` |
| `EmergencyCall` | Emergency Calling Screen | `/driver/safety/emergency/call` |
| `EmergencyConfirmation` | Emergency Assistance Confirmation | `/driver/safety/emergency/confirmation` |
| `FollowMyRideEntry` | Follow My Ride (Entry) | `/driver/safety/follow-my-ride` |
| `FollowMyRide` | Follow My Ride | `/driver/safety/follow-my-ride/:rideId` |
| `ShareMyRideEntry` | Share My Ride (Entry) | `/driver/safety/share-my-ride` |
| `ShareMyRide` | Share My Ride | `/driver/safety/share-my-ride/:rideId` |
| `AddShareContact` | Add Person to Share Ride | `/driver/safety/share-my-ride/:rideId/add-contact` |

### 10. Delivery & Package Operations
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `DeliveryOrdersDashboard` | Orders to Delivery | `/driver/delivery/orders-dashboard` |
| `DeliveryOrdersEntry` | List of Orders (Entry) | `/driver/delivery/orders` |
| `DeliveryOrdersFilterEntry` | Select Order Type (Entry) | `/driver/delivery/orders/filter` |
| `PickedUpOrders` | Picked-Up Orders | `/driver/delivery/orders/picked-up` |
| `DeliveryRouteDetails` | Route Details | `/driver/delivery/route/:routeId` |
| `DeliveryRouteMap` | Route Details (Map Variant) | `/driver/delivery/route/:routeId/map` |
| `ActiveDeliveryRoute` | Active Delivery Route | `/driver/delivery/route/:routeId/active` |
| `ActiveRouteDetails` | Active Route Details | `/driver/delivery/route/:routeId/details` |
| `DeliveryStopContact` | Active Route – Stop Contact | `/driver/delivery/route/:routeId/stop/:stopId/contact` |
| `DeliveryStopDetails` | Active Route – Expanded Stop Details | `/driver/delivery/route/:routeId/stop/:stopId/details` |
| `SelectDestination` | Pick Your Destination | `/driver/delivery/destination/select` |
| `PickupConfirmation` | Pick Up Confirmation | `/driver/delivery/pickup/confirm` |
| `ConfirmPickupLocation` | Confirm Current Location as Pick Up | `/driver/delivery/pickup/confirm-location` |
| `PackagePickupQR` | Package Pickup Verification | `/driver/delivery/pickup/qr` |
| `PickupConfirmed` | Pick-Up Confirmed Screen | `/driver/delivery/pickup/confirmed` |
| `DeliveryDropoffConfirmed` | Delivery Drop-Off Confirmed | `/driver/delivery/dropoff/confirmed` |

### 11. QR Scanning Flows
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `QRScanner` | QR Code Scanner | `/driver/qr/scanner` |
| `QRScannerActive` | Scan QR Code – Active Camera View | `/driver/qr/active` |
| `QRScanConfirmation` | Scan QR Code Confirmation | `/driver/qr/scan-confirmation` |
| `QRScanned` | QR Code Scanned – Confirmation Indicator| `/driver/qr/scanned` |
| `QRProcessing` | QR Code – Processing Stage | `/driver/qr/processing` |
| `QRMarketingScan` | QR Code Scanning – Marketing | `/driver/qr/marketing-scan` |
| `QRMarketingProcessing` | QR Code – Marketing Processing | `/driver/qr/marketing-processing` |

### 12. Specialised Job Flows
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `RentalJobOverview` | Rental Job Overview / On Rental | `/driver/rental/job/:jobId` |
| `TourSchedule` | Tour – Today’s Schedule | `/driver/tour/:tourId/today` |
| `AmbulanceIncoming` | Ambulance Job Incoming | `/driver/ambulance/incoming` |
| `AmbulanceJobStatus` | Ambulance Job Status Screen | `/driver/ambulance/job/:jobId/status` |

### 13. History, Proof & Logs
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `ProofOfTripMain` | Proof of Trip Status – Main View | `/driver/trip/:tripId/proof` |
| `ProofOfTripActive` | Proof of Trip – Active Trip View | `/driver/trip/:tripId/proof/active` |
| `RideHistory` | Ride History | `/driver/history/rides` |
| `RideDetails` | Ride Details | `/driver/history/ride/:tripId` |
| `SharedRideDetails` | Shared Ride Details | `/driver/history/shared/:tripId` |
| `DeliveryDetailsView` | Delivery Details | `/driver/history/delivery/:tripId` |
| `RentalDetailsView` | Rental Details | `/driver/history/rental/:tripId` |
| `TourDetailsView` | Tour Details | `/driver/history/tour/:tripId` |
| `AmbulanceDetailsView` | Ambulance Details | `/driver/history/ambulance/:tripId` |

### 14. Settings, Profile & App Utilities
| Screen ID | Label | Route Path |
| :--- | :--- | :--- |
| `Profile` | Profile | `/driver/profile` |
| `ProfileMore` | Profile (More) | `/driver/more/profile` |
| `Settings` | Settings | `/driver/settings` |
| `SettingsLanguage` | Settings – Language | `/driver/settings/language` |
| `SettingsPassword` | Settings – Password | `/driver/settings/password` |
| `SettingsPrivacy` | Settings – Privacy | `/driver/settings/privacy` |
| `SettingsDelete` | Settings – Delete Account | `/driver/settings/delete-account` |
| `JobTypesLegend` | Job Types & Icons Legend | `/driver/settings/job-types-legend` |
| `MoreMenu` | More Menu | `/driver/more` |
| `Help` | Help & Support | `/driver/help` |
| `About` | About EVzone | `/driver/about` |
| `NotificationsCenter`| Notifications | `/driver/notifications` |
| `Ratings` | Ratings & Reviews | `/driver/ratings` |
| `Documents` | Document Center | `/driver/documents` |
| `DestinationFilter` | Destination Filter | `/driver/navigation/destination` |
| `ShuttleLinkInfo` | Shuttle Link Info Screen | `/driver/help/shuttle-link` |
| `SurgeNotification` | Surge Notification Popup | `/driver/surge/notification` |
| `SurgePricing` | Surge Pricing Map | `/driver/surge/map` |
| `RideSharingNotification`| Ride Sharing Notification Popup | `/driver/ridesharing/notification` |
| `LastTripSummary` | Last Trip Summary Popup | `/driver/trip/last-summary` |

---

## Technical Considerations for URL Matching

- Routes leveraging dynamic URL segments (e.g., `:tripId`, `:vehicleId`, `:routeId`, `:jobId`) automatically extract identifiers utilizing React Router's `useParams()` hook in their respective components.
- State passing is also aggressively used when redirecting users from guards, notably by capturing the blocked URL in `location.state` to enable smooth unblocking continuations.
