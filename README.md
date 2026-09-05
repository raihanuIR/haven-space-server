# ⚙️ RentalHub — Property Rental & Booking Platform (Server API)

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Stripe](https://img.shields.io/badge/Stripe-SDK-635bff?logo=stripe&logoColor=white)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://haven-space-server-theta.vercel.app/api)

Backend RESTful API engine powering the RentalHub property rental platform. Built with Node.js, Express, MongoDB (Mongoose), and JSON Web Tokens. Features strict Role-Based Access Control (RBAC), multi-criteria database search & sorting, Stripe payment processing, and administrative moderation workflows.

---

## 🌐 Live Deployment & Repositories

- **Live API Endpoint**: [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api)
- **Front-End Live Application**: [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/)
- **Server GitHub Repository**: [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server)
- **Client GitHub Repository**: [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client)

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Scope & Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentalhub.com` | `AdminPassword123!` | Moderate properties with rejection feedback, change user roles, audit bookings, and view paginated financial transactions. |
| **Owner** | `owner@rentalhub.com` | `OwnerPassword123!` | 12-Month Recharts earnings line chart, Download Earnings PDF, publish new listings, view rejection feedback (👁️), approve/reject booking requests. |
| **Tenant** | `tenant@rentalhub.com` | `TenantPassword123!` | Browse catalog, filter & sort listings, bookmark favorites, reserve properties via Stripe with confetti celebration, submit ratings & reviews. |

---

## 🏗️ Architecture & Design Principles

1. **MVC Pattern**: Clear separation of concerns among Routes, Controllers, Models, and Middlewares.
2. **JWT Security & RBAC**:
   - `verifyJWT`: Validates incoming `Bearer <token>` headers and attaches the decoded user payload to `req.user`.
   - `verifyOwner`: Ensures only property owners or administrators can publish and manage listings.
   - `verifyAdmin`: Restricts user role assignment and property moderation exclusively to administrators.
3. **Resilient Database Connectivity**:
   - Implements serverless connection caching with Mongoose.
   - Includes automatic in-memory fallback seeding so that the live API remains functional even if external cluster connection limits are encountered.
4. **Backend-Driven Query Execution**:
   - Performs case-insensitive regex search on property locations.
   - Executes multi-field filtering by property type and price ranges.
   - Powers server-side pagination with dynamic page offsets and limit bounds.

---

## 📡 Comprehensive REST API Endpoints

### 1. Authentication & User Management (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`, `photo`, `role`). |
| `POST` | `/api/auth/login` | Public | Authenticate with credentials and receive a signed JWT token. |
| `POST` | `/api/auth/google` | Public | Google Social Login (auto-creates or matches user, defaults to `Tenant`). |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile using JWT token. |
| `PUT` | `/api/auth/profile` | Private | Update authenticated user profile name and photo URL. |

### 2. Property Listings (`/api/properties`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/properties/featured` | Public | Fetch 6 approved featured properties (`.limit(6)`). |
| `GET` | `/api/properties` | Public | Paginated query engine with backend search, type filtering, and sorting. |
| `GET` | `/api/properties/my-properties` | Owner | Retrieve all listings owned by the logged-in owner (including rejected with feedback). |
| `GET` | `/api/properties/:id` | Private | Retrieve full property details, specs, amenities, and owner contact. |
| `POST` | `/api/properties` | Owner | Create a new property listing (status automatically defaults to `Pending`). |
| `PUT` | `/api/properties/:id` | Owner / Admin | Update existing property details. |
| `DELETE` | `/api/properties/:id` | Owner / Admin | Permanently delete a property listing. |

### 3. Bookings & Reservations (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create a reservation booking with initial status `Pending` and payment status `Paid`. |
| `GET` | `/api/bookings/my-bookings` | Tenant | Retrieve all reservations placed by the authenticated tenant. |
| `GET` | `/api/bookings/owner-requests`| Owner | Fetch incoming booking requests for properties owned by the logged-in owner. |
| `PATCH`| `/api/bookings/:id/status` | Owner | Approve or Reject a tenant booking request. |

### 4. Owner Analytics (`/api/owner`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/owner/analytics` | Owner | Aggregated 12-month earnings trendline dataset and summary totals for Recharts. |

### 5. Administrative Controls (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/users` | Admin | Retrieve all registered platform users. |
| `PATCH`| `/api/admin/users/:id/role` | Admin | Update a user's system role (`Tenant`, `Owner`, `Admin`). |
| `GET` | `/api/admin/properties` | Admin | Retrieve all property listings across all statuses (`Pending`, `Approved`, `Rejected`). |
| `PATCH`| `/api/admin/properties/:id/moderate` | Admin | Approve or Reject property listing with mandatory rejection feedback. |
| `GET` | `/api/admin/bookings` | Admin | Paginated platform-wide booking audit stream. |
| `GET` | `/api/admin/transactions` | Admin | Paginated financial transaction records with amounts, dates, and parties. |

### 6. Stripe Payment Processing (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-payment-intent` | Private | Generate Stripe PaymentIntent client secret or create simulated payment audit. |

### 7. Saved Favorites (`/api/favorites`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/favorites` | Private | Fetch all bookmarked properties for the logged-in user. |
| `POST` | `/api/favorites` | Private | Add a property to the user's saved favorites list. |
| `DELETE`| `/api/favorites/:id` | Private | Remove a property from saved favorites. |

### 8. Ratings & Reviews (`/api/reviews`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/featured` | Public | Retrieve verified reviews for the homepage testimonials section. |
| `GET` | `/api/reviews/property/:id` | Public | Retrieve reviews and ratings submitted for a specific property. |
| `POST` | `/api/reviews` | Private | Submit a rating (1–5 stars) and review commentary. |

---

## 🗄️ Database Schemas Overview

- **User**: Name, email, hashed password, photo, role (`Tenant`, `Owner`, `Admin`), Google provider flag.
- **Property**: Title, description, location, propertyType, rentPrice, rentType (`Monthly`, `Weekly`, `Daily`), bedrooms, bathrooms, propertySize, amenities, images, status (`Pending`, `Approved`, `Rejected`), rejectionFeedback, owner (`ObjectId`).
- **Booking**: Property reference, tenant reference, owner reference, moveInDate, contactNumber, additionalNotes, amountPaid, bookingStatus (`Pending`, `Approved`, `Rejected`), paymentStatus (`Paid`, `Refunded`).
- **Transaction**: Transaction ID, property reference, tenant reference, owner reference, amount, paymentMethod, status (`Completed`).
- **Review**: Property reference, user reference, rating (1–5), comment, timestamp.
- **Favorite**: User reference, property reference, timestamp.

---

## 📦 NPM Packages Used

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^4.19.2` | Fast, unopinionated web framework for Node.js. |
| `mongoose` | `^8.6.0` | Elegant MongoDB object modeling and schema validation. |
| `jsonwebtoken` | `^9.0.2` | Signed JWT token generation and verification middleware. |
| `bcryptjs` | `^2.4.3` | Secure password hashing with salt rounds. |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing enablement for the Vite client. |
| `dotenv` | `^16.4.5` | Environment variable management. |
| `stripe` | `^16.10.0` | Official Stripe server SDK for payment intent processing. |

---

## 🛠️ Environment Configuration

Create a `.env` file inside the `server/` root directory:

```env
# Server Port
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/haven-space?retryWrites=true&w=majority

# JWT Token Secret
JWT_SECRET=super_secure_jwt_secret_key_rentalhub_platform_2026

# Stripe Secret API Key
STRIPE_SECRET_KEY=sk_test_51MockSecretKeyForRentalHubPlatform

# Authorized Frontend Origin
CLIENT_URL=https://haven-space-client.vercel.app
```

---

## 💻 Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raihanuIR/haven-space-server.git
   cd haven-space-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Seed Database with initial records**:
   ```bash
   node src/utils/seedAdditional.js
   ```

4. **Start the API server**:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The API will be live at `http://localhost:5000/api`.
