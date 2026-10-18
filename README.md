# 🎬 IMovies — Cinema Management & Ticket Booking System (MERN)

A full-stack cinema booking platform: browse movies, pick showtimes, select seats in real time, pay and manage bookings. Includes an admin panel for movies, theatres and shows.

**Stack:** MongoDB · Express.js · React (Vite) · Node.js · Socket.io · Redux Toolkit · Bootstrap 5 · JWT · bcrypt

## Folder structure (phase-wise)

```
IMovies-MERN/
├── README.md
├── docs/                              ← Phase-wise documentation
│   ├── Phase1_Environment_Setup.md
│   ├── Phase2_Database_Design.md
│   ├── Phase3_Application_Development.md
│   ├── Phase4_Role_Based_Security.md
│   ├── Phase5_Frontend_Integration.md
│   ├── Phase6_Testing_Validation.md
│   ├── Phase7_Monitoring_Optimization.md
│   ├── API_Documentation.md
│   └── Project_Report_Outline.md
├── postman/IMovies.postman_collection.json
├── backend/                           ← Express API + Socket.io
│   ├── src/{config,models,controllers,routes,middleware,utils,sockets,seed}
│   ├── tests/                         ← Jest + Supertest
│   ├── .env.example
│   └── package.json
└── frontend/                          ← React app
    ├── src/{api,app(redux),components,pages,pages/admin,utils}
    └── package.json
```

## Quick start

Prerequisites: Node.js ≥ 16, npm, MongoDB running locally (or an Atlas URI), Git, Postman.

```bash
# 1) Backend
cd backend
npm install
cp .env.example .env        # edit MONGO_URI and JWT_SECRET
npm run seed                # demo data + admin/user accounts
npm run dev                 # http://localhost:5000

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

**Demo logins** (after `npm run seed`)

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@imovies.com  | Admin@123  |
| User  | user@imovies.com   | User@123   |

Payment is a **mock gateway**: any card works; a card number ending in `0000` simulates failure.

## Tests
```bash
cd backend && npm test      # auth, shows/seats, booking flow, filters (in-memory MongoDB)
```
Import `postman/IMovies.postman_collection.json` in Postman and run the collection in order (it stores tokens and IDs automatically).

## Booking flow
1. User picks a show → seat map loads (`GET /shows/:id/seats`) and joins a Socket.io room.
2. **Lock** selected seats (5 min hold, atomic, race-safe) → other users see them as held instantly.
3. Create a **pending booking** (price computed server-side).
4. **Pay** → success: seats become *booked*, booking *confirmed*, notification created. Failure: retry until hold expires.
5. **Cancel** (≥ 2 h before show): seats freed, payment marked refunded.
6. A background job releases expired holds every 30 s.

## Production notes
Replace the mock gateway in `paymentController.js` with Razorpay/Stripe, set `NODE_ENV=production`, use a strong `JWT_SECRET`, serve over HTTPS, and set `CLIENT_URL` to your frontend origin.
