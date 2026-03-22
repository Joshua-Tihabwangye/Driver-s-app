# EVzone Driver App – Routing Guide (D01–D102)

This document describes how all **102 driver screens (D01–D102)** fit together:

- Suggested **route paths** (for React Router or similar).
- **Purpose** of each screen.
- Typical **entry points** (where the user comes from).
- The most common **next screens** (where the user goes next).
- How **job types** (Ride / Delivery / Rental / Tour / Ambulance / Shuttle) are threaded through.

> Paths here are recommended, not mandatory. You can rename them as long as the
> relationships between screens stay consistent.

---

## 1. Routing conventions

### 1.1 Top‑level route groups

- `/app/*` – EVzone super‑app shell (Rider + services).
- `/auth/*` – Shared authentication.
- `/driver/*` – Everything related to the Driver App.

Within `/driver`, we further group by domain:

- `/driver/onboarding/*` – Profile, documents, identity, vehicle setup.
- `/driver/vehicles/*` – Personal EVs, business vehicles, accessories.
- `/driver/preferences/*` – Preferences, identity, training, safety links.
- `/driver/training/*` – Training content and quizzes.
- `/driver/dashboard/*` – Online/offline dashboards, alerts.
- `/driver/map/*` – Map dashboards, navigation, surge, map settings.
- `/driver/earnings/*` – Earnings overview, weekly/monthly, goals.
- `/driver/jobs/*` – Job browsing, incoming requests, ride‑sharing extras.
- `/driver/trip/*` – Ride lifecycle (pickup → in‑trip → completion → proof).
- `/driver/delivery/*` – Delivery orders, routes, destinations.
- `/driver/qr/*` – QR scanning flows.
- `/driver/safety/*` – Safety toolkit, SOS, follow/share ride, hub, driving hours.
- `/driver/history/*` – Ride history.
- `/driver/rental/*` – Long‑duration rental jobs.
- `/driver/tour/*` – Multi‑day tour jobs.
- `/driver/ambulance/*` – Ambulance–style emergency jobs.
- `/driver/settings/*` & `/driver/help/*` – Job type legend, shuttle link info.

### 1.2 Job type model

Many screens are **shared** between services and switch behaviour based on a `jobType`:

- `jobType = "ride" | "delivery" | "rental" | "tour" | "ambulance" | "shuttle"`

Key shared screens that use `jobType`:

- D42 / D43 – Incoming job requests.
- D44 – Job list with filters.
- D47–D56 – Navigation + trip flow (text and labels change per job type).
- D55 / D56 – In‑trip & completion summaries.
- D69 – History with job type chips.

Dedicated screens for new job types:

- D97 – Rental job overview / on rental.
- D98 – Tour today’s schedule.
- D99 – Ambulance job incoming.
- D100 – Ambulance job status screen.
- D101 – Job type & icons legend.
- D102 – Shuttle link info screen (links to separate Shuttle Driver App).

---

## 2. High‑level flows

### 2.1 Super‑app → Driver onboarding

1. **D01** – Super‑app Home → “Register services”.
2. **D02** – Choose “EVzone Driver”.
3. If no account:
   - **D03** – Global registration.
4. Then:
   - **D04** – EVzone Driver registration step.
5. Land in:
   - **D05** – Driver Personal → start full onboarding.

### 2.2 Onboarding scaffold (before first trip)

1. **Profile & documents** → D05–D10.
2. **Identity & face** → D11–D13.
3. **Vehicles & accessories** → D14–D17.
4. **Training & quiz** → D18–D24.
5. Once all required steps are “OK”:
   - Unlock **dashboards**: D25+/D27+/D29+/D31.

### 2.3 Daily life

- **Dashboards:** D25–D31
- **Earnings:** D33–D35, D38
- **Map & search:** D26, D28, D31, D36, D37, D39, D73
- **Jobs:** D42–D46, plus D74–D77 (delivery jobs)
- **Ride lifecycle:** D47–D56, D57–D58
- **Safety & emergency:** D59–D66, D70–D72
- **Proof & history:** D67–D69
- **Delivery & QR:** D74–D96
- **New job types:** D97–D102

---

## 3. Screen‑by‑screen routing map (D01–D102)

Below: each screen with **route, purpose, from, and to**.

---

### 3.1 Super‑app & registration (D01–D04)

**D01 – Home (Super App)**  
- **Route:** `/app/home`  
- **Purpose:** EVzone super‑app landing (Rider + “Register services” module).  
- **From:** App launch.  
- **To:** Tap “Register services” → **D02**.

**D02 – Register Services**  
- **Route:** `/app/register-services`  
- **Purpose:** Choose roles (School, Seller, EVzone Driver, etc.).  
- **From:** **D01** or account menu.  
- **To:**  
  - Select “EVzone Driver”:
    - If not logged in → **D03**.
    - If logged in → **D04**.

**D03 – Registration**  
- **Route:** `/auth/register`  
- **Purpose:** Shared account signup (name, email/phone, password).  
- **From:** **D02** when user is new.  
- **To:** Success → **D04**.

**D04 – Registration – EVzone Driver**  
- **Route:** `/driver/register`  
- **Purpose:** Turn a user into a Driver (choose ride / delivery / both; accept terms).  
- **From:** **D02** (existing users) or **D03** (new signups).  
- **To:** **D05** (Driver Personal) to begin driver onboarding.

---

### 3.2 Profile, documents & identity (D05–D17)

**D05 – Driver Personal**  
- **Route:** `/driver/onboarding/profile`  
- **Purpose:** Central profile, doc status, ID/licence, vehicle link.  
- **From:** **D04**, or any time from menu.  
- **To:**  
  - Missing docs → **D07**.  
  - Identity incomplete → **D11**.  
  - Vehicles missing → **D14**.  
  - Preferences & training → **D06**.

**D06 – Preferences**  
- **Route:** `/driver/preferences`  
- **Purpose:** Hub for identity, training, safety, comms, language.  
- **From:** **D05**, settings bottom nav.  
- **To:**  
  - Identity → **D11–D13**.  
  - Training → **D18–D24**.  
  - Safety hub → **D70–D71**.

**D07 – Document Verification**  
- **Route:** `/driver/onboarding/profile/documents/upload`  
- **Purpose:** Upload ID, license, police clearance, etc.  
- **From:** **D05**.  
- **To:** **D08** (Under review).

**D08 – Document Under Review**  
- **Route:** `/driver/onboarding/profile/documents/review`  
- **Purpose:** Show doc review in progress.  
- **From:** **D07**.  
- **To:**  
  - Approved → **D10**.  
  - Rejected → **D09**.

**D09 – Document Rejected**  
- **Route:** `/driver/onboarding/profile/documents/rejected`  
- **Purpose:** Show rejection reason; CTA to re‑upload.  
- **From:** **D08** (failed review).  
- **To:** **D07** (re‑upload) or support contact.

**D10 – All Documents Verified**  
- **Route:** `/driver/onboarding/profile/documents/verified`  
- **Purpose:** Confirm docs OK; part of activation check.  
- **From:** **D08** (pass).  
- **To:**  
  - Identity → **D11**.  
  - Training → **D18**.  
  - Dashboards → **D27** when all other requirements met.

**D11 – Identity Verification**  
- **Route:** `/driver/preferences/identity`  
- **Purpose:** KYC identity step (ID number, DOB, etc.).  
- **From:** **D06**, **D05** (tap identity).  
- **To:** **D12** (face capture) or **D13** (image upload).

**D12 – Face Capture – Preferences**  
- **Route:** `/driver/preferences/identity/face-capture`  
- **Purpose:** Multi‑step liveness (front, left, right).  
- **From:** **D11**.  
- **To:** Success → **D13** or back to **D05** with verified status.

**D13 – Upload Your Image – Preferences**  
- **Route:** `/driver/preferences/identity/upload-image`  
- **Purpose:** Upload selfie/headshot as fallback/confirm.  
- **From:** **D11** or **D12**.  
- **To:** Back to **D05** (identity section marked “verified”).

**D14 – My Vehicles**  
- **Route:** `/driver/vehicles`  
- **Purpose:** EV list for driver (personal EV‑only).  
- **From:** **D05**, nav.  
- **To:**  
  - Add/Edit → **D15**.  
  - Business vehicles → **D16**.  
  - Accessories → **D17**.

**D15 – Vehicles**  
- **Route:** `/driver/vehicles/edit` or `/driver/vehicles/:vehicleId`  
- **Purpose:** Configure EV details (plate, model, docs).  
- **From:** **D14**.  
- **To:** Back to **D14**; once at least one EV is valid → dashboards (**D27**).

**D16 – Business Vehicles**  
- **Route:** `/driver/vehicles/business`  
- **Purpose:** Show fleet/company vehicles attached to the driver.  
- **From:** **D14**.  
- **To:** Vehicle details (**D15**), accessories (**D17**).

**D17 – Vehicle Accessories**  
- **Route:** `/driver/vehicles/accessories`  
- **Purpose:** Manage child seats, delivery boxes, mounts, etc.  
- **From:** **D14** or **D16**.  
- **To:** Back to vehicles (**D14**) or dashboards.

---

### 3.3 Training & quizzes (D18–D24)

**D18 – Intro to Driving with EVzone Ride**  
- **Route:** `/driver/training/intro`  
- **Purpose:** EVzone mission, EV‑first vision.  
- **From:** **D06** or required onboarding step.  
- **To:** **D19**.

**D19 – Info Session for Driver‑Partners**  
- **Route:** `/driver/training/info-session`  
- **Purpose:** Expectations, behaviour, policies.  
- **From:** **D18**.  
- **To:** **D20**.

**D20 – Driver Info Tutorial (Boost Your Earnings)**  
- **Route:** `/driver/training/earnings-tutorial`  
- **Purpose:** Surge, hours, eco‑driving, incentives.  
- **From:** **D19**.  
- **To:** **D21** (quiz).

**D21 – Driver Info Session Quiz**  
- **Route:** `/driver/training/quiz`  
- **Purpose:** Required quiz before going fully online.  
- **From:** **D20**.  
- **To:** Per question feedback (**D22**) and completion (**D23**).

**D22 – Quiz Answer Selected**  
- **Route:** `/driver/training/quiz/answer`  
- **Purpose:** Explain why answer is right/wrong.  
- **From:** **D21**.  
- **To:** Next question (**D21**) or quiz result (**D23**).

**D23 – Quiz Passed Confirmation**  
- **Route:** `/driver/training/quiz/passed`  
- **Purpose:** Show success; unlock Online.  
- **From:** **D21/22** once score is sufficient.  
- **To:** **D24** or dashboards (**D27**).

**D24 – Content Completion Screen**  
- **Route:** `/driver/training/completion`  
- **Purpose:** End of training session.  
- **From:** **D23**.  
- **To:** Dashboards (**D27**, **D25**, **D29**).

---

### 3.4 Dashboards, earnings & search (D25–D41)

**D25 – Delivery Driver Dashboard**  
- **Route:** `/driver/dashboard/delivery`  
- **Purpose:** Delivery‑centric dashboard (deliveries, earnings).  
- **From:** **D27** when in delivery mode or mode switch.  
- **To:** Orders list (**D75**), Go Online (**D26/D31**).

**D26 – Online Map View**  
- **Route:** `/driver/map/online`  
- **Purpose:** Online map‑first view.  
- **From:** Go Online from **D27/D29/D31**.  
- **To:** Searching (**D32**), incoming job (**D42/D43**), safety (**D59**).

**D27 – Dashboard (Offline)**  
- **Route:** `/driver/dashboard/offline`  
- **Purpose:** Base offline home; highlight blockers.  
- **From:** App open after onboarding, or toggling offline.  
- **To:** Go Online (**D26/D31**) or fix blockers (**D05/D11/D18/D14** via **D30**).

**D28 – Map View (Online variant)**  
- **Route:** `/driver/map/online/variant`  
- **Purpose:** Alternative layout of D26.  
- **From:** Online state; tab switch / A/B.  
- **To:** Same as D26.

**D29 – Active Dashboard (Online Mode)**  
- **Route:** `/driver/dashboard/active`  
- **Purpose:** Stats‑heavy active view (time, rides, earnings).  
- **From:** **D27** after Go Online or from D26 via tab.  
- **To:** History (**D69**), earnings (**D33–D35**), surge map (**D73**).

**D30 – Required Actions (Alert Dashboard)**  
- **Route:** `/driver/dashboard/required-actions`  
- **Purpose:** Show why driver can’t go online.  
- **From:** **D27** when “Go Online” is pressed with blockers.  
- **To:**  
  - Docs → **D07**  
  - Identity → **D11**  
  - Training → **D18**  
  - Vehicles → **D14**

**D31 – Online Dashboard (Active Mode)**  
- **Route:** `/driver/dashboard/online`  
- **Purpose:** Combined map + KPIs + quick actions.  
- **From:** **D27** after Go Online.  
- **To:** Searching (**D32**), jobs (**D42/D44**), earnings (**D33**), safety (**D59**), surge (**D73**).

**D32 – Searching for Ride**  
- **Route:** `/driver/map/searching`  
- **Purpose:** Shows driver is online but waiting for job.  
- **From:** **D26/D31** after toggling online.  
- **To:** Incoming requests (**D42/D43**) or fallback to map (**D26**).

**D33 – Earnings Overview**  
- **Route:** `/driver/earnings/overview`  
- **Purpose:** Today’s earnings summary.  
- **From:** Dashboards (**D25/D29/D31**).  
- **To:** Weekly (**D34**), monthly (**D35**), goals (**D38**).

**D34 – Weekly Earnings Summary**  
- **Route:** `/driver/earnings/weekly`  
- **Purpose:** Weekly breakdown; helpful for planning.  
- **From:** **D33**.  
- **To:** Monthly (**D35**), history (**D69**).

**D35 – Monthly Earnings Summary**  
- **Route:** `/driver/earnings/monthly`  
- **Purpose:** Monthly trends & totals.  
- **From:** **D33** or **D34**.  
- **To:** History (**D69**).

**D36 – Search Screen**  
- **Route:** `/driver/search`  
- **Purpose:** Search addresses, past jobs, orders.  
- **From:** Search icon from dashboards.  
- **To:** Map (**D26/D31**) or history (**D69**).

**D37 – Map Settings & Report Issues**  
- **Route:** `/driver/map/settings`  
- **Purpose:** Adjust map theme, layers; report map issues.  
- **From:** Map screens (**D26/D28/D31**).  
- **To:** Back to those maps.

**D38 – Set Weekly Earning Goal**  
- **Route:** `/driver/earnings/goals`  
- **Purpose:** Let driver set weekly income targets.  
- **From:** **D33/D34**.  
- **To:** Back to earnings or dashboard.

**D39 – Surge Notification Popup**  
- **Route:** `/driver/surge/notification`  
- **Purpose:** Alert about nearby surge zone.  
- **From:** System event while on **D26/D28/D31**.  
- **To:** Open surge map (**D73**) or dismiss (stay on map).

**D40 – Ride Sharing Notification Popup**  
- **Route:** `/driver/ridesharing/notification`  
- **Purpose:** Introduce ride‑sharing / pooling.  
- **From:** When feature unlocks, on **D29/D31**.  
- **To:** Accept → ride‑sharing flows (**D46**); dismiss → stay on dashboard.

**D41 – Last Trip Summary Popup**  
- **Route:** `/driver/trip/last-summary`  
- **Purpose:** Post‑trip mini summary and rating prompt.  
- **From:** **D56** after completing a trip.  
- **To:** History (**D69**) or dashboards.

---

### 3.5 Job requests & selection (D42–D46)

**D42 – Ride Request Incoming**  
- **Route:** `/driver/jobs/incoming`  
- **Purpose:** Standard incoming job card with job type pill.  
- **From:** **D32/D26/D31** when a job arrives.  
- **To:**  
  - Accept → **D47** (navigation to pickup) or job‑specific screen (e.g. **D97/D98/D99**).  
  - Decline → back to **D32**.

**D43 – Incoming Ride Request (Rich)**  
- **Route:** `/driver/jobs/incoming/rich`  
- **Purpose:** Richer incoming view with more context.  
- **From:** Same as **D42** (A/B or config).  
- **To:** Same as **D42**.

**D44 – Ride Requests List**  
- **Route:** `/driver/jobs/list`  
- **Purpose:** Browse nearby jobs with filters (All / Ride / Delivery / Rental / Shuttle / Tour / Ambulance).  
- **From:** **D45**, or from dashboards via “View jobs”.  
- **To:**  
  - Ride/Delivery/Rental/Tour/Ambulance → **D47** or **D97/D98/D99**.  
  - Shuttle → deep‑link to Shuttle Driver App, optionally via **D102**.

**D45 – Ride Requests Prompt**  
- **Route:** `/driver/jobs/prompt`  
- **Purpose:** Nudge drivers to browse jobs: “Browse nearby jobs (Ride, Delivery, Rental, Tour, Ambulance…)”.  
- **From:** Dashboards when search is idle or driver is new.  
- **To:** **D44**.

**D46 – Active Ride with Additional Requests**  
- **Route:** `/driver/jobs/active-with-additional`  
- **Purpose:** Show other job offers while driver is mid‑trip (ride‑sharing).  
- **From:** **D55** when new jobs arrive mid‑ride.  
- **To:**  
  - Accept → update route, stay in **D55**.  
  - Decline → back to **D55**.

---

### 3.6 Navigation, arrival & waiting (D47–D52)

**D47 – Navigate to Pick‑Up Location**  
- **Route:** `/driver/trip/:tripId/navigate-to-pickup`  
- **Purpose:** Start navigation to pickup, show job type label.  
- **From:** Accept job (**D42/43/44**, **D99**, **D97/D98** segment).  
- **To:** **D48** or directly **D50** when near pickup.

**D48 – Navigation in Progress**  
- **Route:** `/driver/trip/:tripId/navigation`  
- **Purpose:** Turn‑by‑turn navigation while en route.  
- **From:** **D47**.  
- **To:** **D50** (arrived).

**D49 – En Route to Pickup (Expanded)**  
- **Route:** `/driver/trip/:tripId/en-route-details`  
- **Purpose:** Expandable details: passenger, fare, job type, rental/tour/ambulance details.  
- **From:** **D47/D48** via details toggle.  
- **To:** Back to **D48**, then **D50**.

**D50 – Arrived at Pickup Point**  
- **Route:** `/driver/trip/:tripId/arrived`  
- **Purpose:** Mark arrival at pickup; notify party.  
- **From:** **D47/D48** on arrival event.  
- **To:** **D51** (waiting), or call/chat controls.

**D51 – Waiting for Passenger**  
- **Route:** `/driver/trip/:tripId/waiting`  
- **Purpose:** Show wait timer, passenger ETA. For Ambulance, “On scene time”.  
- **From:** **D50**.  
- **To:**  
  - Passenger on board → **D53**.  
  - Expired wait / no‑show → **D52**.

**D52 – Cancel Ride (Passenger No‑Show)**  
- **Route:** `/driver/trip/:tripId/cancel/no-show`  
- **Purpose:** Confirm no‑show cancellation.  
- **From:** **D51** once threshold passed.  
- **To:** **D57** (reason) → dashboard.

---

### 3.7 Verification, start, in‑trip & completion (D53–D56)

**D53 – Rider Verification Code Entry**  
- **Route:** `/driver/trip/:tripId/verify-rider`  
- **Purpose:** Enter rider’s code to verify correct passenger.  
- **From:** **D51** after passenger boards.  
- **To:** **D54** when verification passes.

**D54 – Start Drive**  
- **Route:** `/driver/trip/:tripId/start`  
- **Purpose:** Confirm starting the trip/segment; label changes per job type.  
- **From:** **D53**.  
- **To:** **D55**.

**D55 – Ride in Progress**  
- **Route:** `/driver/trip/:tripId/in-progress`  
- **Purpose:** Main in‑trip state (map + key info).  
- **From:** **D54**.  
- **To:**  
  - End trip → **D56**.  
  - Additional requests → **D46**.  
  - Proof of trip → **D68**.  
  - Safety toolkit → **D59**.

**D56 – Arrived / Trip Completion Screen**  
- **Route:** `/driver/trip/:tripId/completed`  
- **Purpose:** Full summary; variant for standard ride, rental window, tour segment, ambulance run.  
- **From:** **D55**, or **D100** (“Run completed”).  
- **To:** **D41** (last trip popup), **D69** (history), **D67** (proof), or dashboards.

---

### 3.8 Cancellation reasons (D57–D58)

**D57 – Cancel Ride Reason Screen**  
- **Route:** `/driver/trip/:tripId/cancel/reason`  
- **Purpose:** Choose structured cancellation reason.  
- **From:** **D52** or cancel from **D55**.  
- **To:** Optional additional comment (**D58**) or finish → dashboard.

**D58 – Cancel Ride (Additional Comment)**  
- **Route:** `/driver/trip/:tripId/cancel/details`  
- **Purpose:** Add free‑text context for support.  
- **From:** **D57**.  
- **To:** Dashboard (**D27/D29**).

---

### 3.9 Safety & emergency (D59–D66, D70–D72)

**D59 – Safety Toolkit Screen**  
- **Route:** `/driver/safety/toolkit`  
- **Purpose:** Safety shortcuts: SOS, emergency help, follow/share ride, report.  
- **From:** Safety icon on **D31/D55** or Safety Hub.  
- **To:** **D60/D61/D62/D65/D66/D70**.

**D60 – Emergency Assistance (Map/Location)**  
- **Route:** `/driver/safety/emergency/map`  
- **Purpose:** Show current location before emergency call or SOS.  
- **From:** **D59**.  
- **To:** **D61** (SOS send) or **D63** (call).

**D61 – SOS / Emergency Alert Sending**  
- **Route:** `/driver/safety/sos/sending`  
- **Purpose:** Show SOS alert being sent to EVzone.  
- **From:** **D59/D60**.  
- **To:** **D64** or **D63**.

**D62 – Emergency Assistance (Type + Description)**  
- **Route:** `/driver/safety/emergency/details`  
- **Purpose:** Optional classification and notes for incidents.  
- **From:** **D59** or after **D61**.  
- **To:** **D64**.

**D63 – Emergency Calling Screen**  
- **Route:** `/driver/safety/emergency/call`  
- **Purpose:** In‑app wrapper for calling emergency services.  
- **From:** **D60/D61**.  
- **To:** **D64**.

**D64 – Emergency Assistance Confirmation**  
- **Route:** `/driver/safety/emergency/confirmation`  
- **Purpose:** Confirm that EVzone logged the emergency and what happens next.  
- **From:** **D61/D62/D63**.  
- **To:** Back to **D59** or the active trip (**D55**).

**D65 – Follow My Ride Screen**  
- **Route:** `/driver/safety/follow-my-ride`  
- **Purpose:** Manage live tracking shared with trusted contacts.  
- **From:** **D59** or **D55**.  
- **To:** **D66** or back to trip.

**D66 – Share My Ride Screen**  
- **Route:** `/driver/safety/share-my-ride`  
- **Purpose:** Generate shareable tracking link; share via messaging apps.  
- **From:** **D65** or **D59**.  
- **To:** Back to **D55**.

**D70 – Safety Hub**  
- **Route:** `/driver/safety/hub`  
- **Purpose:** Safety overview; entry point to toolkit, policy, micro‑training.  
- **From:** **D06**, or via **D59**.  
- **To:** **D71**, **D59**, or **D72**.

**D71 – Safety Hub (Expanded View)**  
- **Route:** `/driver/safety/hub/expanded`  
- **Purpose:** Full list of safety resources and training content.  
- **From:** **D70**.  
- **To:** **D59**, **D61**, **D62**, **D72**.

**D72 – Driving Hours**  
- **Route:** `/driver/safety/driving-hours`  
- **Purpose:** Show total active hours; includes Rides, Deliveries, Rentals, Tours, Ambulance.  
- **From:** **D70/D71**, and from dashboards.  
- **To:** Back to dashboard or safety hub.

---

### 3.10 Proof of trip & history (D67–D69)

**D67 – Proof of Trip Status – Main View**  
- **Route:** `/driver/trip/:tripId/proof`  
- **Purpose:** Capture proof (photos, notes, checklists) for a trip.  
- **From:** **D55/D56**, and from history (**D69**).  
- **To:** Confirmation inside flow, **D68** for active trip overlay.

**D68 – Proof of Trip – Active Trip View**  
- **Route:** `/driver/trip/:tripId/proof/active`  
- **Purpose:** Lightweight proof capture while trip is still ongoing.  
- **From:** **D55**.  
- **To:** Back to **D55** or **D67** summary.

**D69 – Ride History**  
- **Route:** `/driver/history/rides`  
- **Purpose:** Past trips list with **job type chips** and filters.  
- **From:** **D29/D33/D35**.  
- **To:** Individual trip summary (**D56**), proof (**D67**).

---

### 3.11 Surge & delivery order dashboards (D73–D77)

**D73 – Surge Pricing**  
- **Route:** `/driver/surge/map`  
- **Purpose:** Heatmap of surge zones and multipliers.  
- **From:** **D29/D31**, or **D39** CTA.  
- **To:** Navigate to surge zone → back to map (**D26/D31**).

**D74 – Orders to Delivery**  
- **Route:** `/driver/delivery/orders-dashboard`  
- **Purpose:** Summary of pending and completed delivery orders.  
- **From:** **D25** or navigation menu.  
- **To:** **D75**.

**D75 – List of Orders**  
- **Route:** `/driver/delivery/orders`  
- **Purpose:** List of available/assigned orders.  
- **From:** **D25/D74**.  
- **To:** **D76** (filter), **D77** (picked up), or route details (**D78/D79**) when choosing an order.

**D76 – List of Orders – Select Order Type**  
- **Route:** `/driver/delivery/orders/filter`  
- **Purpose:** Filter by category (food/parcel/e‑commerce).  
- **From:** **D75**.  
- **To:** Back to **D75** with filters set.

**D77 – List of Orders – Picked Up Orders**  
- **Route:** `/driver/delivery/orders/picked-up`  
- **Purpose:** Show all orders currently in driver’s possession.  
- **From:** **D75**, or after confirmed pickup (**D96**).  
- **To:** Route details (**D78–D80**).

---

### 3.12 Routes & active delivery (D78–D84)

**D78 – Route Details**  
- **Route:** `/driver/delivery/route/:routeId`  
- **Purpose:** Ordered list of route stops with addresses & contact.  
- **From:** **D75/D77**.  
- **To:** Map variant (**D79**) or active route (**D80**).

**D79 – Route Details Screen (map variant)**  
- **Route:** `/driver/delivery/route/:routeId/map`  
- **Purpose:** Same route plus map timeline.  
- **From:** **D78**.  
- **To:** **D80**.

**D80 – Active Delivery Route Screen**  
- **Route:** `/driver/delivery/route/:routeId/active`  
- **Purpose:** Live navigation for multi‑stop route.  
- **From:** **D78/D79** or **D96**.  
- **To:**  
  - Stop contact (**D81**)  
  - Stop details (**D83**)  
  - Pickup/delivery QR flows (**D87–D93**) at each stop.

**D81 – Active Route with Stop Contact**  
- **Route:** `/driver/delivery/route/:routeId/stop/:stopId/contact`  
- **Purpose:** Quick contact & messaging for a stop.  
- **From:** **D80**.  
- **To:** Back to **D80**.

**D82 – Active Route Details Screen**  
- **Route:** `/driver/delivery/route/:routeId/details`  
- **Purpose:** Overview of all stops + statuses while route is in progress.  
- **From:** **D80**.  
- **To:** Back to **D80**.

**D83 – Active Route with Expanded Stop Details**  
- **Route:** `/driver/delivery/route/:routeId/stop/:stopId/details`  
- **Purpose:** Deep stop details, contact, messaging shortcuts.  
- **From:** **D80/D81**.  
- **To:** Back to **D80**, or into QR scan when delivering.

**D84 – Pick Your Destination**  
- **Route:** `/driver/delivery/destination/select`  
- **Purpose:** Choose pickup/drop location for a delivery run.  
- **From:** **D75** or new route creation.  
- **To:** **D78/D79**, or **D85** (pickup confirmation) if confirming on the spot.

---

### 3.13 Pickup confirmation & QR flows (D85–D96)

**D85 – Alert – Pick Up Confirmation**  
- **Route:** `/driver/delivery/pickup/confirm`  
- **Purpose:** Confirm that all items have been collected.  
- **From:** After QR success (**D93/D92**) or route events.  
- **To:** **D86** (location check) or back to route (**D80**).

**D86 – Warning – Confirm Current Location as Pick Up**  
- **Route:** `/driver/delivery/pickup/confirm-location`  
- **Purpose:** Warn when GPS doesn’t match pickup.  
- **From:** **D85** if mismatch.  
- **To:** Confirm anyway → **D96**; or correct location → QR flow again (**D87–D93**).

**D87 – QR Code – Package Pickup Verification**  
- **Route:** `/driver/delivery/pickup/qr`  
- **Purpose:** Show or accept pickup QR for verification.  
- **From:** **D80** at pickup stop.  
- **To:** Scanner (**D88/D91**).

**D88 – QR Code Scanner**  
- **Route:** `/driver/qr/scanner`  
- **Purpose:** Base QR scanning screen.  
- **From:** **D87**, or from **D90** after instructions.  
- **To:** Active camera view (**D91**), or confirmation (**D89/D92**).

**D89 – Scan QR Code Confirmation Popup**  
- **Route:** `/driver/qr/scan-confirmation`  
- **Purpose:** Confirm that the scanned QR matches the expected order.  
- **From:** **D88/D91**.  
- **To:** **D93** or back to **D88** on mismatch.

**D90 – Scan QR Code – Instruction Popup**  
- **Route:** `/driver/qr/instruction`  
- **Purpose:** First‑time onboarding (align code, stable hands, etc.).  
- **From:** **D87/D88** on first use.  
- **To:** **D88/D91**.

**D91 – Scan QR Code – Active Camera View**  
- **Route:** `/driver/qr/active`  
- **Purpose:** Full camera view with moving scan line.  
- **From:** **D88**.  
- **To:** Success indicator (**D92**), then processing (**D93**).

**D92 – QR Code Scanned – Confirmation Indicator**  
- **Route:** `/driver/qr/scanned`  
- **Purpose:** Show scan success (checkmark + mini summary).  
- **From:** **D91**.  
- **To:** Processing (**D93**).

**D93 – QR Code – Processing Stage**  
- **Route:** `/driver/qr/processing`  
- **Purpose:** Backend validation of QR.  
- **From:** **D89/D92**.  
- **To:** **D96** on success; **D88** on failure.

**D94 – QR Code Scanning Screen (marketing “SCAN ME”)**  
- **Route:** `/driver/qr/marketing-scan`  
- **Purpose:** Marketing / education QR scanning (for campaigns).  
- **From:** Marketing links or training.  
- **To:** **D95** or back to app.

**D95 – QR Code – Processing Screen (marketing)**  
- **Route:** `/driver/qr/marketing-processing`  
- **Purpose:** Marketing processing state.  
- **From:** **D94**.  
- **To:** Close or show marketing result.

**D96 – Pick‑Up Confirmed Screen**  
- **Route:** `/driver/delivery/pickup/confirmed`  
- **Purpose:** Confirmed pickup; show order, destination, next step.  
- **From:** **D93**, maybe **D85** if confirmed.  
- **To:** Active route (**D80**) or picked‑up list (**D77**).

---

### 3.14 Special job types (D97–D102)

**D97 – Rental Job Overview / On Rental Screen**  
- **Route:** `/driver/rental/job/:jobId`  
- **Purpose:** Summary for ongoing rental: window, statuses, notes.  
- **From:** Rental jobs accepted from **D42/D43/D44**.  
- **To:** Navigation & segments via **D47–D55**; finalise via **D56**.

**D98 – Tour – Today’s Schedule Screen**  
- **Route:** `/driver/tour/:tourId/today`  
- **Purpose:** Daily schedule for multi‑day tours.  
- **From:** Tour job accepted in **D42/D43/D44**.  
- **To:** Segment navigation screens (**D47–D55**) per segment.

**D99 – Ambulance Job Incoming Screen**  
- **Route:** `/driver/ambulance/incoming`  
- **Purpose:** High‑priority incoming for Ambulance: Code 1/2, minimal patient info.  
- **From:** Dispatch / control center.  
- **To:** Accept → **D100**; decline → dashboards.

**D100 – Ambulance Job Status Screen**  
- **Route:** `/driver/ambulance/job/:jobId/status`  
- **Purpose:** Track stages: en route → on scene → to hospital → handover.  
- **From:** **D99**, or ambulant job from **D42/D43**.  
- **To:**  
  - Start transport → reuse **D55** layout.  
  - After handover → **D56** with ambulance summary.

**D101 – Job Types & Icons Legend**  
- **Route:** `/driver/settings/job-types-legend`  
- **Purpose:** Educate drivers on all job types, icons, colours.  
- **From:** Settings → Help, or from job screens as “What do these colours mean?”.  
- **To:** Shuttle help (**D102**) or back to settings.

**D102 – Shuttle Link Info Screen**  
- **Route:** `/driver/help/shuttle-link`  
- **Purpose:** Explain that school shuttles use a **separate Shuttle Driver App**.  
- **From:** Shuttle cards (D44) or legend (**D101**).  
- **To:** Attempt deep‑link to Shuttle Driver App, or back.

---

## 4. How everything hangs together

At a high level:

- **Onboarding path:** D01 → D02 → (D03) → D04 → D05–D17 → D18–D24 → D27.
- **Go‑online path:** D27 → D30 (if blocked) or D26/D31 → D32 → D42/D43.
- **Ride lifecycle:** D42/D43 → D47 → D48/D49 → D50 → D51 → D53 → D54 → D55 → D56 → D41/D69.
- **Delivery lifecycle:** D25/D74 → D75 → D78/D79 → D80 → D84 → D87–D93 → D96 → D80 → D77.
- **Safety flows:** From any active map/trip (**D31/D55**) into D59–D66, D70–D72.
- **Proof & history:** D55/D56 → D67/D68, and D29/D33/D35 → D69 → D56/D67.
- **New verticals:** Rental (**D97**), Tours (**D98**), Ambulance (**D99–D100**) reuse the same navigation & trip core (D47–D56) but change labels and metrics.

This guide should give your team a **single source of truth** for how all 102 screens connect, and where to plug each React screen (`Dxx.jsx`) into the real navigation stack.
