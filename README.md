## Inventory Management System:
A simple and efficient Inventory Management System built to manage products, stock, sales, and purchases with role-based access. This project helps businesses track inventory in real time, reduce manual errors, and manage operations smoothly.

### Features:
  # Role-based Login (Admin / Customer)
  # Dashboard with inventory stats
  # Product & Stock Management
  # Purchase Management
  # Sales Management
  # Customer View (view products & book / buy)
  # MongoDB Database Integration
  # REST API based backend
  # Responsive UI

## Tech Stack:
 ## Frontend:
   # React.js
   # Axios
   # Tailwind / CSS
  # Backend:
   # Node.js
   # Express.js
 ## Database:
   # MongoDB (MongoDB Compass)
 ## Other Tools:
   # Git & GitHub
   # VS Code
   # Postman
## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Folder Structure
C:.
├───Backend
│   │   .env
│   │   .gitignore
│   │   app.js
│   │   config.npmrc
│   │   package-lock.json
│   │   package.json
│   │   README.md
│   │
│   ├───controllers
│   │       product_controller.js
│   │       user_controllers.js
│   │
│   ├───db
│   │       user_db.js
│   │
│   ├───middlewares
│   │       user_auth.js
│   │
│   ├───models
│   │       company_model.js
│   │       history_model.js
│   │       locations_models.js
│   │       product_model.js
│   │       user_model.js
│   │
│   ├───routes
│   │       analyticsRoutes.js
│   │       companyRoutes.js
│   │       historyRoutes.js
│   │       locationRoutes.js
│   │       productRoutes.js
│   │       user_routes.js
│   │
│   └───utils
│           user_utils.js
│
└───Frontend
    │   .env
    │   .eslintrc.cjs
    │   .gitignore
    │   index.html
    │   package-lock.json
    │   package.json
    │   postcss.config.js
    │   README.md
    │   tailwind.config.js
    │   vite.config.js
    │
    ├───public
    │       vite.svg
    │
    └───src
        │   App.jsx
        │   index.css
        │   main.jsx
        │   router.jsx
        │
        ├───assets
        │       admin-logo.svg
        │       authenticate.svg
        │       menu.svg
        │       react.svg
        │       undraw_empty_re.svg
        │       user-logo.svg
        │
        ├───components
        │       HeaderBar.jsx
        │       LoadingIndicator.jsx
        │       LogoutButton.jsx
        │       PopUpComponenet.jsx
        │       ShowErrorMessage.jsx
        │       ShowSuccessMesasge.jsx
        │       SideNavbar.jsx
        │       WarrantyExpiringProductsTableComponent.jsx
        │
        └───screens
            │   InventoryFormScreen.jsx
            │
            ├───brands
            │       BrandsScreen.jsx
            │       EditBrandsScreen.jsx
            │       NewBrandsScreen.jsx
            │
            ├───dashboard
            │   │   DashBoardLayout.jsx
            │   │   DashBoardScreen.jsx
            │   │
            │   └───components
            │           AnalyticsComponent.jsx
            │           PieChart.jsx
            │
            ├───locations
            │       EditLocationScreen.jsx
            │       LocationsScreen.jsx
            │       NewLocationScreen.jsx
            │
            ├───login
            │       AuthLayout.jsx
            │       LoginScreen.jsx
            │       SignupScreen.jsx
            │
            ├───product
            │       AddNewProductScreen.jsx
            │       ProductEditScreen.jsx
            │       ProductHistoryScreen.jsx
            │       ProductInfoScreen.jsx
            │       ProductsScreen.jsx
            │
            └───users
                │   UserManagementScreen.jsx
                │
                └───components
                        ChangeRolePopup.jsx
                        ManageUserTableRow.jsx

## Installation
# 1.Clone the repository:
git clone https://github.com/your-username/your-repo.git
cd your-repo
## 2.Backend Setup:
# cd Backend
# npm install

## 3. Frontend Setup
# cd Frontend
# npm install

## Running the Application
## 1.Run Backend
# cd Backend
# npm start
## 2.Run Frontend
# cd Frontend
# npm start

## Environment Variables
# Create a .env file in the Backend and Frontend directories and configure the following:
##  Backend .env:
# MONGODB_URI=your_mongodb_connection_string
# PORT=3000
# SECRET_KEY=your_secret_key
# NODE_ENV=development
# ORIGIN=http://localhost:3000

# Frontend .env:
# VITE_SERVER=https://inventory-management-backend-hsaf.onrender.com
# VITE_MODE=PROD
# VITE_LOCAL=http://localhost:3000

##  API endpoints
### User Routes
- **POST** `/api/v1/users/signup` - Sign up a new user  
- **POST** `/api/v1/users/login` - Log in a user  
- **GET** `/api/v1/users/logout` - Log out a user  

### Product Routes

- **GET** `/api/v1/products` - Get all products  
- **POST** `/api/v1/products` - Add a new product  
- **PUT** `/api/v1/products/:id` - Update a product  
- **DELETE** `/api/v1/products/:id` - Delete a product  

### History Routes

- **GET** `/api/v1/history/:productId` - Get product history  

### Company Routes

- **GET** `/api/v1/companies` - Get all companies  
- **POST** `/api/v1/companies` - Add a new company
- 
### Location Routes

-**GET** `/api/v1/locations ` - Get all locations
-**POST** `/api/v1/locations` - Add a new location

### Analytics Routes

-**GET** `/api/v1/analytics` - Get analytics data
## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
