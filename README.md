# Property Rental & Booking Platform (RentalHub) - Backend REST API

An end-to-end full-stack property rental and leasing platform backend developed with Node.js, Express.js (ES Modules), MongoDB Atlas via Mongoose ODM, Stripe Node SDK, and JWT Authentication. Fully upgraded according to the **Remontada Project Update** specifications.

---

## 🌐 Live Deployment & Repositories

| Entity | Live Link / Repository |
| :--- | :--- |
| **Front-End Live Application** | [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/) |
| **Backend REST API Endpoint** | [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api) |
| **Client Repository (GitHub)** | [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client) |
| **Server Repository (GitHub)** | [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server) |

---

## 🔑 Demo Account Credentials

| Role | Email Address | Password | Permissions & Dashboard |
| :--- | :--- | :--- | :--- |
| **User / Tenant** | `tenant@rentalhub.com` | `TenantPassword123!` | Book properties, Stripe deposit payment, add favorites, view spending trends, update password |
| **Admin** | `admin@rentalhub.com` | `AdminPassword123!` | Executive overview with Bar/Line/Pie Recharts, manage users & properties, audit inquiries & transactions |
| **Owner** | `owner@rentalhub.com` | `OwnerPassword123!` | Publish listings, view 12-month earnings chart, download PDF, approve/reject requests |

---

## 🚀 API Endpoints Overview

### Public Endpoints:
- `GET /api/properties` - Filter, search, and paginated catalog
- `GET /api/properties/featured` - Featured approved listings
- `GET /api/properties/stats/summary` - Live platform summary statistics for Home page & Dashboards
- `GET /api/properties/:id` - Public property details
- `GET /api/properties/:id/related` - Related property recommendations
- `POST /api/contact` - Submit contact inquiry directly to MongoDB database
- `POST /api/auth/register` - Create account (User/Tenant or Owner)
- `POST /api/auth/login` - Authenticate with JWT token
- `POST /api/auth/google` - Firebase Google OAuth session

### Authenticated Endpoints (`verifyJWT`):
- `GET /api/auth/me` - Current user identity
- `PUT /api/auth/profile` - Update user name and avatar
- `PUT /api/auth/change-password` - Update account password with bcrypt validation
- `GET /api/bookings/my-bookings` - Tenant reservations
- `POST /api/bookings` - Create reservation
- `GET /api/favorites` - Saved user bookmarks
- `POST /api/favorites` / `DELETE /api/favorites/:id` - Toggle bookmark
- `POST /api/payments/create-intent` - Stripe PaymentIntent creation

### Admin Endpoints (`verifyJWT` + `verifyAdmin`):
- `GET /api/admin/users` - Directory of all registered users
- `PATCH /api/admin/users/:id/role` - Update user role
- `GET /api/admin/properties` - All properties (Approved, Pending, Rejected)
- `PATCH /api/admin/properties/:id/moderate` - Approve or reject with feedback
- `GET /api/admin/bookings` - All platform bookings with pagination
- `GET /api/admin/transactions` - All Stripe transactions with pagination
- `GET /api/contact` - Review contact inquiries
- `PATCH /api/contact/:id/status` - Mark inquiry status (Read, Replied)

---

## 🛠️ Technology Stack

- **Core**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB Atlas via Mongoose ODM (with in-memory resilience store)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **Payments**: Stripe Node SDK
- **Security**: CORS origin reflection, dotenv environment management
