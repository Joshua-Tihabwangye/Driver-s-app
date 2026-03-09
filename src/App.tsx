import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth & Landing ──────────────────────────────────────
import LandingPage from "./screens/LandingPage";
import Login from "./screens/Login";

// ── Super-app & registration (D01–D04) ──────────────────
import D01Screen from "./screens/D01";
import D02Screen from "./screens/D02";
import D03Screen from "./screens/D03";
import D04Screen from "./screens/D04";

// ── Profile, documents & identity (D05–D17) ─────────────
import D05Screen from "./screens/D05";
import D06Screen from "./screens/D06";
import D07Screen from "./screens/D07";
import D08Screen from "./screens/D08";
import D09Screen from "./screens/D09";
import D10Screen from "./screens/D10";
import D11Screen from "./screens/D11";
import D12Screen from "./screens/D12";
import D13Screen from "./screens/D13";
import D14Screen from "./screens/D14";
import D15Screen from "./screens/D15";
import D16Screen from "./screens/D16";
import D17Screen from "./screens/D17";

// ── Training & quizzes (D18–D24) ────────────────────────
import D18Screen from "./screens/D18";
import D19Screen from "./screens/D19";
import D20Screen from "./screens/D20";
import D21Screen from "./screens/D21";
import D22Screen from "./screens/D22";
import D23Screen from "./screens/D23";
import D24Screen from "./screens/D24";

// ── Dashboards, earnings & map (D25–D41) ────────────────
import D25Screen from "./screens/D25";
import D26Screen from "./screens/D26";
import D27Screen from "./screens/D27";
import D28Screen from "./screens/D28";
import D29Screen from "./screens/D29";
import D30Screen from "./screens/D30";
import D31Screen from "./screens/D31";
import D32Screen from "./screens/D32";
import D33Screen from "./screens/D33";
import D34Screen from "./screens/D34";
import D35Screen from "./screens/D35";
import D36Screen from "./screens/D36";
import D37Screen from "./screens/D37";
import D38Screen from "./screens/D38";
import D39Screen from "./screens/D39";
import D40Screen from "./screens/D40";
import D41Screen from "./screens/D41";

// ── Job requests & selection (D42–D46) ──────────────────
import D42Screen from "./screens/D42";
import D43Screen from "./screens/D43";
import D44Screen from "./screens/D44";
import D45Screen from "./screens/D45";
import D46Screen from "./screens/D46";

// ── Navigation, trip & cancellation (D47–D58) ───────────
import D47Screen from "./screens/D47";
import D48Screen from "./screens/D48";
import D49Screen from "./screens/D49";
import D50Screen from "./screens/D50";
import D51Screen from "./screens/D51";
import D52Screen from "./screens/D52";
import D53Screen from "./screens/D53";
import D54Screen from "./screens/D54";
import D55Screen from "./screens/D55";
import D56Screen from "./screens/D56";
import D57Screen from "./screens/D57";
import D58Screen from "./screens/D58";

// ── Safety & emergency (D59–D66, D70–D72) ───────────────
import D59Screen from "./screens/D59";
import D60Screen from "./screens/D60";
import D61Screen from "./screens/D61";
import D62Screen from "./screens/D62";
import D63Screen from "./screens/D63";
import D64Screen from "./screens/D64";
import D65Screen from "./screens/D65";
import D66Screen from "./screens/D66";
import D70Screen from "./screens/D70";
import D71Screen from "./screens/D71";
import D72Screen from "./screens/D72";

// ── Proof, history, surge (D67–D69, D73) ────────────────
import D67Screen from "./screens/D67";
import D68Screen from "./screens/D68";
import D69Screen from "./screens/D69";
import D73Screen from "./screens/D73";

// ── Delivery orders, routes & QR (D74–D96) ──────────────
import D74Screen from "./screens/D74";
import D75Screen from "./screens/D75";
import D76Screen from "./screens/D76";
import D77Screen from "./screens/D77";
import D78Screen from "./screens/D78";
import D79Screen from "./screens/D79";
import D80Screen from "./screens/D80";
import D81Screen from "./screens/D81";
import D82Screen from "./screens/D82";
import D83Screen from "./screens/D83";
import D84Screen from "./screens/D84";
import D85Screen from "./screens/D85";
import D86Screen from "./screens/D86";
import D87Screen from "./screens/D87";
import D88Screen from "./screens/D88";
import D89Screen from "./screens/D89";
import D90Screen from "./screens/D90";
import D91Screen from "./screens/D91";
import D92Screen from "./screens/D92";
import D93Screen from "./screens/D93";
import D94Screen from "./screens/D94";
import D95Screen from "./screens/D95";
import D96Screen from "./screens/D96";

// ── Special job types (D97–D102) ────────────────────────
import D97Screen from "./screens/D97";
import D98Screen from "./screens/D98";
import D99Screen from "./screens/D99";
import D100Screen from "./screens/D100";
import D101Screen from "./screens/D101";
import D102Screen from "./screens/D102";

// ── New screens ─────────────────────────────────────────
import MoreMenu from "./screens/MoreMenu";
import HelpScreen from "./screens/Help";
import AboutScreen from "./screens/About";
import ProfileScreen from "./screens/Profile";
import AnalyticsDashboard from "./screens/AnalyticsDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ─── Entry Point ─── */}
        <Route index element={<LandingPage />} />
        <Route path="auth/login" element={<Login />} />

        {/* ═══════════════════════════════════════════════
            REGISTRATION FLOW
            ═══════════════════════════════════════════════ */}
        <Route path="app/home" element={<D01Screen />} />
        <Route path="app/register-services" element={<D02Screen />} />
        <Route path="auth/register" element={<D03Screen />} />
        <Route path="driver/register" element={<D04Screen />} />

        {/* ═══════════════════════════════════════════════
            ONBOARDING
            ═══════════════════════════════════════════════ */}
        <Route path="driver/onboarding/profile" element={<D05Screen />} />
        <Route path="driver/onboarding/profile/documents/upload" element={<D07Screen />} />
        <Route path="driver/onboarding/profile/documents/review" element={<D08Screen />} />
        <Route path="driver/onboarding/profile/documents/rejected" element={<D09Screen />} />
        <Route path="driver/onboarding/profile/documents/verified" element={<D10Screen />} />
        <Route path="driver/preferences/identity" element={<D11Screen />} />
        <Route path="driver/preferences/identity/face-capture" element={<D12Screen />} />
        <Route path="driver/preferences/identity/upload-image" element={<D13Screen />} />

        {/* Training */}
        <Route path="driver/training/intro" element={<D18Screen />} />
        <Route path="driver/training/info-session" element={<D19Screen />} />
        <Route path="driver/training/earnings-tutorial" element={<D20Screen />} />
        <Route path="driver/training/quiz" element={<D21Screen />} />
        <Route path="driver/training/quiz/answer" element={<D22Screen />} />
        <Route path="driver/training/quiz/passed" element={<D23Screen />} />
        <Route path="driver/training/completion" element={<D24Screen />} />

        {/* ═══════════════════════════════════════════════
            MAIN APP SCREENS (Now self-contained)
            ═══════════════════════════════════════════════ */}

        {/* ── Dashboards ── */}
        <Route path="driver/dashboard/online" element={<D31Screen />} />
        <Route path="driver/dashboard/offline" element={<D27Screen />} />
        <Route path="driver/dashboard/active" element={<D29Screen />} />
        <Route path="driver/dashboard/delivery" element={<D25Screen />} />
        <Route path="driver/dashboard/required-actions" element={<D30Screen />} />

        {/* Map views */}
        <Route path="driver/map/online" element={<D26Screen />} />
        <Route path="driver/map/online/variant" element={<D28Screen />} />
        <Route path="driver/map/searching" element={<D32Screen />} />
        <Route path="driver/map/settings" element={<D37Screen />} />

        {/* Search */}
        <Route path="driver/search" element={<D36Screen />} />

        {/* ── Earnings ── */}
        <Route path="driver/earnings/overview" element={<D33Screen />} />
        <Route path="driver/earnings/weekly" element={<D34Screen />} />
        <Route path="driver/earnings/monthly" element={<D35Screen />} />
        <Route path="driver/earnings/goals" element={<D38Screen />} />
        <Route path="driver/analytics" element={<AnalyticsDashboard />} />

        {/* Surge */}
        <Route path="driver/surge/map" element={<D73Screen />} />
        <Route path="driver/surge/notification" element={<D39Screen />} />

        {/* ── Jobs ── */}
        <Route path="driver/jobs/incoming" element={<D42Screen />} />
        <Route path="driver/jobs/incoming/rich" element={<D43Screen />} />
        <Route path="driver/jobs/list" element={<D44Screen />} />
        <Route path="driver/jobs/prompt" element={<D45Screen />} />
        <Route path="driver/jobs/active-with-additional" element={<D46Screen />} />

        {/* Trip lifecycle */}
        <Route path="driver/trip/:tripId/navigate-to-pickup" element={<D47Screen />} />
        <Route path="driver/trip/:tripId/navigation" element={<D48Screen />} />
        <Route path="driver/trip/:tripId/en-route-details" element={<D49Screen />} />
        <Route path="driver/trip/:tripId/arrived" element={<D50Screen />} />
        <Route path="driver/trip/:tripId/waiting" element={<D51Screen />} />
        <Route path="driver/trip/:tripId/cancel/no-show" element={<D52Screen />} />
        <Route path="driver/trip/:tripId/verify-rider" element={<D53Screen />} />
        <Route path="driver/trip/:tripId/start" element={<D54Screen />} />
        <Route path="driver/trip/:tripId/in-progress" element={<D55Screen />} />
        <Route path="driver/trip/:tripId/completed" element={<D56Screen />} />
        <Route path="driver/trip/:tripId/cancel/reason" element={<D57Screen />} />
        <Route path="driver/trip/:tripId/cancel/details" element={<D58Screen />} />
        <Route path="driver/trip/last-summary" element={<D41Screen />} />
        <Route path="driver/trip/:tripId/proof" element={<D67Screen />} />
        <Route path="driver/trip/:tripId/proof/active" element={<D68Screen />} />

        {/* Delivery orders */}
        <Route path="driver/delivery/orders-dashboard" element={<D74Screen />} />
        <Route path="driver/delivery/orders" element={<D75Screen />} />
        <Route path="driver/delivery/orders/filter" element={<D76Screen />} />
        <Route path="driver/delivery/orders/picked-up" element={<D77Screen />} />
        <Route path="driver/delivery/route/:routeId" element={<D78Screen />} />
        <Route path="driver/delivery/route/:routeId/map" element={<D79Screen />} />
        <Route path="driver/delivery/route/:routeId/active" element={<D80Screen />} />
        <Route path="driver/delivery/route/:routeId/stop/:stopId/contact" element={<D81Screen />} />
        <Route path="driver/delivery/route/:routeId/details" element={<D82Screen />} />
        <Route path="driver/delivery/route/:routeId/stop/:stopId/details" element={<D83Screen />} />
        <Route path="driver/delivery/destination/select" element={<D84Screen />} />
        <Route path="driver/delivery/pickup/confirm" element={<D85Screen />} />
        <Route path="driver/delivery/pickup/confirm-location" element={<D86Screen />} />
        <Route path="driver/delivery/pickup/qr" element={<D87Screen />} />
        <Route path="driver/delivery/pickup/confirmed" element={<D96Screen />} />

        {/* QR flows */}
        <Route path="driver/qr/scanner" element={<D88Screen />} />
        <Route path="driver/qr/scan-confirmation" element={<D89Screen />} />
        <Route path="driver/qr/instruction" element={<D90Screen />} />
        <Route path="driver/qr/active" element={<D91Screen />} />
        <Route path="driver/qr/scanned" element={<D92Screen />} />
        <Route path="driver/qr/processing" element={<D93Screen />} />
        <Route path="driver/qr/marketing-scan" element={<D94Screen />} />
        <Route path="driver/qr/marketing-processing" element={<D95Screen />} />

        {/* Special job types */}
        <Route path="driver/rental/job/:jobId" element={<D97Screen />} />
        <Route path="driver/tour/:tourId/today" element={<D98Screen />} />
        <Route path="driver/ambulance/incoming" element={<D99Screen />} />
        <Route path="driver/ambulance/job/:jobId/status" element={<D100Screen />} />

        {/* ── Safety ── */}
        <Route path="driver/safety/toolkit" element={<D59Screen />} />
        <Route path="driver/safety/emergency/map" element={<D60Screen />} />
        <Route path="driver/safety/sos/sending" element={<D61Screen />} />
        <Route path="driver/safety/emergency/details" element={<D62Screen />} />
        <Route path="driver/safety/emergency/call" element={<D63Screen />} />
        <Route path="driver/safety/emergency/confirmation" element={<D64Screen />} />
        <Route path="driver/safety/follow-my-ride" element={<D65Screen />} />
        <Route path="driver/safety/share-my-ride" element={<D66Screen />} />
        <Route path="driver/safety/hub" element={<D70Screen />} />
        <Route path="driver/safety/hub/expanded" element={<D71Screen />} />
        <Route path="driver/safety/driving-hours" element={<D72Screen />} />

        {/* ── More ── */}
        <Route path="driver/more" element={<MoreMenu />} />
        <Route path="driver/preferences" element={<D06Screen />} />
        <Route path="driver/vehicles" element={<D14Screen />} />
        <Route path="driver/vehicles/:vehicleId" element={<D15Screen />} />
        <Route path="driver/vehicles/business" element={<D16Screen />} />
        <Route path="driver/vehicles/accessories" element={<D17Screen />} />
        <Route path="driver/history/rides" element={<D69Screen />} />
        <Route path="driver/settings/job-types-legend" element={<D101Screen />} />
        <Route path="driver/help/shuttle-link" element={<D102Screen />} />
        <Route path="driver/help" element={<HelpScreen />} />
        <Route path="driver/about" element={<AboutScreen />} />
        <Route path="driver/profile" element={<ProfileScreen />} />

        {/* Notifications / popups */}
        <Route path="driver/ridesharing/notification" element={<D40Screen />} />

        {/* ─── Fallback ─── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
