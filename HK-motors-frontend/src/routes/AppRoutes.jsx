import { Routes, Route } from "react-router-dom";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";
import CustomerLayout from "../layouts/CustomerLayout";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// Customer Pages
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import BookCar from "../pages/customer/BookCar";
import MyBookings from "../pages/customer/MyBookings";
import CustomerSettings from "../pages/customer/CustomerSettings";
import MyInvoices from "../pages/customer/MyInvoices";
import CarDetails from "../pages/customer/carDetails";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageCars from "../pages/admin/ManageCars";

// ✅ ✅ FINAL FIX (IMPORTANT)
import BookingManagement from "../pages/manager/BookingManagement";

// Manager Pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import SalesHistory from "../pages/manager/SalesHistory";
import ManageEmployees from "../pages/manager/ManageEmployees";
import ManageSuppliers from "../pages/manager/ManageSuppliers";
import Reports from "../pages/manager/Reports";
import Settings from "../pages/manager/Settings";
import PurchaseStock from "../pages/manager/PurchaseStock";
import StockManagement from "../pages/manager/StockManagement";
import Invoices from "../pages/manager/Invoices";

// Employee Pages
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import Sales from "../pages/employee/Sales";
import InvoiceGenerator from "../pages/employee/InvoiceGenerator"; 

// Utilities
import ProtectedRoute from "../components/auth/ProtectedRoute";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CUSTOMER ROUTES */}
      <Route element={<CustomerLayout />}>

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/book-car"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookCar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/car/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CarDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/invoices"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <MyInvoices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/settings"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerSettings />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* DASHBOARD ROUTES */}
      <Route element={<DashboardLayout />}>

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/cars" element={<ManageCars />} />

        {/* ✅ FIXED */}
        <Route path="/admin/bookings" element={<BookingManagement />} />

        {/* MANAGER */}
        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED */}
        <Route path="/manager/stock" element={<BookingManagement />} />

        <Route path="/manager/sales-history" element={<SalesHistory />} />
        <Route path="/manager/employees" element={<ManageEmployees />} />
        <Route path="/manager/suppliers" element={<ManageSuppliers />} />
        <Route path="/manager/reports" element={<Reports />} />
        <Route path="/manager/settings" element={<Settings />} />
        <Route path="/manager/purchase-stock" element={<PurchaseStock />} />
        <Route path="/manager/stock-management" element={<StockManagement />} />

        <Route
          path="/manager/invoices"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Invoices />
            </ProtectedRoute>
          }
        />

        {/* EMPLOYEE */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/employee/sales" element={<Sales />} />
        
        <Route
          path="/employee/invoices"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <InvoiceGenerator />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}