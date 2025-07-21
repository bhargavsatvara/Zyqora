# Zyqora E-Commerce Frontend

## Project Title & Description

**Zyqora E-Commerce Frontend**

This is the frontend for Zyqora, a modern, full-featured e-commerce platform. It provides a seamless shopping experience for users, including product browsing, cart management, secure checkout with Stripe, and user account management. The frontend is built with React and styled using Tailwind CSS for a responsive, accessible, and visually appealing UI.

---

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `frontend` directory.
   - Add your Stripe publishable key:
     ```env
     REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     ```
   - (Optional) Set API base URL if different from default.
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Visit the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Technology Stack

- **React.js** (with functional components & hooks)
- **Tailwind CSS** (utility-first styling)
- **Vite** (fast dev server & build tool)
- **Stripe.js** (payment integration)
- **Axios** (API requests)
- **React Router** (routing)
- **Context API** (state management)
- **Node.js/Express** (backend, see separate repo)
- **MongoDB/Mongoose** (database, see backend)

---

## LIVE Site Link

[https://zyqora-frontend.vercel.app](https://zyqora-frontend.vercel.app)  
*(Replace with your actual deployed URL if different)*

---

## Team Members & Contributions

- **Bhargav Sathvara**  
  - Project Lead, Full Stack Development, Stripe Integration, Cart & Checkout Logic, Admin Panel, UI/UX
- **[Add more team members here]**
  - [Describe their contributions]

---

## Current Features

- User authentication (login, signup, password reset)
- Product catalog with filtering and search
- Product detail pages with size, color, and brand info
- Add to cart, update quantity, remove items
- Guest cart and cart merging on login
- Secure Stripe payment integration
- Order history and order details
- Responsive, accessible UI (with aria roles)
- Admin panel (separate app) for product, order, and user management

---

## Future Plans

- Add product reviews and ratings
- Implement wishlist and recently viewed products
- Add user profile editing and address book
- Improve accessibility and add more ARIA attributes
- Add PWA support for offline access
- Integrate with more payment gateways
- Enhance analytics and reporting for admins
- Add multi-language support

---

*For backend and admin panel setup, see their respective README files.*
