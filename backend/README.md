# Zyqora E-Commerce Backend

## Project Title & Description

**Zyqora E-Commerce Backend**

This is the backend API for Zyqora, a modern, full-featured e-commerce platform. It provides RESTful endpoints for user authentication, product management, cart, orders, payments (Stripe), and admin operations. Built with Node.js, Express, and MongoDB, it supports both user and admin roles, secure JWT authentication, and robust data validation.

---

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     PORT=4000
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **API Base URL:**
   - By default: `http://localhost:4000/api`

---

## Technology Stack

- **Node.js** (JavaScript runtime)
- **Express.js** (web framework)
- **MongoDB** (database)
- **Mongoose** (ODM)
- **Stripe** (payment processing)
- **JWT** (authentication)
- **Multer** (file uploads)
- **Swagger** (API docs)

---

## API Base URL

- Local: `http://localhost:4000/api`
- (Update with your deployed backend URL if available)

---

## Environment Variables

- `PORT` - Port to run the server (default: 4000)
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret for JWT token signing
- `STRIPE_SECRET_KEY` - Stripe secret key for payments

---

## Team Members & Contributions

- **Bhargav Sathvara**  
  - Project Lead, Backend Architecture, Auth, Cart/Order Logic, Stripe Integration, Admin APIs
- **[Add more team members here]**
  - [Describe their contributions]

---

## Current Features

- User & admin authentication (JWT)
- RESTful API for products, categories, brands, departments, sizes, colors
- Cart management (guest & user, merging on login)
- Order creation, payment (Stripe), and order history
- Admin endpoints for managing products, orders, users
- File uploads for product images
- API documentation with Swagger
- CORS enabled for frontend integration

---

## Future Plans

- Add email notifications (order confirmation, password reset)
- Implement rate limiting and security hardening
- Add more analytics endpoints for admin
- Support for multi-vendor/marketplace features
- Add GraphQL endpoint (optional)
- Add automated tests (Jest, Supertest)

---

*For frontend and admin panel setup, see their respective README files.* 