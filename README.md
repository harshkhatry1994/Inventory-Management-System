##Inventory Management System:
A simple and efficient Inventory Management System built to manage products, stock, sales, and purchases with role-based access. This project helps businesses track inventory in real time, reduce manual errors, and manage operations smoothly.

##Features:
  * Role-based Login (Admin / Customer)
  * Dashboard with inventory stats
  * Product & Stock Management
  * Purchase Management
  * Sales Management
  * Customer View (view products & book / buy)
  * MongoDB Database Integration
  * REST API based backend
  * Responsive UI

## Tech Stack:
 #Frontend:
    *React.js
    *Axios
    *Tailwind / CSS
 #Backend:
    *Node.js
    *Express.js
 #Database:
    *MongoDB (MongoDB Compass)
 #Other Tools:
    *Git & GitHub
    *VS Code
    *Postman

## Structure:
Inventory-Management-System/
│
├── inventory-backend/
│   ├── config/              # Database connection (db.js)
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Mongoose models (User, Product, Purchase)
│   ├── routes/              # API routes (authRoutes, productRoutes, purchaseRoutes)
│   ├── server.js            # Backend entry point
│   ├── package.json
│   └── .env                 # Environment variables (not pushed to GitHub)
│
└── inventory-frontend/
    ├── public/
    ├── src/
    │   ├── components/      # Navbar, ProtectedRoute
    │   ├── context/         # AuthContext
    │   ├── pages/           # Products, Sales, Purchase, Register, etc.
    │   ├── api.js           # API configuration & requests
    │   ├── App.js
    │   └── index.js
    └── package.json
