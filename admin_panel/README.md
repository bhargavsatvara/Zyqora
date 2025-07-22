# Zyqora Admin Panel

## Project Title & Description

**Zyqora Admin Panel**

This is the admin dashboard for Zyqora, a modern e-commerce platform. The admin panel allows authorized users to manage products, categories, brands, orders, users, and more. It features secure admin authentication, a responsive UI, and real-time order/status management.

---

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd admin_panel
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the `admin_panel` directory.
   - Add your API base URL:
     ```env
     VITE_API_URL=http://localhost:4000/api
     ```
   - (Optional) Add other environment variables as needed.
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Visit the admin panel:**
   - Open [http://localhost:5174](http://localhost:5174) in your browser (or the port shown in your terminal).

---

## Technology Stack

- **React.js** (with functional components & hooks)
- **Tailwind CSS** (utility-first styling)
- **Vite** (fast dev server & build tool)
- **Axios** (API requests)
- **React Router** (routing)
- **Context API** (state management)
- **Node.js/Express** (backend, see separate repo)
- **MongoDB/Mongoose** (database, see backend)

---

## LIVE Site Link

[https://zyqora-admin.vercel.app](https://zyqora-admin.vercel.app)  
*(Replace with your actual deployed URL if different)*

---

## Team Members & Contributions

- **Bhargav Sathvara**  
  - Project Lead, Admin Panel UI/UX, API Integration, Order Management, Role-based Auth
- **[Add more team members here]**
  - [Describe their contributions]

---

## Current Features

- Admin authentication (login/logout)
- Dashboard with order, user, and product stats
- Manage products, categories, brands, departments, sizes, colors
- View and update orders (status, details)
- Manage users (view, edit, delete)
- Responsive, accessible UI (with aria roles)
- Real-time notifications and toasts

---

## Future Plans

- Add advanced analytics and reporting
- Implement role-based permissions (super admin, staff, etc.)
- Add bulk import/export for products
- Integrate email notifications for order updates
- Add dark mode toggle
- Add multi-language support

---

*For frontend and backend setup, see their respective README files.* 