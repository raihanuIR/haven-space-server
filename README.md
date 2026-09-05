# Property Rental & Booking Platform - Server API

Backend REST API for the Property Rental & Booking Platform built with Node.js, Express, MongoDB, and JWT authentication.

## Purpose
Provides role-based access control (Tenant, Owner, Admin), property listing management, booking workflows, Stripe payment processing, customer reviews, and administrative moderation.

## Live Deployment
- **Live API Endpoint**: [https://haven-space-server-theta.vercel.app/api](https://haven-space-server-theta.vercel.app/api)
- **Frontend Live URL**: [https://haven-space-client.vercel.app/](https://haven-space-client.vercel.app/)
- **Server Repository**: [https://github.com/raihanuIR/haven-space-server](https://github.com/raihanuIR/haven-space-server)
- **Client Repository**: [https://github.com/raihanuIR/haven-space-client](https://github.com/raihanuIR/haven-space-client)

## Key Features
- **Role-Based Access Control**: Strict middleware verification for Tenant, Owner, and Admin roles.
- **JWT Authentication**: Secure token generation with password hashing via bcryptjs.
- **Property Management**: Complete CRUD operations, status management (Pending, Approved, Rejected) with admin feedback.
- **Backend Search & Filtering**: Multi-criteria query engine with regex location matching, property type filtering, price sorting, and pagination.
- **Stripe Payments**: Payment Intent generation with audit trail creation.
- **Owner Analytics**: 12-month aggregated monthly earnings dataset for Recharts visualization.
- **Moderation Workflow**: Admin approval/rejection modal with structured rejection feedback.

## NPM Packages Used
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `mongoose`: Elegant MongoDB object modeling.
- `jsonwebtoken`: Secure JWT token issuance and verification.
- `bcryptjs`: Password hashing and credential verification.
- `cors`: Cross-Origin Resource Sharing enablement.
- `dotenv`: Zero-dependency module for environment variable loading.
- `stripe`: Official Stripe SDK for secure payment workflows.

## Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

## Running Locally
```bash
npm install
npm run dev
```
