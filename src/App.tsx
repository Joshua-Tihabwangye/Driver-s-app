import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  matchPath,
} from "react-router-dom";
import { MapPin, Moon, Sun } from "lucide-react";
import { useTheme } from "./context/ThemeContext";
import D01Screen from "./screens/D01.jsx";
import D02Screen from "./screens/D02.jsx";
import D03Screen from "./screens/D03.jsx";
import D04Screen from "./screens/D04.jsx";
import D05Screen from "./screens/D05.jsx";
import D06Screen from "./screens/D06.jsx";
import D07Screen from "./screens/D07.jsx";
import D08Screen from "./screens/D08.jsx";
import D09Screen from "./screens/D09.jsx";
import D10Screen from "./screens/D10.jsx";
import D11Screen from "./screens/D11.jsx";
import D12Screen from "./screens/D12.jsx";
import D13Screen from "./screens/D13.jsx";
import D14Screen from "./screens/D14.jsx";
import D15Screen from "./screens/D15.jsx";
import D16Screen from "./screens/D16.jsx";
import D17Screen from "./screens/D17.jsx";
import D18Screen from "./screens/D18.jsx";
import D19Screen from "./screens/D19.jsx";
import D20Screen from "./screens/D20.jsx";
import D21Screen from "./screens/D21.jsx";
import D22Screen from "./screens/D22.jsx";
import D23Screen from "./screens/D23.jsx";
import D24Screen from "./screens/D24.jsx";
import D25Screen from "./screens/D25.jsx";
import D26Screen from "./screens/D26.jsx";
import D27Screen from "./screens/D27.jsx";
import D28Screen from "./screens/D28.jsx";
import D29Screen from "./screens/D29.jsx";
import D30Screen from "./screens/D30.jsx";
import D31Screen from "./screens/D31.jsx";
import D32Screen from "./screens/D32.jsx";
import D33Screen from "./screens/D33.jsx";
import D34Screen from "./screens/D34.jsx";
import D35Screen from "./screens/D35.jsx";
import D36Screen from "./screens/D36.jsx";
import D37Screen from "./screens/D37.jsx";
import D38Screen from "./screens/D38.jsx";
import D39Screen from "./screens/D39.jsx";
import D40Screen from "./screens/D40.jsx";
import D41Screen from "./screens/D41.jsx";
import D42Screen from "./screens/D42.jsx";
import D43Screen from "./screens/D43.jsx";
import D44Screen from "./screens/D44.jsx";
import D45Screen from "./screens/D45.jsx";
import D46Screen from "./screens/D46.jsx";
import D47Screen from "./screens/D47.jsx";
import D48Screen from "./screens/D48.jsx";
import D49Screen from "./screens/D49.jsx";
import D50Screen from "./screens/D50.jsx";
import D51Screen from "./screens/D51.jsx";
import D52Screen from "./screens/D52.jsx";
import D53Screen from "./screens/D53.jsx";
import D54Screen from "./screens/D54.jsx";
import D55Screen from "./screens/D55.jsx";
import D56Screen from "./screens/D56.jsx";
import D57Screen from "./screens/D57.jsx";
import D58Screen from "./screens/D58.jsx";
import D59Screen from "./screens/D59.jsx";
import D60Screen from "./screens/D60.jsx";
import D61Screen from "./screens/D61.jsx";
import D62Screen from "./screens/D62.jsx";
import D63Screen from "./screens/D63.jsx";
import D64Screen from "./screens/D64.jsx";
import D65Screen from "./screens/D65.jsx";
import D66Screen from "./screens/D66.jsx";
import D67Screen from "./screens/D67.jsx";
import D68Screen from "./screens/D68.jsx";
import D69Screen from "./screens/D69.jsx";
import D70Screen from "./screens/D70.jsx";
import D71Screen from "./screens/D71.jsx";
import D72Screen from "./screens/D72.jsx";
import D73Screen from "./screens/D73.jsx";
import D74Screen from "./screens/D74.jsx";
import D75Screen from "./screens/D75.jsx";
import D76Screen from "./screens/D76.jsx";
import D77Screen from "./screens/D77.jsx";
import D78Screen from "./screens/D78.jsx";
import D79Screen from "./screens/D79.jsx";
import D80Screen from "./screens/D80.jsx";
import D81Screen from "./screens/D81.jsx";
import D82Screen from "./screens/D82.jsx";
import D83Screen from "./screens/D83.jsx";
import D84Screen from "./screens/D84.jsx";
import D85Screen from "./screens/D85.jsx";
import D86Screen from "./screens/D86.jsx";
import D87Screen from "./screens/D87.jsx";
import D88Screen from "./screens/D88.jsx";
import D89Screen from "./screens/D89.jsx";
import D90Screen from "./screens/D90.jsx";
import D91Screen from "./screens/D91.jsx";
import D92Screen from "./screens/D92.jsx";
import D93Screen from "./screens/D93.jsx";
import D94Screen from "./screens/D94.jsx";
import D95Screen from "./screens/D95.jsx";
import D96Screen from "./screens/D96.jsx";
import D97Screen from "./screens/D97.jsx";
import D98Screen from "./screens/D98.jsx";
import D99Screen from "./screens/D99.jsx";
import D100Screen from "./screens/D100.jsx";
import D101Screen from "./screens/D101.jsx";
import D102Screen from "./screens/D102.jsx";
import CashOutScreen from "./screens/CashOut";

const SAMPLE_IDS = {
  trip: "demo-trip",
  vehicle: "demo-vehicle",
  route: "demo-route",
  stop: "alpha-stop",
  job: "demo-job",
  tour: "demo-tour",
};

const BOTTOM_NAV_DESTINATIONS = {
  home: "/driver/dashboard/online",
  manager: "/driver/jobs/list",
  wallet: "/driver/earnings/overview",
  settings: "/driver/preferences",
  bookings: "/driver/jobs/list",
  tasks: "/driver/delivery/orders",
  delivery: "/driver/delivery/orders",
  orders: "/driver/delivery/orders",
  mode: "/driver/dashboard/offline",
  online: "/driver/dashboard/online",
  map: "/driver/map/online",
  jobs: "/driver/jobs/list",
  programs: "/driver/training/intro",
  shuttle: "/driver/help/shuttle-link",
  safety: "/driver/safety/hub",
  search: "/driver/search",
};

const BOTTOM_NAV_CLASS_MARKERS = ["border-t", "backdrop-blur"];

const SCREENS = [
  // Super app & registration (ROUTING_GUIDE §3.1)
  { id: "D01", label: "Home (Super App)", path: "/app/home", Component: D01Screen },
  {
    id: "D02",
    label: "Register Services",
    path: "/app/register-services",
    Component: D02Screen,
  },
  {
    id: "D03",
    label: "Registration",
    path: "/auth/register",
    Component: D03Screen,
  },
  {
    id: "D04",
    label: "Registration – EVzone Driver",
    path: "/driver/register",
    Component: D04Screen,
  },
  // Profile, documents & identity (§3.2)
  {
    id: "D05",
    label: "Driver Personal",
    path: "/driver/onboarding/profile",
    Component: D05Screen,
  },
  {
    id: "D06",
    label: "Preferences",
    path: "/driver/preferences",
    Component: D06Screen,
  },
  {
    id: "D07",
    label: "Document Verification",
    path: "/driver/onboarding/profile/documents/upload",
    Component: D07Screen,
  },
  {
    id: "D08",
    label: "Document Under Review",
    path: "/driver/onboarding/profile/documents/review",
    Component: D08Screen,
  },
  {
    id: "D09",
    label: "Document Rejected",
    path: "/driver/onboarding/profile/documents/rejected",
    Component: D09Screen,
  },
  {
    id: "D10",
    label: "All Documents Verified",
    path: "/driver/onboarding/profile/documents/verified",
    Component: D10Screen,
  },
  {
    id: "D11",
    label: "Identity Verification",
    path: "/driver/preferences/identity",
    Component: D11Screen,
  },
  {
    id: "D12",
    label: "Face Capture",
    path: "/driver/preferences/identity/face-capture",
    Component: D12Screen,
  },
  {
    id: "D13",
    label: "Upload Your Image",
    path: "/driver/preferences/identity/upload-image",
    Component: D13Screen,
  },
  {
    id: "D14",
    label: "My Vehicles",
    path: "/driver/vehicles",
    Component: D14Screen,
  },
  {
    id: "D15",
    label: "Vehicles",
    path: "/driver/vehicles/:vehicleId",
    previewPath: `/driver/vehicles/${SAMPLE_IDS.vehicle}`,
    Component: D15Screen,
  },
  {
    id: "D16",
    label: "Business Vehicles",
    path: "/driver/vehicles/business",
    Component: D16Screen,
  },
  {
    id: "D17",
    label: "Vehicle Accessories",
    path: "/driver/vehicles/accessories",
    Component: D17Screen,
  },
  // Training & quiz (§3.3)
  {
    id: "D18",
    label: "Intro to Driving with EVzone Ride",
    path: "/driver/training/intro",
    Component: D18Screen,
  },
  {
    id: "D19",
    label: "Info Session for Driver-Partners",
    path: "/driver/training/info-session",
    Component: D19Screen,
  },
  {
    id: "D20",
    label: "Driver Info Tutorial",
    path: "/driver/training/earnings-tutorial",
    Component: D20Screen,
  },
  {
    id: "D21",
    label: "Driver Info Session Quiz",
    path: "/driver/training/quiz",
    Component: D21Screen,
  },
  {
    id: "D22",
    label: "Quiz Answer Selected",
    path: "/driver/training/quiz/answer",
    Component: D22Screen,
  },
  {
    id: "D23",
    label: "Quiz Passed Confirmation",
    path: "/driver/training/quiz/passed",
    Component: D23Screen,
  },
  {
    id: "D24",
    label: "Content Completion Screen",
    path: "/driver/training/completion",
    Component: D24Screen,
  },
  // Dashboards, earnings & map (§3.4)
  {
    id: "D25",
    label: "Delivery Driver Dashboard",
    path: "/driver/dashboard/delivery",
    Component: D25Screen,
  },
  {
    id: "D26",
    label: "Online Map View",
    path: "/driver/map/online",
    Component: D26Screen,
  },
  {
    id: "D27",
    label: "Dashboard (Offline State)",
    path: "/driver/dashboard/offline",
    Component: D27Screen,
  },
  {
    id: "D28",
    label: "Map View (Online Variant)",
    path: "/driver/map/online/variant",
    Component: D28Screen,
  },
  {
    id: "D29",
    label: "Active Dashboard (Online Mode)",
    path: "/driver/dashboard/active",
    Component: D29Screen,
  },
  {
    id: "D30",
    label: "Required Actions Dashboard",
    path: "/driver/dashboard/required-actions",
    Component: D30Screen,
  },
  {
    id: "D31",
    label: "Online Dashboard (Active)",
    path: "/driver/dashboard/online",
    Component: D31Screen,
  },
  {
    id: "D32",
    label: "Searching for Ride",
    path: "/driver/map/searching",
    Component: D32Screen,
  },
  {
    id: "D33",
    label: "Earnings Overview",
    path: "/driver/earnings/overview",
    Component: D33Screen,
  },
  {
    id: "D34",
    label: "Weekly Earnings Summary",
    path: "/driver/earnings/weekly",
    Component: D34Screen,
  },
  {
    id: "D35",
    label: "Monthly Earnings Summary",
    path: "/driver/earnings/monthly",
    Component: D35Screen,
  },
  {
    id: "D36",
    label: "Search Screen",
    path: "/driver/search",
    Component: D36Screen,
  },
  {
    id: "D37",
    label: "Map Settings & Report Issues",
    path: "/driver/map/settings",
    Component: D37Screen,
  },
  {
    id: "D38",
    label: "Set Weekly Earning Goal",
    path: "/driver/earnings/goals",
    Component: D38Screen,
  },
  {
    id: "D39",
    label: "Surge Notification Popup",
    path: "/driver/surge/notification",
    Component: D39Screen,
  },
  {
    id: "D40",
    label: "Ride Sharing Notification Popup",
    path: "/driver/ridesharing/notification",
    Component: D40Screen,
  },
  {
    id: "D41",
    label: "Last Trip Summary Popup",
    path: "/driver/trip/last-summary",
    Component: D41Screen,
  },
  // Job requests & selection (§3.5)
  {
    id: "D42",
    label: "Ride Request Incoming",
    path: "/driver/jobs/incoming",
    Component: D42Screen,
  },
  {
    id: "D43",
    label: "Incoming Ride Request (Rich)",
    path: "/driver/jobs/incoming/rich",
    Component: D43Screen,
  },
  {
    id: "D44",
    label: "Ride Requests List",
    path: "/driver/jobs/list",
    Component: D44Screen,
  },
  {
    id: "D45",
    label: "Ride Requests Prompt",
    path: "/driver/jobs/prompt",
    Component: D45Screen,
  },
  {
    id: "D46",
    label: "Active Ride with Additional Requests",
    path: "/driver/jobs/active-with-additional",
    Component: D46Screen,
  },
  // Navigation & trip (§3.6–3.8)
  {
    id: "D47",
    label: "Navigate to Pick-Up Location",
    path: "/driver/trip/:tripId/navigate-to-pickup",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/navigate-to-pickup`,
    Component: D47Screen,
  },
  {
    id: "D48",
    label: "Navigation in Progress",
    path: "/driver/trip/:tripId/navigation",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/navigation`,
    Component: D48Screen,
  },
  {
    id: "D49",
    label: "En Route to Pickup – Details",
    path: "/driver/trip/:tripId/en-route-details",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/en-route-details`,
    Component: D49Screen,
  },
  {
    id: "D50",
    label: "Arrived at Pickup Point",
    path: "/driver/trip/:tripId/arrived",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/arrived`,
    Component: D50Screen,
  },
  {
    id: "D51",
    label: "Waiting for Passenger",
    path: "/driver/trip/:tripId/waiting",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/waiting`,
    Component: D51Screen,
  },
  {
    id: "D52",
    label: "Cancel Ride – Passenger No-Show",
    path: "/driver/trip/:tripId/cancel/no-show",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/no-show`,
    Component: D52Screen,
  },
  {
    id: "D53",
    label: "Rider Verification Code Entry",
    path: "/driver/trip/:tripId/verify-rider",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/verify-rider`,
    Component: D53Screen,
  },
  {
    id: "D54",
    label: "Start Drive",
    path: "/driver/trip/:tripId/start",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/start`,
    Component: D54Screen,
  },
  {
    id: "D55",
    label: "Ride in Progress",
    path: "/driver/trip/:tripId/in-progress",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/in-progress`,
    Component: D55Screen,
  },
  {
    id: "D56",
    label: "Trip Completion Screen",
    path: "/driver/trip/:tripId/completed",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/completed`,
    Component: D56Screen,
  },
  {
    id: "D57",
    label: "Cancel Ride – Reason",
    path: "/driver/trip/:tripId/cancel/reason",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/reason`,
    Component: D57Screen,
  },
  {
    id: "D58",
    label: "Cancel Ride – Additional Comment",
    path: "/driver/trip/:tripId/cancel/details",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/cancel/details`,
    Component: D58Screen,
  },
  // Safety & emergency (§3.9)
  {
    id: "D59",
    label: "Safety Toolkit",
    path: "/driver/safety/toolkit",
    Component: D59Screen,
  },
  {
    id: "D60",
    label: "Emergency Assistance (Map Variant)",
    path: "/driver/safety/emergency/map",
    Component: D60Screen,
  },
  {
    id: "D61",
    label: "SOS / Emergency Alert Sending",
    path: "/driver/safety/sos/sending",
    Component: D61Screen,
  },
  {
    id: "D62",
    label: "Emergency Assistance (Details Variant)",
    path: "/driver/safety/emergency/details",
    Component: D62Screen,
  },
  {
    id: "D63",
    label: "Emergency Calling Screen",
    path: "/driver/safety/emergency/call",
    Component: D63Screen,
  },
  {
    id: "D64",
    label: "Emergency Assistance Confirmation",
    path: "/driver/safety/emergency/confirmation",
    Component: D64Screen,
  },
  {
    id: "D65",
    label: "Follow My Ride",
    path: "/driver/safety/follow-my-ride",
    Component: D65Screen,
  },
  {
    id: "D66",
    label: "Share My Ride",
    path: "/driver/safety/share-my-ride",
    Component: D66Screen,
  },
  // Proof & history (§3.10)
  {
    id: "D67",
    label: "Proof of Trip Status – Main View",
    path: "/driver/trip/:tripId/proof",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/proof`,
    Component: D67Screen,
  },
  {
    id: "D68",
    label: "Proof of Trip – Active Trip View",
    path: "/driver/trip/:tripId/proof/active",
    previewPath: `/driver/trip/${SAMPLE_IDS.trip}/proof/active`,
    Component: D68Screen,
  },
  {
    id: "D69",
    label: "Ride History",
    path: "/driver/history/rides",
    Component: D69Screen,
  },
  // Safety hub additions (§3.9)
  {
    id: "D70",
    label: "Safety Hub",
    path: "/driver/safety/hub",
    Component: D70Screen,
  },
  {
    id: "D71",
    label: "Safety Hub – Expanded",
    path: "/driver/safety/hub/expanded",
    Component: D71Screen,
  },
  {
    id: "D72",
    label: "Driving Hours",
    path: "/driver/safety/driving-hours",
    Component: D72Screen,
  },
  // Surge & delivery order dashboards (§3.11)
  {
    id: "D73",
    label: "Surge Pricing",
    path: "/driver/surge/map",
    Component: D73Screen,
  },
  {
    id: "D74",
    label: "Orders to Delivery",
    path: "/driver/delivery/orders-dashboard",
    Component: D74Screen,
  },
  {
    id: "D75",
    label: "List of Orders",
    path: "/driver/delivery/orders",
    Component: D75Screen,
  },
  {
    id: "D76",
    label: "Select Order Type",
    path: "/driver/delivery/orders/filter",
    Component: D76Screen,
  },
  {
    id: "D77",
    label: "Picked-Up Orders",
    path: "/driver/delivery/orders/picked-up",
    Component: D77Screen,
  },
  // Routes & delivery flows (§3.12)
  {
    id: "D78",
    label: "Route Details",
    path: "/driver/delivery/route/:routeId",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}`,
    Component: D78Screen,
  },
  {
    id: "D79",
    label: "Route Details (Map Variant)",
    path: "/driver/delivery/route/:routeId/map",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/map`,
    Component: D79Screen,
  },
  {
    id: "D80",
    label: "Active Delivery Route",
    path: "/driver/delivery/route/:routeId/active",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/active`,
    Component: D80Screen,
  },
  {
    id: "D81",
    label: "Active Route – Stop Contact",
    path: "/driver/delivery/route/:routeId/stop/:stopId/contact",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/stop/${SAMPLE_IDS.stop}/contact`,
    Component: D81Screen,
  },
  {
    id: "D82",
    label: "Active Route Details",
    path: "/driver/delivery/route/:routeId/details",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/details`,
    Component: D82Screen,
  },
  {
    id: "D83",
    label: "Active Route – Expanded Stop Details",
    path: "/driver/delivery/route/:routeId/stop/:stopId/details",
    previewPath: `/driver/delivery/route/${SAMPLE_IDS.route}/stop/${SAMPLE_IDS.stop}/details`,
    Component: D83Screen,
  },
  {
    id: "D84",
    label: "Pick Your Destination",
    path: "/driver/delivery/destination/select",
    Component: D84Screen,
  },
  // Pickup confirmation & QR (§3.13)
  {
    id: "D85",
    label: "Pick Up Confirmation",
    path: "/driver/delivery/pickup/confirm",
    Component: D85Screen,
  },
  {
    id: "D86",
    label: "Confirm Current Location as Pick Up",
    path: "/driver/delivery/pickup/confirm-location",
    Component: D86Screen,
  },
  {
    id: "D87",
    label: "Package Pickup Verification",
    path: "/driver/delivery/pickup/qr",
    Component: D87Screen,
  },
  {
    id: "D88",
    label: "QR Code Scanner",
    path: "/driver/qr/scanner",
    Component: D88Screen,
  },
  {
    id: "D89",
    label: "Scan QR Code Confirmation",
    path: "/driver/qr/scan-confirmation",
    Component: D89Screen,
  },
  {
    id: "D90",
    label: "Scan QR Code – Instruction Popup",
    path: "/driver/qr/instruction",
    Component: D90Screen,
  },
  {
    id: "D91",
    label: "Scan QR Code – Active Camera View",
    path: "/driver/qr/active",
    Component: D91Screen,
  },
  {
    id: "D92",
    label: "QR Code Scanned – Confirmation Indicator",
    path: "/driver/qr/scanned",
    Component: D92Screen,
  },
  {
    id: "D93",
    label: "QR Code – Processing Stage",
    path: "/driver/qr/processing",
    Component: D93Screen,
  },
  {
    id: "D94",
    label: "QR Code Scanning – Marketing",
    path: "/driver/qr/marketing-scan",
    Component: D94Screen,
  },
  {
    id: "D95",
    label: "QR Code – Marketing Processing",
    path: "/driver/qr/marketing-processing",
    Component: D95Screen,
  },
  {
    id: "D96",
    label: "Pick-Up Confirmed Screen",
    path: "/driver/delivery/pickup/confirmed",
    Component: D96Screen,
  },
  // Special job types (§3.14)
  {
    id: "D97",
    label: "Rental Job Overview / On Rental",
    path: "/driver/rental/job/:jobId",
    previewPath: `/driver/rental/job/${SAMPLE_IDS.job}`,
    Component: D97Screen,
  },
  {
    id: "D98",
    label: "Tour – Today’s Schedule",
    path: "/driver/tour/:tourId/today",
    previewPath: `/driver/tour/${SAMPLE_IDS.tour}/today`,
    Component: D98Screen,
  },
  {
    id: "D99",
    label: "Ambulance Job Incoming",
    path: "/driver/ambulance/incoming",
    Component: D99Screen,
  },
  {
    id: "D100",
    label: "Ambulance Job Status Screen",
    path: "/driver/ambulance/job/:jobId/status",
    previewPath: `/driver/ambulance/job/${SAMPLE_IDS.job}/status`,
    Component: D100Screen,
  },
  {
    id: "D101",
    label: "Job Types & Icons Legend",
    path: "/driver/settings/job-types-legend",
    Component: D101Screen,
  },
  {
    id: "D102",
    label: "Shuttle Link Info Screen",
    path: "/driver/help/shuttle-link",
    Component: D102Screen,
  },
  {
    id: "CashOut",
    label: "Cash Out – Payment Gateway",
    path: "/driver/earnings/cashout",
    Component: CashOutScreen,
  },
];

const DEFAULT_SCREEN = SCREENS[0];

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentScreen =
    SCREENS.find((screen) =>
      matchPath({ path: screen.path, end: true }, location.pathname)
    ) || DEFAULT_SCREEN;

  const handleScreenChange = (event) => {
    const next = SCREENS.find((screen) => screen.id === event.target.value);
    if (next) {
      navigate(next.previewPath ?? next.path);
    }
  };

  useEffect(() => {
    const normalizeLabel = (text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const handleBottomNavClick = (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      const nav = button.closest("nav");
      if (!nav) return;

      const looksLikeBottomNav = BOTTOM_NAV_CLASS_MARKERS.every((cls) =>
        nav.classList.contains(cls)
      );
      if (!looksLikeBottomNav) return;

      const normalized = normalizeLabel(button.textContent || "");
      if (!normalized) return;

      const destination = BOTTOM_NAV_DESTINATIONS[normalized];
      if (!destination) return;

      navigate(destination);
    };

    document.addEventListener("click", handleBottomNavClick);
    return () => document.removeEventListener("click", handleBottomNavClick);
  }, [navigate]);

  return (
    <Box
      className={`preview-root ${isDark ? "dark" : ""}`}
      data-screen-id={currentScreen.id}
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#0f172a" : "#edf3f2",
        color: isDark ? "#e2e8f0" : "#1e293b",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Global Theme Toggle FAB */}
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-[9999] p-3 rounded-full shadow-2xl transition-all active:scale-90 hover:scale-110 flex items-center justify-center border"
        style={{
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderColor: isDark ? "#334155" : "#e2e8f0",
          color: isDark ? "#fbbf24" : "#475569"
        }}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      <Box
        sx={{
          width: 360,
          mb: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "transparent",
            boxShadow: isDark
              ? "0 12px 30px rgba(0,0,0,0.5)"
              : "0 12px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Box
            sx={{
              px: 2.25,
              pt: 2,
              pb: 1.25,
              background: isDark
                ? "linear-gradient(135deg, #065f46, #047857)"
                : "linear-gradient(135deg, #0bbf7c, #03cd8c)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <MapPin size={16} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}
                >
                  EVzone Driver App – Supervisor Preview
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 12.5,
                  lineHeight: 1.45,
                  maxWidth: 280,
                }}
              >
                Select any screen ID from D01 to D102 or jump via the official
                routes from ROUTING_GUIDE.md.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: 2,
              pb: 2,
              pt: 1.25,
              backgroundColor: isDark ? "#1e293b" : "#ffffff",
              borderRadius: "0 0 24px 24px",
              transition: "background-color 0.3s ease",
            }}
          >
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: isDark ? "#263348" : "#ffffff",
                  boxShadow: isDark
                    ? "0 8px 20px rgba(0,0,0,0.3)"
                    : "0 8px 20px rgba(15,23,42,0.12)",
                  color: isDark ? "#e2e8f0" : undefined,
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontWeight: 600,
                    fontSize: 14,
                    py: 1.25,
                  },
                  "& fieldset": {
                    borderColor: isDark ? "#475569" : undefined,
                  },
                  "&:hover fieldset": {
                    borderColor: isDark ? "#64748b" : undefined,
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: 12,
                  letterSpacing: 0.2,
                  color: isDark ? "#94a3b8" : undefined,
                },
                "& .MuiSvgIcon-root": {
                  color: isDark ? "#94a3b8" : undefined,
                },
                mt: 0.5,
              }}
            >
              <InputLabel id="screen-select-label">Screen (D01–D102)</InputLabel>
              <Select
                labelId="screen-select-label"
                id="screen-select"
                value={currentScreen.id}
                label="Screen (D01–D102)"
                onChange={handleScreenChange}
                inputProps={{ "aria-label": "Select screen" }}
                startAdornment={
                  <InputAdornment position="start" sx={{ color: isDark ? "#64748b" : "#94a3b8" }}>
                    <MapPin size={16} />
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 360,
                      borderRadius: 2,
                      bgcolor: isDark ? "#1e293b" : "#ffffff",
                      color: isDark ? "#e2e8f0" : undefined,
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          bgcolor: isDark ? "#263348" : undefined,
                        },
                        "&.Mui-selected": {
                          bgcolor: isDark ? "#334155" : undefined,
                        },
                      },
                    },
                  },
                }}
              >
                {SCREENS.map((screen) => (
                  <MenuItem key={screen.id} value={screen.id}>
                    {screen.id} – {screen.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>

      <Box className="screen-preview-host" sx={{ width: "100%" }}>
        <Routes>
          {SCREENS.map((screen) => (
            <Route
              key={screen.id}
              path={screen.path}
              element={<screen.Component />}
            />
          ))}
          <Route
            path="*"
            element={
              <Navigate
                to={DEFAULT_SCREEN.previewPath ?? DEFAULT_SCREEN.path}
                replace
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}
