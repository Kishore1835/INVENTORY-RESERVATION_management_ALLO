# Allo Health — Inventory Reservation System

A modern full-stack Inventory Reservation Platform built for the Allo Health Software Engineer Internship Assessment.


OPEN URL : https://inventory-reservation-management-al.vercel.app/
---

## Features

### Reservation Engine

* Real-time inventory reservation
* Prevents overselling
* Multi-warehouse inventory support
* Reservation stock locking

### Reservation Lifecycle

* Pending reservations
* Confirmed purchases
* Automatic expiry handling
* Reservation cancellation
* Stock rollback mechanism

### Analytics Dashboard

* Inventory analytics cards
* Warehouse inventory charts
* Reservation activity table
* Real-time inventory visibility

### UI/UX

* Modern SaaS-style dashboard
* Responsive design
* Status badges
* Countdown reservation timer
* Professional glassmorphism UI

---

# Tech Stack

## Frontend

* Next.js 16
* React
* Tailwind CSS
* Recharts

## Backend

* Next.js API Routes
* Prisma ORM

## Database

* PostgreSQL (Supabase)

---

# How To Run The App Locally

## 1. Clone Repository

```bash
git clone <https://github.com/Kishore1835/INVENTORY-RESERVATION_management_ALLO>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="YOUR_SUPABASE_DATABASE_URL"
```

---

## 4. Run Prisma Migration / Sync Database

```bash
npx prisma db push
```

---

## 5. Generate Prisma Client

```bash
npx prisma generate
```

---

## 6. Seed Initial Data

Open Prisma Studio:

```bash
npx prisma studio
```

Add:

### Products

* iPhone 15
* MacBook Pro
* AirPods Pro
* iPad Air
* Apple Watch

### Warehouses

* Chennai Hub
* Bangalore Hub
* Mumbai Hub

### Inventory Records

Example:

| productId | warehouseId | totalStock | reservedStock |
| --------- | ----------- | ---------- | ------------- |
| 1         | 1           | 10         | 0             |
| 2         | 1           | 5          | 0             |
| 3         | 2           | 15         | 0             |
| 4         | 2           | 8          | 0             |
| 5         | 3           | 12         | 0             |

---

## 7. Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# Reservation Expiry Mechanism

The project implements an automatic reservation expiry workflow.

## Reservation Flow

1. User reserves inventory
2. Reserved stock is locked immediately
3. Reservation enters `pending` state
4. Countdown timer starts
5. When timer reaches zero:

   * Reservation status changes to `expired`
   * Reserved stock is restored automatically
   * Reservation actions become disabled

---

# How Expiry Works In Production

For this assessment project, expiry is implemented using a frontend-triggered expiry API call.

When the countdown timer reaches zero:

```txt
/api/reservations/[id]/expire
```

is automatically triggered.

This API:

* updates reservation status
* restores inventory stock
* prevents further reservation actions

---

# Production Trade-Off

In a real production system, reservation expiry should ideally be handled using:

* Background workers
* Cron jobs
* Message queues
* Scheduled tasks

Examples:

* BullMQ
* Redis queues
* Temporal
* AWS EventBridge
* Kubernetes CronJobs

This would avoid dependency on an active frontend session.

For the scope of this assessment, the current implementation was chosen because:

* simpler architecture
* faster implementation
* easier local testing
* demonstrates reservation lifecycle logic clearly

---

# Database Schema

## Product

Stores product information.

## Warehouse

Stores warehouse information.

## Inventory

Tracks:

* total stock
* reserved stock
* warehouse mapping

## Reservation

Tracks:

* reservation status
* quantity
* expiry time
* lifecycle management

---

# API Endpoints

## Products

```txt
GET /api/products
```

---

## Reservations

```txt
GET /api/reservations
POST /api/reservations
```

---

## Reservation Actions

```txt
POST /api/reservations/[id]/confirm
POST /api/reservations/[id]/cancel
POST /api/reservations/[id]/expire
```

---

# Trade-Offs / Improvements With More Time

If given more time, I would improve the system with:

## Backend Improvements

* Background job queue for expiry handling
* WebSocket real-time inventory sync
* Transaction-safe reservation locking
* Optimistic concurrency control

## Frontend Improvements

* Toast notifications
* Search & filtering
* Product images
* Skeleton loading states
* Better mobile optimization

## Infrastructure Improvements

* Docker containerization
* CI/CD pipeline
* Monitoring & logging
* Rate limiting
* Authentication & authorization

---

# Screenshots

## Dashboard

* Analytics cards
* Inventory charts
* Reservation table

## Reservation Checkout

* Countdown timer
* Status workflow
* Confirm / Cancel actions

---

# Author

Kishore Kumar

Built as part of the Allo Health Software Engineer Internship Assessment.
