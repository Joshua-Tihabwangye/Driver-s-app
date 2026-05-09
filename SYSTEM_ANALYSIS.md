# EVzone Driver App — Complete System Workflow Analysis

> Generated: 2026-05-08  
> Scope: Frontend, Backend, State Management, User Flows, Build/Deploy, QA, and Architectural Gaps

---

## 1. Executive Summary

The **EVzone Driver App** is a **mobile-first, single-page React application** designed to simulate a native driver experience for electric vehicle (EV) drivers. It currently operates as a **fully client-side, offline-capable prototype** with no live backend integration. The system supports **7 job categories** (Ride, Delivery, Rental, Tour, Ambulance, Shuttle, Shared) across **102 conceptual screens (D01–D102)**, orchestrated through config-driven routing, React Context state management, and localStorage persistence.

A partially implemented backend stub exists for **document expiry management**, but it is non-runnable and disconnected from the frontend.

### Key Metrics
| Metric | Value |
|--------|-------|
| Total Screens | 102 (D01–D102) |
| Implemented Screen Files | 131 `.tsx` files |
| State Container | 1 monolithic React Context (~4,000 lines) |
| Persistence Layer | Browser `localStorage` |
| Backend API Calls | **Zero** |
| Tech Stack | Vite 5 + React 18 + TypeScript (non-strict) + Tailwind CSS + MUI v5 |
| Deployment Target | Vercel (static SPA) |

---

## 2. System Architecture (Layer Model)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Screens   │  │ Components  │  │   Theme     │  │   Supervisor Shell  │ │
│  │  (131 .tsx) │  │   (13 .tsx) │  │(MUI+Tailwind│  │    (Preview Mode)   │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
│         └─────────────────┴─────────────────┘                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ROUTING LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  React Router DOM v6  →  Config-driven route table (src/config/routes.ts)││
│  │  Route Guards: GuestOnlyRoute | RequireAuth | RequireOnlineForJobs       ││
│  └─────────────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│                         STATE LAYER                                          │
│  ┌─────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│
│  │  StoreContext   │ │ AuthContext │ │ JobsContext │ │ SharedTripsContext  ││
│  │   (~4,000 LoC)  │ │ (isLoggedIn)│ │(filtered   │ │  (pooled rides)     ││
│  │                 │ │  + user obj │ │   views)    │ │                     ││
│  └────────┬────────┘ └──────┬──────┘ └──────┬──────┘ └─────────────────────┘│
│           └─────────────────┴─────────────────┘                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                         PERSISTENCE LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Browser localStorage  —  All state snapshots, mock data seeds,         ││
│  │  document uploads, onboarding progress, driver profile, preferences     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│                         MOCK DATA LAYER                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  src/data/mockData.ts  —  Earnings, trips, vehicles, jobs, profiles     ││
│  └─────────────────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────────────────┤
│                         BACKEND STUB (Non-Operational)                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │  Express routes (document CRUD) | Middleware | Cron jobs | Services     ││
│  │  STATUS: No server entry point, no DB implementation, no npm deps,      ││
│  │          zero integration with frontend                                 ││
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow & State Management

### 3.1 The Monolithic StoreContext

The `StoreContext` is the beating heart of the application. At ~4,000 lines, it manages:

| Domain | State Held |
|--------|-----------|
| **Collections** | `jobs`, `trips`, `revenueEvents`, `tripFeedbacks`, `vehicles`, `emergencyContacts` |
| **Driver Config** | `driverRoleConfig`, `driverProfile`, `driverPreferences`, `driverProfilePhoto`, `driverMapPreferences` |
| **Onboarding** | `onboardingCheckpoints` (6 boolean flags), `onboardingBlockers` |
| **Presence** | `driverPresenceStatus` (`"offline"` / `"online"`), `canGoOnline` |
| **Active Trip** | `activeTrip` (workflow stage machine), `activeRideRuntime` |
| **Delivery** | `deliveryWorkflow` (6-stage state machine) |
| **Metrics** | Derived dashboard stats from mock/stored data |

**Persistence Pattern:**
1. On app bootstrap (`main.tsx`), `StoreContext` initializes state by reading `localStorage` keys.
2. If `localStorage` is empty, it seeds from `MOCK_EARNINGS`, `MOCK_COMPLETED_TRIPS`, etc.
3. Every significant state change writes back to `localStorage`.
4. In `DEV` mode, jobs are reseeded from mock data on every refresh to aid workflow testing.

### 3.2 Context Hierarchy

```
main.tsx
└── ThemeProvider (dark/light mode, CSS class toggle)
    └── AuthProvider (isLoggedIn, user object, localStorage)
        └── StoreProvider (monolithic state engine)
            └── JobsProvider (derived filtered job lists)
                └── SharedTripsProvider (pooled ride logic)
                    └── App.tsx (router + guards + shell)
                        └── AppPhoneShell (responsive wrapper + BottomNav)
                            └── <CurrentScreen />
```

### 3.3 State Flow by User Action

**Example: Accepting a Ride Request**
```
User taps "Accept" on RideRequestIncoming.tsx
         │
         ▼
Screen calls navigate(buildAcceptedJobRoute(jobId, jobType), { state: { job } })
         │
         ▼
Target screen (e.g., NavigateToPickup.tsx) reads job from location.state
         │
         ▼
Screen calls store.acceptJob(job) → updates activeTrip, driverPresenceStatus
         │
         ▼
StoreContext writes updated state to localStorage
         │
         ▼
React re-renders affected screens; BottomNav may update
```

---

## 4. Routing Architecture

### 4.1 Config-Driven Routing

Every screen is declared in `src/config/routes.ts` as a `ScreenConfig`:

```ts
{
  id: "OfflineDashboard",
  label: "Offline Dashboard",
  path: "/driver/dashboard/offline",
  Component: OfflineDashboard
}
```

`App.tsx` maps this array into `<Route>` elements dynamically. Adding a screen is a one-line config change plus one file in `src/screens/`.

### 4.2 Route Guards (Access Control Layer)

```
Incoming URL
     │
     ├─► GuestOnlyRoute ──► Blocks logged-in users from /auth/*
     │
     ├─► RequireAuth ─────► Redirects guests to /app/register-services
     │                       (preserves intended URL in location.state)
     │
     └─► RequireOnlineForJobs ──► Blocks offline drivers from /driver/jobs/*,
                                   /driver/trip/*, /driver/delivery/*
                                   Redirects to /driver/dashboard/offline
                                   with guard message
```

### 4.3 Public vs. Protected Onboarding

A critical design decision: **onboarding screens are public** (not behind `RequireAuth`). This prevents infinite redirect loops when a new driver hasn't created an account yet but needs to upload documents. The trade-off is a potential security concern noted in `audit_report.md`.

**Public Screen Sets:**
- `PUBLIC_SCREEN_IDS`: `RegisterServices`, `Registration`, `DriverRegistration`
- `SENSITIVE_ONBOARDING_IDS`: 19 screens covering documents, identity, vehicles, training

---

## 5. User Journey Flows (Conceptual Workflows)

### 5.1 Onboarding Scaffold (First-Time Driver)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ D01/D02     │───►│ D03/D04     │───►│ D05         │───►│ D06–D10     │
│ Super-app   │    │ Registration│    │ Driver      │    │ Documents   │
│ Entry       │    │ (if needed) │    │ Profile     │    │ Upload      │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                 │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│ D18–D24     │◄───│ D14–D17     │◄───│ D11–D13     │◄──────────┘
│ Training &  │    │ Vehicles &  │    │ Identity &  │
│ Quiz        │    │ Accessories │    │ Face Capture │
└──────┬──────┘    └─────────────┘    └─────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Onboarding Checkpoints Complete?       │
│  (role ✓ | docs ✓ | identity ✓ |        │
│   vehicle ✓ | emergency ✓ | training ✓) │
└─────────────────┬───────────────────────┘
                  │ YES
                  ▼
        ┌─────────────────┐
        │ Unlock Dashboard│
        │ (D25+ / D27+)   │
        └─────────────────┘
```

### 5.2 Daily Driver Life (The Core Loop)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Offline         │     │ Go Online       │     │ Online          │
│ Dashboard       │────►│ (resolve        │────►│ Dashboard       │
│ (D25)           │     │  blockers)      │     │ (D27/D29)       │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                              ┌──────────────────────────┼──────────┐
                              │                          │          │
                              ▼                          ▼          ▼
                       ┌─────────────┐           ┌─────────────┐  ┌─────────────┐
                       │ Job List    │           │ Earnings    │  │ Map/Search  │
                       │ (D42–D46)   │           │ (D33–D38)   │  │ (D36/D37)   │
                       └──────┬──────┘           └─────────────┘  └─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │ Incoming    │
                       │ Request     │
                       │ (D42/D43)   │
                       └──────┬──────┘
                              │ ACCEPT
                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Navigate to │───►│ Arrived /   │───►│ Rider       │───►│ Start Drive │
│ Pickup      │    │ Waiting     │    │ Verification│    │ (D52)       │
│ (D47)       │    │ (D49/D50)   │    │ (D51)       │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────┐
                                                        │ Ride In     │
                                                        │ Progress    │
                                                        │ (D55)       │
                                                        └──────┬──────┘
                                                               │
                                                               ▼
                              ┌────────────────────────────────────────────────┐
                              │  Specialized Branches (jobType-dependent)      │
                              │  • Rental → elapsed timer + return checks      │
                              │  • Tour → segment navigation + daily schedule  │
                              │  • Ambulance → hospital status updates         │
                              │  • Shared → pooled passenger management        │
                              │  • Delivery → QR scan + pickup/dropoff stages  │
                              └────────────────────────────────────────────────┘
                                                               │
                                                               ▼
                                                        ┌─────────────┐
                                                        │ Trip        │
                                                        │ Completion  │
                                                        │ (D56)       │
                                                        └──────┬──────┘
                                                               │
                                                               ▼
                              ┌────────────────────────────────────────────────┐
                              │  Post-Trip Outcomes                            │
                              │  • Revenue event recorded                      │
                              │  • Trip added to history                       │
                              │  • Return to Online Dashboard                  │
                              │  • Optional: Safety toolkit, SOS, Follow Ride  │
                              └────────────────────────────────────────────────┘
```

### 5.3 Shared Ride Workflow (Pooled Rides)

The `SharedTripsContext` manages a complex state machine for multi-passenger rides:

```
Shared trip accepted
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ ActiveShared│───►│ Stop 1:     │───►│ Stop 2:     │───► ...
│ Trip        │    │ Pickup A    │    │ Dropoff B   │
│             │    │ (onboard /  │    │ (dropoff)   │
│             │    │ no-show)    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ simulateNewMatch() ──► dynamically inserts new pickup into stop chain
       │
       ▼
┌─────────────┐
│ Finalize:   │
│ mark all    │
│ passengers, │
│ complete trip│
└─────────────┘
```

### 5.4 Safety & Emergency Flows

```
Any Trip Screen ──► SafetyToolkit (D59)
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    EmergencyAssistance  FollowMyRide    SOS
    Map (D60)            (D65/D66)       (D61–D64)
          │
          ▼
    SOSSending ──► EmergencyCall ──► EmergencyConfirmation
    (D62)           (D63)             (D64)
```

---

## 6. Job Type Model & Adaptive Screens

The app uses a **single set of screens that adapt behavior** based on `jobType`:

| jobType | Key Adaptations |
|---------|----------------|
| `ride` | Standard pickup → drive → dropoff |
| `delivery` | QR verification at pickup + dropoff, package photos |
| `rental` | Elapsed time tracker, return location, long-duration pricing |
| `tour` | Multi-segment schedule, daily itinerary, guide mode |
| `ambulance` | Hospital destination, patient status, priority routing |
| `shuttle` | Links to external Shuttle Driver App |
| `shared` | Pooled passenger management via `SharedTripsContext` |

**Route Builders** (`src/data/constants.ts`) generate canonical URLs:
- `buildPrivateTripRoute(stage, tripId)`
- `buildAcceptedJobRoute(jobId, jobType)`
- `buildJobDetailRoute(jobId, jobType)`
- `buildJobHistoryRoute(jobId, jobType)`

---

## 7. Offline/Online Presence Model

```
                    ┌─────────────────────┐
                    │  driverPresenceStatus│
                    │  "offline" | "online" │
                    └─────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                           ▼
   ┌─────────────┐                           ┌─────────────┐
   │ OFFLINE     │                           │ ONLINE      │
   │             │                           │             │
   │ • Can view  │                           │ • Can accept│
   │   dashboards│                           │   jobs      │
   │ • Can view  │                           │ • Can see   │
   │   earnings  │                           │   surge     │
   │ • CANNOT    │                           │ • Full nav  │
   │   access    │                           │   access    │
   │   jobs/trip │                           │             │
   └─────────────┘                           └─────────────┘
          │                                           │
          │ Tap "Go Online"                           │ Tap "Go Offline"
          │ (resolve blockers first)                  │
          └──────────────────►◄───────────────────────┘
```

**Blockers to Going Online:**
1. Incomplete onboarding checkpoints
2. Missing/expired documents
3. No vehicle registered
4. Optional: Selfie verification (`VITE_REQUIRE_GO_ONLINE_SELFIE`)

---

## 8. Build, Deploy & QA Pipeline

### 8.1 Build Pipeline

```
Developer runs `npm run build`
         │
         ▼
┌─────────────────┐
│ Vite compiles   │
│ TypeScript +    │
│ Tailwind + React│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Output: dist/   │
│ • index.html    │
│ • assets/       │
│   (hashed JS)   │
│   (hashed CSS)  │
│ • favicon.*     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Vercel deploys  │
│ (static SPA)    │
│ Rewrites all    │
│ routes to       │
│ index.html      │
└─────────────────┘
```

### 8.2 QA Gate Scripts

All QA is **static code analysis** (string matching), not runtime testing:

| Script | Purpose | Checks |
|--------|---------|--------|
| `check:route-hygiene` | Routing consistency | Dead route IDs removed, legacy paths removed, core workflow routes registered |
| `check:ride-regressions` | Ride flow integrity | Accept handlers, stage maps, cancel branches, shared chain advancement, revenue persistence, strict matching |
| `check:shared-workflow` | Shared-ride integrity | Eligibility gates, toggle clamping, event-driven match insertion, completion persistence |
| `check:qa-smoke` | Meta-runner | Runs all three above in sequence |

**Release Checklist** (`docs/release-checklist.md`):
1. `npm run typecheck`
2. `npm run check:route-hygiene`
3. `npm run check:ride-regression`
4. `npm run check:shared-workflow`
5. CI lint verification
6. Manual test matrix (12 categories)

---

## 9. Backend Stub Analysis

The `backend/` directory is a **design-phase stub** for document expiry management only.

### What Exists
- Express route factories (`documentRoutes.ts`, `orderRoutes.ts`)
- Document validation middleware (`requireValidDocuments.ts`)
- Business logic services (`documentExpiryService.ts`)
- Type definitions (`document.ts`)
- PostgreSQL migration (`20260420_add_document_expiry.sql`)
- Cron job stub (`documentExpiryCron.ts`)

### What's Missing
- ❌ `package.json` with backend dependencies (`express`, `node-cron`, `pg`)
- ❌ Server entry point (`server.ts`, `app.ts`)
- ❌ Concrete repository implementation
- ❌ Database connection / ORM
- ❌ Environment configuration
- ❌ Authentication implementation
- ❌ Any integration with the frontend

**The frontend handles document management entirely client-side** via `src/utils/documentVerificationState.ts` using `localStorage`.

---

## 10. Audit Findings & Architectural Gaps

From `audit_report.md` (March 27, 2026):

| Finding | Severity | Description |
|---------|----------|-------------|
| `ActiveDashboard` orphaned | Medium | Not linked in any menu or navigation flow |
| `DocumentReview` / `DocumentRejected` unreachable | Medium | Only reachable via backend polling, no local nav path |
| No path to `RequiredActionsDashboard` while online | Medium | Driver must go offline first to see required actions |
| Onboarding routes public | Low-Medium | Potential security concern; prevents auth loops but opens surface |
| No real backend API | High | Entire app is a sophisticated prototype with mock data |

### Additional Gaps Identified

1. **TypeScript Non-Strict**: `strict: false`, `noImplicitAny: false` — reduces type safety.
2. **Monolithic State**: `StoreContext` at ~4,000 lines is a maintenance risk.
3. **No HTTP Client**: No `axios`, `fetch` wrapper, or API abstraction exists.
4. **No CI/CD**: No GitHub Actions, GitLab CI, or automated deployment pipeline.
5. **Legacy Coexistence**: `final_driver-main/` and `build/` directories contain outdated CRA artifacts.
6. **No Error Boundaries**: No React error boundaries for crash isolation.
7. **No Service Worker**: Despite being "offline-capable," there's no PWA/service worker for true offline functionality.

---

## 11. Technology Dependency Map

```
React 18
├── react-router-dom v6      (routing)
├── @mui/material v5          (theming, occasional components)
├── @emotion/react/styled     (MUI styling engine)
├── tailwindcss v3            (primary styling)
├── lucide-react              (icons)
├── jsqr                      (QR scanning)
├── vite v5                   (build tool)
│   └── @vitejs/plugin-react
├── typescript                (language, non-strict)
├── postcss + autoprefixer    (CSS pipeline)
└── (dev tooling: eslint, etc.)

Backend Stub (non-operational)
├── express                   (missing from package.json)
├── node-cron                 (missing from package.json)
└── pg / postgres             (implied, missing)
```

---

## 12. Conceptual System Diagram (Full)

```
                              ┌─────────────────────────────┐
                              │     SUPERVISOR / QA         │
                              │     (Preview Mode Shell)    │
                              │     D01–D102 Dropdown       │
                              └─────────────────────────────┘
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EVZONE DRIVER APP                                   │
│                                                                                  │
│   ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐   │
│   │   AUTH FLOWS    │     │  ONBOARDING     │     │    DAILY OPERATIONS     │   │
│   │                 │     │                 │     │                         │   │
│   │ /auth/login     │     │ /driver/onboard │     │ /driver/dashboard/*     │   │
│   │ /auth/forgot-pw │     │ /driver/training│     │ /driver/jobs/*          │   │
│   │ /auth/verify-otp│     │ /driver/vehicles│     │ /driver/trip/*          │   │
│   │                 │     │                 │     │ /driver/earnings/*      │   │
│   │ GuestOnlyRoute  │     │ Public access   │     │ /driver/safety/*        │   │
│   │ RequireAuth     │     │ (6 checkpoints) │     │ /driver/history/*       │   │
│   └─────────────────┘     └─────────────────┘     │ RequireOnlineForJobs    │   │
│                                                   └─────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         STATE ENGINE (StoreContext)                      │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────────┐  │   │
│   │  │ Jobs    │ │ Trips   │ │ Revenue │ │ Profile │ │ Onboarding      │  │   │
│   │  │ (mock)  │ │ (mock)  │ │ (mock)  │ │ (local) │ │ Checkpoints     │  │   │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────────┘  │   │
│   │                              ▲                                          │   │
│   │                              │ localStorage read/write                  │   │
│   └──────────────────────────────┼──────────────────────────────────────────┘   │
│                                  │                                               │
│   ┌──────────────────────────────┼──────────────────────────────────────────┐   │
│   │                         PERSISTENCE LAYER                                │   │
│   │                    Browser localStorage + Mock Data Seeds                │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                      BACKEND STUB (Document Expiry Only)                 │   │
│   │   Express routes | Middleware | Cron | Services | Types | Migration      │   │
│   │   STATUS: Non-runnable, zero frontend integration                        │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────────┐
                              │      VERCEL (Static SPA)    │
                              │   SPA rewrite rules + CDN   │
                              └─────────────────────────────┘
```

---

## 13. Key Design Decisions

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Config-driven routing** | One-line screen additions | Less compile-time safety |
| **Monolithic StoreContext** | Simple mental model, easy persistence | ~4,000-line file, tight coupling |
| **localStorage persistence** | Works offline, survives refresh | Limited to ~5MB, no sync across devices |
| **Mock data as fallback** | Enables full UI testing without backend | Not production-realistic |
| **Onboarding as public routes** | Prevents auth loops for new drivers | Security surface area |
| **Non-strict TypeScript** | Faster iteration, fewer build errors | Reduced type safety |
| **Tailwind + MUI dual theming** | Tailwind for layout/speed, MUI for complex components | Two theming systems to maintain |
| **Static QA scripts** | Fast, no test runner needed | Only checks code patterns, not runtime behavior |

---

## 14. Recommendations for Production Readiness

1. **Extract Backend**: Move `backend/` to a separate Node.js project with proper dependencies, DB implementation, and authentication.
2. **Add API Layer**: Create an API client in the frontend to replace mock data with real HTTP calls.
3. **Split StoreContext**: Decompose into domain-specific contexts or adopt Zustand/Redux Toolkit.
4. **Enable Strict TypeScript**: Flip `strict: true` and fix type errors.
5. **Add CI/CD**: GitHub Actions for build, typecheck, lint, and QA script enforcement.
6. **Implement Service Worker**: Add a PWA service worker for true offline capability.
7. **Add Error Boundaries**: Wrap route shells in React error boundaries.
8. **Remove Legacy Artifacts**: Delete `final_driver-main/` and `build/` (or archive them).
9. **Address Audit Findings**: Link `ActiveDashboard`, make `DocumentReview` reachable, add "Required Actions" to `MoreMenu`.
10. **Add Integration Tests**: Move beyond static string-matching QA to Playwright/Cypress E2E tests.

---

*End of System Analysis*
