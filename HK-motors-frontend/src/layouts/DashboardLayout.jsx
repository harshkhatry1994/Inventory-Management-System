import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Users, Car, BookOpen, ScrollText,
  PackagePlus, UserCircle, Truck, Warehouse, BarChart3,
  Settings, LogOut, Moon, Sun, ChevronLeft, ChevronRight
} from "lucide-react";
import API from "../api/axios";

export default function DashboardLayout() {

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  // DARK MODE STATE
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "employee";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Apply dark mode to whole page
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Fetch low stock
  useEffect(() => {
    if (role === "admin" || role === "manager") {
      API.get("/reports/dashboard")
        .then((res) => {
          setLowStockCount(res.data?.lowStock?.length || 0);
        })
        .catch(() => setLowStockCount(0));
    }
  }, [role]);

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20}/> },
      { name: "Manage Users", path: "/admin/users", icon: <Users size={20}/> },
      { name: "Manage Cars", path: "/admin/cars", icon: <Car size={20}/> },
      { name: "Manage Bookings", path: "/admin/bookings", icon: <BookOpen size={20}/> },
      { name: "Reports", path: "/manager/reports", icon: <BarChart3 size={20}/> },
    ],
    manager: [
  { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={20}/> },
  { name: "Manage Cars", path: "/admin/cars", icon: <Car size={20}/> },
  { name: "Stock/Bookings", path: "/manager/stock", icon: <Warehouse size={20}/> },
  { name: "Sales History", path: "/manager/sales-history", icon: <ScrollText size={20}/> },
  { name: "Purchase Stock", path: "/manager/purchase-stock", icon: <PackagePlus size={20}/> },
  { name: "Manage Employees", path: "/manager/employees", icon: <UserCircle size={20}/> },
  { name: "Manage Suppliers", path: "/manager/suppliers", icon: <Truck size={20}/> },
  { name: "Stock Management", path: "/manager/stock-management", icon: <Warehouse size={20}/> },
  { name: "Reports", path: "/manager/reports", icon: <BarChart3 size={20}/> },
  { name: "Settings", path: "/manager/settings", icon: <Settings size={20}/> },
  { name: "Sales Invoices", path: "/manager/invoices", icon: <ScrollText size={20}/> }
],
    employee: [
  { name: "Dashboard", path: "/employee/dashboard", icon: <LayoutDashboard size={20}/> },
  { name: "Sales Entry", path: "/employee/sales", icon: <ScrollText size={20}/> },
  { name: "Manage Bookings", path: "/admin/bookings", icon: <BookOpen size={20}/> },

  { name: "Stock Management", path: "/manager/stock-management", icon: <Warehouse size={20}/> },
  { name: "Invoices", path: "/employee/invoices", icon: <ScrollText size={20}/> }
]
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* SIDEBAR */}
      <div className={`
        ${collapsed ? "w-20" : "w-72"}
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        flex flex-col transition-all duration-500 shadow-2xl
      `}>

        <div className="p-8 flex items-center gap-3">
          <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xl">
            HK
          </div>

          {!collapsed && (
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              HK <span className="text-orange-600">Motors.</span>
            </h1>
          )}
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">

          {menuItems[role]?.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition
                ${isActive
                  ? "bg-orange-600 text-white shadow-xl"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}
              `}
            >
              {item.icon}

              {!collapsed && (
               <span className="text-sm font-semibold uppercase tracking-wide">
                  {item.name}
                </span>
              )}
            </NavLink>

          ))}

        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">

          {/* DARK MODE */}
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? <Sun size={20}/> : <Moon size={20}/>}

            {!collapsed && (
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {dark ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          {/* COLLAPSE */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-orange-500"
          >
            {collapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}

            {!collapsed && (
              <span className="text-xs font-bold uppercase tracking-widest">
                Collapse View
              </span>
            )}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl"
          >
            <LogOut size={20}/>

            {!collapsed && (
              <span className="text-sm font-black uppercase tracking-widest">
                Logout
              </span>
            )}
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between transition-colors">
        <div>
  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    Authorized Personnel
  </p>

  <p className="text-lg font-bold text-slate-800 dark:text-white">
    Welcome back,
    <span className="text-orange-600 ml-2">
      {user?.name?.replace(" Employee","")}
    </span>
  </p>
</div>

          <div className="flex items-center gap-4">

            <div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black">
              {user?.name?.replace(" Employee","")?.[0]?.toUpperCase()}
            </div>

            <span className="text-[10px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest bg-orange-50 text-orange-600 dark:bg-slate-800 dark:text-orange-500">
              {role.toUpperCase()}
            </span>

          </div>

        </header>

        <main className="p-10 flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors">
        <Outlet />
        </main>

      </div>
    </div>
  );
}
