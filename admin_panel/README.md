# Zyqora Admin Panel

This is the admin panel for the Zyqora e-commerce platform. It allows administrators to manage products, categories, brands, users, orders, and more.

## Features
- Admin authentication (login/logout)
- Product management (add, edit, delete, image upload to Cloudinary)
- Category, brand, department, and attribute management
- User management
- Order and inventory management
- Analytics and reports
- Responsive design with modern UI
- Toast notifications and modals
- Role-based access (admin only)

## Tech Stack
- **Frontend:** React, Tailwind CSS, React Router
- **State Management:** React Context API
- **API:** Connects to Zyqora backend (Node.js/Express)
- **Image Uploads:** Cloudinary

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd admin_panel
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the `admin_panel` directory and set the API URL:
   ```env
   VITE_API_URL=http://localhost:4000/api
   # Or your deployed backend URL
   ```

### Running the Admin Panel
```sh
npm run dev
# or
yarn dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production
```sh
npm run build
# or
yarn build
```

## Environment Variables
- `VITE_API_URL`: The base URL for the backend API (e.g., `http://localhost:4000/api` or your deployed backend).

## Folder Structure
```
admin_panel/
  src/
    components/      # Reusable UI components
    contexts/        # React Contexts (Auth, Toast, etc.)
    pages/           # Page components (Products, Categories, etc.)
    services/        # API service wrappers
    index.css        # Global styles
    main.jsx         # App entry point
  public/            # Static assets
  package.json       # Project config
  tailwind.config.js # Tailwind CSS config
```

## Notes
- Make sure your backend server is running and accessible at the URL specified in `VITE_API_URL`.
- Product and category images are uploaded to Cloudinary.
- Only admin users can access the admin panel.

## License
This project is for educational/demo purposes. 

## Team Members & Contributions

- **Bhargav Satvara**  
  - Project Lead, Admin Panel UI/UX, API Integration, Order Management, Role-based Auth
- **Dhruvi Patel**  
  - Product & Category Management, Testing, Documentation
- **Dixit Gami**  
  - User Management, Analytics, Bug Fixes, Deployment 