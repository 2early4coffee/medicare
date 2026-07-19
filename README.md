# MediCare — Healthcare Appointment Platform

A full-stack healthcare appointment booking platform. MediCare connects patients with doctors and medical services, enabling online appointment scheduling, service bookings, and secure payments — all in one place.

**Live Demo:**
- Frontend: https://medicare-black-tau.vercel.app
- Admin Panel: https://medicare-admin-eight.vercel.app
- Backend API: https://medicare-backend-ycw1.onrender.com

---

## Project Structure

This is a monorepo with three separate applications:

```
medicare/
├── frontend/       # Patient-facing web app (React + Vite)
├── admin/          # Admin & doctor dashboard (React + Vite)
└── backend/        # REST API (Node.js + Express + MongoDB)
```

---

## Tech Stack

### Frontend (Patient App)
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Clerk | Authentication |
| React Router v7 | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| Stripe | Online payments |

### Admin Panel
| Technology | Purpose |
|---|---|
| Preact | Lightweight UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Clerk | Authentication |
| React Router v7 | Client-side routing |
| Lucide React | Icons |

### Backend (REST API)
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Clerk Express | Auth middleware |
| Cloudinary | Image storage |
| Stripe | Payment processing |
| JWT | Doctor authentication |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |
| Multer | File uploads |
| Dotenv | Environment variables |

---

## Features

### Patient App
- Browse and search doctors by name or specialization
- View doctor profiles, schedules, ratings, and fees in KSh
- Book doctor appointments with date and time slot selection
- Browse and book medical services
- Online payment via Stripe or cash option
- View and track appointment history
- Contact clinic via WhatsApp form
- Fully responsive — mobile, tablet, and desktop

### Admin Panel
- Dashboard with live stats — total doctors, appointments, earnings, completed, cancelled
- Doctor management — add, edit, delete doctors with image upload to Cloudinary
- Service management — add, edit, delete services with scheduling
- Appointment management — view, update status, reschedule appointments
- Service appointment management — track all service bookings
- Doctor schedule management — set available dates and time slots
- Search and filter across all data

### Backend API
- RESTful API with full CRUD for doctors, services, and appointments
- Clerk-based authentication for patients
- JWT-based authentication for doctors
- Image upload and management via Cloudinary
- Stripe checkout session creation and payment verification
- Stats summary endpoint aggregating all platform data
- Rate limiting, Helmet security headers, and NoSQL sanitization
- MongoDB Atlas with indexed queries

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account
- Clerk account
- Cloudinary account
- Stripe account

### 1 — Clone the repository
```bash
git clone https://github.com/2early4coffee/medicare.git
cd medicare
```

### 2 — Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/MediCare?appName=Cluster0
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:
```bash
npm start
```

### 3 — Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE=http://localhost:4000
```

Start the frontend:
```bash
npm run dev
```

### 4 — Admin setup
```bash
cd admin
npm install
```

Create a `.env` file in the `admin` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE=http://localhost:4000
```

Start the admin panel:
```bash
npm run dev
```

---

## Seed Scripts

The `backend` folder includes seed scripts to populate the database with sample Kenyan data:

```bash
# Seed doctors and services (with Cloudinary image upload)
node seed.js

# Seed doctor appointments
node seedAppointments.js

# Seed service appointments
node seedServiceAppointments.js
```

> **Note:** Run `seed.js` first before the appointment scripts, as they depend on doctors and services being in the database.

---

## API Endpoints

### Doctors
```
GET    /api/doctors              — Get all doctors
POST   /api/doctors              — Add a doctor
GET    /api/doctors/:id          — Get doctor by ID
PUT    /api/doctors/:id          — Update doctor
DELETE /api/doctors/:id          — Delete doctor
POST   /api/doctors/login        — Doctor login
POST   /api/doctors/:id/toggle-availability — Toggle availability
```

### Services
```
GET    /api/services             — Get all services
POST   /api/services             — Add a service
GET    /api/services/:id         — Get service by ID
PUT    /api/services/:id         — Update service
DELETE /api/services/:id         — Delete service
```

### Appointments
```
GET    /api/appointments         — Get all appointments
POST   /api/appointments         — Book an appointment
GET    /api/appointments/:id     — Get appointment by ID
PUT    /api/appointments/:id     — Update appointment
GET    /api/appointments/confirm — Verify Stripe payment
```

### Service Appointments
```
GET    /api/service-appointments          — Get all service appointments
POST   /api/service-appointments          — Book a service appointment
GET    /api/service-appointments/:id      — Get by ID
PUT    /api/service-appointments/:id      — Update
GET    /api/service-appointments/confirm  — Verify Stripe payment
```

### Stats
```
GET    /api/stats/summary        — Platform-wide stats
GET    /api/stats/users/count    — Total registered users via Clerk
```

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://medicare-black-tau.vercel.app |
| Admin | Vercel | https://medicare-admin-eight.vercel.app |
| Backend | Render | https://medicare-backend-ycw1.onrender.com |
| Database | MongoDB Atlas | MediCare cluster |
| Images | Cloudinary | medicare/doctors, medicare/services |

### Environment Variables on Vercel
Add `VITE_API_BASE` pointing to your Render backend URL for both frontend and admin projects.

### Environment Variables on Render
Add all backend `.env` variables in the Render dashboard under **Environment**.

### MongoDB Atlas
Whitelist `0.0.0.0/0` under **Network Access** to allow connections from Render's dynamic IPs.

---

## Security

- **Helmet** — sets secure HTTP response headers
- **Rate limiting** — 100 requests/15min on all API routes, 10 on login
- **CORS** — restricted to whitelisted frontend origins
- **NoSQL sanitization** — custom middleware blocks `$` operator injection
- **Clerk** — handles all patient authentication securely
- **JWT** — doctor-specific authentication with 7-day expiry

---

## Future Improvements

- [ ] Pagination on appointments and service appointments pages
- [ ] Skeleton loaders for better perceived performance
- [ ] Password hashing for doctor accounts (bcrypt)
- [ ] Email notifications for appointment confirmations
- [ ] Doctor portal with full schedule management
- [ ] Mobile app (React Native)
- [ ] Testimonials scroll animation fix
- [ ] Analytics dashboard with charts

---

## Author

**Walter (2early4coffee)**
- GitHub: [@2early4coffee](https://github.com/2early4coffee)
- Portfolio: [2early4coffee.github.io](https://2early4coffee.github.io)

---

## License

ISC
