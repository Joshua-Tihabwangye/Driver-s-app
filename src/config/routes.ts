// ── Route Configuration ──────────────────────────────────
// Extracted from App.tsx for clean separation of routing config from rendering.

import type { ComponentType } from "react";
import { SAMPLE_IDS } from "../data/constants";

// ── Screen Imports ──────────────────────────────────────
import AboutScreen from "../screens/About";
import CashOutScreen from "../screens/CashOut";
import RegisterServices from "../screens/RegisterServices";
import Registration from "../screens/Registration";
import DriverRegistration from "../screens/DriverRegistration";
import DriverProfileOnboarding from "../screens/DriverProfileOnboarding";
import DriverPreferences from "../screens/DriverPreferences";
import DocumentUpload from "../screens/DocumentUpload";
import DocumentReview from "../screens/DocumentReview";
import DocumentRejected from "../screens/DocumentRejected";
import DocumentVerified from "../screens/DocumentVerified";
import AmbulanceJobStatus from "../screens/AmbulanceJobStatus";
import JobTypesLegend from "../screens/JobTypesLegend";
import ShuttleLinkInfo from "../screens/ShuttleLinkInfo";
import IdentityVerification from "../screens/IdentityVerification";
import FaceCapture from "../screens/FaceCapture";
import ImageUpload from "../screens/ImageUpload";
import MyVehicles from "../screens/MyVehicles";
import VehicleDetails from "../screens/VehicleDetails";
import BusinessVehicles from "../screens/BusinessVehicles";
import VehicleAccessories from "../screens/VehicleAccessories";
import TrainingIntro from "../screens/TrainingIntro";
import TrainingInfoSession from "../screens/TrainingInfoSession";
import EarningsTutorial from "../screens/EarningsTutorial";
import TrainingQuiz from "../screens/TrainingQuiz";
import TrainingQuizAnswer from "../screens/TrainingQuizAnswer";
import TrainingQuizPassed from "../screens/TrainingQuizPassed";
import TrainingCompletion from "../screens/TrainingCompletion";
import DeliveryDashboard from "../screens/DeliveryDashboard";
import OnlineMapView from "../screens/OnlineMapView";
import OfflineDashboard from "../screens/OfflineDashboard";
import OnlineMapVariant from "../screens/OnlineMapVariant";
import ActiveDashboard from "../screens/ActiveDashboard";
import RequiredActionsDashboard from "../screens/RequiredActionsDashboard";
import OnlineDashboard from "../screens/OnlineDashboard";
import SearchingForRide from "../screens/SearchingForRide";
import AnalyticsDashboard from "../screens/AnalyticsDashboard";
import EarningsOverview from "../screens/EarningsOverview";
import WeeklyEarnings from "../screens/WeeklyEarnings";
import MonthlyEarnings from "../screens/MonthlyEarnings";
import SearchScreen from "../screens/SearchScreen";
import MapSettings from "../screens/MapSettings";
import EarningsGoals from "../screens/EarningsGoals";
import SurgeNotification from "../screens/SurgeNotification";
import RideSharingNotification from "../screens/RideSharingNotification";
import LastTripSummary from "../screens/LastTripSummary";
import RideRequestIncoming from "../screens/RideRequestIncoming";
import RideRequestRich from "../screens/RideRequestRich";
import RideRequestsList from "../screens/RideRequestsList";
import RideRequestsPrompt from "../screens/RideRequestsPrompt";
import NavigateToPickup from "../screens/NavigateToPickup";
import NavigationInProgress from "../screens/NavigationInProgress";
import ArrivedAtPickup from "../screens/ArrivedAtPickup";
import WaitingForPassenger from "../screens/WaitingForPassenger";
import CancelNoShow from "../screens/CancelNoShow";
import RiderVerification from "../screens/RiderVerification";
import StartDrive from "../screens/StartDrive";
import RideInProgress from "../screens/RideInProgress";
import ActiveSharedTrip from "../screens/ActiveSharedTrip";
import TripCompletion from "../screens/TripCompletion";
import CancelReason from "../screens/CancelReason";
import CancelDetails from "../screens/CancelDetails";
import SafetyToolkit from "../screens/SafetyToolkit";
import EmergencyAssistanceMap from "../screens/EmergencyAssistanceMap";
import SOSSending from "../screens/SOSSending";
import EmergencyAssistanceDetails from "../screens/EmergencyAssistanceDetails";
import EmergencyCall from "../screens/EmergencyCall";
import EmergencyConfirmation from "../screens/EmergencyConfirmation";
import FollowMyRide from "../screens/FollowMyRide";
import FollowMyRideEntry from "../screens/FollowMyRideEntry";
import ShareMyRide from "../screens/ShareMyRide";
import ShareMyRideEntry from "../screens/ShareMyRideEntry";
import AddShareContact from "../screens/AddShareContact";
import ProofOfTripMain from "../screens/ProofOfTripMain";
import ProofOfTripActive from "../screens/ProofOfTripActive";
import RideHistory from "../screens/RideHistory";
import RideDetails from "../screens/RideDetails";
import SharedRideDetails from "../screens/SharedRideDetails";
import DeliveryDetailsView from "../screens/DeliveryDetailsView";
import RentalDetailsView from "../screens/RentalDetailsView";
import TourDetailsView from "../screens/TourDetailsView";
import SafetyHub from "../screens/SafetyHub";
import SafetyHubExpanded from "../screens/SafetyHubExpanded";
import DrivingHours from "../screens/DrivingHours";
import SurgePricing from "../screens/SurgePricing";
import DeliveryOrdersDashboard from "../screens/DeliveryOrdersDashboard";
import DeliveryOrdersEntry from "../screens/DeliveryOrdersEntry";
import DeliveryOrdersFilterEntry from "../screens/DeliveryOrdersFilterEntry";
import PickedUpOrders from "../screens/PickedUpOrders";
import DeliveryRouteDetails from "../screens/DeliveryRouteDetails";
import DeliveryRouteMap from "../screens/DeliveryRouteMap";
import ActiveDeliveryRoute from "../screens/ActiveDeliveryRoute";
import DeliveryStopContact from "../screens/DeliveryStopContact";
import ActiveRouteDetails from "../screens/ActiveRouteDetails";
import DeliveryStopDetails from "../screens/DeliveryStopDetails";
import SelectDestination from "../screens/SelectDestination";
import PickupConfirmation from "../screens/PickupConfirmation";
import ConfirmPickupLocation from "../screens/ConfirmPickupLocation";
import PackagePickupQR from "../screens/PackagePickupQR";
import QRScanner from "../screens/QRScanner";
import QRScanConfirmation from "../screens/QRScanConfirmation";
import QRInstruction from "../screens/QRInstruction";
import QRScannerActive from "../screens/QRScannerActive";
import QRScanned from "../screens/QRScanned";
import QRProcessing from "../screens/QRProcessing";
import QRMarketingScan from "../screens/QRMarketingScan";
import QRMarketingProcessing from "../screens/QRMarketingProcessing";
import PickupConfirmed from "../screens/PickupConfirmed";
import DeliveryDropoffConfirmed from "../screens/DeliveryDropoffConfirmed";
import RentalJobOverview from "../screens/RentalJobOverview";
import TourSchedule from "../screens/TourSchedule";
import AmbulanceIncoming from "../screens/AmbulanceIncoming";
import HelpScreen from "../screens/Help";
import MoreMenuScreen from "../screens/MoreMenu";
import ProfileScreen from "../screens/Profile";
import ForgotPassword from "../screens/ForgotPassword";
import OTPVerification from "../screens/OTPVerification";
import NotificationsCenter from "../screens/NotificationsCenter";
import RatingsAndFeedback from "../screens/RatingsAndFeedback";
import Settings from "../screens/Settings";
import SettingsLanguage from "../screens/SettingsLanguage";
import SettingsPassword from "../screens/SettingsPassword";
import SettingsPrivacy from "../screens/SettingsPrivacy";
import SettingsDeleteAccount from "../screens/SettingsDeleteAccount";
import DocumentCenter from "../screens/DocumentCenter";
import DestinationFilter from "../screens/DestinationFilter";
import SuperAppHome from "../screens/SuperAppHome";

export interface ScreenConfig {
  id: string;
  label: string;
  path: string;
  previewPath?: string;
  Component: ComponentType;
}

export const SCREENS: ScreenConfig[] = [
  // Super app & registration
  { id: "SuperAppHome", label: "Home (Super App)", path: "/app/home", Component: SuperAppHome },
  { id: "RegisterServices", label: "Register Services", path: "/app/register-services", Component: RegisterServices },
  { id: "Registration", label: "Registration", path: "/auth/register", Component: Registration },
  { id: "DriverRegistration", label: "Registration – EVzone Driver", path: "/driver/register", Component: DriverRegistration },
  // Profile, documents & identity
  { id: "DriverProfileOnboarding", label: "Driver Personal", path: "/driver/onboarding/profile", Component: DriverProfileOnboarding },
  { id: "DriverPreferences", label: "Preferences", path: "/driver/preferences", Component: DriverPreferences },
  { id: "DocumentUpload", label: "Document Verification", path: "/driver/onboarding/profile/documents/upload", Component: DocumentUpload },
  { id: "DocumentReview", label: "Document Under Review", path: "/driver/onboarding/profile/documents/review", Component: DocumentReview },
  { id: "DocumentRejected", label: "Document Rejected", path: "/driver/onboarding/profile/documents/rejected", Component: DocumentRejected },
  { id: "DocumentVerified", label: "All Documents Verified", path: "/driver/onboarding/profile/documents/verified", Component: DocumentVerified },
  { id: "IdentityVerification", label: "Identity Verification", path: "/driver/preferences/identity", Component: IdentityVerification },
  { id: "FaceCapture", label: "Face Capture", path: "/driver/preferences/identity/face-capture", Component: FaceCapture },
  { id: "ImageUpload", label: "Upload Your Image", path: "/driver/preferences/identity/upload-image", Component: ImageUpload },
  { id: "MyVehicles", label: "My Vehicles", path: "/driver/vehicles", Component: MyVehicles },
  { id: "MyVehiclesManage", label: "My Vehicles (Manage)", path: "/driver/vehicles/manage", Component: MyVehicles },
  { id: "VehicleDetails", label: "Vehicles", path: "/driver/vehicles/:vehicleId", previewPath: `/driver/vehicles/${SAMPLE_IDS.vehicle}`, Component: VehicleDetails },
  { id: "BusinessVehicles", label: "Business Vehicles", path: "/driver/vehicles/business", Component: BusinessVehicles },
  { id: "VehicleAccessories", label: "Vehicle Accessories", path: "/driver/vehicles/accessories", Component: VehicleAccessories },
  // Training & quiz
  { id: "TrainingIntro", label: "Intro to Driving with EVzone Ride", path: "/driver/training/intro", Component: TrainingIntro },
  { id: "TrainingInfoSession", label: "Info Session for Driver-Partners", path: "/driver/training/info-session", Component: TrainingInfoSession },
  { id: "EarningsTutorial", label: "Driver Info Tutorial", path: "/driver/training/earnings-tutorial", Component: EarningsTutorial },
  { id: "TrainingQuiz", label: "Driver Info Session Quiz", path: "/driver/training/quiz", Component: TrainingQuiz },
  { id: "TrainingQuizAnswer", label: "Quiz Answer Selected", path: "/driver/training/quiz/answer", Component: TrainingQuizAnswer },
  { id: "TrainingQuizPassed", label: "Quiz Passed Confirmation", path: "/driver/training/quiz/passed", Component: TrainingQuizPassed },
  { id: "TrainingCompletion", label: "Content Completion Screen", path: "/driver/training/completion", Component: TrainingCompletion },
  // Dashboards, earnings & map
  { id: "DeliveryDashboard", label: "Delivery Driver Dashboard", path: "/driver/dashboard/delivery", Component: DeliveryDashboard },
  { id: "OnlineMapView", label: "Online Map View", path: "/driver/map/online", Component: OnlineMapView },
  { id: "OfflineDashboard", label: "Dashboard (Offline State)", path: "/driver/dashboard/offline", Component: OfflineDashboard },
  { id: "OnlineMapVariant", label: "Map View (Online Variant)", path: "/driver/map/online/variant", Component: OnlineMapVariant },
  { id: "ActiveDashboard", label: "Active Dashboard (Online Mode)", path: "/driver/dashboard/active", Component: ActiveDashboard },
  { id: "RequiredActionsDashboard", label: "Required Actions Dashboard", path: "/driver/dashboard/required-actions", Component: RequiredActionsDashboard },
  { id: "OnlineDashboard", label: "Online Dashboard (Active)", path: "/driver/dashboard/online", Component: OnlineDashboard },
  { id: "SearchingForRide", label: "Searching for Ride", path: "/driver/map/searching", Component: SearchingForRide },
  { id: "AnalyticsDashboard", label: "Analytics Dashboard", path: "/driver/analytics", Component: AnalyticsDashboard },
  { id: "EarningsOverview", label: "Earnings Overview", path: "/driver/earnings/overview", Component: EarningsOverview },
  { id: "WeeklyEarnings", label: "Weekly Earnings Summary", path: "/driver/earnings/weekly", Component: WeeklyEarnings },
  { id: "MonthlyEarnings", label: "Monthly Earnings Summary", path: "/driver/earnings/monthly", Component: MonthlyEarnings },
  { id: "SearchScreen", label: "Search Screen", path: "/driver/search", Component: SearchScreen },
  { id: "MapSettings", label: "Map Settings & Report Issues", path: "/driver/map/settings", Component: MapSettings },
  { id: "EarningsGoals", label: "Set Weekly Earning Goal", path: "/driver/earnings/goals", Component: EarningsGoals },
  { id: "SurgeNotification", label: "Surge Notification Popup", path: "/driver/surge/notification", Component: SurgeNotification },
  { id: "RideSharingNotification", label: "Ride Sharing Notification Popup", path: "/driver/ridesharing/notification", Component: RideSharingNotification },
  { id: "LastTripSummary", label: "Last Trip Summary Popup", path: "/driver/trip/last-summary", Component: LastTripSummary },
  // Job requests & selection
  { id: "RideRequestIncoming", label: "Ride Request Incoming", path: "/driver/jobs/incoming", Component: RideRequestIncoming },
  { id: "RideRequestRich", label: "Incoming Ride Request (Rich)", path: "/driver/jobs/incoming/rich", Component: RideRequestRich },
  { id: "RideRequestsList", label: "Ride Requests List", path: "/driver/jobs/list", Component: RideRequestsList },
  { id: "RideRequestsPrompt", label: "Ride Requests Prompt", path: "/driver/jobs/prompt", Component: RideRequestsPrompt },
  // Navigation & trip
  { id: "NavigateToPickup", label: "Navigate to Pick-Up Location", path: "/driver/trip/:tripId/navigate-to-pickup", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/navigate-to-pickup`, Component: NavigateToPickup },
  { id: "NavigationInProgress", label: "Navigation in Progress", path: "/driver/trip/:tripId/navigation", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/navigation`, Component: NavigationInProgress },
  { id: "ArrivedAtPickup", label: "Arrived at Pickup Point", path: "/driver/trip/:tripId/arrived", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/arrived`, Component: ArrivedAtPickup },
  { id: "WaitingForPassenger", label: "Waiting for Passenger", path: "/driver/trip/:tripId/waiting", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/waiting`, Component: WaitingForPassenger },
  { id: "CancelNoShow", label: "Cancel Ride – Passenger No-Show", path: "/driver/trip/:tripId/cancel/no-show", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/no-show`, Component: CancelNoShow },
  { id: "RiderVerification", label: "Rider Verification Code Entry", path: "/driver/trip/:tripId/verify-rider", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/verify-rider`, Component: RiderVerification },
  { id: "StartDrive", label: "Start Drive", path: "/driver/trip/:tripId/start", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/start`, Component: StartDrive },
  { id: "RideInProgress", label: "Ride in Progress", path: "/driver/trip/:tripId/in-progress", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/in-progress`, Component: RideInProgress },
  { id: "ActiveSharedTrip", label: "Active Shared Trip", path: "/driver/trip/:tripId/active", previewPath: `/driver/trip/${SAMPLE_IDS.ride}/active`, Component: ActiveSharedTrip },
  { id: "TripCompletion", label: "Trip Completion Screen", path: "/driver/trip/:tripId/completed", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/completed`, Component: TripCompletion },
  { id: "CancelReason", label: "Cancel Ride – Reason", path: "/driver/trip/:tripId/cancel/reason", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/reason`, Component: CancelReason },
  { id: "CancelDetails", label: "Cancel Ride – Additional Comment", path: "/driver/trip/:tripId/cancel/details", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/details`, Component: CancelDetails },
  // Safety & emergency
  { id: "SafetyToolkit", label: "Safety Toolkit", path: "/driver/safety/toolkit", Component: SafetyToolkit },
  { id: "EmergencyAssistanceMap", label: "Emergency Assistance (Map Variant)", path: "/driver/safety/emergency/map", Component: EmergencyAssistanceMap },
  { id: "SOSSending", label: "SOS / Emergency Alert Sending", path: "/driver/safety/sos/sending", Component: SOSSending },
  { id: "EmergencyAssistanceDetails", label: "Emergency Assistance (Details Variant)", path: "/driver/safety/emergency/details", Component: EmergencyAssistanceDetails },
  { id: "EmergencyCall", label: "Emergency Calling Screen", path: "/driver/safety/emergency/call", Component: EmergencyCall },
  { id: "EmergencyConfirmation", label: "Emergency Assistance Confirmation", path: "/driver/safety/emergency/confirmation", Component: EmergencyConfirmation },
  { id: "FollowMyRideEntry", label: "Follow My Ride (Entry)", path: "/driver/safety/follow-my-ride", Component: FollowMyRideEntry },
  { id: "ShareMyRideEntry", label: "Share My Ride (Entry)", path: "/driver/safety/share-my-ride", Component: ShareMyRideEntry },
  { id: "FollowMyRide", label: "Follow My Ride", path: "/driver/safety/follow-my-ride/:rideId", previewPath: `/driver/safety/follow-my-ride/${SAMPLE_IDS.ride}`, Component: FollowMyRide },
  { id: "ShareMyRide", label: "Share My Ride", path: "/driver/safety/share-my-ride/:rideId", previewPath: `/driver/safety/share-my-ride/${SAMPLE_IDS.ride}`, Component: ShareMyRide },
  { id: "AddShareContact", label: "Add Person to Share Ride", path: "/driver/safety/share-my-ride/:rideId/add-contact", previewPath: `/driver/safety/share-my-ride/${SAMPLE_IDS.ride}/add-contact`, Component: AddShareContact },
  // Proof & history
  { id: "ProofOfTripMain", label: "Proof of Trip Status – Main View", path: "/driver/trip/:tripId/proof", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/proof`, Component: ProofOfTripMain },
  { id: "ProofOfTripActive", label: "Proof of Trip – Active Trip View", path: "/driver/trip/:tripId/proof/active", previewPath: `/driver/trip/${SAMPLE_IDS.trip}/proof/active`, Component: ProofOfTripActive },
  { id: "RideHistory", label: "Ride History", path: "/driver/history/rides", Component: RideHistory },
  { id: "RideDetails", label: "Ride Details", path: "/driver/history/ride/:tripId", previewPath: `/driver/history/ride/${SAMPLE_IDS.trip}`, Component: RideDetails },
  { id: "SharedRideDetails", label: "Shared Ride Details", path: "/driver/history/shared/:tripId", previewPath: `/driver/history/shared/${SAMPLE_IDS.ride}`, Component: SharedRideDetails },
  { id: "DeliveryDetailsView", label: "Delivery Details", path: "/driver/history/delivery/:tripId", previewPath: `/driver/history/delivery/${SAMPLE_IDS.job}`, Component: DeliveryDetailsView },
  { id: "RentalDetailsView", label: "Rental Details", path: "/driver/history/rental/:tripId", previewPath: `/driver/history/rental/${SAMPLE_IDS.job}`, Component: RentalDetailsView },
  { id: "TourDetailsView", label: "Tour Details", path: "/driver/history/tour/:tripId", previewPath: `/driver/history/tour/${SAMPLE_IDS.tour}`, Component: TourDetailsView },
  // Safety hub additions
  { id: "SafetyHub", label: "Safety Hub", path: "/driver/safety/hub", Component: SafetyHub },
  { id: "SafetyHubExpanded", label: "Safety Hub – Expanded", path: "/driver/safety/hub/expanded", Component: SafetyHubExpanded },
  { id: "DrivingHours", label: "Driving Hours", path: "/driver/safety/driving-hours", Component: DrivingHours },
  // Surge & delivery order dashboards
  { id: "SurgePricing", label: "Surge Pricing", path: "/driver/surge/map", Component: SurgePricing },
  { id: "DeliveryOrdersDashboard", label: "Orders to Delivery", path: "/driver/delivery/orders-dashboard", Component: DeliveryOrdersDashboard },
  { id: "DeliveryOrdersEntry", label: "List of Orders (Entry)", path: "/driver/delivery/orders", Component: DeliveryOrdersEntry },
  { id: "DeliveryOrdersFilterEntry", label: "Select Order Type (Entry)", path: "/driver/delivery/orders/filter", Component: DeliveryOrdersFilterEntry },
  { id: "PickedUpOrders", label: "Picked-Up Orders", path: "/driver/delivery/orders/picked-up", Component: PickedUpOrders },
  // Routes & delivery flows
  { id: "DeliveryRouteDetails", label: "Route Details", path: "/driver/delivery/route/:routeId", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}`, Component: DeliveryRouteDetails },
  { id: "DeliveryRouteMap", label: "Route Details (Map Variant)", path: "/driver/delivery/route/:routeId/map", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/map`, Component: DeliveryRouteMap },
  { id: "ActiveDeliveryRoute", label: "Active Delivery Route", path: "/driver/delivery/route/:routeId/active", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/active`, Component: ActiveDeliveryRoute },
  { id: "DeliveryStopContact", label: "Active Route – Stop Contact", path: "/driver/delivery/route/:routeId/stop/:stopId/contact", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/stop/${SAMPLE_IDS.stop}/contact`, Component: DeliveryStopContact },
  { id: "ActiveRouteDetails", label: "Active Route Details", path: "/driver/delivery/route/:routeId/details", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/details`, Component: ActiveRouteDetails },
  { id: "DeliveryStopDetails", label: "Active Route – Expanded Stop Details", path: "/driver/delivery/route/:routeId/stop/:stopId/details", previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/stop/${SAMPLE_IDS.stop}/details`, Component: DeliveryStopDetails },
  { id: "SelectDestination", label: "Pick Your Destination", path: "/driver/delivery/destination/select", Component: SelectDestination },
  // Pickup confirmation & QR
  { id: "PickupConfirmation", label: "Pick Up Confirmation", path: "/driver/delivery/pickup/confirm", Component: PickupConfirmation },
  { id: "ConfirmPickupLocation", label: "Confirm Current Location as Pick Up", path: "/driver/delivery/pickup/confirm-location", Component: ConfirmPickupLocation },
  { id: "PackagePickupQR", label: "Package Pickup Verification", path: "/driver/delivery/pickup/qr", Component: PackagePickupQR },
  { id: "QRScanner", label: "QR Code Scanner", path: "/driver/qr/scanner", Component: QRScanner },
  { id: "QRScanConfirmation", label: "Scan QR Code Confirmation", path: "/driver/qr/scan-confirmation", Component: QRScanConfirmation },
  { id: "QRInstruction", label: "Scan QR Code – Instruction Popup", path: "/driver/qr/instruction", Component: QRInstruction },
  { id: "QRScannerActive", label: "Scan QR Code – Active Camera View", path: "/driver/qr/active", Component: QRScannerActive },
  { id: "QRScanned", label: "QR Code Scanned – Confirmation Indicator", path: "/driver/qr/scanned", Component: QRScanned },
  { id: "QRProcessing", label: "QR Code – Processing Stage", path: "/driver/qr/processing", Component: QRProcessing },
  { id: "QRMarketingScan", label: "QR Code Scanning – Marketing", path: "/driver/qr/marketing-scan", Component: QRMarketingScan },
  { id: "QRMarketingProcessing", label: "QR Code – Marketing Processing", path: "/driver/qr/marketing-processing", Component: QRMarketingProcessing },
  { id: "PickupConfirmed", label: "Pick-Up Confirmed Screen", path: "/driver/delivery/pickup/confirmed", Component: PickupConfirmed },
  { id: "DeliveryDropoffConfirmed", label: "Delivery Drop-Off Confirmed", path: "/driver/delivery/dropoff/confirmed", Component: DeliveryDropoffConfirmed },
  // Special job types
  { id: "RentalJobOverview", label: "Rental Job Overview / On Rental", path: "/driver/rental/job/:jobId", previewPath: `/driver/rental/job/${SAMPLE_IDS.job}`, Component: RentalJobOverview },
  { id: "TourSchedule", label: "Tour – Today’s Schedule", path: "/driver/tour/:tourId/today", previewPath: `/driver/tour/${SAMPLE_IDS.tour}/today`, Component: TourSchedule },
  { id: "AmbulanceIncoming", label: "Ambulance Job Incoming", path: "/driver/ambulance/incoming", Component: AmbulanceIncoming },
  { id: "AmbulanceJobStatus", label: "Ambulance Job Status Screen", path: "/driver/ambulance/job/:jobId/status", previewPath: `/driver/ambulance/job/${SAMPLE_IDS.job}/status`, Component: AmbulanceJobStatus },
  { id: "JobTypesLegend", label: "Job Types & Icons Legend", path: "/driver/settings/job-types-legend", Component: JobTypesLegend },
  { id: "ShuttleLinkInfo", label: "Shuttle Link Info Screen", path: "/driver/help/shuttle-link", Component: ShuttleLinkInfo },
  { id: "MoreMenu", label: "More Menu", path: "/driver/more", Component: MoreMenuScreen },
  { id: "Profile", label: "Profile", path: "/driver/profile", Component: ProfileScreen },
  { id: "ProfileMore", label: "Profile (More)", path: "/driver/more/profile", Component: ProfileScreen },
  { id: "Help", label: "Help & Support", path: "/driver/help", Component: HelpScreen },
  { id: "About", label: "About EVzone", path: "/driver/about", Component: AboutScreen },
  { id: "CashOut", label: "Cash Out – Payment Gateway", path: "/driver/earnings/cashout", Component: CashOutScreen },
  { id: "ForgotPassword", label: "Forgot Password", path: "/auth/forgot-password", Component: ForgotPassword },
  { id: "OTPVerification", label: "OTP Verification", path: "/auth/verify-otp", Component: OTPVerification },
  { id: "NotificationsCenter", label: "Notifications", path: "/driver/notifications", Component: NotificationsCenter },
  { id: "Ratings", label: "Ratings & Reviews", path: "/driver/ratings", Component: RatingsAndFeedback },
  { id: "Settings", label: "Settings", path: "/driver/settings", Component: Settings },
  { id: "SettingsLanguage", label: "Settings – Language", path: "/driver/settings/language", Component: SettingsLanguage },
  { id: "SettingsPassword", label: "Settings – Password", path: "/driver/settings/password", Component: SettingsPassword },
  { id: "SettingsPrivacy", label: "Settings – Privacy", path: "/driver/settings/privacy", Component: SettingsPrivacy },
  { id: "SettingsDelete", label: "Settings – Delete Account", path: "/driver/settings/delete-account", Component: SettingsDeleteAccount },
  { id: "Documents", label: "Document Center", path: "/driver/documents", Component: DocumentCenter },
  { id: "DestinationFilter", label: "Destination Filter", path: "/driver/navigation/destination", Component: DestinationFilter },
];

/**
 * Single-source screen path map generated from SCREENS.
 * Kept as a named export for compatibility with legacy ScreenMap imports.
 */
function buildScreenMap(screens: ScreenConfig[]): Record<string, string> {
  const map: Record<string, string> = {};

  for (const screen of screens) {
    map[screen.id] = screen.path;
  }

  return map;
}

export const ScreenMap = Object.freeze(buildScreenMap(SCREENS));
export type ScreenName = keyof typeof ScreenMap;

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

export { SAMPLE_IDS };
