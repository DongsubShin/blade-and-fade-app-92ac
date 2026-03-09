# blade-and-fade-app — Product Requirements Document

**Version:** 1.0
**Date:** 2023-10-27
**Status:** Draft

---

## 0. Project Overview

### Product

**Name:** blade-and-fade-app
**Type:** Web Application (Mobile-Responsive)
**Deadline:** Q1 2024
**Status:** Draft

### Description

blade-and-fade-app is a custom-built management and booking platform designed specifically for "Blade and Fade," a premier barbershop in Dallas, TX. The application serves as a direct replacement for Booksy, providing a seamless interface for clients to book appointments, a real-time digital walk-in queue for on-site customers, and a robust CRM for the shop's three barbers to manage client relationships and history.

### Goals

1. **Eliminate Third-Party Fees:** Transition away from Booksy to a proprietary system to save on monthly subscription costs and booking fees.
2. **Hybrid Queue Management:** Efficiently manage both pre-booked appointments and spontaneous walk-in customers to maximize chair uptime.
3. **Client Retention:** Build a detailed CRM that tracks specific haircut preferences (e.g., guard sizes, styles) to ensure consistent service quality across all three barbers.

### Target Audience

| Audience | Description |
|----------|-------------|
| **Primary** | Local Dallas residents looking for professional grooming services with easy online booking. |
| **Secondary** | Walk-in customers who need real-time visibility into current wait times. |

### User Types

| Type | DB Value | Description | Key Actions |
|------|----------|-------------|-------------|
| **Client** | `0` | Standard customer | Book appointments, join walk-in queue, view history. |
| **Barber** | `1` | Shop staff (3 total) | Manage personal schedule, view client notes, check-in walk-ins. |
| **Admin** | `99` | Shop Owner | Manage shop hours, services, pricing, and view business analytics. |

### User Status

| Status | DB Value | Behavior |
|--------|----------|----------|
| **Active** | `0` | Full access to booking and profile features. |
| **Suspended** | `1` | Restricted from booking (used for frequent no-shows). Show: "Please call the shop to book." |
| **Withdrawn** | `2` | Account deactivated; data anonymized after 30 days for GDPR/Privacy compliance. |

### MVP Scope

**Included:**
- User authentication (Email/Phone)
- Appointment booking calendar
- Real-time Walk-in Queue (Digital Waitlist)
- SMS Reminders via Twilio
- Client CRM (Notes, Photo Uploads, Visit History)
- Admin Dashboard for Shop Management

**Excluded (deferred):**
- In-app payment processing (Payments to be handled via existing POS in-shop)
- Multi-location support (System optimized for the single Dallas location)
- Barber "Portfolio" social feed

---

## 1. Terminology

### Core Concepts

| Term | Definition |
|------|------------|
| **The Queue** | The real-time list of walk-in customers currently waiting for the next available barber. |
| **Service** | A specific offering (e.g., "Skin Fade," "Beard Trim," "The Works") with a set duration and price. |
| **No-Show** | A client who misses a booked appointment without canceling 2 hours in advance. |

### User Roles

| Role | Description |
|------|-------------|
| **Guest** | Can view service menu and estimated wait times but cannot book or join the queue. |
| **Client** | Authenticated user who can manage their own bookings and profile. |
| **Barber** | Can see the full shop schedule and manage their specific "Chair." |

### Status Values

| Enum | Values | Description |
|------|--------|-------------|
| **BookingStatus** | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NOSHOW` | Tracks the lifecycle of a scheduled appointment. |
| **QueueStatus** | `WAITING`, `IN_CHAIR`, `FINISHED` | Tracks the real-time status of a walk-in customer. |

### Technical Terms

| Term | Definition |
|------|------------|
| **Slug** | A URL-friendly version of a barber's name or service (e.g., `/book/john-doe`). |
| **Buffer Time** | A 5-10 minute window automatically added between appointments for cleaning. |

---

## 2. System Modules

### Module 1 — Booking Engine

Handles the logic for scheduling future appointments based on barber availability and service duration.

#### Main Features

1. **Dynamic Calendar** — Shows available slots in 15-minute increments.
2. **Barber Selection** — Allows clients to pick a specific barber or "First Available."
3. **Conflict Validation** — Prevents double-booking and respects barber break times.

#### Technical Flow

##### Appointment Creation

1. User selects a Service and Barber.
2. App fetches available slots from the backend, filtering out existing bookings and blocked time.
3. Backend validates the selected `startTime` + `serviceDuration` does not overlap with another record.
4. On success:
   - Create `Booking` record with status `CONFIRMED`.
   - Trigger SMS confirmation to Client.
   - Update Barber's dashboard in real-time.
5. On failure:
   - Return "Slot no longer available" error and refresh calendar.

---

### Module 2 — Walk-in Queue (The "Digital Clipboard")

Manages customers who arrive at the shop without an appointment.

#### Main Features

1. **Wait Time Algorithm** — Calculates estimated wait based on current "In-Chair" status and pending queue.
2. **Public Display Mode** — A simplified view for a tablet/TV in the shop lobby.
3. **SMS "You're Next"** — Automated alert when the client is 1st in line.

#### Technical Flow

1. User enters name and phone number via the shop tablet.
2. System calculates `estimatedWait` = (Number of people ahead / 3 barbers) * 30 mins.
3. On success:
   - Add entry to `Queue` table.
   - Send "Welcome" SMS with a link to track their position.
4. On failure:
   - Show "Queue is currently full" if the wait time exceeds shop closing hours.

---

### Module 3 — Client CRM & History

The central database for client preferences and service history.

#### Main Features

1. **Style Notes** — Barbers can save specific details (e.g., "Number 2 on sides, scissor cut top").
2. **Visit Frequency Tracking** — Identifies "VIPs" or "At-Risk" clients who haven't visited in 6 weeks.

#### Technical Flow

1. Barber finishes a service and clicks "Complete."
2. A modal appears prompting for "Service Notes" and optional "Photo Upload."
3. Backend updates the `ClientProfile` with the latest metadata and timestamps.

---

## 3. User Application

### 3.1 Page Architecture

**Stack:** React, React Router, Tailwind CSS, Axios

#### Route Groups

| Group | Access |
|-------|--------|
| Public | Landing, Service Menu, Waitlist View |
| Auth | Login, Signup, OTP Verification |
| Protected | Booking Flow, My Profile, Appointment History |

#### Page Map

**Public**
| Route | Page |
|-------|------|
| `/` | Landing Page (Shop Info & CTA) |
| `/services` | Service Menu & Pricing |
| `/waitlist` | Live Shop Queue Status |

**Auth**
| Route | Page |
|-------|------|
| `/login` | Phone Number / Email Login |
| `/signup` | New Client Registration |

**Protected**
| Route | Page |
|-------|------|
| `/book` | Barber & Service Selection |
| `/book/calendar` | Date & Time Picker |
| `/profile` | User Profile & Style Notes |
| `/my-bookings` | List of upcoming/past visits |

---

### 3.2 Feature List by Page

#### `/` — Landing Page
- **Hero Section:** High-quality shop imagery and "Book Now" vs "Join Queue" buttons.
- **Shop Status:** Real-time "Open/Closed" indicator and current estimated walk-in wait time.
- **Location:** Integrated Google Maps view of the Dallas location.

#### `/services` — Service Menu
- **Categorized List:** Haircuts, Beard, Shaves, Extras.
- **Details:** Price, duration, and description for each service.

#### `/book` — Booking Flow
- **Barber Selection:** Cards for each of the 3 barbers with their specialty and next available time.
- **Service Selection:** Multi-select for add-ons (e.g., Haircut + Beard Trim).
- **Time Picker:** Grid of available slots for the selected date.

#### `/profile` — My Profile
- **Personal Info:** Name, Phone, Email.
- **Style Vault:** View-only section showing notes the barber has made about the user's hair.
- **Preferences:** Toggle for SMS notification reminders.

---

## 4. Admin Dashboard (Barber Interface)

### 4.1 Page Architecture

**Access:** Barber or Admin role only. Optimized for Tablet/Desktop.

| Route | Page |
|-------|------|
| `/admin` | Today's Overview (Schedule + Queue) |
| `/admin/queue` | Walk-in Queue Management |
| `/admin/clients` | CRM / Client Directory |
| `/admin/clients/:id` | Detailed Client History & Notes |
| `/admin/settings` | Shop Hours & Service Management |

---

### 4.2 Feature List by Page

#### `/admin` — Today's Overview
- **Split View:** Left side shows the day's appointments; Right side shows the live walk-in queue.
- **Check-in Button:** One-click to mark a client as "Arrived."
- **Status Toggle:** Barbers can toggle "On-Break" to temporarily remove themselves from the "First Available" logic.

#### `/admin/queue` — Queue Management
- **Drag-and-Drop:** Reorder the queue if necessary (e.g., for shop errors).
- **Summon Client:** Button to trigger the "You're Next" SMS.
- **Remove:** Cancel a walk-in entry.

#### `/admin/clients` — Client CRM
- **Search:** Instant search by name or phone number.
- **Filters:** Filter by "Regulars," "New Clients," or "No-Shows."
- **Export:** Download client list (Email/Phone) for marketing.

#### `/admin/settings` — Platform Settings
- **Business Hours:** Set standard hours and holiday closures.
- **Service Editor:** Add/Edit/Delete services, prices, and durations.
- **Barber Profiles:** Manage the 3 barber accounts and their individual schedules.

---

## 5. Tech Stack

### Architecture

The application follows a modern decoupled architecture with a RESTful API.

```
blade-and-fade-app/
├── backend/    ← NestJS API (Node.js)
├── frontend/   ← React (Vite) Client App
└── shared/     ← Shared TypeScript types/interfaces
```

### Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Backend | NestJS | 10.x | Scalable API framework |
| Language | TypeScript | 5.x | Type safety across stack |
| ORM | TypeORM | 0.3.x | Database interaction |
| Database | PostgreSQL | 15 | Relational data storage |
| Frontend | React | 18.x | UI Library |
| Styling | Tailwind CSS | 3.x | Utility-first styling |
| State | TanStack Query | 5.x | Server state management |
| SMS | Twilio | — | Transactional SMS |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| **Twilio** | Sending appointment reminders and queue alerts. |
| **Cloudinary** | Storing and optimizing client "Style Vault" photos. |
| **Google Maps API** | Displaying shop location and calculating travel time for clients. |

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| **PostgreSQL** | Chosen for robust relational handling of complex scheduling and overlapping time slots. |
| **NestJS** | Provides a structured, modular backend that is easy to maintain as the shop grows. |
| **SMS over Email** | Barbershop clients respond significantly better to SMS for appointment reminders. |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connection string for PostgreSQL. |
| `TWILIO_ACCOUNT_SID` | Credentials for SMS service. |
| `JWT_SECRET` | Secret key for user authentication tokens. |
| `CORS_ORIGIN` | Allowed frontend URL for security. |

---

## 6. Open Questions

| # | Question | Context / Impact | Owner | Status |
|:-:|----------|-----------------|-------|--------|
| 1 | Should we require a deposit for new clients? | Reduces no-shows but requires Stripe integration. | Client | ⏳ Open |
| 2 | Do the 3 barbers have different working hours? | Affects the complexity of the calendar logic. | Client | ⏳ Open |
| 3 | Is there a maximum queue size? | Prevents the walk-in list from becoming unmanageable. | Client | ⏳ Open |
| 4 | Should clients be able to choose "Any Barber" for walk-ins? | Impacts how the queue is distributed. | Client | ⏳ Open |